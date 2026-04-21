// Package entities contains the core domain models for the session-service.
package entities

import (
	"time"
)

// AttendanceStatus represents whether a participant attended a session.
type AttendanceStatus string

const (
	// AttendanceStatusPresent indicates the participant attended.
	AttendanceStatusPresent AttendanceStatus = "present"

	// AttendanceStatusAbsent indicates the participant did not attend.
	AttendanceStatusAbsent AttendanceStatus = "absent"

	// AttendanceStatusLate indicates the participant arrived late.
	AttendanceStatusLate AttendanceStatus = "late"

	// AttendanceStatusLeftEarly indicates the participant left before the session ended.
	AttendanceStatusLeftEarly AttendanceStatus = "left_early"

	// AttendanceStatusExcused indicates the absence was excused.
	AttendanceStatusExcused AttendanceStatus = "excused"

	// AttendanceStatusPending indicates attendance hasn't been recorded yet.
	AttendanceStatusPending AttendanceStatus = "pending"
)

// ParticipantRole identifies the role of an attendee in a session.
type ParticipantRole string

const (
	// ParticipantRoleLearner is a student in the session.
	ParticipantRoleLearner ParticipantRole = "learner"

	// ParticipantRoleEducator is the instructor leading the session.
	ParticipantRoleEducator ParticipantRole = "educator"

	// ParticipantRoleObserver is someone observing the session (e.g., ECM, guardian).
	ParticipantRoleObserver ParticipantRole = "observer"
)

// AttendanceRecord tracks a participant's attendance at a specific session.
type AttendanceRecord struct {
	// Unique identifier for this attendance record
	ID string `json:"id"`

	// SessionID links to the learning session
	SessionID string `json:"session_id"`

	// ParticipantID is the user who attended (or didn't)
	ParticipantID string `json:"participant_id"`

	// ParticipantRole indicates the attendee's role
	ParticipantRole ParticipantRole `json:"participant_role"`

	// Status indicates whether they attended
	Status AttendanceStatus `json:"status"`

	// JoinedAt records when the participant joined (for online sessions)
	JoinedAt *time.Time `json:"joined_at,omitempty"`

	// LeftAt records when the participant left
	LeftAt *time.Time `json:"left_at,omitempty"`

	// DurationMinutes is the total time the participant was present
	DurationMinutes *int `json:"duration_minutes,omitempty"`

	// LateByMinutes records how late the participant was (if late)
	LateByMinutes *int `json:"late_by_minutes,omitempty"`

	// LeftEarlyByMinutes records how early the participant left (if left early)
	LeftEarlyByMinutes *int `json:"left_early_by_minutes,omitempty"`

	// JoinCount tracks how many times they connected/disconnected (for online)
	JoinCount int `json:"join_count"`

	// DeviceType records the device used to attend
	DeviceType string `json:"device_type"`

	// IPAddress records the IP address (for online sessions)
	IPAddress *string `json:"ip_address,omitempty"`

	// Notes contains any additional information about attendance
	Notes string `json:"notes"`

	// ExcuseReason explains why an absence was excused
	ExcuseReason *string `json:"excuse_reason,omitempty"`

	// ExcusedBy records who approved the excuse
	ExcusedBy *string `json:"excused_by,omitempty"`

	// RecordedBy is who created/updated this attendance record
	RecordedBy string `json:"recorded_by"`

	// VerifiedBy is an optional second confirmation
	VerifiedBy *string `json:"verified_by,omitempty"`

	// VerifiedAt records when verification occurred
	VerifiedAt *time.Time `json:"verified_at,omitempty"`

	// EngagementScore is an optional measure of participation quality (0-100)
	EngagementScore *int `json:"engagement_score,omitempty"`

	// CreatedAt records when this record was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when this record was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// MarkPresent sets the attendance status to present.
func (a *AttendanceRecord) MarkPresent(joinedAt time.Time) {
	now := time.Now()
	a.Status = AttendanceStatusPresent
	a.JoinedAt = &joinedAt
	a.UpdatedAt = now
}

// MarkAbsent sets the attendance status to absent.
func (a *AttendanceRecord) MarkAbsent() {
	now := time.Now()
	a.Status = AttendanceStatusAbsent
	a.UpdatedAt = now
}

// MarkLate sets the attendance status to late with the delay duration.
func (a *AttendanceRecord) MarkLate(joinedAt time.Time, sessionStartTime time.Time) {
	now := time.Now()
	a.Status = AttendanceStatusLate
	a.JoinedAt = &joinedAt

	// Calculate how late they were
	lateBy := int(joinedAt.Sub(sessionStartTime).Minutes())
	if lateBy < 0 {
		lateBy = 0
	}
	a.LateByMinutes = &lateBy
	a.UpdatedAt = now
}

// MarkLeftEarly records that the participant left before the session ended.
func (a *AttendanceRecord) MarkLeftEarly(leftAt time.Time, sessionEndTime time.Time) {
	now := time.Now()
	a.Status = AttendanceStatusLeftEarly
	a.LeftAt = &leftAt

	// Calculate how early they left
	earlyBy := int(sessionEndTime.Sub(leftAt).Minutes())
	if earlyBy < 0 {
		earlyBy = 0
	}
	a.LeftEarlyByMinutes = &earlyBy

	// Calculate actual duration if we have join time
	if a.JoinedAt != nil {
		duration := int(leftAt.Sub(*a.JoinedAt).Minutes())
		if duration < 0 {
			duration = 0
		}
		a.DurationMinutes = &duration
	}
	a.UpdatedAt = now
}

// MarkExcused changes an absence to excused with a reason.
func (a *AttendanceRecord) MarkExcused(reason string, excusedBy string) error {
	if a.Status != AttendanceStatusAbsent {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	a.Status = AttendanceStatusExcused
	a.ExcuseReason = &reason
	a.ExcusedBy = &excusedBy
	a.UpdatedAt = now
	return nil
}

// Verify adds a verification to the attendance record.
func (a *AttendanceRecord) Verify(verifiedBy string) {
	now := time.Now()
	a.VerifiedBy = &verifiedBy
	a.VerifiedAt = &now
	a.UpdatedAt = now
}

// RecordLeave marks when a participant left the session.
func (a *AttendanceRecord) RecordLeave(leftAt time.Time) {
	now := time.Now()
	a.LeftAt = &leftAt

	// Calculate duration if we have join time
	if a.JoinedAt != nil {
		duration := int(leftAt.Sub(*a.JoinedAt).Minutes())
		if duration < 0 {
			duration = 0
		}
		a.DurationMinutes = &duration
	}
	a.UpdatedAt = now
}

// IncrementJoinCount increments the number of times the participant joined.
// Useful for tracking disconnections in online sessions.
func (a *AttendanceRecord) IncrementJoinCount() {
	a.JoinCount++
	a.UpdatedAt = time.Now()
}

// SetEngagementScore sets the engagement score and updates the timestamp.
func (a *AttendanceRecord) SetEngagementScore(score int) {
	if score < 0 {
		score = 0
	}
	if score > 100 {
		score = 100
	}
	a.EngagementScore = &score
	a.UpdatedAt = time.Now()
}

// WasPresent returns true if the participant attended the session in any capacity.
func (a *AttendanceRecord) WasPresent() bool {
	return a.Status == AttendanceStatusPresent ||
		a.Status == AttendanceStatusLate ||
		a.Status == AttendanceStatusLeftEarly
}

// AttendanceSummary provides aggregate attendance statistics for a session.
type AttendanceSummary struct {
	SessionID    string `json:"session_id"`
	TotalInvited int    `json:"total_invited"`
	Present      int    `json:"present"`
	Absent       int    `json:"absent"`
	Late         int    `json:"late"`
	LeftEarly    int    `json:"left_early"`
	Excused      int    `json:"excused"`
	Pending      int    `json:"pending"`
}

// AttendanceRate calculates the attendance rate as a percentage.
func (s *AttendanceSummary) AttendanceRate() float64 {
	if s.TotalInvited == 0 {
		return 0
	}
	attended := s.Present + s.Late + s.LeftEarly
	return float64(attended) / float64(s.TotalInvited) * 100
}
