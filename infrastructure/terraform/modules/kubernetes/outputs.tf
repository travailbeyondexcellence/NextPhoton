# =============================================================================
# NextPhoton EduCare Platform - Kubernetes Module Outputs
# =============================================================================

# -----------------------------------------------------------------------------
# Cluster Information
# -----------------------------------------------------------------------------
output "cluster_name" {
  description = "Name of the Kubernetes cluster"
  value       = var.cloud_provider == "gcp" ? (length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].name : "") : (length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].name : "")
}

output "cluster_id" {
  description = "Unique identifier of the cluster"
  value       = var.cloud_provider == "gcp" ? (length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].id : "") : (length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].id : "")
}

output "cluster_location" {
  description = "Location of the cluster"
  value       = var.cloud_provider == "gcp" ? (length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].location : "") : (length(aws_eks_cluster.primary) > 0 ? var.aws_region : "")
}

# -----------------------------------------------------------------------------
# Cluster Endpoints
# -----------------------------------------------------------------------------
output "cluster_endpoint" {
  description = "Endpoint for the Kubernetes API server"
  value       = var.cloud_provider == "gcp" ? (length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].endpoint : "") : (length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].endpoint : "")
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "Base64 encoded CA certificate for the cluster"
  value       = var.cloud_provider == "gcp" ? (length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].master_auth[0].cluster_ca_certificate : "") : (length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].certificate_authority[0].data : "")
  sensitive   = true
}

# -----------------------------------------------------------------------------
# GKE Specific Outputs
# -----------------------------------------------------------------------------
output "gke_master_version" {
  description = "Version of the GKE master"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].master_version : null
}

output "gke_node_pools" {
  description = "List of GKE node pools"
  value = var.cloud_provider == "gcp" ? {
    for name, pool in google_container_node_pool.pools : name => {
      name           = pool.name
      node_count     = pool.initial_node_count
      machine_type   = pool.node_config[0].machine_type
      disk_size_gb   = pool.node_config[0].disk_size_gb
      min_node_count = pool.autoscaling[0].min_node_count
      max_node_count = pool.autoscaling[0].max_node_count
    }
  } : {}
}

output "gke_workload_identity_pool" {
  description = "Workload Identity pool for the GKE cluster"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].workload_identity_config[0].workload_pool : null
}

# -----------------------------------------------------------------------------
# EKS Specific Outputs
# -----------------------------------------------------------------------------
output "eks_cluster_arn" {
  description = "ARN of the EKS cluster"
  value       = var.cloud_provider == "aws" && length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].arn : null
}

output "eks_cluster_version" {
  description = "Version of the EKS cluster"
  value       = var.cloud_provider == "aws" && length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].version : null
}

output "eks_node_groups" {
  description = "Map of EKS node groups"
  value = var.cloud_provider == "aws" ? {
    for name, ng in aws_eks_node_group.pools : name => {
      arn            = ng.arn
      status         = ng.status
      instance_types = ng.instance_types
      scaling_config = ng.scaling_config
    }
  } : {}
}

output "eks_oidc_issuer_url" {
  description = "OIDC issuer URL for the EKS cluster"
  value       = var.cloud_provider == "aws" && length(aws_eks_cluster.primary) > 0 ? aws_eks_cluster.primary[0].identity[0].oidc[0].issuer : null
}

# -----------------------------------------------------------------------------
# Service Account Outputs
# -----------------------------------------------------------------------------
output "cluster_service_account_email" {
  description = "Email of the cluster service account"
  value       = var.cloud_provider == "gcp" && length(google_service_account.cluster_sa) > 0 ? google_service_account.cluster_sa[0].email : null
}

output "cluster_service_account_name" {
  description = "Name of the cluster service account"
  value       = var.cloud_provider == "gcp" && length(google_service_account.cluster_sa) > 0 ? google_service_account.cluster_sa[0].name : null
}

output "eks_node_role_arn" {
  description = "ARN of the EKS node IAM role"
  value       = var.cloud_provider == "aws" && length(aws_iam_role.eks_node) > 0 ? aws_iam_role.eks_node[0].arn : null
}

output "eks_cluster_role_arn" {
  description = "ARN of the EKS cluster IAM role"
  value       = var.cloud_provider == "aws" && length(aws_iam_role.eks_cluster) > 0 ? aws_iam_role.eks_cluster[0].arn : null
}

# -----------------------------------------------------------------------------
# Namespace Outputs
# -----------------------------------------------------------------------------
output "app_namespace" {
  description = "Name of the application namespace"
  value       = var.create_namespaces && length(kubernetes_namespace.app) > 0 ? kubernetes_namespace.app[0].metadata[0].name : null
}

output "infrastructure_namespaces" {
  description = "Map of infrastructure namespaces created"
  value = {
    for ns in kubernetes_namespace.infra : ns.metadata[0].name => {
      name   = ns.metadata[0].name
      labels = ns.metadata[0].labels
    }
  }
}

# -----------------------------------------------------------------------------
# Kubeconfig Outputs
# -----------------------------------------------------------------------------
output "kubeconfig_raw" {
  description = "Raw kubeconfig content for the cluster"
  value = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? templatefile("${path.module}/templates/kubeconfig.tpl", {
    cluster_name     = google_container_cluster.primary[0].name
    cluster_endpoint = google_container_cluster.primary[0].endpoint
    cluster_ca_cert  = google_container_cluster.primary[0].master_auth[0].cluster_ca_certificate
    project_id       = var.gcp_project_id
    region           = var.gcp_region
  }) : null
  sensitive = true
}

output "kubectl_config_cmd" {
  description = "Command to configure kubectl for this cluster"
  value = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? "gcloud container clusters get-credentials ${google_container_cluster.primary[0].name} --region ${var.gcp_region} --project ${var.gcp_project_id}" : (var.cloud_provider == "aws" && length(aws_eks_cluster.primary) > 0 ? "aws eks update-kubeconfig --name ${aws_eks_cluster.primary[0].name} --region ${var.aws_region}" : "")
}

# -----------------------------------------------------------------------------
# Network Outputs
# -----------------------------------------------------------------------------
output "cluster_network" {
  description = "Network name of the cluster"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].network : null
}

output "cluster_subnetwork" {
  description = "Subnetwork name of the cluster"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].subnetwork : null
}

output "services_ipv4_cidr" {
  description = "CIDR range for services"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].services_ipv4_cidr : null
}

output "cluster_ipv4_cidr" {
  description = "CIDR range for pods"
  value       = var.cloud_provider == "gcp" && length(google_container_cluster.primary) > 0 ? google_container_cluster.primary[0].cluster_ipv4_cidr : null
}
