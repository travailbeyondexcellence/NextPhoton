// Package entities contains the core domain models for the session-service.
package entities

import (
	"time"
)

// AssignmentType categorizes the nature of the assignment.
type AssignmentType string

const (
	// AssignmentTypeHomework represents practice work to be done at home.
	AssignmentTypeHomework AssignmentType = "homework"

	// AssignmentTypeQuiz represents a short assessment.
	AssignmentTypeQuiz AssignmentType = "quiz"

	// AssignmentTypeProject represents a longer-term project.
	AssignmentTypeProject AssignmentType = "project"

	// AssignmentTypePractice represents practice exercises.
	AssignmentTypePractice AssignmentType = "practice"

	// AssignmentTypeReading represents reading assignments.
	AssignmentTypeReading AssignmentType = "reading"

	// AssignmentTypeTest represents a formal test or exam.
	AssignmentTypeTest AssignmentType = "test"
)

// AssignmentStatus tracks the state of an assignment.
type AssignmentStatus string

const (
	// AssignmentStatusDraft indicates the assignment is being prepared.
	AssignmentStatusDraft AssignmentStatus = "draft"

	// AssignmentStatusPublished indicates the assignment is visible to learners.
	AssignmentStatusPublished AssignmentStatus = "published"

	// AssignmentStatusClosed indicates no more submissions are accepted.
	AssignmentStatusClosed AssignmentStatus = "closed"

	// AssignmentStatusArchived indicates the assignment is no longer active.
	AssignmentStatusArchived AssignmentStatus = "archived"
)

// SubmissionStatus tracks the state of a learner's assignment submission.
type SubmissionStatus string

const (
	// SubmissionStatusNotStarted indicates the learner hasn't begun work.
	SubmissionStatusNotStarted SubmissionStatus = "not_started"

	// SubmissionStatusInProgress indicates the learner is working on it.
	SubmissionStatusInProgress SubmissionStatus = "in_progress"

	// SubmissionStatusSubmitted indicates the learner has submitted their work.
	SubmissionStatusSubmitted SubmissionStatus = "submitted"

	// SubmissionStatusLate indicates the submission was made after the deadline.
	SubmissionStatusLate SubmissionStatus = "late"

	// SubmissionStatusGraded indicates the submission has been evaluated.
	SubmissionStatusGraded SubmissionStatus = "graded"

	// SubmissionStatusReturned indicates the work was returned for revision.
	SubmissionStatusReturned SubmissionStatus = "returned"

	// SubmissionStatusResubmitted indicates a revised submission was made.
	SubmissionStatusResubmitted SubmissionStatus = "resubmitted"
)

// Assignment represents educational work assigned by an educator to learners.
type Assignment struct {
	// Unique identifier for the assignment
	ID string `json:"id"`

	// Title is a brief descriptive name
	Title string `json:"title"`

	// Description provides detailed instructions and expectations
	Description string `json:"description"`

	// Type categorizes the assignment
	Type AssignmentType `json:"type"`

	// Status tracks the assignment lifecycle
	Status AssignmentStatus `json:"status"`

	// EducatorID is the educator who created the assignment
	EducatorID string `json:"educator_id"`

	// SessionID links to the session this assignment is associated with (optional)
	SessionID *string `json:"session_id,omitempty"`

	// SubjectID is the subject this assignment covers
	SubjectID string `json:"subject_id"`

	// TopicIDs are the specific topics covered
	TopicIDs []string `json:"topic_ids,omitempty"`

	// LearnerIDs lists who should complete this assignment
	LearnerIDs []string `json:"learner_ids"`

	// DueDate is when the assignment should be completed
	DueDate time.Time `json:"due_date"`

	// PublishedAt is when the assignment was made visible to learners
	PublishedAt *time.Time `json:"published_at,omitempty"`

	// ClosedAt is when submissions were closed
	ClosedAt *time.Time `json:"closed_at,omitempty"`

	// MaxScore is the maximum points possible (for graded assignments)
	MaxScore *int `json:"max_score,omitempty"`

	// PassingScore is the minimum score to pass (optional)
	PassingScore *int `json:"passing_score,omitempty"`

	// EstimatedTimeMinutes is how long the assignment should take
	EstimatedTimeMinutes int `json:"estimated_time_minutes"`

	// AllowLateSubmission indicates whether late work is accepted
	AllowLateSubmission bool `json:"allow_late_submission"`

	// LatePenaltyPercent is the percentage deduction for late submissions
	LatePenaltyPercent *int `json:"late_penalty_percent,omitempty"`

	// MaxAttempts limits how many times a learner can submit (-1 for unlimited)
	MaxAttempts int `json:"max_attempts"`

	// Attachments contains URLs to any attached files or resources
	Attachments []Attachment `json:"attachments,omitempty"`

	// Instructions contains structured instructions in JSON format
	Instructions *string `json:"instructions,omitempty"`

	// RubricID links to a grading rubric (optional)
	RubricID *string `json:"rubric_id,omitempty"`

	// CreatedAt records when the assignment was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when the assignment was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// Attachment represents a file attached to an assignment.
type Attachment struct {
	// ID is a unique identifier for the attachment
	ID string `json:"id"`

	// Name is the display name of the attachment
	Name string `json:"name"`

	// URL is the location of the file
	URL string `json:"url"`

	// MimeType describes the file type
	MimeType string `json:"mime_type"`

	// SizeBytes is the file size
	SizeBytes int64 `json:"size_bytes"`

	// UploadedAt records when the file was uploaded
	UploadedAt time.Time `json:"uploaded_at"`
}

// AssignmentSubmission represents a learner's work on an assignment.
type AssignmentSubmission struct {
	// Unique identifier for the submission
	ID string `json:"id"`

	// AssignmentID links to the assignment
	AssignmentID string `json:"assignment_id"`

	// LearnerID is who made the submission
	LearnerID string `json:"learner_id"`

	// Status tracks the submission state
	Status SubmissionStatus `json:"status"`

	// AttemptNumber tracks which attempt this is
	AttemptNumber int `json:"attempt_number"`

	// Content is the learner's submitted work (text/JSON)
	Content string `json:"content"`

	// Attachments contains any files the learner submitted
	Attachments []Attachment `json:"attachments,omitempty"`

	// SubmittedAt records when the work was submitted
	SubmittedAt *time.Time `json:"submitted_at,omitempty"`

	// Score is the awarded points (nil if not yet graded)
	Score *int `json:"score,omitempty"`

	// ScorePercent is the percentage score (calculated from Score/MaxScore)
	ScorePercent *float64 `json:"score_percent,omitempty"`

	// IsPassing indicates whether the submission met the passing threshold
	IsPassing *bool `json:"is_passing,omitempty"`

	// GradedAt records when the submission was graded
	GradedAt *time.Time `json:"graded_at,omitempty"`

	// GradedBy records who graded the submission
	GradedBy *string `json:"graded_by,omitempty"`

	// Feedback contains the educator's feedback on the submission
	Feedback string `json:"feedback"`

	// FeedbackAttachments contains any files attached to feedback
	FeedbackAttachments []Attachment `json:"feedback_attachments,omitempty"`

	// TimeSpentMinutes tracks how long the learner spent (self-reported or tracked)
	TimeSpentMinutes *int `json:"time_spent_minutes,omitempty"`

	// StartedAt records when the learner began work
	StartedAt *time.Time `json:"started_at,omitempty"`

	// IsLate indicates if the submission was after the deadline
	IsLate bool `json:"is_late"`

	// PenaltyApplied is the point reduction for late submission
	PenaltyApplied *int `json:"penalty_applied,omitempty"`

	// CreatedAt records when this record was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when this record was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// Publish transitions the assignment to published status.
func (a *Assignment) Publish() error {
	if a.Status != AssignmentStatusDraft {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	a.Status = AssignmentStatusPublished
	a.PublishedAt = &now
	a.UpdatedAt = now
	return nil
}

// Close transitions the assignment to closed status.
func (a *Assignment) Close() error {
	if a.Status != AssignmentStatusPublished {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	a.Status = AssignmentStatusClosed
	a.ClosedAt = &now
	a.UpdatedAt = now
	return nil
}

// Archive transitions the assignment to archived status.
func (a *Assignment) Archive() error {
	if a.Status == AssignmentStatusArchived {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	a.Status = AssignmentStatusArchived
	a.UpdatedAt = now
	return nil
}

// IsPastDue returns true if the assignment's due date has passed.
func (a *Assignment) IsPastDue() bool {
	return time.Now().After(a.DueDate)
}

// Submit records a submission for this assignment.
func (s *AssignmentSubmission) Submit() error {
	if s.Status == SubmissionStatusSubmitted || s.Status == SubmissionStatusGraded {
		return ErrInvalidStateTransition
	}
	now := time.Now()
	s.Status = SubmissionStatusSubmitted
	s.SubmittedAt = &now
	s.UpdatedAt = now
	return nil
}

// Grade records a score and feedback for the submission.
func (s *AssignmentSubmission) Grade(score int, feedback string, gradedBy string, maxScore int, passingScore *int) error {
	if s.Status != SubmissionStatusSubmitted && s.Status != SubmissionStatusResubmitted && s.Status != SubmissionStatusLate {
		return ErrInvalidStateTransition
	}

	now := time.Now()
	s.Score = &score
	s.Feedback = feedback
	s.GradedAt = &now
	s.GradedBy = &gradedBy
	s.Status = SubmissionStatusGraded
	s.UpdatedAt = now

	// Calculate percentage
	if maxScore > 0 {
		percent := float64(score) / float64(maxScore) * 100
		s.ScorePercent = &percent
	}

	// Determine if passing
	if passingScore != nil {
		passing := score >= *passingScore
		s.IsPassing = &passing
	}

	return nil
}

// Return marks the submission as returned for revision.
func (s *AssignmentSubmission) Return(feedback string, gradedBy string) error {
	if s.Status != SubmissionStatusSubmitted && s.Status != SubmissionStatusResubmitted && s.Status != SubmissionStatusLate {
		return ErrInvalidStateTransition
	}

	now := time.Now()
	s.Status = SubmissionStatusReturned
	s.Feedback = feedback
	s.GradedBy = &gradedBy
	s.UpdatedAt = now
	return nil
}
