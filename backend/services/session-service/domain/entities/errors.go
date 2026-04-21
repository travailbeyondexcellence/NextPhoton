// Package entities contains the core domain models for the session-service.
package entities

import "errors"

// Domain errors for the session service.
// These errors represent business rule violations and domain-specific issues.
var (
	// ErrInvalidStateTransition is returned when an operation is not allowed
	// given the current state of an entity.
	ErrInvalidStateTransition = errors.New("invalid state transition")

	// ErrInvalidRating is returned when a rating value is outside the valid range (1-5).
	ErrInvalidRating = errors.New("rating must be between 1 and 5")

	// ErrSessionNotFound is returned when a requested session does not exist.
	ErrSessionNotFound = errors.New("session not found")

	// ErrBookingNotFound is returned when a requested booking does not exist.
	ErrBookingNotFound = errors.New("booking not found")

	// ErrAssignmentNotFound is returned when a requested assignment does not exist.
	ErrAssignmentNotFound = errors.New("assignment not found")

	// ErrSubmissionNotFound is returned when a requested submission does not exist.
	ErrSubmissionNotFound = errors.New("submission not found")

	// ErrAttendanceNotFound is returned when a requested attendance record does not exist.
	ErrAttendanceNotFound = errors.New("attendance record not found")

	// ErrFeedbackNotFound is returned when a requested feedback does not exist.
	ErrFeedbackNotFound = errors.New("feedback not found")

	// ErrDuplicateBooking is returned when a booking already exists for the same time slot.
	ErrDuplicateBooking = errors.New("a booking already exists for this time slot")

	// ErrScheduleConflict is returned when there's a scheduling conflict.
	ErrScheduleConflict = errors.New("schedule conflict detected")

	// ErrUnauthorized is returned when the user lacks permission for the operation.
	ErrUnauthorized = errors.New("unauthorized to perform this operation")

	// ErrBookingExpired is returned when trying to process an expired booking.
	ErrBookingExpired = errors.New("booking has expired")

	// ErrSessionAlreadyStarted is returned when trying to modify a started session.
	ErrSessionAlreadyStarted = errors.New("session has already started")

	// ErrSessionAlreadyCompleted is returned when trying to modify a completed session.
	ErrSessionAlreadyCompleted = errors.New("session has already been completed")

	// ErrMaxAttemptsReached is returned when submission attempts are exhausted.
	ErrMaxAttemptsReached = errors.New("maximum submission attempts reached")

	// ErrAssignmentClosed is returned when trying to submit to a closed assignment.
	ErrAssignmentClosed = errors.New("assignment is closed for submissions")

	// ErrInvalidDuration is returned when session duration is invalid.
	ErrInvalidDuration = errors.New("invalid session duration")

	// ErrInvalidTimeRange is returned when end time is before start time.
	ErrInvalidTimeRange = errors.New("end time must be after start time")

	// ErrEducatorUnavailable is returned when the educator is not available at the requested time.
	ErrEducatorUnavailable = errors.New("educator is not available at the requested time")

	// ErrLearnerUnavailable is returned when a learner is not available at the requested time.
	ErrLearnerUnavailable = errors.New("learner is not available at the requested time")

	// ErrFeedbackAlreadyExists is returned when trying to create duplicate feedback.
	ErrFeedbackAlreadyExists = errors.New("feedback already submitted for this session")

	// ErrAttendanceAlreadyRecorded is returned when attendance has already been marked.
	ErrAttendanceAlreadyRecorded = errors.New("attendance already recorded for this participant")
)
