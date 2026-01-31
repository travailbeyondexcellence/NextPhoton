// Package entities defines the core domain models for the Analytics Service.
package entities

import (
	"time"

	"github.com/google/uuid"
)

// MetricType represents different types of metrics tracked by the analytics system.
type MetricType string

const (
	// User engagement metrics
	MetricDAU           MetricType = "daily_active_users"
	MetricMAU           MetricType = "monthly_active_users"
	MetricWAU           MetricType = "weekly_active_users"
	MetricRetentionRate MetricType = "retention_rate"
	MetricChurnRate     MetricType = "churn_rate"
	MetricDAUMAURatio   MetricType = "dau_mau_ratio"

	// Session metrics
	MetricSessionCompletionRate MetricType = "session_completion_rate"
	MetricAverageSessionRating  MetricType = "average_session_rating"
	MetricSessionsPerLearner    MetricType = "sessions_per_learner"
	MetricAverageSessionDuration MetricType = "average_session_duration"
	MetricSessionNoShowRate     MetricType = "session_no_show_rate"
	MetricSessionBookingRate    MetricType = "session_booking_rate"

	// Learner performance metrics
	MetricLearnerProgressScore MetricType = "learner_progress_score"
	MetricAssignmentCompletionRate MetricType = "assignment_completion_rate"
	MetricAverageAssignmentScore MetricType = "average_assignment_score"
	MetricLearningVelocity     MetricType = "learning_velocity"

	// ECM metrics
	MetricECMLearnerRatio      MetricType = "ecm_learner_ratio"
	MetricECMInterventionRate  MetricType = "ecm_intervention_rate"
	MetricECMResponseTime      MetricType = "ecm_response_time"
	MetricECMSatisfactionScore MetricType = "ecm_satisfaction_score"

	// Revenue metrics
	MetricMRR                  MetricType = "monthly_recurring_revenue"
	MetricARR                  MetricType = "annual_recurring_revenue"
	MetricARPU                 MetricType = "average_revenue_per_user"
	MetricLTV                  MetricType = "lifetime_value"
	MetricConversionRate       MetricType = "conversion_rate"
	MetricPaymentSuccessRate   MetricType = "payment_success_rate"

	// Growth metrics
	MetricUserSignups          MetricType = "user_signups"
	MetricUserGrowthRate       MetricType = "user_growth_rate"
	MetricActivationRate       MetricType = "activation_rate"
	MetricViralCoefficient     MetricType = "viral_coefficient"

	// Quality metrics
	MetricNPS                  MetricType = "net_promoter_score"
	MetricCSAT                 MetricType = "customer_satisfaction"
	MetricCES                  MetricType = "customer_effort_score"
)

// MetricGranularity represents the time granularity of a metric.
type MetricGranularity string

const (
	GranularityHourly  MetricGranularity = "hourly"
	GranularityDaily   MetricGranularity = "daily"
	GranularityWeekly  MetricGranularity = "weekly"
	GranularityMonthly MetricGranularity = "monthly"
	GranularityQuarterly MetricGranularity = "quarterly"
	GranularityYearly  MetricGranularity = "yearly"
)

// Metric represents a calculated metric value at a point in time.
// Metrics are derived from events through aggregation and stored for fast retrieval.
type Metric struct {
	// ID is the unique identifier for this metric record
	ID uuid.UUID `json:"id"`

	// Type identifies what metric this is
	Type MetricType `json:"metric_type"`

	// Value is the numeric value of the metric
	Value float64 `json:"value"`

	// PreviousValue holds the previous period's value for comparison
	PreviousValue *float64 `json:"previous_value,omitempty"`

	// ChangePercent is the percentage change from previous period
	ChangePercent *float64 `json:"change_percent,omitempty"`

	// Granularity indicates the time period this metric covers
	Granularity MetricGranularity `json:"granularity"`

	// PeriodStart is the beginning of the measurement period
	PeriodStart time.Time `json:"period_start"`

	// PeriodEnd is the end of the measurement period
	PeriodEnd time.Time `json:"period_end"`

	// Dimensions contains dimensional breakdowns (e.g., by subject, by role)
	Dimensions map[string]string `json:"dimensions,omitempty"`

	// Metadata contains additional metric-specific information
	Metadata map[string]interface{} `json:"metadata,omitempty"`

	// CalculatedAt is when this metric was calculated
	CalculatedAt time.Time `json:"calculated_at"`

	// SampleSize is the number of data points used in calculation
	SampleSize int64 `json:"sample_size,omitempty"`

	// Confidence represents statistical confidence (for sampled metrics)
	Confidence *float64 `json:"confidence,omitempty"`
}

// NewMetric creates a new Metric with the given values.
func NewMetric(metricType MetricType, value float64, granularity MetricGranularity, periodStart, periodEnd time.Time) *Metric {
	return &Metric{
		ID:           uuid.New(),
		Type:         metricType,
		Value:        value,
		Granularity:  granularity,
		PeriodStart:  periodStart,
		PeriodEnd:    periodEnd,
		CalculatedAt: time.Now().UTC(),
	}
}

// WithDimensions adds dimensional breakdowns to the metric.
func (m *Metric) WithDimensions(dimensions map[string]string) *Metric {
	m.Dimensions = dimensions
	return m
}

// WithPreviousValue sets the previous value and calculates change percent.
func (m *Metric) WithPreviousValue(previousValue float64) *Metric {
	m.PreviousValue = &previousValue
	if previousValue != 0 {
		changePercent := ((m.Value - previousValue) / previousValue) * 100
		m.ChangePercent = &changePercent
	}
	return m
}

// WithMetadata adds metadata to the metric.
func (m *Metric) WithMetadata(metadata map[string]interface{}) *Metric {
	m.Metadata = metadata
	return m
}

// WithSampleSize sets the sample size used in calculation.
func (m *Metric) WithSampleSize(size int64) *Metric {
	m.SampleSize = size
	return m
}

// IsPositiveChange returns true if the metric shows positive change.
func (m *Metric) IsPositiveChange() bool {
	if m.ChangePercent == nil {
		return false
	}
	return *m.ChangePercent > 0
}

// GetDimension returns the value for a specific dimension, or empty string if not found.
func (m *Metric) GetDimension(key string) string {
	if m.Dimensions == nil {
		return ""
	}
	return m.Dimensions[key]
}

// MetricSummary represents a summary view of multiple metrics for dashboards.
type MetricSummary struct {
	// Type identifies what metric this is
	Type MetricType `json:"metric_type"`

	// CurrentValue is the most recent value
	CurrentValue float64 `json:"current_value"`

	// PreviousValue is the previous period value
	PreviousValue float64 `json:"previous_value"`

	// ChangePercent is the percentage change
	ChangePercent float64 `json:"change_percent"`

	// Trend indicates the direction (up, down, flat)
	Trend string `json:"trend"`

	// SparklineData contains values for mini chart visualization
	SparklineData []float64 `json:"sparkline_data,omitempty"`

	// Target is the goal value for this metric
	Target *float64 `json:"target,omitempty"`

	// TargetProgress is the percentage progress toward target
	TargetProgress *float64 `json:"target_progress,omitempty"`

	// LastUpdated is when this summary was last calculated
	LastUpdated time.Time `json:"last_updated"`
}

// DimensionalMetric represents a metric broken down by dimensions.
type DimensionalMetric struct {
	// Type identifies what metric this is
	Type MetricType `json:"metric_type"`

	// Dimension is the dimension being broken down (e.g., "subject", "role")
	Dimension string `json:"dimension"`

	// Values maps dimension values to metric values
	Values []DimensionValue `json:"values"`

	// Total is the aggregate value across all dimensions
	Total float64 `json:"total"`

	// PeriodStart is the beginning of the measurement period
	PeriodStart time.Time `json:"period_start"`

	// PeriodEnd is the end of the measurement period
	PeriodEnd time.Time `json:"period_end"`
}

// DimensionValue represents a single dimension-value pair.
type DimensionValue struct {
	// Label is the dimension value (e.g., "Mathematics", "Science")
	Label string `json:"label"`

	// Value is the metric value for this dimension
	Value float64 `json:"value"`

	// Percent is the percentage of total
	Percent float64 `json:"percent"`

	// Count is the underlying count (for averages/rates)
	Count int64 `json:"count,omitempty"`
}

// MetricTimeSeries represents a time series of metric values.
type MetricTimeSeries struct {
	// Type identifies what metric this is
	Type MetricType `json:"metric_type"`

	// Granularity is the time granularity of the series
	Granularity MetricGranularity `json:"granularity"`

	// DataPoints contains the time-value pairs
	DataPoints []TimeSeriesDataPoint `json:"data_points"`

	// StartTime is the start of the series
	StartTime time.Time `json:"start_time"`

	// EndTime is the end of the series
	EndTime time.Time `json:"end_time"`

	// Dimensions filters applied to this series
	Dimensions map[string]string `json:"dimensions,omitempty"`
}

// TimeSeriesDataPoint represents a single point in a time series.
type TimeSeriesDataPoint struct {
	// Timestamp is the time for this data point
	Timestamp time.Time `json:"timestamp"`

	// Value is the metric value at this time
	Value float64 `json:"value"`

	// Metadata contains additional data for this point
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// Cohort represents a group of users for cohort analysis.
type Cohort struct {
	// ID is the unique identifier for this cohort
	ID uuid.UUID `json:"id"`

	// Name is a human-readable name for the cohort
	Name string `json:"name"`

	// Description explains the cohort criteria
	Description string `json:"description,omitempty"`

	// Criteria defines how users are included in this cohort
	Criteria CohortCriteria `json:"criteria"`

	// Size is the number of users in the cohort
	Size int64 `json:"size"`

	// CreatedAt is when the cohort was defined
	CreatedAt time.Time `json:"created_at"`

	// LastUpdated is when the cohort size was last calculated
	LastUpdated time.Time `json:"last_updated"`
}

// CohortCriteria defines the rules for cohort membership.
type CohortCriteria struct {
	// StartDate is the beginning of the cohort period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the cohort period
	EndDate time.Time `json:"end_date"`

	// EventType is the qualifying event for the cohort
	EventType EventType `json:"event_type,omitempty"`

	// Filters are additional property filters
	Filters map[string]interface{} `json:"filters,omitempty"`

	// UserRole filters by user role
	UserRole string `json:"user_role,omitempty"`
}

// CohortRetentionData represents retention data for a cohort.
type CohortRetentionData struct {
	// CohortID identifies the cohort
	CohortID uuid.UUID `json:"cohort_id"`

	// CohortName is the name of the cohort
	CohortName string `json:"cohort_name"`

	// CohortSize is the initial size of the cohort
	CohortSize int64 `json:"cohort_size"`

	// RetentionByPeriod maps period index to retention rate
	RetentionByPeriod []RetentionPeriod `json:"retention_by_period"`
}

// RetentionPeriod represents retention data for a single period.
type RetentionPeriod struct {
	// PeriodIndex is the period number (0 = week 0, 1 = week 1, etc.)
	PeriodIndex int `json:"period_index"`

	// RetainedCount is the number of users still active
	RetainedCount int64 `json:"retained_count"`

	// RetentionRate is the percentage retained
	RetentionRate float64 `json:"retention_rate"`
}
