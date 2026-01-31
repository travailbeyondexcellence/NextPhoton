// Package entities contains the core domain models for the session-service.
package entities

import (
	"time"
)

// BookingStatus represents the current state of a session booking request.
// Bookings follow a dual-approval workflow: educator approval followed by ECM approval.
type BookingStatus string

const (
	// BookingStatusPending indicates the booking has been submitted and awaits educator review.
	BookingStatusPending BookingStatus = "pending"

	// BookingStatusEducatorApproved indicates the educator has approved but ECM review is pending.
	BookingStatusEducatorApproved BookingStatus = "educator_approved"

	// BookingStatusECMApproved indicates both educator and ECM have approved.
	// The booking is now ready to be scheduled.
	BookingStatusECMApproved BookingStatus = "ecm_approved"

	// BookingStatusScheduled indicates the session has been created from this booking.
	BookingStatusScheduled BookingStatus = "scheduled"

	// BookingStatusRejected indicates the booking was rejected during the approval process.
	BookingStatusRejected BookingStatus = "rejected"

	// BookingStatusCancelled indicates the booking was cancelled before scheduling.
	BookingStatusCancelled BookingStatus = "cancelled"

	// BookingStatusExpired indicates the booking was not processed in time.
	BookingStatusExpired BookingStatus = "expired"
)

// SessionBooking represents a request to schedule a learning session.
// Bookings go through a dual-approval workflow before becoming scheduled sessions.
type SessionBooking struct {
	// Unique identifier for the booking
	ID string `json:"id"`

	// RequestedBy is the user ID of whoever initiated the booking request
	// This could be a learner, guardian, or educator
	RequestedBy string `json:"requested_by"`

	// LearnerID is the learner who will attend the session
	LearnerID string `json:"learner_id"`

	// EducatorID is the requested educator for the session
	EducatorID string `json:"educator_id"`

	// GuardianID is the guardian associated with the learner (for approval tracking)
	GuardianID *string `json:"guardian_id,omitempty"`

	// ECMID is the EduCare Manager responsible for final approval
	ECMID *string `json:"ecm_id,omitempty"`

	// Status tracks the booking through the approval workflow
	Status BookingStatus `json:"status"`

	// SessionType is the requested type of session
	SessionType SessionType `json:"session_type"`

	// SessionFormat is the requested format for the session
	SessionFormat SessionFormat `json:"session_format"`

	// SubjectID is the subject for the session
	SubjectID string `json:"subject_id"`

	// TopicIDs are specific topics to be covered (optional)
	TopicIDs []string `json:"topic_ids,omitempty"`

	// PreferredStartTime is when the requester would like the session to start
	PreferredStartTime time.Time `json:"preferred_start_time"`

	// PreferredEndTime is when the requester would like the session to end
	PreferredEndTime time.Time `json:"preferred_end_time"`

	// AlternativeTimeSlots provides backup options if the preferred time doesn't work
	AlternativeTimeSlots []TimeSlot `json:"alternative_time_slots,omitempty"`

	// DurationMinutes is the requested session duration
	DurationMinutes int `json:"duration_minutes"`

	// SpecialRequirements captures any special needs or requests
	SpecialRequirements string `json:"special_requirements"`

	// Notes contains additional information about the booking
	Notes string `json:"notes"`

	// EstimatedCost is the calculated cost for the session
	EstimatedCost int64 `json:"estimated_cost"`

	// CostCurrency is the ISO 4217 currency code
	CostCurrency string `json:"cost_currency"`

	// EducatorApprovedAt records when the educator approved
	EducatorApprovedAt *time.Time `json:"educator_approved_at,omitempty"`

	// EducatorApprovedBy records who (educator ID) approved
	EducatorApprovedBy *string `json:"educator_approved_by,omitempty"`

	// EducatorNotes contains any notes from the educator during approval
	EducatorNotes string `json:"educator_notes"`

	// ECMApprovedAt records when the ECM approved
	ECMApprovedAt *time.Time `json:"ecm_approved_at,omitempty"`

	// ECMApprovedBy records who (ECM ID) approved
	ECMApprovedBy *string `json:"ecm_approved_by,omitempty"`

	// ECMNotes contains any notes from the ECM during approval
	ECMNotes string `json:"ecm_notes"`

	// RejectedAt records when the booking was rejected
	RejectedAt *time.Time `json:"rejected_at,omitempty"`

	// RejectedBy records who rejected the booking
	RejectedBy *string `json:"rejected_by,omitempty"`

	// RejectionReason explains why the booking was rejected
	RejectionReason *string `json:"rejection_reason,omitempty"`

	// SessionID links to the created session once scheduled
	SessionID *string `json:"session_id,omitempty"`

	// ExpiresAt is when this booking request expires if not processed
	ExpiresAt time.Time `json:"expires_at"`

	// CreatedAt records when the booking was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when the booking was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// TimeSlot represents an alternative time preference for scheduling.
type TimeSlot struct {
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Priority  int       `json:"priority"` // Lower number = higher priority
}

// CanEducatorApprove returns true if the booking can receive educator approval.
func (b *SessionBooking) CanEducatorApprove() bool {
	return b.Status == BookingStatusPending
}

// CanECMApprove returns true if the booking can receive ECM approval.
func (b *SessionBooking) CanECMApprove() bool {
	return b.Status == BookingStatusEducatorApproved
}

// CanReject returns true if the booking can be rejected.
func (b *SessionBooking) CanReject() bool {
	return b.Status == BookingStatusPending || b.Status == BookingStatusEducatorApproved
}

// CanCancel returns true if the booking can be cancelled.
func (b *SessionBooking) CanCancel() bool {
	return b.Status == BookingStatusPending ||
		b.Status == BookingStatusEducatorApproved ||
		b.Status == BookingStatusECMApproved
}

// CanSchedule returns true if the booking can be converted to a session.
func (b *SessionBooking) CanSchedule() bool {
	return b.Status == BookingStatusECMApproved
}

// ApproveByEducator transitions the booking to educator_approved status.
func (b *SessionBooking) ApproveByEducator(educatorID string, notes string) error {
	if !b.CanEducatorApprove() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	b.Status = BookingStatusEducatorApproved
	b.EducatorApprovedAt = &now
	b.EducatorApprovedBy = &educatorID
	b.EducatorNotes = notes
	b.UpdatedAt = now
	return nil
}

// ApproveByECM transitions the booking to ecm_approved status.
func (b *SessionBooking) ApproveByECM(ecmID string, notes string) error {
	if !b.CanECMApprove() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	b.Status = BookingStatusECMApproved
	b.ECMApprovedAt = &now
	b.ECMApprovedBy = &ecmID
	b.ECMNotes = notes
	b.UpdatedAt = now
	return nil
}

// Reject transitions the booking to rejected status.
func (b *SessionBooking) Reject(rejectedBy string, reason string) error {
	if !b.CanReject() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	b.Status = BookingStatusRejected
	b.RejectedAt = &now
	b.RejectedBy = &rejectedBy
	b.RejectionReason = &reason
	b.UpdatedAt = now
	return nil
}

// Cancel transitions the booking to cancelled status.
func (b *SessionBooking) Cancel() error {
	if !b.CanCancel() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	b.Status = BookingStatusCancelled
	b.UpdatedAt = now
	return nil
}

// MarkAsScheduled transitions the booking to scheduled status and links the session.
func (b *SessionBooking) MarkAsScheduled(sessionID string) error {
	if !b.CanSchedule() {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	b.Status = BookingStatusScheduled
	b.SessionID = &sessionID
	b.UpdatedAt = now
	return nil
}

// IsExpired checks if the booking has passed its expiration time.
func (b *SessionBooking) IsExpired() bool {
	return time.Now().After(b.ExpiresAt)
}
