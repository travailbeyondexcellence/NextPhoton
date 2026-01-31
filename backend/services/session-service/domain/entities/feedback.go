// Package entities contains the core domain models for the session-service.
package entities

import (
	"time"
)

// FeedbackType indicates what kind of feedback is being given.
type FeedbackType string

const (
	// FeedbackTypeSession is feedback about the overall session.
	FeedbackTypeSession FeedbackType = "session"

	// FeedbackTypeEducator is feedback specifically about the educator.
	FeedbackTypeEducator FeedbackType = "educator"

	// FeedbackTypePlatform is feedback about the NextPhoton platform.
	FeedbackTypePlatform FeedbackType = "platform"

	// FeedbackTypeContent is feedback about the educational content.
	FeedbackTypeContent FeedbackType = "content"
)

// FeedbackSource indicates who is providing the feedback.
type FeedbackSource string

const (
	// FeedbackSourceLearner is feedback from a learner.
	FeedbackSourceLearner FeedbackSource = "learner"

	// FeedbackSourceGuardian is feedback from a guardian.
	FeedbackSourceGuardian FeedbackSource = "guardian"

	// FeedbackSourceEducator is feedback from an educator.
	FeedbackSourceEducator FeedbackSource = "educator"

	// FeedbackSourceECM is feedback from an EduCare Manager.
	FeedbackSourceECM FeedbackSource = "ecm"
)

// SessionFeedback captures feedback about a learning session.
type SessionFeedback struct {
	// Unique identifier for this feedback
	ID string `json:"id"`

	// SessionID links to the session being reviewed
	SessionID string `json:"session_id"`

	// GivenBy is the user ID of the feedback provider
	GivenBy string `json:"given_by"`

	// Source indicates the role of the feedback provider
	Source FeedbackSource `json:"source"`

	// Type categorizes what aspect is being reviewed
	Type FeedbackType `json:"type"`

	// OverallRating is the general rating (1-5 stars)
	OverallRating int `json:"overall_rating"`

	// ContentRating rates the educational content quality (1-5)
	ContentRating *int `json:"content_rating,omitempty"`

	// EngagementRating rates how engaging the session was (1-5)
	EngagementRating *int `json:"engagement_rating,omitempty"`

	// CommunicationRating rates the communication quality (1-5)
	CommunicationRating *int `json:"communication_rating,omitempty"`

	// PreparationRating rates how well-prepared the educator was (1-5)
	PreparationRating *int `json:"preparation_rating,omitempty"`

	// TechnicalRating rates the technical quality (video, audio) for online sessions (1-5)
	TechnicalRating *int `json:"technical_rating,omitempty"`

	// ValueRating rates the perceived value for money (1-5)
	ValueRating *int `json:"value_rating,omitempty"`

	// Comments contains detailed written feedback
	Comments string `json:"comments"`

	// PositiveAspects lists what went well
	PositiveAspects []string `json:"positive_aspects,omitempty"`

	// AreasForImprovement lists suggestions for improvement
	AreasForImprovement []string `json:"areas_for_improvement,omitempty"`

	// WouldRecommend indicates if the user would recommend the educator
	WouldRecommend *bool `json:"would_recommend,omitempty"`

	// WouldBookAgain indicates if the user would book another session
	WouldBookAgain *bool `json:"would_book_again,omitempty"`

	// IsAnonymous indicates if the feedback should be shown anonymously to the educator
	IsAnonymous bool `json:"is_anonymous"`

	// IsPublic indicates if the feedback can be shown publicly
	IsPublic bool `json:"is_public"`

	// IsVerified indicates if the feedback has been verified (user actually attended)
	IsVerified bool `json:"is_verified"`

	// ResponseFromEducator contains the educator's response to the feedback
	ResponseFromEducator *string `json:"response_from_educator,omitempty"`

	// ResponseAt records when the educator responded
	ResponseAt *time.Time `json:"response_at,omitempty"`

	// IsFlagged indicates if this feedback was flagged for review
	IsFlagged bool `json:"is_flagged"`

	// FlagReason explains why the feedback was flagged
	FlagReason *string `json:"flag_reason,omitempty"`

	// FlaggedBy records who flagged it
	FlaggedBy *string `json:"flagged_by,omitempty"`

	// FlaggedAt records when it was flagged
	FlaggedAt *time.Time `json:"flagged_at,omitempty"`

	// CreatedAt records when this feedback was submitted
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when this feedback was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// EducatorRatingSummary aggregates ratings for an educator.
type EducatorRatingSummary struct {
	// EducatorID is the educator being summarized
	EducatorID string `json:"educator_id"`

	// TotalFeedback is the total number of feedback entries
	TotalFeedback int `json:"total_feedback"`

	// AverageOverallRating is the mean overall rating
	AverageOverallRating float64 `json:"average_overall_rating"`

	// AverageContentRating is the mean content rating
	AverageContentRating *float64 `json:"average_content_rating,omitempty"`

	// AverageEngagementRating is the mean engagement rating
	AverageEngagementRating *float64 `json:"average_engagement_rating,omitempty"`

	// AverageCommunicationRating is the mean communication rating
	AverageCommunicationRating *float64 `json:"average_communication_rating,omitempty"`

	// AveragePreparationRating is the mean preparation rating
	AveragePreparationRating *float64 `json:"average_preparation_rating,omitempty"`

	// RecommendationRate is the percentage who would recommend
	RecommendationRate *float64 `json:"recommendation_rate,omitempty"`

	// RebookRate is the percentage who would book again
	RebookRate *float64 `json:"rebook_rate,omitempty"`

	// RatingDistribution shows count of each rating level
	RatingDistribution map[int]int `json:"rating_distribution"`

	// LastUpdated tracks when this summary was calculated
	LastUpdated time.Time `json:"last_updated"`
}

// Validate checks if the feedback has valid rating values.
func (f *SessionFeedback) Validate() error {
	if f.OverallRating < 1 || f.OverallRating > 5 {
		return ErrInvalidRating
	}
	if f.ContentRating != nil && (*f.ContentRating < 1 || *f.ContentRating > 5) {
		return ErrInvalidRating
	}
	if f.EngagementRating != nil && (*f.EngagementRating < 1 || *f.EngagementRating > 5) {
		return ErrInvalidRating
	}
	if f.CommunicationRating != nil && (*f.CommunicationRating < 1 || *f.CommunicationRating > 5) {
		return ErrInvalidRating
	}
	if f.PreparationRating != nil && (*f.PreparationRating < 1 || *f.PreparationRating > 5) {
		return ErrInvalidRating
	}
	if f.TechnicalRating != nil && (*f.TechnicalRating < 1 || *f.TechnicalRating > 5) {
		return ErrInvalidRating
	}
	if f.ValueRating != nil && (*f.ValueRating < 1 || *f.ValueRating > 5) {
		return ErrInvalidRating
	}
	return nil
}

// AddEducatorResponse records the educator's response to feedback.
func (f *SessionFeedback) AddEducatorResponse(response string) {
	now := time.Now()
	f.ResponseFromEducator = &response
	f.ResponseAt = &now
	f.UpdatedAt = now
}

// Flag marks the feedback for review.
func (f *SessionFeedback) Flag(reason string, flaggedBy string) {
	now := time.Now()
	f.IsFlagged = true
	f.FlagReason = &reason
	f.FlaggedBy = &flaggedBy
	f.FlaggedAt = &now
	f.UpdatedAt = now
}

// Unflag removes the flag from the feedback.
func (f *SessionFeedback) Unflag() {
	f.IsFlagged = false
	f.FlagReason = nil
	f.FlaggedBy = nil
	f.FlaggedAt = nil
	f.UpdatedAt = time.Now()
}

// CalculateWeightedScore computes a weighted average of all ratings.
// Weights: Overall=30%, Content=20%, Engagement=15%, Communication=15%, Preparation=20%
func (f *SessionFeedback) CalculateWeightedScore() float64 {
	total := float64(f.OverallRating) * 0.30
	divisor := 0.30

	if f.ContentRating != nil {
		total += float64(*f.ContentRating) * 0.20
		divisor += 0.20
	}
	if f.EngagementRating != nil {
		total += float64(*f.EngagementRating) * 0.15
		divisor += 0.15
	}
	if f.CommunicationRating != nil {
		total += float64(*f.CommunicationRating) * 0.15
		divisor += 0.15
	}
	if f.PreparationRating != nil {
		total += float64(*f.PreparationRating) * 0.20
		divisor += 0.20
	}

	return total / divisor
}

// ProgressNote captures educator notes about learner progress during a session.
// These are internal notes used for ECM tracking and monitoring.
type ProgressNote struct {
	// Unique identifier
	ID string `json:"id"`

	// SessionID links to the session
	SessionID string `json:"session_id"`

	// LearnerID identifies which learner this note is about
	LearnerID string `json:"learner_id"`

	// EducatorID is who wrote the note
	EducatorID string `json:"educator_id"`

	// TopicsDiscovered lists new topics introduced
	TopicsDiscovered []string `json:"topics_discovered,omitempty"`

	// TopicsStrengths lists areas where the learner showed strength
	TopicsStrengths []string `json:"topics_strengths,omitempty"`

	// TopicsWeaknesses lists areas needing improvement
	TopicsWeaknesses []string `json:"topics_weaknesses,omitempty"`

	// HomeworkCompleted indicates if previous homework was done
	HomeworkCompleted *bool `json:"homework_completed,omitempty"`

	// HomeworkQuality rates the homework quality (1-5)
	HomeworkQuality *int `json:"homework_quality,omitempty"`

	// EngagementLevel rates learner engagement during session (1-5)
	EngagementLevel int `json:"engagement_level"`

	// UnderstandingLevel rates learner understanding (1-5)
	UnderstandingLevel int `json:"understanding_level"`

	// BehaviorNotes captures any behavioral observations
	BehaviorNotes string `json:"behavior_notes"`

	// RecommendedNextSteps suggests what to cover next
	RecommendedNextSteps string `json:"recommended_next_steps"`

	// PrivateNotes are notes only visible to the educator and ECM
	PrivateNotes string `json:"private_notes"`

	// GuardianShareable indicates if this can be shared with guardian
	GuardianShareable bool `json:"guardian_shareable"`

	// RequiresIntervention flags if ECM attention is needed
	RequiresIntervention bool `json:"requires_intervention"`

	// InterventionReason explains why intervention is needed
	InterventionReason *string `json:"intervention_reason,omitempty"`

	// CreatedAt records when this note was created
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt records when this note was last modified
	UpdatedAt time.Time `json:"updated_at"`
}

// FlagForIntervention marks the note as requiring ECM attention.
func (n *ProgressNote) FlagForIntervention(reason string) {
	n.RequiresIntervention = true
	n.InterventionReason = &reason
	n.UpdatedAt = time.Now()
}

// ClearIntervention removes the intervention flag.
func (n *ProgressNote) ClearIntervention() {
	n.RequiresIntervention = false
	n.InterventionReason = nil
	n.UpdatedAt = time.Now()
}
