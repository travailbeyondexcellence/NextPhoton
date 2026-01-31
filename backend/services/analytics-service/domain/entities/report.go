// Package entities defines the core domain models for the Analytics Service.
package entities

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// ReportType represents different types of analytics reports.
type ReportType string

const (
	// Standard report types
	ReportExecutiveSummary    ReportType = "executive_summary"
	ReportUserGrowth          ReportType = "user_growth"
	ReportSessionAnalytics    ReportType = "session_analytics"
	ReportFinancialOverview   ReportType = "financial_overview"
	ReportECMPerformance      ReportType = "ecm_performance"
	ReportLearnerProgress     ReportType = "learner_progress"
	ReportEducatorPerformance ReportType = "educator_performance"
	ReportEngagementAnalysis  ReportType = "engagement_analysis"
	ReportRetentionCohort     ReportType = "retention_cohort"
	ReportRevenueBreakdown    ReportType = "revenue_breakdown"
	ReportSubjectAnalysis     ReportType = "subject_analysis"
	ReportCustom              ReportType = "custom"
)

// ReportStatus represents the current status of a report.
type ReportStatus string

const (
	ReportStatusPending    ReportStatus = "pending"
	ReportStatusProcessing ReportStatus = "processing"
	ReportStatusCompleted  ReportStatus = "completed"
	ReportStatusFailed     ReportStatus = "failed"
	ReportStatusExpired    ReportStatus = "expired"
)

// ReportFormat represents the output format of a report.
type ReportFormat string

const (
	ReportFormatJSON ReportFormat = "json"
	ReportFormatCSV  ReportFormat = "csv"
	ReportFormatPDF  ReportFormat = "pdf"
	ReportFormatXLSX ReportFormat = "xlsx"
)

// Report represents a generated analytics report.
// Reports are typically requested by users and generated asynchronously.
type Report struct {
	// ID is the unique identifier for this report
	ID uuid.UUID `json:"id"`

	// Type identifies what kind of report this is
	Type ReportType `json:"report_type"`

	// Name is a human-readable name for the report
	Name string `json:"name"`

	// Description provides additional context about the report
	Description string `json:"description,omitempty"`

	// Status is the current status of the report
	Status ReportStatus `json:"status"`

	// Format is the output format of the report
	Format ReportFormat `json:"format"`

	// Parameters contains the input parameters for report generation
	Parameters ReportParameters `json:"parameters"`

	// Data contains the report data (when status is completed)
	Data *ReportData `json:"data,omitempty"`

	// FileURL is the URL to download the generated report file
	FileURL string `json:"file_url,omitempty"`

	// FileSizeBytes is the size of the generated file
	FileSizeBytes int64 `json:"file_size_bytes,omitempty"`

	// RequestedBy is the user ID who requested the report
	RequestedBy string `json:"requested_by"`

	// RequestedAt is when the report was requested
	RequestedAt time.Time `json:"requested_at"`

	// StartedAt is when report generation started
	StartedAt *time.Time `json:"started_at,omitempty"`

	// CompletedAt is when report generation completed
	CompletedAt *time.Time `json:"completed_at,omitempty"`

	// ExpiresAt is when the report will be deleted
	ExpiresAt time.Time `json:"expires_at"`

	// Error contains error information if generation failed
	Error *ReportError `json:"error,omitempty"`

	// Metadata contains additional report-specific information
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// ReportParameters defines the input parameters for report generation.
type ReportParameters struct {
	// StartDate is the beginning of the reporting period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the reporting period
	EndDate time.Time `json:"end_date"`

	// Granularity is the time granularity for the report
	Granularity MetricGranularity `json:"granularity,omitempty"`

	// Filters contains dimension filters to apply
	Filters map[string][]string `json:"filters,omitempty"`

	// Metrics specifies which metrics to include
	Metrics []MetricType `json:"metrics,omitempty"`

	// GroupBy specifies dimensions to group by
	GroupBy []string `json:"group_by,omitempty"`

	// CompareWithPreviousPeriod enables period-over-period comparison
	CompareWithPreviousPeriod bool `json:"compare_with_previous_period,omitempty"`

	// Limit limits the number of results
	Limit int `json:"limit,omitempty"`

	// CustomQuery allows advanced users to specify custom queries
	CustomQuery string `json:"custom_query,omitempty"`
}

// ReportData contains the actual report content.
type ReportData struct {
	// Summary contains high-level summary statistics
	Summary ReportSummary `json:"summary"`

	// Sections contains the detailed report sections
	Sections []ReportSection `json:"sections"`

	// Charts contains chart configurations for visualization
	Charts []ChartConfig `json:"charts,omitempty"`

	// Tables contains tabular data
	Tables []TableData `json:"tables,omitempty"`

	// GeneratedAt is when the data was generated
	GeneratedAt time.Time `json:"generated_at"`

	// DataVersion tracks the schema version of the report data
	DataVersion string `json:"data_version"`
}

// ReportSummary contains high-level summary statistics.
type ReportSummary struct {
	// Title is the report title
	Title string `json:"title"`

	// Period describes the reporting period
	Period string `json:"period"`

	// KeyMetrics contains the primary metrics
	KeyMetrics []MetricSummary `json:"key_metrics"`

	// Highlights contains notable findings
	Highlights []string `json:"highlights,omitempty"`

	// Alerts contains any concerns or alerts
	Alerts []string `json:"alerts,omitempty"`
}

// ReportSection represents a section within a report.
type ReportSection struct {
	// ID is a unique identifier for this section
	ID string `json:"id"`

	// Title is the section title
	Title string `json:"title"`

	// Description provides context for the section
	Description string `json:"description,omitempty"`

	// Order determines the display order
	Order int `json:"order"`

	// Type indicates the type of content
	Type string `json:"type"` // metrics, chart, table, text

	// Content contains the section content
	Content json.RawMessage `json:"content"`
}

// ChartConfig defines configuration for a chart visualization.
type ChartConfig struct {
	// ID is a unique identifier for this chart
	ID string `json:"id"`

	// Title is the chart title
	Title string `json:"title"`

	// Type is the chart type (line, bar, pie, area, etc.)
	Type string `json:"type"`

	// Data contains the chart data
	Data ChartData `json:"data"`

	// Options contains chart-specific options
	Options map[string]interface{} `json:"options,omitempty"`
}

// ChartData contains data for chart visualization.
type ChartData struct {
	// Labels are the x-axis labels or category names
	Labels []string `json:"labels"`

	// Datasets contains the data series
	Datasets []ChartDataset `json:"datasets"`
}

// ChartDataset represents a single data series in a chart.
type ChartDataset struct {
	// Label is the series name
	Label string `json:"label"`

	// Data contains the values
	Data []float64 `json:"data"`

	// Color is the series color
	Color string `json:"color,omitempty"`

	// Fill indicates whether to fill area under line
	Fill bool `json:"fill,omitempty"`
}

// TableData represents tabular data in a report.
type TableData struct {
	// ID is a unique identifier for this table
	ID string `json:"id"`

	// Title is the table title
	Title string `json:"title"`

	// Columns defines the table columns
	Columns []TableColumn `json:"columns"`

	// Rows contains the table data
	Rows []map[string]interface{} `json:"rows"`

	// TotalRows is the total number of rows (before pagination)
	TotalRows int `json:"total_rows"`

	// SortBy indicates the default sort column
	SortBy string `json:"sort_by,omitempty"`

	// SortOrder indicates the default sort order
	SortOrder string `json:"sort_order,omitempty"` // asc, desc
}

// TableColumn defines a column in a table.
type TableColumn struct {
	// Key is the column identifier
	Key string `json:"key"`

	// Label is the display name
	Label string `json:"label"`

	// Type is the data type (string, number, date, currency, percent)
	Type string `json:"type"`

	// Format is the display format
	Format string `json:"format,omitempty"`

	// Sortable indicates if the column is sortable
	Sortable bool `json:"sortable,omitempty"`

	// Width is the column width
	Width string `json:"width,omitempty"`
}

// ReportError contains error information for failed reports.
type ReportError struct {
	// Code is the error code
	Code string `json:"code"`

	// Message is a human-readable error message
	Message string `json:"message"`

	// Details contains additional error context
	Details map[string]interface{} `json:"details,omitempty"`

	// OccurredAt is when the error occurred
	OccurredAt time.Time `json:"occurred_at"`
}

// NewReport creates a new Report with the given parameters.
func NewReport(reportType ReportType, name string, params ReportParameters, requestedBy string) *Report {
	now := time.Now().UTC()
	return &Report{
		ID:          uuid.New(),
		Type:        reportType,
		Name:        name,
		Status:      ReportStatusPending,
		Format:      ReportFormatJSON,
		Parameters:  params,
		RequestedBy: requestedBy,
		RequestedAt: now,
		ExpiresAt:   now.Add(7 * 24 * time.Hour), // Default 7 day expiration
	}
}

// WithFormat sets the report format.
func (r *Report) WithFormat(format ReportFormat) *Report {
	r.Format = format
	return r
}

// WithDescription sets the report description.
func (r *Report) WithDescription(description string) *Report {
	r.Description = description
	return r
}

// WithExpiration sets the expiration time.
func (r *Report) WithExpiration(expiresAt time.Time) *Report {
	r.ExpiresAt = expiresAt
	return r
}

// MarkProcessing marks the report as processing.
func (r *Report) MarkProcessing() {
	r.Status = ReportStatusProcessing
	now := time.Now().UTC()
	r.StartedAt = &now
}

// MarkCompleted marks the report as completed with data.
func (r *Report) MarkCompleted(data *ReportData, fileURL string, fileSize int64) {
	r.Status = ReportStatusCompleted
	r.Data = data
	r.FileURL = fileURL
	r.FileSizeBytes = fileSize
	now := time.Now().UTC()
	r.CompletedAt = &now
}

// MarkFailed marks the report as failed with an error.
func (r *Report) MarkFailed(code, message string, details map[string]interface{}) {
	r.Status = ReportStatusFailed
	now := time.Now().UTC()
	r.CompletedAt = &now
	r.Error = &ReportError{
		Code:       code,
		Message:    message,
		Details:    details,
		OccurredAt: now,
	}
}

// IsCompleted returns true if the report is completed.
func (r *Report) IsCompleted() bool {
	return r.Status == ReportStatusCompleted
}

// IsFailed returns true if the report generation failed.
func (r *Report) IsFailed() bool {
	return r.Status == ReportStatusFailed
}

// IsExpired returns true if the report has expired.
func (r *Report) IsExpired() bool {
	return time.Now().UTC().After(r.ExpiresAt)
}

// ProcessingDuration returns the processing duration if available.
func (r *Report) ProcessingDuration() *time.Duration {
	if r.StartedAt == nil || r.CompletedAt == nil {
		return nil
	}
	duration := r.CompletedAt.Sub(*r.StartedAt)
	return &duration
}

// ReportTemplate defines a reusable report template.
type ReportTemplate struct {
	// ID is the unique identifier for this template
	ID uuid.UUID `json:"id"`

	// Name is the template name
	Name string `json:"name"`

	// Description explains what the template produces
	Description string `json:"description"`

	// Type is the report type this template creates
	Type ReportType `json:"report_type"`

	// DefaultParameters contains default parameter values
	DefaultParameters ReportParameters `json:"default_parameters"`

	// RequiredFilters specifies which filters must be provided
	RequiredFilters []string `json:"required_filters,omitempty"`

	// IsPublic indicates if the template is available to all users
	IsPublic bool `json:"is_public"`

	// CreatedBy is the user who created the template
	CreatedBy string `json:"created_by"`

	// CreatedAt is when the template was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt is when the template was last updated
	UpdatedAt time.Time `json:"updated_at"`
}

// ScheduledReport defines a report that runs on a schedule.
type ScheduledReport struct {
	// ID is the unique identifier for this scheduled report
	ID uuid.UUID `json:"id"`

	// Name is a human-readable name
	Name string `json:"name"`

	// TemplateID references the report template to use
	TemplateID uuid.UUID `json:"template_id"`

	// Schedule is the cron expression for when to run
	Schedule string `json:"schedule"` // cron expression

	// Parameters contains parameter overrides
	Parameters ReportParameters `json:"parameters"`

	// Recipients are email addresses to send the report to
	Recipients []string `json:"recipients"`

	// Format is the output format
	Format ReportFormat `json:"format"`

	// IsActive indicates if the schedule is active
	IsActive bool `json:"is_active"`

	// LastRunAt is when the report last ran
	LastRunAt *time.Time `json:"last_run_at,omitempty"`

	// NextRunAt is when the report will next run
	NextRunAt *time.Time `json:"next_run_at,omitempty"`

	// CreatedBy is the user who created the schedule
	CreatedBy string `json:"created_by"`

	// CreatedAt is when the schedule was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt is when the schedule was last updated
	UpdatedAt time.Time `json:"updated_at"`
}
