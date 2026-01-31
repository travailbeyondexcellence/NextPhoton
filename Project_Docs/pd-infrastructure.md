# NextPhoton Infrastructure Architecture

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Infrastructure Overview

NextPhoton uses a modern cloud-native infrastructure built on Kubernetes with GitOps practices, event-driven autoscaling, and comprehensive Infrastructure as Code (IaC).

### 1.1 Infrastructure Principles

| Principle | Application |
|-----------|-------------|
| **Infrastructure as Code** | All infrastructure defined in Terraform/Terragrunt |
| **GitOps** | ArgoCD for declarative, version-controlled deployments |
| **Event-Driven Scaling** | KEDA for autoscaling based on NATS queue depth |
| **Immutable Infrastructure** | Container images are versioned and never modified |
| **Zero-Trust Security** | All services require authentication and authorization |
| **Observability First** | Built-in monitoring, logging, and tracing |

### 1.2 Infrastructure Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE EDGE                               │
│  CDN • DDoS Protection • WAF • Workers • R2 Storage                  │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                      KUBERNETES CLUSTER                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │
│  │ Ingress     │  │ Cert-Manager│  │ External    │                  │
│  │ Controller  │  │ (TLS)       │  │ Secrets     │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    APPLICATION LAYER                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │API       │  │Auth      │  │User      │  │Session   │       │  │
│  │  │Gateway   │  │Service   │  │Service   │  │Service   │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │Payment   │  │Analytics │  │Notif     │  │Media     │       │  │
│  │  │Service   │  │Service   │  │Service   │  │Service   │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    INFRASTRUCTURE LAYER                        │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │  │
│  │  │NATS      │  │Redis     │  │Prometheus│  │Jaeger    │       │  │
│  │  │Cluster   │  │Cluster   │  │Stack     │  │Tracing   │       │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                    KEDA AUTOSCALING                            │  │
│  │  ScaledObjects monitoring NATS queue depth & custom metrics    │  │
│  └───────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │     EXTERNAL SERVICES      │
                    │  NeonDB • Vault • Sentry   │
                    └───────────────────────────┘
```

---

## 2. Terraform Infrastructure as Code

### 2.1 Directory Structure

```
infrastructure/terraform/
├── terragrunt.hcl                    # Root Terragrunt config
├── modules/
│   ├── kubernetes/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   ├── outputs.tf
│   │   └── versions.tf
│   ├── neondb/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── redis/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── cloudflare/
│   │   ├── main.tf                   # DNS, CDN, WAF
│   │   ├── workers.tf                # Edge workers
│   │   ├── r2.tf                     # Object storage
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── nats/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   ├── monitoring/
│   │   ├── prometheus.tf
│   │   ├── grafana.tf
│   │   ├── loki.tf
│   │   ├── jaeger.tf
│   │   └── alertmanager.tf
│   └── security/
│       ├── vault.tf
│       ├── cert-manager.tf
│       └── external-secrets.tf
│
└── environments/
    ├── dev/
    │   ├── terragrunt.hcl
    │   └── terraform.tfvars
    ├── staging/
    │   ├── terragrunt.hcl
    │   └── terraform.tfvars
    └── prod/
        ├── terragrunt.hcl
        └── terraform.tfvars
```

### 2.2 Terraform Modules

#### 2.2.1 Kubernetes Module

| Resource | Purpose |
|----------|---------|
| `google_container_cluster` / `aws_eks_cluster` | Managed Kubernetes |
| `kubernetes_namespace` | Environment namespaces |
| `kubernetes_network_policy` | Pod-to-pod security |
| `kubernetes_resource_quota` | Resource limits per namespace |

#### 2.2.2 NeonDB Module

| Resource | Purpose |
|----------|---------|
| `neon_project` | Database project |
| `neon_branch` | Database branches (dev, staging, prod) |
| `neon_endpoint` | Connection endpoints |
| `neon_role` | Database users |

#### 2.2.3 Cloudflare Module

| Resource | Purpose |
|----------|---------|
| `cloudflare_zone` | DNS zone management |
| `cloudflare_record` | DNS records |
| `cloudflare_worker_script` | Edge workers |
| `cloudflare_r2_bucket` | Object storage |
| `cloudflare_ruleset` | WAF rules |

### 2.3 Terragrunt Configuration

```hcl
# terragrunt.hcl (root)
remote_state {
  backend = "gcs"  # or "s3"
  config = {
    bucket         = "nextphoton-terraform-state"
    prefix         = "${path_relative_to_include()}"
    project        = "nextphoton-prod"
    location       = "US"
  }
}

inputs = {
  project_name = "nextphoton"
  region       = "us-central1"
}
```

### 2.4 IaC Tools

| Tool | Version | Purpose |
|------|---------|---------|
| **Terraform** | 1.7.x | Infrastructure provisioning |
| **Terragrunt** | 0.55.x | Terraform wrapper, DRY configs |
| **tflint** | 0.50.x | Terraform linting |
| **checkov** | 3.x | Security scanning |
| **infracost** | 0.10.x | Cost estimation |

---

## 3. Kubernetes Architecture

### 3.1 Directory Structure

```
infrastructure/kubernetes/
├── base/
│   ├── namespace.yaml
│   ├── deployments/
│   │   ├── api-gateway.yaml
│   │   ├── auth-service.yaml
│   │   ├── user-service.yaml
│   │   ├── session-service.yaml
│   │   ├── payment-service.yaml
│   │   ├── analytics-service.yaml
│   │   ├── notification-service.yaml
│   │   └── media-service.yaml
│   ├── services/
│   │   ├── api-gateway-svc.yaml
│   │   └── internal-services.yaml
│   ├── configmaps/
│   │   ├── app-config.yaml
│   │   └── env-config.yaml
│   ├── secrets/
│   │   └── external-secrets.yaml
│   └── kustomization.yaml
│
├── overlays/
│   ├── dev/
│   │   ├── kustomization.yaml
│   │   ├── patches/
│   │   │   └── replica-count.yaml
│   │   └── resources/
│   │       └── dev-ingress.yaml
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   └── prod/
│       ├── kustomization.yaml
│       ├── patches/
│       │   ├── replica-count.yaml
│       │   ├── resource-limits.yaml
│       │   └── hpa.yaml
│       └── resources/
│           └── prod-ingress.yaml
│
├── keda/
│   ├── kustomization.yaml
│   ├── scaled-objects/
│   │   ├── auth-service-scaler.yaml
│   │   ├── notification-service-scaler.yaml
│   │   └── analytics-service-scaler.yaml
│   └── trigger-authentications/
│       └── nats-auth.yaml
│
└── kustomization.yaml
```

### 3.2 Sample Deployment

```yaml
# base/deployments/auth-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: auth-service
  labels:
    app: auth-service
    version: v1
spec:
  replicas: 2
  selector:
    matchLabels:
      app: auth-service
  template:
    metadata:
      labels:
        app: auth-service
        version: v1
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "9090"
    spec:
      serviceAccountName: auth-service
      containers:
        - name: auth-service
          image: ghcr.io/nextphoton/auth-service:latest
          ports:
            - containerPort: 8080
              name: http
            - containerPort: 9090
              name: metrics
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: database-credentials
                  key: url
            - name: NATS_URL
              valueFrom:
                configMapKeyRef:
                  name: app-config
                  key: nats-url
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          livenessProbe:
            httpGet:
              path: /health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 5
```

### 3.3 Kubernetes Version

| Component | Version | Purpose |
|-----------|---------|---------|
| **Kubernetes** | 1.29.x | Container orchestration |
| **Kustomize** | 5.x | K8s configuration management |
| **kubectl** | 1.29.x | CLI tool |

---

## 4. KEDA - Event-Driven Autoscaling

### 4.1 Overview

KEDA (Kubernetes Event-Driven Autoscaling) enables scaling based on:
- NATS queue depth (message backlog)
- Prometheus metrics (custom business metrics)
- External metrics (Redis queue length, etc.)

### 4.2 KEDA Configuration

| Component | Version | Purpose |
|-----------|---------|---------|
| **KEDA** | 2.13.x | Event-driven autoscaler |
| **KEDA HTTP Add-on** | 0.7.x | HTTP request-based scaling |

### 4.3 ScaledObject Examples

#### NATS-based Scaling

```yaml
# keda/scaled-objects/notification-service-scaler.yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: notification-service-scaler
  namespace: nextphoton
spec:
  scaleTargetRef:
    name: notification-service
  pollingInterval: 15
  cooldownPeriod: 60
  minReplicaCount: 1
  maxReplicaCount: 10
  triggers:
    - type: nats-jetstream
      metadata:
        natsServerMonitoringEndpoint: "nats.nextphoton.svc.cluster.local:8222"
        account: "$G"
        stream: "NOTIFICATIONS"
        consumer: "notification-processor"
        lagThreshold: "100"
      authenticationRef:
        name: nats-trigger-auth
```

#### Prometheus-based Scaling

```yaml
# keda/scaled-objects/analytics-service-scaler.yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: analytics-service-scaler
  namespace: nextphoton
spec:
  scaleTargetRef:
    name: analytics-service
  pollingInterval: 30
  cooldownPeriod: 120
  minReplicaCount: 1
  maxReplicaCount: 5
  triggers:
    - type: prometheus
      metadata:
        serverAddress: http://prometheus.monitoring.svc.cluster.local:9090
        metricName: analytics_events_pending
        query: sum(analytics_events_pending{namespace="nextphoton"})
        threshold: "500"
```

### 4.4 Scaling Strategy

| Service | Trigger | Threshold | Min | Max |
|---------|---------|-----------|-----|-----|
| **auth-service** | CPU/Memory | 70% | 2 | 10 |
| **notification-service** | NATS queue depth | 100 msgs | 1 | 10 |
| **analytics-service** | Prometheus metric | 500 events | 1 | 5 |
| **session-service** | HTTP requests/sec | 100 RPS | 2 | 8 |
| **payment-service** | CPU/Memory | 60% | 2 | 6 |

---

## 5. Helm Charts

### 5.1 Directory Structure

```
infrastructure/helm/
├── nextphoton/
│   ├── Chart.yaml
│   ├── values.yaml
│   ├── values-dev.yaml
│   ├── values-staging.yaml
│   ├── values-prod.yaml
│   ├── templates/
│   │   ├── _helpers.tpl
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   ├── ingress.yaml
│   │   ├── hpa.yaml
│   │   ├── pdb.yaml
│   │   ├── serviceaccount.yaml
│   │   ├── configmap.yaml
│   │   └── secrets.yaml
│   └── charts/
│       ├── api-gateway/
│       ├── auth-service/
│       ├── user-service/
│       └── ...
│
└── dependencies/
    ├── nats/
    ├── redis/
    ├── prometheus/
    └── grafana/
```

### 5.2 Helm Versions

| Tool | Version | Purpose |
|------|---------|---------|
| **Helm** | 3.14.x | Kubernetes package manager |
| **Helmfile** | 0.162.x | Declarative Helm releases |

### 5.3 Sample values.yaml

```yaml
# helm/nextphoton/values.yaml
global:
  environment: production
  imageRegistry: ghcr.io/nextphoton
  imagePullSecrets:
    - name: ghcr-credentials

apiGateway:
  replicaCount: 3
  image:
    repository: api-gateway
    tag: "1.0.0"
  resources:
    requests:
      cpu: 200m
      memory: 256Mi
    limits:
      cpu: 1000m
      memory: 1Gi

authService:
  replicaCount: 2
  image:
    repository: auth-service
    tag: "1.0.0"

nats:
  enabled: true
  cluster:
    replicas: 3
  jetstream:
    enabled: true
    memoryStore:
      size: 1Gi

redis:
  enabled: true
  architecture: replication
  replica:
    replicaCount: 2
```

---

## 6. ArgoCD - GitOps

### 6.1 Directory Structure

```
infrastructure/argocd/
├── projects/
│   ├── nextphoton-dev.yaml
│   ├── nextphoton-staging.yaml
│   └── nextphoton-prod.yaml
│
├── applications/
│   ├── dev/
│   │   ├── nextphoton-app.yaml
│   │   └── monitoring.yaml
│   ├── staging/
│   │   ├── nextphoton-app.yaml
│   │   └── monitoring.yaml
│   └── prod/
│       ├── nextphoton-app.yaml
│       └── monitoring.yaml
│
└── applicationsets/
    ├── microservices.yaml          # Generates apps for all services
    └── infrastructure.yaml         # NATS, Redis, monitoring
```

### 6.2 ArgoCD Application

```yaml
# argocd/applications/prod/nextphoton-app.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: nextphoton-prod
  namespace: argocd
  finalizers:
    - resources-finalizer.argocd.argoproj.io
spec:
  project: nextphoton-prod
  source:
    repoURL: https://github.com/nextphoton/nextphoton.git
    targetRevision: main
    path: infrastructure/kubernetes/overlays/prod
  destination:
    server: https://kubernetes.default.svc
    namespace: nextphoton-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PruneLast=true
    retry:
      limit: 5
      backoff:
        duration: 5s
        factor: 2
        maxDuration: 3m
```

### 6.3 ApplicationSet for Microservices

```yaml
# argocd/applicationsets/microservices.yaml
apiVersion: argoproj.io/v1alpha1
kind: ApplicationSet
metadata:
  name: nextphoton-microservices
  namespace: argocd
spec:
  generators:
    - matrix:
        generators:
          - list:
              elements:
                - service: auth-service
                - service: user-service
                - service: session-service
                - service: payment-service
                - service: analytics-service
                - service: notification-service
                - service: media-service
          - list:
              elements:
                - env: dev
                  cluster: dev-cluster
                - env: staging
                  cluster: staging-cluster
                - env: prod
                  cluster: prod-cluster
  template:
    metadata:
      name: '{{service}}-{{env}}'
    spec:
      project: nextphoton-{{env}}
      source:
        repoURL: https://github.com/nextphoton/nextphoton.git
        targetRevision: '{{env}}'
        path: 'backend/services/{{service}}/deploy/{{env}}'
      destination:
        server: '{{cluster}}'
        namespace: nextphoton-{{env}}
```

### 6.4 ArgoCD Versions

| Tool | Version | Purpose |
|------|---------|---------|
| **ArgoCD** | 2.10.x | GitOps continuous delivery |
| **ArgoCD Image Updater** | 0.12.x | Automatic image updates |
| **ArgoCD Notifications** | 1.2.x | Deployment notifications |

---

## 7. Cloudflare Infrastructure

### 7.1 Components

| Component | Purpose |
|-----------|---------|
| **CDN** | Global content delivery |
| **WAF** | Web Application Firewall |
| **DDoS Protection** | Layer 3/4/7 protection |
| **Workers** | Edge computing functions |
| **R2** | Object storage (S3-compatible) |
| **Pages** | Static site hosting (docs) |

### 7.2 Workers Use Cases

| Worker | Purpose |
|--------|---------|
| **auth-edge** | JWT validation at edge |
| **rate-limiter** | Request rate limiting |
| **geo-router** | Geographic routing |
| **image-optimizer** | On-the-fly image transformation |

### 7.3 R2 Buckets

| Bucket | Purpose | Access |
|--------|---------|--------|
| `nextphoton-uploads` | User uploads (assignments, documents) | Private |
| `nextphoton-media` | Public media assets | Public |
| `nextphoton-recordings` | Session recordings | Private |
| `nextphoton-backups` | Database backups | Private |

---

## 8. CI/CD Pipelines

### 8.1 GitHub Actions Workflows

```
.github/workflows/
├── ci.yml                    # Lint, test, build
├── cd.yml                    # Deploy to environments
├── security.yml              # Security scanning
├── release.yml               # Version releases
└── infrastructure.yml        # Terraform apply
```

### 8.2 CI Pipeline

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Go Lint
        uses: golangci/golangci-lint-action@v4
      - name: Terraform Lint
        uses: terraform-linters/setup-tflint@v4

  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
      nats:
        image: nats:latest
      redis:
        image: redis:7
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - run: go test -v -race -coverprofile=coverage.out ./...

  build:
    runs-on: ubuntu-latest
    needs: [lint, test]
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: ${{ github.ref == 'refs/heads/main' }}
          tags: ghcr.io/nextphoton/${{ matrix.service }}:${{ github.sha }}

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          security-checks: 'vuln,secret,config'
```

### 8.3 CD Pipeline

```yaml
# .github/workflows/cd.yml
name: CD

on:
  push:
    branches: [main]
    tags: ['v*']

jobs:
  deploy-dev:
    if: github.ref == 'refs/heads/main'
    environment: development
    steps:
      - name: Trigger ArgoCD Sync
        run: |
          argocd app sync nextphoton-dev --force

  deploy-staging:
    if: startsWith(github.ref, 'refs/tags/v')
    environment: staging
    needs: [deploy-dev]
    steps:
      - name: Trigger ArgoCD Sync
        run: |
          argocd app sync nextphoton-staging --force

  deploy-prod:
    if: startsWith(github.ref, 'refs/tags/v')
    environment: production
    needs: [deploy-staging]
    steps:
      - name: Trigger ArgoCD Sync
        run: |
          argocd app sync nextphoton-prod --force
```

---

## 9. Security Infrastructure

### 9.1 Secrets Management

| Tool | Version | Purpose |
|------|---------|---------|
| **HashiCorp Vault** | 1.15.x | Secrets management |
| **External Secrets Operator** | 0.9.x | K8s secret sync |
| **SOPS** | 3.8.x | Encrypted secrets in Git |

### 9.2 Security Scanning

| Tool | Version | Purpose |
|------|---------|---------|
| **Trivy** | 0.50.x | Container vulnerability scanning |
| **Checkov** | 3.x | IaC security scanning |
| **Falco** | 0.37.x | Runtime security |
| **OPA Gatekeeper** | 3.15.x | Policy enforcement |
| **SonarQube** | 10.x | Code quality & security |

### 9.3 Network Security

| Component | Purpose |
|-----------|---------|
| **Network Policies** | Pod-to-pod traffic control |
| **Cert-Manager** | Automatic TLS certificates |
| **Ingress TLS** | HTTPS termination |
| **mTLS (optional)** | Service mesh encryption |

---

## 10. Environment Configuration

### 10.1 Environment Matrix

| Environment | Purpose | K8s Namespace | Database Branch | Scaling |
|-------------|---------|---------------|-----------------|---------|
| `local` | Developer machine | Docker Compose | Local PostgreSQL | None |
| `dev` | Development testing | `nextphoton-dev` | `dev` | Min replicas |
| `staging` | Pre-production | `nextphoton-staging` | `staging` | Reduced |
| `prod` | Production | `nextphoton-prod` | `main` | Full KEDA |

### 10.2 Environment Variables

| Variable | Description | Source |
|----------|-------------|--------|
| `DATABASE_URL` | PostgreSQL connection string | Vault |
| `NATS_URL` | NATS server URL | ConfigMap |
| `REDIS_URL` | Redis connection string | Vault |
| `JWT_SECRET` | JWT signing key | Vault |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API access | Vault |

---

## 11. Disaster Recovery

### 11.1 Backup Strategy

| Component | Frequency | Retention | Storage |
|-----------|-----------|-----------|---------|
| PostgreSQL | Hourly | 30 days | Cloudflare R2 |
| Redis | Daily | 7 days | Cloudflare R2 |
| Kubernetes configs | Continuous | Unlimited | Git |
| Vault secrets | Daily | 90 days | Encrypted R2 |

### 11.2 RTO/RPO Targets

| Tier | RTO | RPO | Components |
|------|-----|-----|------------|
| Critical | 15 min | 1 hour | Auth, Payments |
| High | 1 hour | 4 hours | Sessions, Users |
| Medium | 4 hours | 24 hours | Analytics, Media |

---

## 12. Cost Optimization

### 12.1 Resource Right-Sizing

- Use Vertical Pod Autoscaler (VPA) recommendations
- Regular review of resource requests/limits
- Spot instances for non-critical workloads

### 12.2 Cost Monitoring

| Tool | Purpose |
|------|---------|
| **Infracost** | Terraform cost estimation |
| **Kubecost** | Kubernetes cost monitoring |
| **CloudHealth** | Multi-cloud cost management |

---

This infrastructure architecture provides a robust, scalable, and secure foundation for NextPhoton while enabling rapid iteration and deployment through GitOps practices.
