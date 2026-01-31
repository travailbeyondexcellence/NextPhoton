// Package dto provides Data Transfer Objects for the Analytics Service.
// DTOs are used to transfer data between layers and to/from external clients,
// providing a clean separation between internal domain models and external APIs.
package dto

import (
	"time"

	"github.com/google/uuid"
	"github.com/nextphoton/analytics-service/domain/entities"
)

// ----------------------
// Event DTOs
// ----------------------

// TrackEventInput represents the input for tracking a new event.
type TrackEventInput struct {
	// UserID is the ID of the user who triggered the event
	UserID string `json:"user_id,omitempty"`

	// SessionID is the browser/app session ID
	SessionID string `json:"session_id,omitempty"`

	// Category is the event category
	Category string `json:"category"`

	// EventType is the specific event type
	EventType string `json:"event_type"`

	// Properties contains event-specific data
	Properties map[string]interface{} `json:"properties,omitempty"`

	// Timestamp is when the event occurred (optional, defaults to now)
	Timestamp *time.Time `json:"timestamp,omitempty"`

	// Source indicates where the event originated
	Source string `json:"source,omitempty"`

	// UserAgent is the client user agent
	UserAgent string `json:"user_agent,omitempty"`

	// IPAddress is the client IP address
	IPAddress string `json:"ip_address,omitempty"`

	// Context provides additional contextual information
	Context map[string]interface{} `json:"context,omitempty"`
}

// TrackEventBatchInput represents input for tracking multiple events.
type TrackEventBatchInput struct {
	// Events is the list of events to track
	Events []TrackEventInput `json:"events"`
}

// EventOutput represents the output for an event.
type EventOutput struct {
	// ID is the unique identifier for the event
	ID string `json:"id"`

	// UserID is the ID of the user who triggered the event
	UserID string `json:"user_id,omitempty"`

	// SessionID is the browser/app session ID
	SessionID string `json:"session_id,omitempty"`

	// Category is the event category
	Category string `json:"category"`

	// EventType is the specific event type
	EventType string `json:"event_type"`

	// Properties contains event-specific data
	Properties map[string]interface{} `json:"properties,omitempty"`

	// Timestamp is when the event occurred
	Timestamp time.Time `json:"timestamp"`

	// Source indicates where the event originated
	Source string `json:"source,omitempty"`
}

// EventListOutput represents a paginated list of events.
type EventListOutput struct {
	// Events is the list of events
	Events []EventOutput `json:"events"`

	// TotalCount is the total number of matching events
	TotalCount int64 `json:"total_count"`

	// HasMore indicates if there are more events
	HasMore bool `json:"has_more"`

	// Limit is the number of events requested
	Limit int `json:"limit"`

	// Offset is the offset used
	Offset int `json:"offset"`
}

// ----------------------
// Metric DTOs
// ----------------------

// MetricOutput represents the output for a metric.
type MetricOutput struct {
	// Type is the metric type
	Type string `json:"metric_type"`

	// Value is the metric value
	Value float64 `json:"value"`

	// PreviousValue is the previous period's value
	PreviousValue *float64 `json:"previous_value,omitempty"`

	// ChangePercent is the percentage change
	ChangePercent *float64 `json:"change_percent,omitempty"`

	// Trend indicates the direction (up, down, flat)
	Trend string `json:"trend,omitempty"`

	// Granularity is the time granularity
	Granularity string `json:"granularity"`

	// PeriodStart is the start of the period
	PeriodStart time.Time `json:"period_start"`

	// PeriodEnd is the end of the period
	PeriodEnd time.Time `json:"period_end"`

	// Dimensions contains dimensional breakdowns
	Dimensions map[string]string `json:"dimensions,omitempty"`

	// SampleSize is the number of data points
	SampleSize int64 `json:"sample_size,omitempty"`

	// LastUpdated is when this metric was last calculated
	LastUpdated time.Time `json:"last_updated"`
}

// MetricSummaryOutput represents a summary view of a metric.
type MetricSummaryOutput struct {
	// Type is the metric type
	Type string `json:"metric_type"`

	// Label is a human-readable label
	Label string `json:"label"`

	// CurrentValue is the current value
	CurrentValue float64 `json:"current_value"`

	// PreviousValue is the previous period's value
	PreviousValue float64 `json:"previous_value"`

	// ChangePercent is the percentage change
	ChangePercent float64 `json:"change_percent"`

	// Trend indicates the direction
	Trend string `json:"trend"`

	// SparklineData contains values for mini chart
	SparklineData []float64 `json:"sparkline_data,omitempty"`

	// Target is the goal value
	Target *float64 `json:"target,omitempty"`

	// TargetProgress is the progress toward target
	TargetProgress *float64 `json:"target_progress,omitempty"`
}

// TimeSeriesOutput represents a time series of metric values.
type TimeSeriesOutput struct {
	// Type is the metric type
	Type string `json:"metric_type"`

	// Granularity is the time granularity
	Granularity string `json:"granularity"`

	// DataPoints contains the time-value pairs
	DataPoints []DataPointOutput `json:"data_points"`

	// StartTime is the start of the series
	StartTime time.Time `json:"start_time"`

	// EndTime is the end of the series
	EndTime time.Time `json:"end_time"`
}

// DataPointOutput represents a single data point.
type DataPointOutput struct {
	// Timestamp is the time for this point
	Timestamp time.Time `json:"timestamp"`

	// Value is the metric value
	Value float64 `json:"value"`
}

// DimensionalMetricOutput represents metrics broken down by dimension.
type DimensionalMetricOutput struct {
	// Type is the metric type
	Type string `json:"metric_type"`

	// Dimension is the dimension being broken down
	Dimension string `json:"dimension"`

	// Values contains the dimensional values
	Values []DimensionValueOutput `json:"values"`

	// Total is the aggregate value
	Total float64 `json:"total"`
}

// DimensionValueOutput represents a single dimension value.
type DimensionValueOutput struct {
	// Label is the dimension value
	Label string `json:"label"`

	// Value is the metric value
	Value float64 `json:"value"`

	// Percent is the percentage of total
	Percent float64 `json:"percent"`

	// Count is the underlying count
	Count int64 `json:"count,omitempty"`
}

// ----------------------
// Report DTOs
// ----------------------

// GenerateReportInput represents input for generating a report.
type GenerateReportInput struct {
	// Type is the report type
	Type string `json:"type"`

	// Name is the report name
	Name string `json:"name"`

	// Description is an optional description
	Description string `json:"description,omitempty"`

	// Format is the output format (json, csv, pdf, xlsx)
	Format string `json:"format,omitempty"`

	// StartDate is the start of the reporting period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the reporting period
	EndDate time.Time `json:"end_date"`

	// Granularity is the time granularity
	Granularity string `json:"granularity,omitempty"`

	// Filters contains dimension filters
	Filters map[string][]string `json:"filters,omitempty"`

	// Metrics specifies which metrics to include
	Metrics []string `json:"metrics,omitempty"`

	// GroupBy specifies dimensions to group by
	GroupBy []string `json:"group_by,omitempty"`

	// CompareWithPreviousPeriod enables comparison
	CompareWithPreviousPeriod bool `json:"compare_with_previous_period,omitempty"`
}

// ReportOutput represents the output for a report.
type ReportOutput struct {
	// ID is the report ID
	ID string `json:"id"`

	// Type is the report type
	Type string `json:"type"`

	// Name is the report name
	Name string `json:"name"`

	// Description is the report description
	Description string `json:"description,omitempty"`

	// Status is the current status
	Status string `json:"status"`

	// Format is the output format
	Format string `json:"format"`

	// FileURL is the download URL
	FileURL string `json:"file_url,omitempty"`

	// FileSizeBytes is the file size
	FileSizeBytes int64 `json:"file_size_bytes,omitempty"`

	// RequestedAt is when the report was requested
	RequestedAt time.Time `json:"requested_at"`

	// CompletedAt is when the report was completed
	CompletedAt *time.Time `json:"completed_at,omitempty"`

	// ExpiresAt is when the report expires
	ExpiresAt time.Time `json:"expires_at"`

	// Error contains error information if failed
	Error *ReportErrorOutput `json:"error,omitempty"`
}

// ReportErrorOutput represents error information for a report.
type ReportErrorOutput struct {
	// Code is the error code
	Code string `json:"code"`

	// Message is the error message
	Message string `json:"message"`
}

// ReportListOutput represents a list of reports.
type ReportListOutput struct {
	// Reports is the list of reports
	Reports []ReportOutput `json:"reports"`

	// TotalCount is the total number of reports
	TotalCount int64 `json:"total_count"`

	// HasMore indicates if there are more reports
	HasMore bool `json:"has_more"`
}

// ----------------------
// Dashboard DTOs
// ----------------------

// DashboardDataInput represents input for fetching dashboard data.
type DashboardDataInput struct {
	// StartDate is the start of the period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the period
	EndDate time.Time `json:"end_date"`

	// Granularity is the time granularity
	Granularity string `json:"granularity,omitempty"`

	// MetricTypes specifies which metrics to include
	MetricTypes []string `json:"metric_types,omitempty"`

	// IncludeCharts indicates whether to include chart data
	IncludeCharts bool `json:"include_charts,omitempty"`

	// Filters contains dimension filters
	Filters map[string]string `json:"filters,omitempty"`
}

// DashboardOutput represents the output for dashboard data.
type DashboardOutput struct {
	// Summary contains key metrics
	Summary []MetricSummaryOutput `json:"summary"`

	// Charts contains chart data
	Charts []ChartOutput `json:"charts,omitempty"`

	// Tables contains table data
	Tables []TableOutput `json:"tables,omitempty"`

	// Period describes the data period
	Period PeriodOutput `json:"period"`

	// GeneratedAt is when the data was generated
	GeneratedAt time.Time `json:"generated_at"`
}

// ChartOutput represents chart data for visualization.
type ChartOutput struct {
	// ID is the chart identifier
	ID string `json:"id"`

	// Title is the chart title
	Title string `json:"title"`

	// Type is the chart type
	Type string `json:"type"`

	// Labels are the axis labels
	Labels []string `json:"labels"`

	// Datasets contains the data series
	Datasets []ChartDatasetOutput `json:"datasets"`
}

// ChartDatasetOutput represents a data series.
type ChartDatasetOutput struct {
	// Label is the series name
	Label string `json:"label"`

	// Data contains the values
	Data []float64 `json:"data"`

	// Color is the series color
	Color string `json:"color,omitempty"`
}

// TableOutput represents tabular data.
type TableOutput struct {
	// ID is the table identifier
	ID string `json:"id"`

	// Title is the table title
	Title string `json:"title"`

	// Columns defines the columns
	Columns []TableColumnOutput `json:"columns"`

	// Rows contains the data
	Rows []map[string]interface{} `json:"rows"`

	// TotalRows is the total row count
	TotalRows int `json:"total_rows"`
}

// TableColumnOutput defines a table column.
type TableColumnOutput struct {
	// Key is the column key
	Key string `json:"key"`

	// Label is the display label
	Label string `json:"label"`

	// Type is the data type
	Type string `json:"type"`
}

// PeriodOutput describes a time period.
type PeriodOutput struct {
	// StartDate is the start of the period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the period
	EndDate time.Time `json:"end_date"`

	// Label is a human-readable label
	Label string `json:"label"`

	// PreviousPeriodStart is the start of the comparison period
	PreviousPeriodStart *time.Time `json:"previous_period_start,omitempty"`

	// PreviousPeriodEnd is the end of the comparison period
	PreviousPeriodEnd *time.Time `json:"previous_period_end,omitempty"`
}

// ----------------------
// Query Input DTOs
// ----------------------

// GetMetricsInput represents input for getting metrics.
type GetMetricsInput struct {
	// MetricTypes specifies which metrics to retrieve
	MetricTypes []string `json:"metric_types"`

	// StartDate is the start of the period
	StartDate time.Time `json:"start_date"`

	// EndDate is the end of the period
	EndDate time.Time `json:"end_date"`

	// Granularity is the time granularity
	Granularity string `json:"granularity,omitempty"`

	// Dimensions filters by dimension values
	Dimensions map[string]string `json:"dimensions,omitempty"`

	// CompareWithPreviousPeriod enables comparison
	CompareWithPreviousPeriod bool `json:"compare_with_previous_period,omitempty"`
}

// GetReportsInput represents input for getting reports.
type GetReportsInput struct {
	// UserID filters by user ID
	UserID string `json:"user_id,omitempty"`

	// Type filters by report type
	Type string `json:"type,omitempty"`

	// Status filters by status
	Status string `json:"status,omitempty"`

	// Limit is the number of results
	Limit int `json:"limit,omitempty"`

	// Offset is the pagination offset
	Offset int `json:"offset,omitempty"`
}

// ----------------------
// Conversion Functions
// ----------------------

// ToEvent converts a TrackEventInput to an Event entity.
func (i *TrackEventInput) ToEvent() *entities.Event {
	timestamp := time.Now().UTC()
	if i.Timestamp != nil {
		timestamp = *i.Timestamp
	}

	event := &entities.Event{
		ID:         uuid.New(),
		UserID:     i.UserID,
		SessionID:  i.SessionID,
		Category:   entities.EventCategory(i.Category),
		Type:       entities.EventType(i.EventType),
		Properties: i.Properties,
		Timestamp:  timestamp,
		ReceivedAt: time.Now().UTC(),
		Source:     i.Source,
		Version:    "1.0",
		UserAgent:  i.UserAgent,
		IPAddress:  i.IPAddress,
		Context:    i.Context,
	}

	if event.Source == "" {
		event.Source = "api"
	}

	return event
}

// FromEvent converts an Event entity to EventOutput.
func FromEvent(event *entities.Event) EventOutput {
	return EventOutput{
		ID:         event.ID.String(),
		UserID:     event.UserID,
		SessionID:  event.SessionID,
		Category:   string(event.Category),
		EventType:  string(event.Type),
		Properties: event.Properties,
		Timestamp:  event.Timestamp,
		Source:     event.Source,
	}
}

// FromMetric converts a Metric entity to MetricOutput.
func FromMetric(metric *entities.Metric) MetricOutput {
	trend := "flat"
	if metric.ChangePercent != nil {
		if *metric.ChangePercent > 1 {
			trend = "up"
		} else if *metric.ChangePercent < -1 {
			trend = "down"
		}
	}

	return MetricOutput{
		Type:          string(metric.Type),
		Value:         metric.Value,
		PreviousValue: metric.PreviousValue,
		ChangePercent: metric.ChangePercent,
		Trend:         trend,
		Granularity:   string(metric.Granularity),
		PeriodStart:   metric.PeriodStart,
		PeriodEnd:     metric.PeriodEnd,
		Dimensions:    metric.Dimensions,
		SampleSize:    metric.SampleSize,
		LastUpdated:   metric.CalculatedAt,
	}
}

// FromReport converts a Report entity to ReportOutput.
func FromReport(report *entities.Report) ReportOutput {
	output := ReportOutput{
		ID:            report.ID.String(),
		Type:          string(report.Type),
		Name:          report.Name,
		Description:   report.Description,
		Status:        string(report.Status),
		Format:        string(report.Format),
		FileURL:       report.FileURL,
		FileSizeBytes: report.FileSizeBytes,
		RequestedAt:   report.RequestedAt,
		CompletedAt:   report.CompletedAt,
		ExpiresAt:     report.ExpiresAt,
	}

	if report.Error != nil {
		output.Error = &ReportErrorOutput{
			Code:    report.Error.Code,
			Message: report.Error.Message,
		}
	}

	return output
}

// ToReportParameters converts GenerateReportInput to ReportParameters.
func (i *GenerateReportInput) ToReportParameters() entities.ReportParameters {
	var granularity entities.MetricGranularity
	switch i.Granularity {
	case "hourly":
		granularity = entities.GranularityHourly
	case "daily":
		granularity = entities.GranularityDaily
	case "weekly":
		granularity = entities.GranularityWeekly
	case "monthly":
		granularity = entities.GranularityMonthly
	default:
		granularity = entities.GranularityDaily
	}

	var metrics []entities.MetricType
	for _, m := range i.Metrics {
		metrics = append(metrics, entities.MetricType(m))
	}

	return entities.ReportParameters{
		StartDate:                 i.StartDate,
		EndDate:                   i.EndDate,
		Granularity:               granularity,
		Filters:                   i.Filters,
		Metrics:                   metrics,
		GroupBy:                   i.GroupBy,
		CompareWithPreviousPeriod: i.CompareWithPreviousPeriod,
	}
}
