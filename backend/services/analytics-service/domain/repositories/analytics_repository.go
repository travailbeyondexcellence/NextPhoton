// Package repositories defines the repository interfaces for the Analytics Service.
// These interfaces abstract the data access layer, allowing the domain layer
// to remain independent of specific persistence technologies.
package repositories

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nextphoton/analytics-service/domain/entities"
)

// EventRepository defines the interface for event persistence operations.
// This interface is implemented by both PostgreSQL (for operational queries)
// and ClickHouse (for analytics queries) repositories.
type EventRepository interface {
	// Create stores a single event
	Create(ctx context.Context, event *entities.Event) error

	// CreateBatch stores multiple events in a single operation
	CreateBatch(ctx context.Context, events []*entities.Event) error

	// GetByID retrieves an event by its ID
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Event, error)

	// GetByUserID retrieves events for a specific user
	GetByUserID(ctx context.Context, userID string, opts EventQueryOptions) ([]*entities.Event, error)

	// GetByType retrieves events of a specific type
	GetByType(ctx context.Context, eventType entities.EventType, opts EventQueryOptions) ([]*entities.Event, error)

	// GetByCategory retrieves events in a specific category
	GetByCategory(ctx context.Context, category entities.EventCategory, opts EventQueryOptions) ([]*entities.Event, error)

	// Query retrieves events matching the given criteria
	Query(ctx context.Context, opts EventQueryOptions) (*EventQueryResult, error)

	// Count counts events matching the given criteria
	Count(ctx context.Context, opts EventQueryOptions) (int64, error)

	// CountByType counts events grouped by type for a time period
	CountByType(ctx context.Context, startTime, endTime time.Time) (map[entities.EventType]int64, error)

	// GetUniqueUsers returns the count of unique users in a time period
	GetUniqueUsers(ctx context.Context, startTime, endTime time.Time) (int64, error)

	// Delete removes events older than a specific time (for data retention)
	DeleteBefore(ctx context.Context, before time.Time) (int64, error)
}

// EventQueryOptions defines options for querying events.
type EventQueryOptions struct {
	// UserID filters by user ID
	UserID string

	// SessionID filters by session ID
	SessionID string

	// Category filters by event category
	Category entities.EventCategory

	// Types filters by event types (OR logic)
	Types []entities.EventType

	// StartTime filters events after this time
	StartTime time.Time

	// EndTime filters events before this time
	EndTime time.Time

	// Source filters by event source
	Source string

	// PropertyFilters filters by event properties
	PropertyFilters map[string]interface{}

	// Limit limits the number of results
	Limit int

	// Offset is the offset for pagination
	Offset int

	// OrderBy specifies the sort field
	OrderBy string

	// OrderDesc sorts in descending order if true
	OrderDesc bool
}

// EventQueryResult contains the results of an event query.
type EventQueryResult struct {
	// Events contains the matched events
	Events []*entities.Event

	// TotalCount is the total count of matching events (before pagination)
	TotalCount int64

	// HasMore indicates if there are more results
	HasMore bool
}

// MetricRepository defines the interface for metric persistence operations.
type MetricRepository interface {
	// Save stores a metric
	Save(ctx context.Context, metric *entities.Metric) error

	// SaveBatch stores multiple metrics in a single operation
	SaveBatch(ctx context.Context, metrics []*entities.Metric) error

	// GetByType retrieves metrics of a specific type
	GetByType(ctx context.Context, metricType entities.MetricType, opts MetricQueryOptions) ([]*entities.Metric, error)

	// GetLatest retrieves the most recent metric of a type
	GetLatest(ctx context.Context, metricType entities.MetricType, dimensions map[string]string) (*entities.Metric, error)

	// GetTimeSeries retrieves a time series of metric values
	GetTimeSeries(ctx context.Context, metricType entities.MetricType, opts MetricQueryOptions) (*entities.MetricTimeSeries, error)

	// GetDimensionalBreakdown retrieves metrics broken down by a dimension
	GetDimensionalBreakdown(ctx context.Context, metricType entities.MetricType, dimension string, opts MetricQueryOptions) (*entities.DimensionalMetric, error)

	// GetSummary retrieves a summary of multiple metrics
	GetSummary(ctx context.Context, metricTypes []entities.MetricType, periodStart, periodEnd time.Time) ([]entities.MetricSummary, error)

	// Delete removes metrics older than a specific time
	DeleteBefore(ctx context.Context, before time.Time) (int64, error)
}

// MetricQueryOptions defines options for querying metrics.
type MetricQueryOptions struct {
	// Granularity filters by time granularity
	Granularity entities.MetricGranularity

	// StartTime filters metrics after this time
	StartTime time.Time

	// EndTime filters metrics before this time
	EndTime time.Time

	// Dimensions filters by dimension values
	Dimensions map[string]string

	// Limit limits the number of results
	Limit int

	// Offset is the offset for pagination
	Offset int

	// IncludePreviousPeriod includes previous period for comparison
	IncludePreviousPeriod bool
}

// ReportRepository defines the interface for report persistence operations.
type ReportRepository interface {
	// Create stores a new report
	Create(ctx context.Context, report *entities.Report) error

	// Update updates an existing report
	Update(ctx context.Context, report *entities.Report) error

	// GetByID retrieves a report by its ID
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Report, error)

	// GetByUserID retrieves reports for a specific user
	GetByUserID(ctx context.Context, userID string, opts ReportQueryOptions) ([]*entities.Report, error)

	// GetByStatus retrieves reports with a specific status
	GetByStatus(ctx context.Context, status entities.ReportStatus, opts ReportQueryOptions) ([]*entities.Report, error)

	// GetPending retrieves pending reports for processing
	GetPending(ctx context.Context, limit int) ([]*entities.Report, error)

	// Delete removes a report
	Delete(ctx context.Context, id uuid.UUID) error

	// DeleteExpired removes expired reports
	DeleteExpired(ctx context.Context) (int64, error)
}

// ReportQueryOptions defines options for querying reports.
type ReportQueryOptions struct {
	// Type filters by report type
	Type entities.ReportType

	// Status filters by report status
	Status entities.ReportStatus

	// StartTime filters reports after this time
	StartTime time.Time

	// EndTime filters reports before this time
	EndTime time.Time

	// Limit limits the number of results
	Limit int

	// Offset is the offset for pagination
	Offset int

	// OrderBy specifies the sort field
	OrderBy string

	// OrderDesc sorts in descending order if true
	OrderDesc bool
}

// ReportTemplateRepository defines the interface for report template operations.
type ReportTemplateRepository interface {
	// Create stores a new report template
	Create(ctx context.Context, template *entities.ReportTemplate) error

	// Update updates an existing template
	Update(ctx context.Context, template *entities.ReportTemplate) error

	// GetByID retrieves a template by its ID
	GetByID(ctx context.Context, id uuid.UUID) (*entities.ReportTemplate, error)

	// GetPublic retrieves all public templates
	GetPublic(ctx context.Context) ([]*entities.ReportTemplate, error)

	// GetByUserID retrieves templates created by a user
	GetByUserID(ctx context.Context, userID string) ([]*entities.ReportTemplate, error)

	// Delete removes a template
	Delete(ctx context.Context, id uuid.UUID) error
}

// ScheduledReportRepository defines the interface for scheduled report operations.
type ScheduledReportRepository interface {
	// Create stores a new scheduled report
	Create(ctx context.Context, scheduled *entities.ScheduledReport) error

	// Update updates an existing scheduled report
	Update(ctx context.Context, scheduled *entities.ScheduledReport) error

	// GetByID retrieves a scheduled report by its ID
	GetByID(ctx context.Context, id uuid.UUID) (*entities.ScheduledReport, error)

	// GetByUserID retrieves scheduled reports for a user
	GetByUserID(ctx context.Context, userID string) ([]*entities.ScheduledReport, error)

	// GetDueReports retrieves reports that are due to run
	GetDueReports(ctx context.Context, before time.Time) ([]*entities.ScheduledReport, error)

	// Delete removes a scheduled report
	Delete(ctx context.Context, id uuid.UUID) error
}

// CohortRepository defines the interface for cohort operations.
type CohortRepository interface {
	// Create stores a new cohort
	Create(ctx context.Context, cohort *entities.Cohort) error

	// Update updates an existing cohort
	Update(ctx context.Context, cohort *entities.Cohort) error

	// GetByID retrieves a cohort by its ID
	GetByID(ctx context.Context, id uuid.UUID) (*entities.Cohort, error)

	// GetAll retrieves all cohorts
	GetAll(ctx context.Context) ([]*entities.Cohort, error)

	// GetRetentionData retrieves retention data for a cohort
	GetRetentionData(ctx context.Context, cohortID uuid.UUID, periods int) (*entities.CohortRetentionData, error)

	// Delete removes a cohort
	Delete(ctx context.Context, id uuid.UUID) error
}

// AggregationRepository defines the interface for analytical aggregations.
// This is typically backed by ClickHouse for efficient OLAP operations.
type AggregationRepository interface {
	// GetDAU returns daily active users for a date range
	GetDAU(ctx context.Context, startDate, endDate time.Time) ([]entities.TimeSeriesDataPoint, error)

	// GetMAU returns monthly active users for a date range
	GetMAU(ctx context.Context, startDate, endDate time.Time) ([]entities.TimeSeriesDataPoint, error)

	// GetWAU returns weekly active users for a date range
	GetWAU(ctx context.Context, startDate, endDate time.Time) ([]entities.TimeSeriesDataPoint, error)

	// GetSessionMetrics returns session-related metrics
	GetSessionMetrics(ctx context.Context, startDate, endDate time.Time, groupBy string) ([]SessionMetricRow, error)

	// GetRevenueMetrics returns revenue-related metrics
	GetRevenueMetrics(ctx context.Context, startDate, endDate time.Time, groupBy string) ([]RevenueMetricRow, error)

	// GetUserGrowth returns user signup trends
	GetUserGrowth(ctx context.Context, startDate, endDate time.Time, granularity entities.MetricGranularity) ([]entities.TimeSeriesDataPoint, error)

	// GetRetentionMatrix returns a cohort retention matrix
	GetRetentionMatrix(ctx context.Context, cohortStart, cohortEnd time.Time, periods int) ([]CohortRetentionRow, error)

	// GetTopEducators returns top performing educators
	GetTopEducators(ctx context.Context, startDate, endDate time.Time, limit int) ([]EducatorPerformanceRow, error)

	// GetSubjectAnalysis returns metrics broken down by subject
	GetSubjectAnalysis(ctx context.Context, startDate, endDate time.Time) ([]SubjectAnalysisRow, error)

	// GetECMMetrics returns ECM performance metrics
	GetECMMetrics(ctx context.Context, startDate, endDate time.Time) ([]ECMMetricRow, error)

	// ExecuteCustomQuery executes a custom analytics query
	ExecuteCustomQuery(ctx context.Context, query string, params map[string]interface{}) ([]map[string]interface{}, error)
}

// SessionMetricRow represents a row in session metrics result.
type SessionMetricRow struct {
	Date               time.Time `json:"date"`
	GroupValue         string    `json:"group_value,omitempty"`
	TotalSessions      int64     `json:"total_sessions"`
	CompletedSessions  int64     `json:"completed_sessions"`
	CancelledSessions  int64     `json:"cancelled_sessions"`
	NoShowSessions     int64     `json:"no_show_sessions"`
	CompletionRate     float64   `json:"completion_rate"`
	AverageRating      float64   `json:"average_rating"`
	AverageDuration    float64   `json:"average_duration_minutes"`
	TotalRevenue       float64   `json:"total_revenue"`
}

// RevenueMetricRow represents a row in revenue metrics result.
type RevenueMetricRow struct {
	Date             time.Time `json:"date"`
	GroupValue       string    `json:"group_value,omitempty"`
	TotalRevenue     float64   `json:"total_revenue"`
	SessionRevenue   float64   `json:"session_revenue"`
	SubscriptionRevenue float64 `json:"subscription_revenue"`
	Refunds          float64   `json:"refunds"`
	NetRevenue       float64   `json:"net_revenue"`
	TransactionCount int64     `json:"transaction_count"`
	UniqueCustomers  int64     `json:"unique_customers"`
}

// CohortRetentionRow represents a row in cohort retention analysis.
type CohortRetentionRow struct {
	CohortDate    time.Time `json:"cohort_date"`
	CohortSize    int64     `json:"cohort_size"`
	PeriodIndex   int       `json:"period_index"`
	RetainedCount int64     `json:"retained_count"`
	RetentionRate float64   `json:"retention_rate"`
}

// EducatorPerformanceRow represents educator performance data.
type EducatorPerformanceRow struct {
	EducatorID       string  `json:"educator_id"`
	EducatorName     string  `json:"educator_name"`
	TotalSessions    int64   `json:"total_sessions"`
	CompletedSessions int64  `json:"completed_sessions"`
	AverageRating    float64 `json:"average_rating"`
	TotalRevenue     float64 `json:"total_revenue"`
	UniqueLearners   int64   `json:"unique_learners"`
	CompletionRate   float64 `json:"completion_rate"`
}

// SubjectAnalysisRow represents subject-level analytics.
type SubjectAnalysisRow struct {
	Subject           string  `json:"subject"`
	TotalSessions     int64   `json:"total_sessions"`
	CompletedSessions int64   `json:"completed_sessions"`
	AverageRating     float64 `json:"average_rating"`
	AverageDuration   float64 `json:"average_duration"`
	TotalRevenue      float64 `json:"total_revenue"`
	UniqueLearners    int64   `json:"unique_learners"`
	UniqueEducators   int64   `json:"unique_educators"`
}

// ECMMetricRow represents ECM performance data.
type ECMMetricRow struct {
	ECMID              string  `json:"ecm_id"`
	ECMName            string  `json:"ecm_name"`
	TotalLearners      int64   `json:"total_learners"`
	ActiveLearners     int64   `json:"active_learners"`
	TotalInterventions int64   `json:"total_interventions"`
	AverageResponseTime float64 `json:"average_response_time_hours"`
	LearnerProgressScore float64 `json:"avg_learner_progress_score"`
	SatisfactionScore  float64 `json:"satisfaction_score"`
}
