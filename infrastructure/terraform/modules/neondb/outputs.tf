# =============================================================================
# NextPhoton EduCare Platform - NeonDB Module Outputs
# =============================================================================

# -----------------------------------------------------------------------------
# Project Information
# -----------------------------------------------------------------------------
output "project_id" {
  description = "NeonDB project ID"
  value       = neon_project.main.id
}

output "project_name" {
  description = "NeonDB project name"
  value       = neon_project.main.name
}

output "region" {
  description = "NeonDB region"
  value       = neon_project.main.region_id
}

output "postgres_version" {
  description = "PostgreSQL version"
  value       = neon_project.main.pg_version
}

# -----------------------------------------------------------------------------
# Branch Information
# -----------------------------------------------------------------------------
output "main_branch_id" {
  description = "Main branch ID"
  value       = neon_branch.main.id
}

output "main_branch_name" {
  description = "Main branch name"
  value       = neon_branch.main.name
}

output "environment_branch_id" {
  description = "Environment-specific branch ID"
  value       = var.environment != "prod" && length(neon_branch.environment) > 0 ? neon_branch.environment[0].id : neon_branch.main.id
}

output "environment_branch_name" {
  description = "Environment-specific branch name"
  value       = var.environment != "prod" && length(neon_branch.environment) > 0 ? neon_branch.environment[0].name : neon_branch.main.name
}

# -----------------------------------------------------------------------------
# Endpoint Information
# -----------------------------------------------------------------------------
output "primary_endpoint_id" {
  description = "Primary endpoint ID"
  value       = neon_endpoint.main.id
}

output "primary_endpoint_host" {
  description = "Primary endpoint hostname"
  value       = neon_endpoint.main.host
  sensitive   = true
}

output "read_replica_endpoint_host" {
  description = "Read replica endpoint hostname"
  value       = var.environment == "prod" && var.enable_read_replicas && length(neon_endpoint.read_replica) > 0 ? neon_endpoint.read_replica[0].host : null
  sensitive   = true
}

output "environment_endpoint_host" {
  description = "Environment-specific endpoint hostname"
  value       = var.environment != "prod" && length(neon_endpoint.environment) > 0 ? neon_endpoint.environment[0].host : neon_endpoint.main.host
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Connection Strings
# -----------------------------------------------------------------------------
output "connection_string" {
  description = "PostgreSQL connection string"
  value       = "postgresql://${var.database_owner}@${neon_endpoint.main.host}:5432/nextphoton?sslmode=require"
  sensitive   = true
}

output "connection_string_pooled" {
  description = "PostgreSQL connection string with connection pooling"
  value       = var.enable_connection_pooling ? "postgresql://${var.database_owner}@${neon_endpoint.main.host}:5432/nextphoton?sslmode=require&pgbouncer=true" : null
  sensitive   = true
}

output "connection_string_read_replica" {
  description = "PostgreSQL read replica connection string"
  value       = var.environment == "prod" && var.enable_read_replicas && length(neon_endpoint.read_replica) > 0 ? "postgresql://${var.database_owner}@${neon_endpoint.read_replica[0].host}:5432/nextphoton?sslmode=require" : null
  sensitive   = true
}

# -----------------------------------------------------------------------------
# Database Information
# -----------------------------------------------------------------------------
output "databases" {
  description = "List of created databases"
  value = {
    for db in neon_database.databases : db.name => {
      id    = db.id
      name  = db.name
      owner = db.owner_name
    }
  }
}

# -----------------------------------------------------------------------------
# Role Information
# -----------------------------------------------------------------------------
output "roles" {
  description = "List of created roles"
  value = {
    for role in neon_role.roles : role.name => {
      id   = role.id
      name = role.name
    }
  }
}

# -----------------------------------------------------------------------------
# Compute Configuration
# -----------------------------------------------------------------------------
output "compute_config" {
  description = "Compute configuration for the endpoint"
  value = {
    min_cu          = neon_endpoint.main.autoscaling_limit_min_cu
    max_cu          = neon_endpoint.main.autoscaling_limit_max_cu
    suspend_timeout = neon_endpoint.main.suspend_timeout_seconds
    pooler_enabled  = neon_endpoint.main.pooler_enabled
    pooler_mode     = neon_endpoint.main.pooler_mode
  }
}

# -----------------------------------------------------------------------------
# Kubernetes Secret Reference
# -----------------------------------------------------------------------------
output "k8s_secret_name" {
  description = "Name of the Kubernetes secret containing database credentials"
  value       = var.create_k8s_secrets && length(kubernetes_secret.database_credentials) > 0 ? kubernetes_secret.database_credentials[0].metadata[0].name : null
}

output "k8s_secret_namespace" {
  description = "Namespace of the Kubernetes secret"
  value       = var.create_k8s_secrets && length(kubernetes_secret.database_credentials) > 0 ? kubernetes_secret.database_credentials[0].metadata[0].namespace : null
}

# -----------------------------------------------------------------------------
# Vault Secret Reference
# -----------------------------------------------------------------------------
output "vault_secret_path" {
  description = "Path to the Vault secret containing database credentials"
  value       = var.create_vault_secrets && length(vault_kv_secret_v2.database_credentials) > 0 ? vault_kv_secret_v2.database_credentials[0].path : null
}

# -----------------------------------------------------------------------------
# Connection Details for Applications
# -----------------------------------------------------------------------------
output "connection_details" {
  description = "Connection details for application configuration"
  value = {
    host     = neon_endpoint.main.host
    port     = 5432
    database = "nextphoton"
    username = var.database_owner
    ssl_mode = "require"
  }
  sensitive = true
}
