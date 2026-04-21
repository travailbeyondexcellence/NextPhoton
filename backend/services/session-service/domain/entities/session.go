// Package entities contains the core domain models for the session-service.
// These entities represent the fundamental business concepts and rules,
// independent of any infrastructure or application concerns.
package entities

import (
	"time"
)

// SessionType defines the type of learning session.
// Different session types have different dynamics and participant limits.
type SessionType string

const (
	// SessionTypeOneOnOne represents a private session between one educator and one learner.
	// Most personalized form of learning with highest engagement.
	SessionTypeOneOnOne SessionType = "one_on_one"

	// SessionTypeGroup represents a session with one educator and multiple learners.
	// Typically 2-10 learners, enables peer learning and group dynamics.
	SessionTypeGroup SessionType = "group"

	// SessionTypeDemo represents a demonstration or trial session.
	// Used for initial educator-learner matching and assessment.
	SessionTypeDemo SessionType = "demo"
)

// SessionFormat defines how the session is conducted.
type SessionFormat string

const (
	// SessionFormatOnline indicates the session is conducted remotely via video call.
	SessionFormatOnline SessionFormat = "online"

	// SessionFormatOffline indicates the session is conducted in-person.
	SessionFormatOffline SessionFormat = "offline"

	// SessionFormatHybrid indicates the session supports both online and offline participants.
	SessionFormatHybrid SessionFormat = "hybrid"
)

// SessionStatus represents the current state of a learning session.
// Sessions follow a lifecycle from scheduled through completion or cancellation.
type SessionStatus string

const (
	// SessionStatusScheduled indicates the session has been approved and is on the calendar.
	SessionStatusScheduled SessionStatus = "scheduled"

	// SessionStatusInProgress indicates the session is currently happening.
	SessionStatusInProgress SessionStatus = "in_progress"

	// SessionStatusCompleted indicates the session has finished successfully.
	SessionStatusCompleted SessionStatus = "completed"

	// SessionStatusCancelled indicates the session was cancelled before it could occur.
	SessionStatusCancelled SessionStatus = "cancelled"

	// SessionStatusNoShow indicates participants did not attend as expected.
	SessionStatusNoShow SessionStatus = "no_show"

	// SessionStatusRescheduled indicates the session was moved to a different time.
	SessionStatusRescheduled SessionStatus = "rescheduled"
)

// PaymentStatus tracks the payment state for a session.
type PaymentStatus string

const (
	// PaymentStatusPending indicates payment has not yet been processed.
	PaymentStatusPending PaymentStatus = "pending"

	// PaymentStatusPaid indicates payment has been received.
	PaymentStatusPaid PaymentStatus = "paid"

	// PaymentStatusRefunded indicates the payment was returned to the payer.
	PaymentStatusRefunded PaymentStatus = "refunded"

	// PaymentStatusPartiallyRefunded indicates a portion of the payment was returned.
	PaymentStatusPartiallyRefunded PaymentStatus = "partially_refunded"

	// PaymentStatusWaived indicates payment was waived (e.g., for demo sessions).
	PaymentStatusWaived PaymentStatus = "waived"
)

// LearningSession represents a scheduled educational session between an educator and learner(s).
// This is the core aggregate root for the session bounded context.
type LearningSession struct {
	// Unique identifier for the session
	ID string `json:"id"`

	// Title is a brief descriptive name for the session
	Title string `json:"title"`

	// Description provides detailed information about what will be covered
	Description string `json:"description"`

	// Type categorizes the session (one-on-one, group, demo)
	Type SessionType `json:"type"`

	// Format indicates how the session is conducted (online, offline, hybrid)
	Format SessionFormat `json:"format"`

	// Status tracks the current state of the session
	Status SessionStatus `json:"status"`

	// EducatorID references the educator conducting the session
	EducatorID string `json:"educator_id"`

	// LearnerIDs contains the list of learner participants
	// For one-on-one sessions, this will have exactly one entry
	LearnerIDs []string `json:"learner_ids"`

	// SubjectID references the subject being taught
	SubjectID string `json:"subject_id"`

	// TopicIDs references specific topics to be covered
	TopicIDs []string `json:"topic_ids"`

	// CurriculumID references the curriculum this session belongs to (optional)
	CurriculumID *string `json:"curriculum_id,omitempty"`

	// ScheduledStartTime is when the session is planned to begin
	ScheduledStartTime time.Time `json:"scheduled_start_time"`

	// ScheduledEndTime is when the session is planned to end
	ScheduledEndTime time.Time `json:"scheduled_end_time"`

	// ActualStartTime records when the session actually started (nil if not started)
	ActualStartTime *time.Time `json:"actual_start_time,omitempty"`

	// ActualEndTime records when the session actually ended (nil if not ended)
	ActualEndTime *time.Time `json:"actual_end_time,omitempty"`

	// Duration is the planned duration in minutes
	DurationMinutes int `json:"duration_minutes"`

	// MeetingURL contains the video conference link for online sessions
	MeetingURL *string `json:"meeting_url,omitempty"`

	// Location contains the physical location for offline sessions
	Location *string `json:"location,omitempty"`

	// Cost represents the total cost of the session in the smallest currency unit (e.g., paise)
	CostAmount int64 `json:"cost_amount"`

	// CostCurrency is the ISO 4217 currency code
	CostCurrency string `json:"cost_currency"`

	// PaymentStatus tracks whether payment has been received
	PaymentStatus PaymentStatus `json:"payment_status"`

	// RecurringPattern describes if this session is part of a recurring series
	RecurringPattern *RecurringPattern `json:"recurring_pattern,omitempty"`

	// ParentSessionID links to the parent if this is part of a recurring series
	ParentSessionID *string `json:"parent_session_id,omitempty"`

	// Notes contains any additional information about the session
	Notes string `json:"notes"`

	// CancelReason explains why the session was cancelled (if applicable)
	CancelReason *string `json:"cancel_reason,omitempty"`

	// CancelledBy indicates who cancelled the session (if applicable)
	CancelledBy *string `json:"cancelled_by,omitempty"`

	// CancelledAt records when the session was cancelled
	CancelledAt *time.Time `json:"cancelled_at,omitempty"`

	// CreatedBy tracks who created this session record
	CreatedBy string `json:"created_by"`

	// CreatedAt records when the session was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when the session was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// RecurringPattern defines how sessions repeat over time.
type RecurringPattern struct {
	// Frequency determines how often the session repeats
	Frequency RecurringFrequency `json:"frequency"`

	// Interval is the number of frequency units between occurrences
	// e.g., Interval=2 with Frequency=weekly means every 2 weeks
	Interval int `json:"interval"`

	// DaysOfWeek specifies which days (0=Sunday, 6=Saturday) for weekly patterns
	DaysOfWeek []int `json:"days_of_week,omitempty"`

	// EndDate is when the recurring pattern ends (nil for indefinite)
	EndDate *time.Time `json:"end_date,omitempty"`

	// MaxOccurrences limits the number of sessions to generate
	MaxOccurrences *int `json:"max_occurrences,omitempty"`
}

// RecurringFrequency defines the repetition frequency for sessions.
type RecurringFrequency string

const (
	RecurringFrequencyDaily   RecurringFrequency = "daily"
	RecurringFrequencyWeekly  RecurringFrequency = "weekly"
	RecurringFrequencyBiweekly RecurringFrequency = "biweekly"
	RecurringFrequencyMonthly RecurringFrequency = "monthly"
)

// IsActive returns true if the session is in a state that can be modified.
func (s *LearningSession) IsActive() bool {
	return s.Status == SessionStatusScheduled || s.Status == SessionStatusInProgress
}

// CanStart returns true if the session can transition to in_progress status.
func (s *LearningSession) CanStart() bool {
	return s.Status == SessionStatusScheduled
}

// CanComplete returns true if the session can transition to completed status.
func (s *LearningSession) CanComplete() bool {
	return s.Status == SessionStatusInProgress
}

// CanCancel returns true if the session can be cancelled.
func (s *LearningSession) CanCancel() bool {
	return s.Status == SessionStatusScheduled || s.Status == SessionStatusInProgress
}

// Start transitions the session to in_progress status.
func (s *LearningSession) Start() error {
	if !s.CanStart() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	s.Status = SessionStatusInProgress
	s.ActualStartTime = &now
	s.UpdatedAt = now
	return nil
}

// Complete transitions the session to completed status.
func (s *LearningSession) Complete() error {
	if !s.CanComplete() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	s.Status = SessionStatusCompleted
	s.ActualEndTime = &now
	s.UpdatedAt = now
	return nil
}

// Cancel transitions the session to cancelled status with a reason.
func (s *LearningSession) Cancel(cancelledBy, reason string) error {
	if !s.CanCancel() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	s.Status = SessionStatusCancelled
	s.CancelledBy = &cancelledBy
	s.CancelReason = &reason
	s.CancelledAt = &now
	s.UpdatedAt = now
	return nil
}

// CalculateDuration returns the actual duration of the session in minutes.
// Returns the scheduled duration if the session hasn't completed yet.
func (s *LearningSession) CalculateDuration() int {
	if s.ActualStartTime == nil || s.ActualEndTime == nil {
		return s.DurationMinutes
	}
	return int(s.ActualEndTime.Sub(*s.ActualStartTime).Minutes())
}
