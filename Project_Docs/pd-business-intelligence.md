# NextPhoton Business Intelligence & Analytics

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Business Intelligence Overview

NextPhoton implements a comprehensive business intelligence stack for product analytics, user behavior tracking, and data-driven decision making.

### 1.1 BI Strategy

| Layer | Purpose | Tools |
|-------|---------|-------|
| **Product Analytics** | User behavior, feature usage | PostHog, Mixpanel |
| **Web Analytics** | Traffic, conversions | Plausible, Umami |
| **Business Intelligence** | Dashboards, reporting | Metabase, Superset |
| **Data Pipeline** | ETL, transformation | Airbyte, dbt |
| **Feature Management** | A/B testing, flags | Unleash, GrowthBook |
| **Session Analytics** | Recordings, heatmaps | OpenReplay, Hotjar |

### 1.2 Analytics Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                      VISUALIZATION LAYER                             │
│         Metabase • Superset • Grafana • Custom Dashboards            │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                       SEMANTIC LAYER                                 │
│                         Cube.js                                      │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                    ANALYTICS DATABASE                                │
│                       ClickHouse                                     │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                    TRANSFORMATION LAYER                              │
│                          dbt                                         │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
┌─────────────────────────────────▼───────────────────────────────────┐
│                      DATA INTEGRATION                                │
│                        Airbyte                                       │
└─────────────────────────────────┬───────────────────────────────────┘
                                  │
    ┌─────────────┬───────────────┼───────────────┬─────────────┐
    │             │               │               │             │
┌───▼───┐    ┌────▼────┐    ┌─────▼─────┐   ┌─────▼─────┐ ┌─────▼─────┐
│Postgres│   │ PostHog │    │  Stripe   │   │  NATS     │ │  Sentry   │
│(NeonDB)│   │ Events  │    │ Payments  │   │  Events   │ │  Errors   │
└────────┘   └─────────┘    └───────────┘   └───────────┘ └───────────┘
```

---

## 2. Product Analytics

### 2.1 PostHog (Self-Hosted)

| Feature | Purpose |
|---------|---------|
| **Event Tracking** | User actions, feature usage |
| **Funnels** | Conversion analysis |
| **Retention** | User engagement over time |
| **Paths** | User journey visualization |
| **Cohorts** | User segmentation |
| **Session Recording** | User behavior replay |
| **Feature Flags** | Gradual rollouts |
| **A/B Testing** | Experimentation |

### 2.2 Event Tracking Implementation

#### Backend (Go)

```go
// backend/shared/pkg/analytics/posthog.go
package analytics

import (
    "github.com/posthog/posthog-go"
)

type AnalyticsClient struct {
    client posthog.Client
}

func NewAnalyticsClient(apiKey, endpoint string) (*AnalyticsClient, error) {
    client, err := posthog.NewWithConfig(apiKey, posthog.Config{
        Endpoint: endpoint,
    })
    if err != nil {
        return nil, err
    }
    return &AnalyticsClient{client: client}, nil
}

func (a *AnalyticsClient) Track(userID string, event string, properties map[string]interface{}) {
    a.client.Enqueue(posthog.Capture{
        DistinctId: userID,
        Event:      event,
        Properties: properties,
    })
}

func (a *AnalyticsClient) Identify(userID string, traits map[string]interface{}) {
    a.client.Enqueue(posthog.Identify{
        DistinctId: userID,
        Properties: traits,
    })
}

// Usage example
func (s *SessionService) BookSession(ctx context.Context, req BookSessionRequest) (*Session, error) {
    session, err := s.repo.Create(ctx, req)
    if err != nil {
        return nil, err
    }

    // Track event
    s.analytics.Track(req.LearnerID, "session_booked", map[string]interface{}{
        "session_id":   session.ID,
        "educator_id":  req.EducatorID,
        "subject":      req.Subject,
        "session_type": req.Type,
        "duration":     req.Duration,
    })

    return session, nil
}
```

#### Frontend (React)

```typescript
// frontend/web/src/lib/analytics.ts
import posthog from 'posthog-js'

export const analytics = {
  init() {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: false, // Manual pageview tracking
    })
  },

  identify(userId: string, traits: Record<string, any>) {
    posthog.identify(userId, traits)
  },

  track(event: string, properties?: Record<string, any>) {
    posthog.capture(event, properties)
  },

  page(pageName: string, properties?: Record<string, any>) {
    posthog.capture('$pageview', { page: pageName, ...properties })
  },

  reset() {
    posthog.reset()
  },
}

// Usage in component
function BookSessionButton({ session }: { session: Session }) {
  const handleClick = () => {
    analytics.track('session_booking_started', {
      session_id: session.id,
      educator_name: session.educator.name,
      subject: session.subject,
    })
    // ... booking logic
  }

  return <Button onClick={handleClick}>Book Session</Button>
}
```

### 2.3 Key Events to Track

| Category | Event | Properties |
|----------|-------|------------|
| **Auth** | `user_signed_up` | role, referral_source |
| **Auth** | `user_logged_in` | method (password/oauth) |
| **Sessions** | `session_booked` | educator_id, subject, duration |
| **Sessions** | `session_started` | session_id, is_on_time |
| **Sessions** | `session_completed` | session_id, duration, rating |
| **Assignments** | `assignment_submitted` | assignment_id, is_late |
| **Payments** | `payment_initiated` | amount, gateway |
| **Payments** | `payment_completed` | amount, gateway, status |

---

## 3. Web Analytics

### 3.1 Plausible (Privacy-Focused)

| Feature | Purpose |
|---------|---------|
| **Pageviews** | Traffic analysis |
| **Referrers** | Traffic sources |
| **Goals** | Conversion tracking |
| **Campaigns** | UTM tracking |
| **Countries** | Geographic distribution |

### 3.2 Implementation

```typescript
// frontend/web/src/components/PlausibleProvider.tsx
import Script from 'next/script'

export function PlausibleProvider() {
  return (
    <Script
      defer
      data-domain="nextphoton.com"
      src="https://plausible.io/js/script.js"
    />
  )
}

// Goal tracking
export function trackGoal(goal: string, props?: Record<string, string>) {
  if (typeof window !== 'undefined' && window.plausible) {
    window.plausible(goal, { props })
  }
}

// Usage
trackGoal('Signup', { plan: 'premium' })
```

---

## 4. Business Intelligence Dashboards

### 4.1 Metabase

| Dashboard | Metrics |
|-----------|---------|
| **Executive Overview** | MRR, active users, session counts |
| **User Growth** | Signups, retention, churn |
| **Session Analytics** | Booking rate, completion rate, ratings |
| **Financial** | Revenue, payments, educator payouts |
| **ECM Performance** | Learner progress, intervention rate |

### 4.2 Sample SQL Queries

```sql
-- Daily Active Users
SELECT
  DATE_TRUNC('day', last_active_at) AS date,
  COUNT(DISTINCT user_id) AS dau
FROM user_sessions
WHERE last_active_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 1
ORDER BY 1;

-- Session Completion Rate by Subject
SELECT
  subject,
  COUNT(*) AS total_sessions,
  COUNT(*) FILTER (WHERE status = 'completed') AS completed,
  ROUND(
    COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100,
    2
  ) AS completion_rate
FROM learning_sessions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY 1
ORDER BY total_sessions DESC;

-- Monthly Recurring Revenue
SELECT
  DATE_TRUNC('month', created_at) AS month,
  SUM(amount) AS mrr,
  COUNT(DISTINCT guardian_id) AS paying_customers
FROM transactions
WHERE status = 'completed'
  AND type = 'subscription'
GROUP BY 1
ORDER BY 1;

-- ECM Learner Ratio
SELECT
  e.id AS ecm_id,
  e.name AS ecm_name,
  COUNT(DISTINCT l.id) AS learner_count,
  AVG(pr.score) AS avg_progress_score
FROM ecm_profiles e
LEFT JOIN learner_profiles l ON l.ecm_id = e.id
LEFT JOIN progress_records pr ON pr.learner_id = l.id
WHERE e.is_active = true
GROUP BY 1, 2
ORDER BY learner_count DESC;
```

### 4.3 Cube.js Semantic Layer

```javascript
// cube/schema/Sessions.js
cube('Sessions', {
  sql: `SELECT * FROM learning_sessions`,

  measures: {
    count: {
      type: 'count',
    },
    completedCount: {
      type: 'count',
      filters: [{ sql: `${CUBE}.status = 'completed'` }],
    },
    completionRate: {
      type: 'number',
      sql: `${completedCount} * 100.0 / NULLIF(${count}, 0)`,
      format: 'percent',
    },
    avgRating: {
      type: 'avg',
      sql: 'rating',
    },
    totalRevenue: {
      type: 'sum',
      sql: 'cost',
      format: 'currency',
    },
  },

  dimensions: {
    id: {
      type: 'string',
      sql: 'id',
      primaryKey: true,
    },
    subject: {
      type: 'string',
      sql: 'subject',
    },
    status: {
      type: 'string',
      sql: 'status',
    },
    sessionType: {
      type: 'string',
      sql: 'session_type',
    },
    createdAt: {
      type: 'time',
      sql: 'created_at',
    },
  },

  preAggregations: {
    dailyStats: {
      type: 'rollup',
      measures: [count, completedCount, avgRating, totalRevenue],
      dimensions: [subject, status],
      timeDimension: createdAt,
      granularity: 'day',
      refreshKey: {
        every: '1 hour',
      },
    },
  },
});
```

---

## 5. Data Pipeline

### 5.1 Airbyte (Data Integration)

| Source | Destination | Sync Frequency |
|--------|-------------|----------------|
| PostgreSQL (NeonDB) | ClickHouse | Every 15 min |
| PostHog | ClickHouse | Hourly |
| Stripe | ClickHouse | Hourly |
| Google Analytics | ClickHouse | Daily |

### 5.2 dbt (Data Transformation)

```yaml
# dbt_project.yml
name: 'nextphoton_analytics'
version: '1.0.0'

profile: 'nextphoton'

model-paths: ["models"]
analysis-paths: ["analyses"]
test-paths: ["tests"]

models:
  nextphoton_analytics:
    staging:
      +materialized: view
    marts:
      +materialized: table
```

```sql
-- models/marts/sessions/fct_sessions.sql
{{ config(materialized='table') }}

WITH sessions AS (
    SELECT * FROM {{ ref('stg_sessions') }}
),

educators AS (
    SELECT * FROM {{ ref('stg_educators') }}
),

learners AS (
    SELECT * FROM {{ ref('stg_learners') }}
)

SELECT
    s.id AS session_id,
    s.scheduled_start,
    s.scheduled_end,
    s.actual_start,
    s.actual_end,
    s.status,
    s.subject,
    s.session_type,
    s.format,
    s.cost,
    s.rating,

    e.id AS educator_id,
    e.name AS educator_name,
    e.classification AS educator_level,

    l.id AS learner_id,
    l.name AS learner_name,
    l.learner_type,

    -- Calculated fields
    DATEDIFF('minute', s.actual_start, s.actual_end) AS actual_duration_minutes,
    CASE WHEN s.actual_start <= s.scheduled_start THEN true ELSE false END AS started_on_time,
    CASE WHEN s.status = 'completed' THEN 1 ELSE 0 END AS is_completed

FROM sessions s
LEFT JOIN educators e ON s.educator_id = e.id
LEFT JOIN learners l ON s.learner_id = l.id
```

---

## 6. Feature Management & Experimentation

### 6.1 Unleash (Feature Flags)

| Feature Flag | Type | Purpose |
|--------------|------|---------|
| `new_booking_flow` | Gradual rollout | New session booking UI |
| `ai_recommendations` | A/B test | AI-powered suggestions |
| `dark_mode` | Release toggle | Dark mode availability |
| `payment_v2` | Ops toggle | New payment gateway |

### 6.2 Implementation

```typescript
// frontend/web/src/lib/features.ts
import { UnleashClient } from 'unleash-proxy-client'

const unleash = new UnleashClient({
  url: process.env.NEXT_PUBLIC_UNLEASH_URL!,
  clientKey: process.env.NEXT_PUBLIC_UNLEASH_CLIENT_KEY!,
  appName: 'nextphoton-web',
})

export function isFeatureEnabled(feature: string, context?: object): boolean {
  return unleash.isEnabled(feature, context)
}

// Usage
function SessionBooking() {
  const showNewFlow = isFeatureEnabled('new_booking_flow', {
    userId: user.id,
    userRole: user.role,
  })

  if (showNewFlow) {
    return <NewBookingFlow />
  }
  return <LegacyBookingFlow />
}
```

### 6.3 GrowthBook (A/B Testing)

```typescript
// frontend/web/src/lib/experiments.ts
import { GrowthBook } from '@growthbook/growthbook-react'

export const growthbook = new GrowthBook({
  apiHost: process.env.NEXT_PUBLIC_GROWTHBOOK_API_HOST,
  clientKey: process.env.NEXT_PUBLIC_GROWTHBOOK_CLIENT_KEY,
  enableDevMode: process.env.NODE_ENV === 'development',
  trackingCallback: (experiment, result) => {
    analytics.track('experiment_viewed', {
      experiment_id: experiment.key,
      variation_id: result.key,
    })
  },
})

// Usage
function PricingPage() {
  const { value } = useFeature('pricing_layout')

  if (value === 'horizontal') {
    return <HorizontalPricing />
  }
  return <VerticalPricing />
}
```

---

## 7. Session & UX Analytics

### 7.1 OpenReplay (Self-Hosted)

| Feature | Purpose |
|---------|---------|
| **Session Replay** | Watch user sessions |
| **DevTools** | Console, network, state |
| **Click Maps** | User interaction patterns |
| **Funnels** | Conversion analysis |
| **Errors** | JS error tracking |

### 7.2 Implementation

```typescript
// frontend/web/src/lib/openreplay.ts
import Tracker from '@openreplay/tracker'

const tracker = new Tracker({
  projectKey: process.env.NEXT_PUBLIC_OPENREPLAY_PROJECT_KEY!,
  ingestPoint: process.env.NEXT_PUBLIC_OPENREPLAY_INGEST_POINT,
})

export function initSessionRecording(userId?: string) {
  tracker.start()

  if (userId) {
    tracker.setUserID(userId)
  }
}

export function setSessionMetadata(key: string, value: string) {
  tracker.setMetadata(key, value)
}

// Usage
useEffect(() => {
  if (user) {
    initSessionRecording(user.id)
    setSessionMetadata('role', user.role)
    setSessionMetadata('plan', user.subscription?.plan || 'free')
  }
}, [user])
```

---

## 8. Key Business Metrics

### 8.1 North Star Metrics

| Metric | Definition | Target |
|--------|-----------|--------|
| **Weekly Active Learners** | Learners with ≥1 session/week | Growth 10% MoM |
| **Session Completion Rate** | Completed / Booked sessions | > 90% |
| **NPS Score** | Net Promoter Score | > 50 |

### 8.2 Health Metrics Dashboard

| Category | Metric | Calculation |
|----------|--------|-------------|
| **Growth** | User Signups | Daily new registrations |
| **Growth** | Activation Rate | Users with first session / Signups |
| **Engagement** | DAU/MAU Ratio | Daily active / Monthly active |
| **Engagement** | Sessions per Learner | Avg sessions per learner/month |
| **Revenue** | MRR | Monthly recurring revenue |
| **Revenue** | ARPU | Revenue / Active paying users |
| **Quality** | Session Rating | Avg rating (1-5) |
| **Quality** | ECM Response Time | Avg time to first response |

---

## 9. Data Privacy & Compliance

### 9.1 GDPR Compliance

| Requirement | Implementation |
|-------------|----------------|
| **Consent** | Cookie consent banner |
| **Data Access** | User data export API |
| **Right to Delete** | Account deletion with data purge |
| **Data Minimization** | Only collect necessary data |
| **Anonymization** | PII removed after retention period |

### 9.2 Data Retention Policies

| Data Type | Retention | Action After |
|-----------|-----------|--------------|
| Analytics events | 2 years | Aggregate & delete |
| Session recordings | 90 days | Delete |
| Error logs | 1 year | Delete |
| Financial records | 7 years | Archive |

---

This BI stack provides comprehensive insights into user behavior, business performance, and product health for data-driven decision making.
