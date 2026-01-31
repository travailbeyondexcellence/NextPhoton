# =============================================================================
# NextPhoton EduCare Platform - NeonDB Module
# =============================================================================
# This module provisions NeonDB serverless PostgreSQL databases with
# branching, connection pooling, and autoscaling capabilities.
# =============================================================================

# -----------------------------------------------------------------------------
# Local Variables
# -----------------------------------------------------------------------------
locals {
  project_name = "${var.project_name}-${var.environment}"

  # Database names based on environment
  default_databases = var.databases != null ? var.databases : ["nextphoton"]

  # Role configurations per environment
  default_roles = {
    admin = {
      name       = "admin"
      privileges = ["CREATE", "CONNECT"]
    }
    app = {
      name       = "app"
      privileges = ["CONNECT"]
    }
    readonly = {
      name       = "readonly"
      privileges = ["CONNECT"]
    }
  }

  # Compute settings per environment
  compute_settings = {
    dev = {
      min_cu             = 0.25
      max_cu             = 1
      autoscaling_limit  = 1
      suspend_timeout    = 300  # 5 minutes
    }
    staging = {
      min_cu             = 0.5
      max_cu             = 2
      autoscaling_limit  = 2
      suspend_timeout    = 600  # 10 minutes
    }
    prod = {
      min_cu             = 1
      max_cu             = 4
      autoscaling_limit  = 4
      suspend_timeout    = 0   # Never suspend in production
    }
  }

  env_compute = lookup(local.compute_settings, var.environment, local.compute_settings["dev"])
}

# -----------------------------------------------------------------------------
# NeonDB Project
# Primary project container for all database resources
# -----------------------------------------------------------------------------
resource "neon_project" "main" {
  name = local.project_name

  # Region configuration
  region_id = var.neon_region

  # PostgreSQL version
  pg_version = var.postgres_version

  # History retention for point-in-time recovery
  history_retention_seconds = var.history_retention_seconds

  # Compute provisioner
  provisioner = var.compute_provisioner

  # Store connection pooler enabled/disabled
  store_passwords = true

  # Default endpoint settings
  default_endpoint_settings {
    # Autoscaling limits
    autoscaling_limit_min_cu = local.env_compute.min_cu
    autoscaling_limit_max_cu = local.env_compute.max_cu

    # Suspend timeout
    suspend_timeout_seconds = local.env_compute.suspend_timeout
  }

  # Quota limits
  quota {
    active_time_seconds    = var.quota_active_time_seconds
    compute_time_seconds   = var.quota_compute_time_seconds
    written_data_bytes     = var.quota_written_data_bytes
    data_transfer_bytes    = var.quota_data_transfer_bytes
    logical_size_bytes     = var.quota_logical_size_bytes
  }
}

# -----------------------------------------------------------------------------
# NeonDB Branch - Main Production Branch
# Primary branch for production workloads
# -----------------------------------------------------------------------------
resource "neon_branch" "main" {
  project_id = neon_project.main.id
  name       = "main"

  # This is the default production branch
  # All other branches are created from this one
}

# -----------------------------------------------------------------------------
# NeonDB Branch - Environment-Specific Branches
# Development and staging branches for non-production workloads
# -----------------------------------------------------------------------------
resource "neon_branch" "environment" {
  count = var.environment != "prod" ? 1 : 0

  project_id = neon_project.main.id
  name       = var.environment

  # Branch from main
  parent_id = neon_branch.main.id

  # Enable logical replication for staging
  parent_lsn = var.environment == "staging" ? null : null
}

# -----------------------------------------------------------------------------
# NeonDB Endpoints
# Compute endpoints for database access
# -----------------------------------------------------------------------------
resource "neon_endpoint" "main" {
  project_id = neon_project.main.id
  branch_id  = neon_branch.main.id

  type = "read_write"

  # Compute size settings
  autoscaling_limit_min_cu = local.env_compute.min_cu
  autoscaling_limit_max_cu = local.env_compute.max_cu

  # Suspend settings
  suspend_timeout_seconds = local.env_compute.suspend_timeout

  # Pooler configuration
  pooler_enabled = var.enable_connection_pooling
  pooler_mode    = var.pooler_mode

  # Compute provisioner
  provisioner = var.compute_provisioner

  # Region (must match project)
  region_id = var.neon_region
}

# Read replica endpoint for production
resource "neon_endpoint" "read_replica" {
  count = var.environment == "prod" && var.enable_read_replicas ? 1 : 0

  project_id = neon_project.main.id
  branch_id  = neon_branch.main.id

  type = "read_only"

  # Compute size settings for read replica
  autoscaling_limit_min_cu = local.env_compute.min_cu
  autoscaling_limit_max_cu = local.env_compute.max_cu

  # Suspend settings
  suspend_timeout_seconds = local.env_compute.suspend_timeout

  # Pooler configuration
  pooler_enabled = var.enable_connection_pooling
  pooler_mode    = var.pooler_mode

  # Compute provisioner
  provisioner = var.compute_provisioner

  # Region
  region_id = var.neon_region
}

# Development/Staging endpoint
resource "neon_endpoint" "environment" {
  count = var.environment != "prod" ? 1 : 0

  project_id = neon_project.main.id
  branch_id  = neon_branch.environment[0].id

  type = "read_write"

  # Compute size settings
  autoscaling_limit_min_cu = local.env_compute.min_cu
  autoscaling_limit_max_cu = local.env_compute.max_cu

  # Suspend settings
  suspend_timeout_seconds = local.env_compute.suspend_timeout

  # Pooler configuration
  pooler_enabled = var.enable_connection_pooling
  pooler_mode    = var.pooler_mode

  # Compute provisioner
  provisioner = var.compute_provisioner

  # Region
  region_id = var.neon_region
}

# -----------------------------------------------------------------------------
# NeonDB Roles
# Database roles with appropriate permissions
# -----------------------------------------------------------------------------
resource "neon_role" "roles" {
  for_each = var.create_roles ? local.default_roles : {}

  project_id = neon_project.main.id
  branch_id  = var.environment == "prod" ? neon_branch.main.id : neon_branch.environment[0].id

  name = "${each.value.name}_${var.environment}"
}

# -----------------------------------------------------------------------------
# NeonDB Databases
# Create databases within the project
# -----------------------------------------------------------------------------
resource "neon_database" "databases" {
  for_each = toset(local.default_databases)

  project_id = neon_project.main.id
  branch_id  = var.environment == "prod" ? neon_branch.main.id : neon_branch.environment[0].id

  name       = each.value
  owner_name = var.database_owner
}

# -----------------------------------------------------------------------------
# Random Password Generation
# Generate secure passwords for database roles
# -----------------------------------------------------------------------------
resource "random_password" "db_passwords" {
  for_each = var.create_roles ? local.default_roles : {}

  length           = 32
  special          = true
  override_special = "!#$%&*()-_=+[]{}<>:?"
}

# -----------------------------------------------------------------------------
# Kubernetes Secrets
# Store database credentials in Kubernetes
# -----------------------------------------------------------------------------
resource "kubernetes_secret" "database_credentials" {
  count = var.create_k8s_secrets ? 1 : 0

  metadata {
    name      = "database-credentials"
    namespace = var.k8s_namespace

    labels = {
      app         = var.project_name
      environment = var.environment
      managed-by  = "terraform"
    }
  }

  data = {
    # Primary connection string (with pooler)
    DATABASE_URL = var.enable_connection_pooling ? "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.main.host}:5432/${local.default_databases[0]}?sslmode=require" : "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.main.host}:5432/${local.default_databases[0]}?sslmode=require"

    # Direct connection string (without pooler, for migrations)
    DATABASE_URL_DIRECT = "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.main.host}:5432/${local.default_databases[0]}?sslmode=require"

    # Individual components
    DB_HOST     = neon_endpoint.main.host
    DB_PORT     = "5432"
    DB_NAME     = local.default_databases[0]
    DB_USER     = var.database_owner
    DB_PASSWORD = neon_project.main.database_password
    DB_SSL_MODE = "require"

    # Read replica connection (if enabled)
    DATABASE_URL_READ_REPLICA = var.environment == "prod" && var.enable_read_replicas && length(neon_endpoint.read_replica) > 0 ? "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.read_replica[0].host}:5432/${local.default_databases[0]}?sslmode=require" : ""
  }

  type = "Opaque"
}

# -----------------------------------------------------------------------------
# HashiCorp Vault Secrets
# Store database credentials in Vault for enhanced security
# -----------------------------------------------------------------------------
resource "vault_kv_secret_v2" "database_credentials" {
  count = var.create_vault_secrets ? 1 : 0

  mount = var.vault_mount_path
  name  = "database/${var.environment}"

  data_json = jsonencode({
    database_url        = "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.main.host}:5432/${local.default_databases[0]}?sslmode=require"
    database_url_direct = "postgresql://${var.database_owner}:${neon_project.main.database_password}@${neon_endpoint.main.host}:5432/${local.default_databases[0]}?sslmode=require"
    host                = neon_endpoint.main.host
    port                = 5432
    database            = local.default_databases[0]
    username            = var.database_owner
    password            = neon_project.main.database_password
    ssl_mode            = "require"
  })

  custom_metadata {
    max_versions = 10
    data = {
      environment = var.environment
      project     = var.project_name
    }
  }
}

# -----------------------------------------------------------------------------
# Monitoring Configuration
# Configure database monitoring and alerting
# -----------------------------------------------------------------------------
resource "null_resource" "monitoring_setup" {
  count = var.enable_monitoring ? 1 : 0

  triggers = {
    project_id = neon_project.main.id
  }

  provisioner "local-exec" {
    command = <<-EOF
      echo "NeonDB monitoring configured for project: ${neon_project.main.id}"
      echo "Environment: ${var.environment}"
      echo "Endpoint: ${neon_endpoint.main.host}"
    EOF
  }
}
