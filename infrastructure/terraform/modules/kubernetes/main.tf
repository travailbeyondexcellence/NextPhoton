# =============================================================================
# NextPhoton EduCare Platform - Kubernetes Module
# =============================================================================
# This module provisions a managed Kubernetes cluster (GKE or EKS) with
# configured node pools, networking, and security settings.
# =============================================================================

# -----------------------------------------------------------------------------
# Local Variables
# -----------------------------------------------------------------------------
locals {
  cluster_name = "${var.project_name}-${var.environment}-cluster"

  # Node pool configurations based on environment
  default_node_pools = {
    dev = {
      general = {
        machine_type   = "e2-medium"
        min_nodes      = 1
        max_nodes      = 3
        disk_size_gb   = 50
        preemptible    = true
        spot           = true
      }
    }
    staging = {
      general = {
        machine_type   = "e2-standard-2"
        min_nodes      = 2
        max_nodes      = 5
        disk_size_gb   = 100
        preemptible    = true
        spot           = true
      }
    }
    prod = {
      general = {
        machine_type   = "e2-standard-4"
        min_nodes      = 3
        max_nodes      = 10
        disk_size_gb   = 100
        preemptible    = false
        spot           = false
      }
      compute = {
        machine_type   = "e2-standard-8"
        min_nodes      = 1
        max_nodes      = 5
        disk_size_gb   = 200
        preemptible    = false
        spot           = false
      }
    }
  }

  # Use custom node pools if provided, otherwise use defaults
  node_pools = length(var.node_pools) > 0 ? var.node_pools : lookup(local.default_node_pools, var.environment, local.default_node_pools["dev"])

  # Common labels for all resources
  common_labels = merge(var.common_tags, {
    cluster = local.cluster_name
  })
}

# -----------------------------------------------------------------------------
# GKE Cluster Configuration
# Primary Kubernetes cluster using Google Kubernetes Engine
# -----------------------------------------------------------------------------
resource "google_container_cluster" "primary" {
  count = var.cloud_provider == "gcp" ? 1 : 0

  name     = local.cluster_name
  location = var.gcp_region
  project  = var.gcp_project_id

  # Use regional cluster for high availability in production
  # Use zonal cluster for dev/staging to reduce costs
  node_locations = var.environment == "prod" ? var.gcp_zones : []

  # We manage node pools separately
  remove_default_node_pool = true
  initial_node_count       = 1

  # Kubernetes version - use release channel for automatic updates
  release_channel {
    channel = var.environment == "prod" ? "STABLE" : "REGULAR"
  }

  # Minimum master version
  min_master_version = var.kubernetes_version

  # Network configuration
  network    = var.vpc_network
  subnetwork = var.vpc_subnetwork

  # IP allocation policy for VPC-native cluster
  ip_allocation_policy {
    cluster_secondary_range_name  = var.pods_range_name
    services_secondary_range_name = var.services_range_name
  }

  # Private cluster configuration
  private_cluster_config {
    enable_private_nodes    = var.enable_private_nodes
    enable_private_endpoint = var.enable_private_endpoint
    master_ipv4_cidr_block  = var.master_ipv4_cidr_block
  }

  # Master authorized networks
  dynamic "master_authorized_networks_config" {
    for_each = var.master_authorized_networks != null ? [1] : []
    content {
      dynamic "cidr_blocks" {
        for_each = var.master_authorized_networks
        content {
          cidr_block   = cidr_blocks.value.cidr_block
          display_name = cidr_blocks.value.display_name
        }
      }
    }
  }

  # Workload Identity for secure pod authentication
  workload_identity_config {
    workload_pool = "${var.gcp_project_id}.svc.id.goog"
  }

  # Addons configuration
  addons_config {
    # Enable HTTP load balancing
    http_load_balancing {
      disabled = false
    }

    # Enable horizontal pod autoscaling
    horizontal_pod_autoscaling {
      disabled = false
    }

    # Enable network policy
    network_policy_config {
      disabled = !var.enable_network_policy
    }

    # GCE persistent disk CSI driver
    gce_persistent_disk_csi_driver_config {
      enabled = true
    }

    # DNS cache for improved performance
    dns_cache_config {
      enabled = true
    }

    # Config connector for GCP resource management
    config_connector_config {
      enabled = var.enable_config_connector
    }
  }

  # Network policy
  network_policy {
    enabled  = var.enable_network_policy
    provider = var.enable_network_policy ? "CALICO" : "PROVIDER_UNSPECIFIED"
  }

  # Cluster autoscaling configuration
  cluster_autoscaling {
    enabled = var.enable_cluster_autoscaling

    dynamic "resource_limits" {
      for_each = var.enable_cluster_autoscaling ? var.autoscaling_resource_limits : []
      content {
        resource_type = resource_limits.value.resource_type
        minimum       = resource_limits.value.minimum
        maximum       = resource_limits.value.maximum
      }
    }

    dynamic "auto_provisioning_defaults" {
      for_each = var.enable_cluster_autoscaling ? [1] : []
      content {
        service_account = google_service_account.cluster_sa[0].email
        oauth_scopes    = var.oauth_scopes
      }
    }
  }

  # Binary authorization
  dynamic "binary_authorization" {
    for_each = var.enable_binary_authorization ? [1] : []
    content {
      evaluation_mode = "PROJECT_SINGLETON_POLICY_ENFORCE"
    }
  }

  # Maintenance window
  maintenance_policy {
    daily_maintenance_window {
      start_time = var.maintenance_start_time
    }
  }

  # Logging and monitoring
  logging_config {
    enable_components = ["SYSTEM_COMPONENTS", "WORKLOADS"]
  }

  monitoring_config {
    enable_components = ["SYSTEM_COMPONENTS"]

    managed_prometheus {
      enabled = var.enable_managed_prometheus
    }
  }

  # Security configuration
  enable_shielded_nodes = true

  # Database encryption
  dynamic "database_encryption" {
    for_each = var.database_encryption_key != "" ? [1] : []
    content {
      state    = "ENCRYPTED"
      key_name = var.database_encryption_key
    }
  }

  # Resource labels
  resource_labels = local.common_labels

  # Lifecycle management
  lifecycle {
    ignore_changes = [
      # Ignore changes to node_config as we manage node pools separately
      node_config,
      initial_node_count,
    ]
  }

  # Timeouts
  timeouts {
    create = "45m"
    update = "45m"
    delete = "45m"
  }

  depends_on = [
    google_service_account.cluster_sa,
  ]
}

# -----------------------------------------------------------------------------
# GKE Node Pools
# Managed node pools for the GKE cluster
# -----------------------------------------------------------------------------
resource "google_container_node_pool" "pools" {
  for_each = var.cloud_provider == "gcp" ? local.node_pools : {}

  name     = each.key
  location = var.gcp_region
  project  = var.gcp_project_id
  cluster  = google_container_cluster.primary[0].name

  # Node count configuration
  initial_node_count = lookup(each.value, "min_nodes", 1)

  # Autoscaling configuration
  autoscaling {
    min_node_count  = lookup(each.value, "min_nodes", 1)
    max_node_count  = lookup(each.value, "max_nodes", 3)
    location_policy = var.environment == "prod" ? "BALANCED" : "ANY"
  }

  # Node management
  management {
    auto_repair  = true
    auto_upgrade = true
  }

  # Upgrade settings
  upgrade_settings {
    max_surge       = var.environment == "prod" ? 2 : 1
    max_unavailable = 0

    dynamic "blue_green_settings" {
      for_each = var.environment == "prod" ? [1] : []
      content {
        standard_rollout_policy {
          batch_percentage    = 0.2
          batch_node_count    = null
          batch_soak_duration = "60s"
        }
      }
    }
  }

  # Node configuration
  node_config {
    machine_type = lookup(each.value, "machine_type", "e2-medium")
    disk_size_gb = lookup(each.value, "disk_size_gb", 100)
    disk_type    = lookup(each.value, "disk_type", "pd-standard")

    # Preemptible/Spot configuration for cost optimization
    preemptible = lookup(each.value, "preemptible", false)
    spot        = lookup(each.value, "spot", false)

    # Service account
    service_account = google_service_account.cluster_sa[0].email
    oauth_scopes    = var.oauth_scopes

    # Workload metadata configuration for workload identity
    workload_metadata_config {
      mode = "GKE_METADATA"
    }

    # Shielded instance configuration
    shielded_instance_config {
      enable_secure_boot          = true
      enable_integrity_monitoring = true
    }

    # Node labels
    labels = merge(local.common_labels, {
      node_pool = each.key
    })

    # Node taints
    dynamic "taint" {
      for_each = lookup(each.value, "taints", [])
      content {
        key    = taint.value.key
        value  = taint.value.value
        effect = taint.value.effect
      }
    }

    # Metadata
    metadata = {
      disable-legacy-endpoints = "true"
    }

    # Tags for firewall rules
    tags = concat(
      ["${local.cluster_name}-node"],
      lookup(each.value, "tags", [])
    )
  }

  # Lifecycle
  lifecycle {
    ignore_changes = [
      initial_node_count,
    ]
  }

  timeouts {
    create = "30m"
    update = "30m"
    delete = "30m"
  }
}

# -----------------------------------------------------------------------------
# GKE Service Account
# Dedicated service account for the GKE cluster nodes
# -----------------------------------------------------------------------------
resource "google_service_account" "cluster_sa" {
  count = var.cloud_provider == "gcp" ? 1 : 0

  account_id   = "${local.cluster_name}-sa"
  display_name = "GKE Cluster Service Account for ${local.cluster_name}"
  project      = var.gcp_project_id
}

# IAM bindings for the cluster service account
resource "google_project_iam_member" "cluster_sa_roles" {
  for_each = var.cloud_provider == "gcp" ? toset([
    "roles/logging.logWriter",
    "roles/monitoring.metricWriter",
    "roles/monitoring.viewer",
    "roles/stackdriver.resourceMetadata.writer",
    "roles/storage.objectViewer",
    "roles/artifactregistry.reader",
  ]) : toset([])

  project = var.gcp_project_id
  role    = each.key
  member  = "serviceAccount:${google_service_account.cluster_sa[0].email}"
}

# -----------------------------------------------------------------------------
# EKS Cluster Configuration (AWS Alternative)
# Amazon Elastic Kubernetes Service cluster
# -----------------------------------------------------------------------------
resource "aws_eks_cluster" "primary" {
  count = var.cloud_provider == "aws" ? 1 : 0

  name     = local.cluster_name
  version  = var.kubernetes_version
  role_arn = aws_iam_role.eks_cluster[0].arn

  vpc_config {
    subnet_ids              = var.aws_subnet_ids
    endpoint_private_access = var.enable_private_endpoint
    endpoint_public_access  = !var.enable_private_endpoint
    security_group_ids      = var.aws_security_group_ids
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]

  encryption_config {
    provider {
      key_arn = var.aws_kms_key_arn
    }
    resources = ["secrets"]
  }

  tags = local.common_labels

  depends_on = [
    aws_iam_role_policy_attachment.eks_cluster_policy,
    aws_iam_role_policy_attachment.eks_vpc_resource_controller,
  ]
}

# EKS Node Groups
resource "aws_eks_node_group" "pools" {
  for_each = var.cloud_provider == "aws" ? local.node_pools : {}

  cluster_name    = aws_eks_cluster.primary[0].name
  node_group_name = each.key
  node_role_arn   = aws_iam_role.eks_node[0].arn
  subnet_ids      = var.aws_subnet_ids

  instance_types = [lookup(each.value, "instance_type", "t3.medium")]
  capacity_type  = lookup(each.value, "spot", false) ? "SPOT" : "ON_DEMAND"
  disk_size      = lookup(each.value, "disk_size_gb", 100)

  scaling_config {
    min_size     = lookup(each.value, "min_nodes", 1)
    max_size     = lookup(each.value, "max_nodes", 3)
    desired_size = lookup(each.value, "min_nodes", 1)
  }

  update_config {
    max_unavailable = 1
  }

  labels = merge(local.common_labels, {
    node_pool = each.key
  })

  dynamic "taint" {
    for_each = lookup(each.value, "taints", [])
    content {
      key    = taint.value.key
      value  = taint.value.value
      effect = upper(replace(taint.value.effect, "No", "NO_"))
    }
  }

  tags = local.common_labels

  depends_on = [
    aws_iam_role_policy_attachment.eks_worker_node_policy,
    aws_iam_role_policy_attachment.eks_cni_policy,
    aws_iam_role_policy_attachment.eks_container_registry,
  ]
}

# -----------------------------------------------------------------------------
# AWS IAM Roles for EKS
# -----------------------------------------------------------------------------
resource "aws_iam_role" "eks_cluster" {
  count = var.cloud_provider == "aws" ? 1 : 0

  name = "${local.cluster_name}-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_labels
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  count = var.cloud_provider == "aws" ? 1 : 0

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster[0].name
}

resource "aws_iam_role_policy_attachment" "eks_vpc_resource_controller" {
  count = var.cloud_provider == "aws" ? 1 : 0

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSVPCResourceController"
  role       = aws_iam_role.eks_cluster[0].name
}

resource "aws_iam_role" "eks_node" {
  count = var.cloud_provider == "aws" ? 1 : 0

  name = "${local.cluster_name}-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_labels
}

resource "aws_iam_role_policy_attachment" "eks_worker_node_policy" {
  count = var.cloud_provider == "aws" ? 1 : 0

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node[0].name
}

resource "aws_iam_role_policy_attachment" "eks_cni_policy" {
  count = var.cloud_provider == "aws" ? 1 : 0

  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node[0].name
}

resource "aws_iam_role_policy_attachment" "eks_container_registry" {
  count = var.cloud_provider == "aws" ? 1 : 0

  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node[0].name
}

# -----------------------------------------------------------------------------
# Kubernetes Namespaces
# Create application namespaces after cluster is ready
# -----------------------------------------------------------------------------
resource "kubernetes_namespace" "app" {
  count = var.create_namespaces ? 1 : 0

  metadata {
    name = "${var.project_name}-${var.environment}"

    labels = merge(local.common_labels, {
      name        = "${var.project_name}-${var.environment}"
      istio-injection = var.enable_istio ? "enabled" : "disabled"
    })

    annotations = {
      "scheduler.alpha.kubernetes.io/defaultTolerations" = jsonencode([])
    }
  }

  depends_on = [
    google_container_cluster.primary,
    google_container_node_pool.pools,
    aws_eks_cluster.primary,
    aws_eks_node_group.pools,
  ]
}

# Create additional namespaces for infrastructure components
resource "kubernetes_namespace" "infra" {
  for_each = var.create_namespaces ? toset(var.infrastructure_namespaces) : toset([])

  metadata {
    name = each.value

    labels = merge(local.common_labels, {
      name = each.value
      type = "infrastructure"
    })
  }

  depends_on = [
    google_container_cluster.primary,
    google_container_node_pool.pools,
    aws_eks_cluster.primary,
    aws_eks_node_group.pools,
  ]
}

# -----------------------------------------------------------------------------
# Resource Quotas
# Apply resource quotas to namespaces
# -----------------------------------------------------------------------------
resource "kubernetes_resource_quota" "app" {
  count = var.create_namespaces && var.enable_resource_quotas ? 1 : 0

  metadata {
    name      = "${var.project_name}-quota"
    namespace = kubernetes_namespace.app[0].metadata[0].name
  }

  spec {
    hard = var.resource_quota_limits
  }
}

# -----------------------------------------------------------------------------
# Network Policies
# Default network policies for the application namespace
# -----------------------------------------------------------------------------
resource "kubernetes_network_policy" "default_deny_ingress" {
  count = var.create_namespaces && var.enable_network_policy ? 1 : 0

  metadata {
    name      = "default-deny-ingress"
    namespace = kubernetes_namespace.app[0].metadata[0].name
  }

  spec {
    pod_selector {}
    policy_types = ["Ingress"]
  }
}

resource "kubernetes_network_policy" "allow_same_namespace" {
  count = var.create_namespaces && var.enable_network_policy ? 1 : 0

  metadata {
    name      = "allow-same-namespace"
    namespace = kubernetes_namespace.app[0].metadata[0].name
  }

  spec {
    pod_selector {}

    ingress {
      from {
        namespace_selector {
          match_labels = {
            name = kubernetes_namespace.app[0].metadata[0].name
          }
        }
      }
    }

    policy_types = ["Ingress"]
  }
}

# -----------------------------------------------------------------------------
# Limit Ranges
# Default limits for containers in the namespace
# -----------------------------------------------------------------------------
resource "kubernetes_limit_range" "app" {
  count = var.create_namespaces && var.enable_limit_ranges ? 1 : 0

  metadata {
    name      = "${var.project_name}-limits"
    namespace = kubernetes_namespace.app[0].metadata[0].name
  }

  spec {
    limit {
      type = "Container"

      default = {
        cpu    = var.default_container_limits.cpu
        memory = var.default_container_limits.memory
      }

      default_request = {
        cpu    = var.default_container_requests.cpu
        memory = var.default_container_requests.memory
      }
    }

    limit {
      type = "PersistentVolumeClaim"

      max = {
        storage = var.max_pvc_storage
      }
    }
  }
}
