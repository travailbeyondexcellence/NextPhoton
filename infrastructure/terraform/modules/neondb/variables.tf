# =============================================================================
# NextPhoton EduCare Platform - NeonDB Module Variables
# =============================================================================

# -----------------------------------------------------------------------------
# General Configuration
# -----------------------------------------------------------------------------
variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "nextphoton"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "common_tags" {
  description = "Common tags to apply to all resources"
  type        = map(string)
  default     = {}
}

# -----------------------------------------------------------------------------
# NeonDB Configuration
# -----------------------------------------------------------------------------
variable "neon_region" {
  description = "NeonDB region for the project"
  type        = string
  default     = "aws-us-east-1"

  validation {
    condition = contains([
      "aws-us-east-1",
      "aws-us-east-2",
      "aws-us-west-2",
      "aws-eu-central-1",
      "aws-eu-west-1",
      "aws-eu-west-2",
      "aws-ap-southeast-1",
      "aws-ap-southeast-2",
    ], var.neon_region)
    error_message = "Invalid NeonDB region specified."
  }
}

variable "postgres_version" {
  description = "PostgreSQL version to use"
  type        = number
  default     = 16

  validation {
    condition     = contains([14, 15, 16], var.postgres_version)
    error_message = "PostgreSQL version must be 14, 15, or 16."
  }
}

variable "compute_provisioner" {
  description = "Compute provisioner (k8s-pod or k8s-neonvm)"
  type        = string
  default     = "k8s-neonvm"
}

# -----------------------------------------------------------------------------
# Database Configuration
# -----------------------------------------------------------------------------
variable "databases" {
  description = "List of database names to create"
  type        = list(string)
  default     = null
}

variable "database_owner" {
  description = "Owner of the databases"
  type        = string
  default     = "neondb_owner"
}

variable "create_roles" {
  description = "Create default database roles"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Connection Pooling
# -----------------------------------------------------------------------------
variable "enable_connection_pooling" {
  description = "Enable connection pooling via PgBouncer"
  type        = bool
  default     = true
}

variable "pooler_mode" {
  description = "Connection pooler mode (transaction, session, statement)"
  type        = string
  default     = "transaction"

  validation {
    condition     = contains(["transaction", "session", "statement"], var.pooler_mode)
    error_message = "Pooler mode must be one of: transaction, session, statement."
  }
}

# -----------------------------------------------------------------------------
# Read Replicas
# -----------------------------------------------------------------------------
variable "enable_read_replicas" {
  description = "Enable read replicas for production"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# History and Backup
# -----------------------------------------------------------------------------
variable "history_retention_seconds" {
  description = "History retention for point-in-time recovery (in seconds)"
  type        = number
  default     = 604800  # 7 days

  validation {
    condition     = var.history_retention_seconds >= 86400 && var.history_retention_seconds <= 2592000
    error_message = "History retention must be between 1 day (86400) and 30 days (2592000)."
  }
}

# -----------------------------------------------------------------------------
# Quota Configuration
# -----------------------------------------------------------------------------
variable "quota_active_time_seconds" {
  description = "Active time quota in seconds (0 for unlimited)"
  type        = number
  default     = 0
}

variable "quota_compute_time_seconds" {
  description = "Compute time quota in seconds (0 for unlimited)"
  type        = number
  default     = 0
}

variable "quota_written_data_bytes" {
  description = "Written data quota in bytes (0 for unlimited)"
  type        = number
  default     = 0
}

variable "quota_data_transfer_bytes" {
  description = "Data transfer quota in bytes (0 for unlimited)"
  type        = number
  default     = 0
}

variable "quota_logical_size_bytes" {
  description = "Logical size quota in bytes (0 for unlimited)"
  type        = number
  default     = 0
}

# -----------------------------------------------------------------------------
# Kubernetes Integration
# -----------------------------------------------------------------------------
variable "create_k8s_secrets" {
  description = "Create Kubernetes secrets for database credentials"
  type        = bool
  default     = true
}

variable "k8s_namespace" {
  description = "Kubernetes namespace for secrets"
  type        = string
  default     = "default"
}

# -----------------------------------------------------------------------------
# Vault Integration
# -----------------------------------------------------------------------------
variable "create_vault_secrets" {
  description = "Create HashiCorp Vault secrets for database credentials"
  type        = bool
  default     = false
}

variable "vault_mount_path" {
  description = "Vault KV mount path"
  type        = string
  default     = "secret"
}

# -----------------------------------------------------------------------------
# Monitoring Configuration
# -----------------------------------------------------------------------------
variable "enable_monitoring" {
  description = "Enable database monitoring"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Compute Size Configuration
# Override defaults if needed
# -----------------------------------------------------------------------------
variable "min_compute_units" {
  description = "Minimum compute units (override environment defaults)"
  type        = number
  default     = null
}

variable "max_compute_units" {
  description = "Maximum compute units (override environment defaults)"
  type        = number
  default     = null
}

variable "suspend_timeout_seconds" {
  description = "Suspend timeout in seconds (override environment defaults)"
  type        = number
  default     = null
}
