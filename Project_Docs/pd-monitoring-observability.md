# NextPhoton Monitoring & Observability

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Observability Overview

NextPhoton implements comprehensive observability across all services using the three pillars: Metrics, Logs, and Traces.

### 1.1 Observability Pillars

| Pillar | Technology | Purpose |
|--------|-----------|---------|
| **Metrics** | Prometheus + Grafana | Performance monitoring |
| **Logs** | Loki + Promtail | Log aggregation |
| **Traces** | Jaeger + OpenTelemetry | Distributed tracing |

### 1.2 Monitoring Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         GRAFANA DASHBOARDS                           │
│            Metrics • Logs • Traces • Alerts • SLOs                   │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
    ┌─────────────┬───────────────┼───────────────┬─────────────┐
    │             │               │               │             │
┌───▼───┐    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐ ┌─────▼─────┐
│Prometh│    │  Loki   │    │   Jaeger  │   │AlertManag│ │  Thanos   │
│  eus  │    │         │    │           │   │    er    │ │           │
└───┬───┘    └────┬────┘    └─────┬─────┘   └─────┬─────┘ └─────┬─────┘
    │             │               │               │             │
    │        ┌────┴────┐          │               │             │
    │        │Promtail │          │               │             │
    │        └────┬────┘          │               │             │
    │             │               │               │             │
    └─────────────┴───────────────┴───────────────┴─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │   OpenTelemetry Collector  │
                    └─────────────┬─────────────┘
                                  │
    ┌─────────────┬───────────────┼───────────────┬─────────────┐
    │             │               │               │             │
┌───▼───┐    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐ ┌─────▼─────┐
│ Auth  │    │  User   │    │  Session  │   │  Payment  │ │ Analytics │
│Service│    │ Service │    │  Service  │   │  Service  │ │  Service  │
└───────┘    └─────────┘    └───────────┘   └───────────┘ └───────────┘
```

---

## 2. Metrics (Prometheus)

### 2.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Prometheus** | 2.50.x | Metrics collection |
| **Thanos** | 0.34.x | Long-term storage |
| **Grafana** | 10.x | Visualization |
| **AlertManager** | 0.27.x | Alert management |

### 2.2 Prometheus Configuration

```yaml
# infrastructure/monitoring/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
            - alertmanager:9093

rule_files:
  - /etc/prometheus/rules/*.yml

scrape_configs:
  - job_name: 'kubernetes-pods'
    kubernetes_sd_configs:
      - role: pod
    relabel_configs:
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep
        regex: true
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: (.+)
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: ([^:]+)(?::\d+)?;(\d+)
        replacement: $1:$2
        target_label: __address__

  - job_name: 'nextphoton-services'
    static_configs:
      - targets:
          - auth-service:9090
          - user-service:9090
          - session-service:9090
          - payment-service:9090
          - analytics-service:9090
```

### 2.3 Key Metrics

#### 2.3.1 RED Metrics (Request, Error, Duration)

```go
// backend/shared/pkg/metrics/metrics.go
package metrics

import (
    "github.com/prometheus/client_golang/prometheus"
    "github.com/prometheus/client_golang/prometheus/promauto"
)

var (
    // Request count
    RequestsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "nextphoton_requests_total",
            Help: "Total number of requests",
        },
        []string{"service", "method", "endpoint", "status"},
    )

    // Error rate
    ErrorsTotal = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "nextphoton_errors_total",
            Help: "Total number of errors",
        },
        []string{"service", "method", "endpoint", "error_type"},
    )

    // Request duration
    RequestDuration = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "nextphoton_request_duration_seconds",
            Help:    "Request duration in seconds",
            Buckets: prometheus.DefBuckets,
        },
        []string{"service", "method", "endpoint"},
    )
)
```

#### 2.3.2 Business Metrics

```go
var (
    // Active sessions
    ActiveSessions = promauto.NewGauge(
        prometheus.GaugeOpts{
            Name: "nextphoton_active_sessions",
            Help: "Number of active learning sessions",
        },
    )

    // Session bookings
    SessionBookings = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "nextphoton_session_bookings_total",
            Help: "Total session bookings",
        },
        []string{"type", "status"},
    )

    // Payment transactions
    PaymentTransactions = promauto.NewCounterVec(
        prometheus.CounterOpts{
            Name: "nextphoton_payment_transactions_total",
            Help: "Total payment transactions",
        },
        []string{"gateway", "status"},
    )

    // Payment amount
    PaymentAmount = promauto.NewHistogramVec(
        prometheus.HistogramOpts{
            Name:    "nextphoton_payment_amount",
            Help:    "Payment amount distribution",
            Buckets: []float64{100, 500, 1000, 5000, 10000, 50000},
        },
        []string{"gateway", "currency"},
    )
)
```

### 2.4 Alert Rules

```yaml
# infrastructure/monitoring/prometheus/rules/nextphoton-alerts.yml
groups:
  - name: nextphoton-alerts
    rules:
      - alert: HighErrorRate
        expr: |
          sum(rate(nextphoton_errors_total[5m])) by (service)
          /
          sum(rate(nextphoton_requests_total[5m])) by (service)
          > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "High error rate on {{ $labels.service }}"
          description: "Error rate is {{ $value | humanizePercentage }}"

      - alert: HighLatency
        expr: |
          histogram_quantile(0.95,
            sum(rate(nextphoton_request_duration_seconds_bucket[5m])) by (le, service)
          ) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency on {{ $labels.service }}"
          description: "P95 latency is {{ $value }}s"

      - alert: ServiceDown
        expr: up{job="nextphoton-services"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Service {{ $labels.instance }} is down"

      - alert: HighMemoryUsage
        expr: |
          container_memory_usage_bytes{namespace="nextphoton"}
          /
          container_spec_memory_limit_bytes{namespace="nextphoton"}
          > 0.9
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory usage on {{ $labels.pod }}"
```

---

## 3. Logging (Loki)

### 3.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Loki** | 2.9.x | Log aggregation |
| **Promtail** | 2.9.x | Log shipping |
| **Grafana** | 10.x | Log visualization |

### 3.2 Promtail Configuration

```yaml
# infrastructure/monitoring/loki/promtail-config.yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: kubernetes-pods
    kubernetes_sd_configs:
      - role: pod
    pipeline_stages:
      - cri: {}
      - json:
          expressions:
            level: level
            msg: msg
            service: service
            trace_id: trace_id
      - labels:
          level:
          service:
      - timestamp:
          source: time
          format: RFC3339Nano
    relabel_configs:
      - source_labels:
          - __meta_kubernetes_pod_label_app
        target_label: app
      - source_labels:
          - __meta_kubernetes_namespace
        target_label: namespace
      - source_labels:
          - __meta_kubernetes_pod_name
        target_label: pod
```

### 3.3 Structured Logging (Go)

```go
// backend/shared/pkg/logging/logger.go
package logging

import (
    "go.uber.org/zap"
    "go.uber.org/zap/zapcore"
)

func NewLogger(service string) (*zap.Logger, error) {
    config := zap.NewProductionConfig()
    config.EncoderConfig.TimeKey = "time"
    config.EncoderConfig.EncodeTime = zapcore.RFC3339NanoTimeEncoder

    logger, err := config.Build(
        zap.Fields(zap.String("service", service)),
    )
    if err != nil {
        return nil, err
    }

    return logger, nil
}

// Usage
func (s *AuthService) Login(ctx context.Context, email, password string) (*User, error) {
    logger := logging.FromContext(ctx)

    logger.Info("login attempt",
        zap.String("email", email),
        zap.String("trace_id", tracing.TraceIDFromContext(ctx)),
    )

    user, err := s.userRepo.FindByEmail(ctx, email)
    if err != nil {
        logger.Error("login failed",
            zap.String("email", email),
            zap.Error(err),
        )
        return nil, err
    }

    logger.Info("login successful",
        zap.String("user_id", user.ID),
        zap.String("email", email),
    )

    return user, nil
}
```

---

## 4. Distributed Tracing (Jaeger)

### 4.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Jaeger** | 1.54.x | Trace storage & UI |
| **OpenTelemetry** | 1.24.x | Instrumentation |
| **Tempo** | 2.4.x | Trace storage (alt) |

### 4.2 OpenTelemetry Configuration

```go
// backend/shared/pkg/tracing/tracing.go
package tracing

import (
    "context"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/exporters/jaeger"
    "go.opentelemetry.io/otel/sdk/resource"
    "go.opentelemetry.io/otel/sdk/trace"
    semconv "go.opentelemetry.io/otel/semconv/v1.4.0"
)

func InitTracer(serviceName, jaegerEndpoint string) (*trace.TracerProvider, error) {
    exporter, err := jaeger.New(
        jaeger.WithCollectorEndpoint(jaeger.WithEndpoint(jaegerEndpoint)),
    )
    if err != nil {
        return nil, err
    }

    tp := trace.NewTracerProvider(
        trace.WithBatcher(exporter),
        trace.WithResource(resource.NewWithAttributes(
            semconv.SchemaURL,
            semconv.ServiceNameKey.String(serviceName),
        )),
        trace.WithSampler(trace.ParentBased(trace.TraceIDRatioBased(0.1))),
    )

    otel.SetTracerProvider(tp)
    return tp, nil
}
```

### 4.3 Tracing Middleware

```go
// backend/shared/pkg/middleware/tracing.go
package middleware

import (
    "net/http"

    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/propagation"
    "go.opentelemetry.io/otel/trace"
)

func TracingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        ctx := otel.GetTextMapPropagator().Extract(r.Context(), propagation.HeaderCarrier(r.Header))

        tracer := otel.Tracer("http")
        ctx, span := tracer.Start(ctx, r.URL.Path,
            trace.WithAttributes(
                attribute.String("http.method", r.Method),
                attribute.String("http.url", r.URL.String()),
            ),
        )
        defer span.End()

        // Add trace ID to response header
        span.SpanContext().TraceID().String()
        w.Header().Set("X-Trace-ID", span.SpanContext().TraceID().String())

        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
```

---

## 5. Grafana Dashboards

### 5.1 Dashboard Categories

| Dashboard | Purpose | Key Metrics |
|-----------|---------|-------------|
| **Service Overview** | High-level health | Request rate, error rate, latency |
| **Authentication** | Auth service metrics | Login success/failure, token validation |
| **Sessions** | Session management | Active sessions, bookings, cancellations |
| **Payments** | Payment processing | Transaction volume, success rate, amounts |
| **Infrastructure** | K8s resources | CPU, memory, pod health |

### 5.2 SLO Dashboard Example

```json
{
  "title": "NextPhoton SLOs",
  "panels": [
    {
      "title": "Availability SLO (99.9%)",
      "type": "gauge",
      "targets": [
        {
          "expr": "1 - (sum(rate(nextphoton_errors_total{status=~\"5..\"}[30d])) / sum(rate(nextphoton_requests_total[30d])))",
          "legendFormat": "Availability"
        }
      ],
      "fieldConfig": {
        "defaults": {
          "thresholds": {
            "steps": [
              { "value": 0.999, "color": "green" },
              { "value": 0.99, "color": "yellow" },
              { "value": 0, "color": "red" }
            ]
          },
          "unit": "percentunit"
        }
      }
    },
    {
      "title": "Latency SLO (P95 < 500ms)",
      "type": "gauge",
      "targets": [
        {
          "expr": "histogram_quantile(0.95, sum(rate(nextphoton_request_duration_seconds_bucket[30d])) by (le))",
          "legendFormat": "P95 Latency"
        }
      ]
    }
  ]
}
```

---

## 6. APM & Error Tracking

### 6.1 Sentry Integration

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Sentry** | 23.x | Error tracking |
| **Sentry Go** | 0.27.x | Go SDK |
| **Sentry React** | 7.x | React SDK |

### 6.2 Sentry Configuration (Go)

```go
// backend/shared/pkg/errors/sentry.go
package errors

import (
    "github.com/getsentry/sentry-go"
    "time"
)

func InitSentry(dsn, environment, release string) error {
    return sentry.Init(sentry.ClientOptions{
        Dsn:              dsn,
        Environment:      environment,
        Release:          release,
        TracesSampleRate: 0.1,
        BeforeSend: func(event *sentry.Event, hint *sentry.EventHint) *sentry.Event {
            // Filter sensitive data
            return event
        },
    })
}

func CaptureError(err error, ctx context.Context) {
    hub := sentry.GetHubFromContext(ctx)
    if hub == nil {
        hub = sentry.CurrentHub()
    }

    hub.CaptureException(err)
}

func Flush() {
    sentry.Flush(2 * time.Second)
}
```

---

## 7. Uptime Monitoring

### 7.1 Technology Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Uptime Kuma** | 1.23.x | Uptime monitoring |
| **Blackbox Exporter** | 0.24.x | Endpoint probing |

### 7.2 Health Check Endpoints

```go
// backend/shared/pkg/health/health.go
package health

import (
    "context"
    "encoding/json"
    "net/http"
)

type HealthStatus struct {
    Status    string            `json:"status"`
    Version   string            `json:"version"`
    Checks    map[string]Check  `json:"checks"`
}

type Check struct {
    Status  string `json:"status"`
    Message string `json:"message,omitempty"`
}

func HealthHandler(db *sql.DB, nats *nats.Conn, redis *redis.Client) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx := r.Context()
        status := HealthStatus{
            Status:  "healthy",
            Version: version.Version,
            Checks:  make(map[string]Check),
        }

        // Check database
        if err := db.PingContext(ctx); err != nil {
            status.Checks["database"] = Check{Status: "unhealthy", Message: err.Error()}
            status.Status = "unhealthy"
        } else {
            status.Checks["database"] = Check{Status: "healthy"}
        }

        // Check NATS
        if !nats.IsConnected() {
            status.Checks["nats"] = Check{Status: "unhealthy", Message: "disconnected"}
            status.Status = "unhealthy"
        } else {
            status.Checks["nats"] = Check{Status: "healthy"}
        }

        // Check Redis
        if _, err := redis.Ping(ctx).Result(); err != nil {
            status.Checks["redis"] = Check{Status: "unhealthy", Message: err.Error()}
            status.Status = "unhealthy"
        } else {
            status.Checks["redis"] = Check{Status: "healthy"}
        }

        w.Header().Set("Content-Type", "application/json")
        if status.Status != "healthy" {
            w.WriteHeader(http.StatusServiceUnavailable)
        }
        json.NewEncoder(w).Encode(status)
    }
}
```

---

## 8. Incident Management

### 8.1 Tools

| Tool | Purpose |
|------|---------|
| **Grafana OnCall** | On-call scheduling |
| **PagerDuty** | Alerting (optional) |
| **Slack** | Notifications |

### 8.2 AlertManager Configuration

```yaml
# infrastructure/monitoring/alertmanager/alertmanager.yml
global:
  resolve_timeout: 5m
  slack_api_url: 'https://hooks.slack.com/services/xxx'

route:
  receiver: 'default'
  group_by: ['alertname', 'service']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  routes:
    - match:
        severity: critical
      receiver: 'critical'
      continue: true
    - match:
        severity: warning
      receiver: 'warning'

receivers:
  - name: 'default'
    slack_configs:
      - channel: '#alerts'

  - name: 'critical'
    slack_configs:
      - channel: '#alerts-critical'
    pagerduty_configs:
      - service_key: '<pagerduty-key>'

  - name: 'warning'
    slack_configs:
      - channel: '#alerts-warning'
```

---

## 9. SLO Definitions

### 9.1 Service Level Objectives

| Service | SLI | SLO Target | Error Budget |
|---------|-----|-----------|--------------|
| **API Gateway** | Availability | 99.9% | 43.2 min/month |
| **Auth Service** | Success Rate | 99.95% | 21.6 min/month |
| **Session Service** | Latency P95 | < 500ms | - |
| **Payment Service** | Success Rate | 99.99% | 4.3 min/month |

---

This observability stack provides comprehensive visibility into NextPhoton's health, performance, and reliability across all services.
