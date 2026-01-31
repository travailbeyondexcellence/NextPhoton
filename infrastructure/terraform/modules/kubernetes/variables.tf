# =============================================================================
# NextPhoton EduCare Platform - Kubernetes Module Variables
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
# Cloud Provider Configuration
# -----------------------------------------------------------------------------
variable "cloud_provider" {
  description = "Cloud provider to use (gcp or aws)"
  type        = string
  default     = "gcp"

  validation {
    condition     = contains(["gcp", "aws"], var.cloud_provider)
    error_message = "Cloud provider must be either 'gcp' or 'aws'."
  }
}

# -----------------------------------------------------------------------------
# GCP Configuration
# -----------------------------------------------------------------------------
variable "gcp_project_id" {
  description = "GCP project ID"
  type        = string
  default     = ""
}

variable "gcp_region" {
  description = "GCP region for the cluster"
  type        = string
  default     = "us-central1"
}

variable "gcp_zones" {
  description = "GCP zones for regional cluster node distribution"
  type        = list(string)
  default     = ["us-central1-a", "us-central1-b", "us-central1-c"]
}

# -----------------------------------------------------------------------------
# AWS Configuration
# -----------------------------------------------------------------------------
variable "aws_region" {
  description = "AWS region for the cluster"
  type        = string
  default     = "us-east-1"
}

variable "aws_subnet_ids" {
  description = "List of AWS subnet IDs for EKS"
  type        = list(string)
  default     = []
}

variable "aws_security_group_ids" {
  description = "List of AWS security group IDs for EKS"
  type        = list(string)
  default     = []
}

variable "aws_kms_key_arn" {
  description = "ARN of the AWS KMS key for EKS secrets encryption"
  type        = string
  default     = ""
}

# -----------------------------------------------------------------------------
# Kubernetes Configuration
# -----------------------------------------------------------------------------
variable "kubernetes_version" {
  description = "Kubernetes version for the cluster"
  type        = string
  default     = "1.29"
}

# -----------------------------------------------------------------------------
# Network Configuration
# -----------------------------------------------------------------------------
variable "vpc_network" {
  description = "VPC network name or self-link (GCP)"
  type        = string
  default     = "default"
}

variable "vpc_subnetwork" {
  description = "VPC subnetwork name or self-link (GCP)"
  type        = string
  default     = "default"
}

variable "pods_range_name" {
  description = "Name of the secondary IP range for pods"
  type        = string
  default     = "pods"
}

variable "services_range_name" {
  description = "Name of the secondary IP range for services"
  type        = string
  default     = "services"
}

variable "enable_private_nodes" {
  description = "Enable private nodes (no public IPs)"
  type        = bool
  default     = true
}

variable "enable_private_endpoint" {
  description = "Enable private endpoint (master not accessible from internet)"
  type        = bool
  default     = false
}

variable "master_ipv4_cidr_block" {
  description = "CIDR block for the master's private endpoint"
  type        = string
  default     = "172.16.0.0/28"
}

variable "master_authorized_networks" {
  description = "List of authorized networks for master access"
  type = list(object({
    cidr_block   = string
    display_name = string
  }))
  default = null
}

# -----------------------------------------------------------------------------
# Node Pool Configuration
# -----------------------------------------------------------------------------
variable "node_pools" {
  description = "Map of node pool configurations"
  type = map(object({
    machine_type   = optional(string, "e2-medium")
    instance_type  = optional(string, "t3.medium")  # AWS
    min_nodes      = optional(number, 1)
    max_nodes      = optional(number, 3)
    disk_size_gb   = optional(number, 100)
    disk_type      = optional(string, "pd-standard")
    preemptible    = optional(bool, false)
    spot           = optional(bool, false)
    tags           = optional(list(string), [])
    taints = optional(list(object({
      key    = string
      value  = string
      effect = string
    })), [])
  }))
  default = {}
}

variable "oauth_scopes" {
  description = "OAuth scopes for GKE nodes"
  type        = list(string)
  default = [
    "https://www.googleapis.com/auth/cloud-platform",
    "https://www.googleapis.com/auth/logging.write",
    "https://www.googleapis.com/auth/monitoring",
  ]
}

# -----------------------------------------------------------------------------
# Autoscaling Configuration
# -----------------------------------------------------------------------------
variable "enable_cluster_autoscaling" {
  description = "Enable cluster autoscaling (NAP)"
  type        = bool
  default     = false
}

variable "autoscaling_resource_limits" {
  description = "Resource limits for cluster autoscaling"
  type = list(object({
    resource_type = string
    minimum       = number
    maximum       = number
  }))
  default = [
    {
      resource_type = "cpu"
      minimum       = 2
      maximum       = 100
    },
    {
      resource_type = "memory"
      minimum       = 4
      maximum       = 400
    }
  ]
}

# -----------------------------------------------------------------------------
# Security Configuration
# -----------------------------------------------------------------------------
variable "enable_network_policy" {
  description = "Enable network policy enforcement"
  type        = bool
  default     = true
}

variable "enable_binary_authorization" {
  description = "Enable binary authorization"
  type        = bool
  default     = false
}

variable "database_encryption_key" {
  description = "KMS key for database encryption"
  type        = string
  default     = ""
}

variable "enable_config_connector" {
  description = "Enable Config Connector for GCP resource management"
  type        = bool
  default     = false
}

# -----------------------------------------------------------------------------
# Monitoring Configuration
# -----------------------------------------------------------------------------
variable "enable_managed_prometheus" {
  description = "Enable Google Managed Prometheus"
  type        = bool
  default     = true
}

# -----------------------------------------------------------------------------
# Maintenance Configuration
# -----------------------------------------------------------------------------
variable "maintenance_start_time" {
  description = "Start time for maintenance window (UTC)"
  type        = string
  default     = "03:00"
}

# -----------------------------------------------------------------------------
# Namespace Configuration
# -----------------------------------------------------------------------------
variable "create_namespaces" {
  description = "Create Kubernetes namespaces"
  type        = bool
  default     = true
}

variable "infrastructure_namespaces" {
  description = "List of infrastructure namespaces to create"
  type        = list(string)
  default = [
    "monitoring",
    "logging",
    "ingress",
    "cert-manager",
    "argocd",
    "keda",
  ]
}

variable "enable_istio" {
  description = "Enable Istio service mesh injection"
  type        = bool
  default     = false
}

# -----------------------------------------------------------------------------
# Resource Quota Configuration
# -----------------------------------------------------------------------------
variable "enable_resource_quotas" {
  description = "Enable resource quotas on namespaces"
  type        = bool
  default     = true
}

variable "resource_quota_limits" {
  description = "Resource quota limits for the application namespace"
  type        = map(string)
  default = {
    "requests.cpu"       = "10"
    "requests.memory"    = "20Gi"
    "limits.cpu"         = "20"
    "limits.memory"      = "40Gi"
    "pods"               = "100"
    "services"           = "20"
    "secrets"            = "50"
    "configmaps"         = "50"
    "persistentvolumeclaims" = "20"
  }
}

# -----------------------------------------------------------------------------
# Limit Range Configuration
# -----------------------------------------------------------------------------
variable "enable_limit_ranges" {
  description = "Enable limit ranges for default container limits"
  type        = bool
  default     = true
}

variable "default_container_limits" {
  description = "Default container resource limits"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "500m"
    memory = "512Mi"
  }
}

variable "default_container_requests" {
  description = "Default container resource requests"
  type = object({
    cpu    = string
    memory = string
  })
  default = {
    cpu    = "100m"
    memory = "128Mi"
  }
}

variable "max_pvc_storage" {
  description = "Maximum storage for a single PVC"
  type        = string
  default     = "100Gi"
}
