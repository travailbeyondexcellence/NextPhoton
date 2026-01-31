# =============================================================================
# NextPhoton EduCare Platform - Terraform Version Constraints
# =============================================================================
# This file defines the required Terraform and provider versions for the
# NextPhoton infrastructure. All modules inherit these constraints.
# =============================================================================

terraform {
  required_version = ">= 1.7.0, < 2.0.0"

  required_providers {
    # Google Cloud Platform Provider
    # Used for GKE cluster provisioning and GCP resources
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }

    # Google Cloud Platform Beta Provider
    # Required for certain GKE features like workload identity
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }

    # AWS Provider (alternative to GCP)
    # Used for EKS cluster provisioning and AWS resources
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    # Kubernetes Provider
    # Used for Kubernetes resource management post-cluster creation
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.25"
    }

    # Helm Provider
    # Used for deploying Helm charts to Kubernetes
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }

    # Cloudflare Provider
    # Used for DNS, CDN, WAF, Workers, and R2 storage
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }

    # NeonDB Provider (Community)
    # Used for NeonDB PostgreSQL serverless database
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.6"
    }

    # Random Provider
    # Used for generating random values (passwords, suffixes, etc.)
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }

    # TLS Provider
    # Used for generating TLS certificates and keys
    tls = {
      source  = "hashicorp/tls"
      version = "~> 4.0"
    }

    # Null Provider
    # Used for running local-exec provisioners
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }

    # Time Provider
    # Used for time-based operations and delays
    time = {
      source  = "hashicorp/time"
      version = "~> 0.10"
    }

    # Vault Provider
    # Used for HashiCorp Vault secrets management
    vault = {
      source  = "hashicorp/vault"
      version = "~> 3.25"
    }
  }
}
