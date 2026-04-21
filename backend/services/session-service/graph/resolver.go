package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/session-service/internal/middleware"
	"github.com/nextphoton/session-service/internal/service"
)

type Resolver struct {
	SessionService *service.SessionService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

// Query resolvers
func (r *queryResolver) Session(ctx context.Context, id string) (*service.LearningSession, error) {
	return r.SessionService.GetSession(ctx, id)
}

func (r *queryResolver) SessionsByLearner(ctx context.Context, learnerID string, limit *int, offset *int) (*SessionList, error) {
	l, o := 10, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }

	sessions, total, err := r.SessionService.GetSessionsByLearner(ctx, learnerID, l, o)
	if err != nil {
		return nil, err
	}
	return &SessionList{Sessions: sessions, TotalCount: total}, nil
}

func (r *queryResolver) SessionsByEducator(ctx context.Context, educatorID string, limit *int, offset *int) (*SessionList, error) {
	l, o := 10, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }

	sessions, total, err := r.SessionService.GetSessionsByEducator(ctx, educatorID, l, o)
	if err != nil {
		return nil, err
	}
	return &SessionList{Sessions: sessions, TotalCount: total}, nil
}

// Mutation resolvers
func (r *mutationResolver) CreateSession(ctx context.Context, input CreateSessionInput) (*service.LearningSession, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}

	sess := &service.LearningSession{
		LearnerID:      input.LearnerID,
		EducatorID:     input.EducatorID,
		SubjectID:      input.SubjectID,
		SessionType:    input.SessionType,
		SessionFormat:  input.SessionFormat,
		ScheduledStart: input.ScheduledStart,
		ScheduledEnd:   input.ScheduledEnd,
		Title:          input.Title,
		Description:    input.Description,
		MeetingLink:    input.MeetingLink,
	}

	return r.SessionService.CreateSession(ctx, sess)
}

func (r *mutationResolver) UpdateSessionStatus(ctx context.Context, id, status string) (*service.LearningSession, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	return r.SessionService.UpdateSessionStatus(ctx, id, status)
}

func (r *mutationResolver) CancelSession(ctx context.Context, id, reason string) (*service.LearningSession, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	return r.SessionService.CancelSession(ctx, id, reason)
}

func (r *mutationResolver) CreateBooking(ctx context.Context, input CreateBookingInput) (*service.SessionBooking, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}

	booking := &service.SessionBooking{
		LearnerID:     input.LearnerID,
		EducatorID:    input.EducatorID,
		SubjectID:     input.SubjectID,
		LearningGoals: input.LearningGoals,
	}
	return r.SessionService.CreateBooking(ctx, booking)
}

func (r *mutationResolver) RecordAttendance(ctx context.Context, input RecordAttendanceInput) (*service.AttendanceRecord, error) {
	record := &service.AttendanceRecord{
		SessionID:          input.SessionID,
		LearnerID:          input.LearnerID,
		Status:             input.Status,
		JoinTime:           input.JoinTime,
		LeaveTime:          input.LeaveTime,
		ParticipationLevel: input.ParticipationLevel,
	}
	return r.SessionService.RecordAttendance(ctx, record)
}

func (r *mutationResolver) SubmitFeedback(ctx context.Context, input SubmitFeedbackInput) (*service.SessionFeedback, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}

	feedback := &service.SessionFeedback{
		SessionID:    input.SessionID,
		GivenByID:    claims.UserID,
		Rating:       input.Rating,
		Comments:     input.Comments,
		TopicClarity: input.TopicClarity,
		PaceRating:   input.PaceRating,
	}
	return r.SessionService.SubmitFeedback(ctx, feedback)
}

// Types
type SessionList struct {
	Sessions   []*service.LearningSession `json:"sessions"`
	TotalCount int                        `json:"totalCount"`
}

type CreateSessionInput struct {
	LearnerID     string  `json:"learnerId"`
	EducatorID    string  `json:"educatorId"`
	SubjectID     *string `json:"subjectId"`
	SessionType   string  `json:"sessionType"`
	SessionFormat string  `json:"sessionFormat"`
	ScheduledStart interface{} `json:"scheduledStart"`
	ScheduledEnd   interface{} `json:"scheduledEnd"`
	Title         string  `json:"title"`
	Description   *string `json:"description"`
	MeetingLink   *string `json:"meetingLink"`
}

type CreateBookingInput struct {
	LearnerID     string  `json:"learnerId"`
	EducatorID    *string `json:"educatorId"`
	SubjectID     *string `json:"subjectId"`
	LearningGoals *string `json:"learningGoals"`
}

type RecordAttendanceInput struct {
	SessionID          string      `json:"sessionId"`
	LearnerID          string      `json:"learnerId"`
	Status             string      `json:"status"`
	JoinTime           interface{} `json:"joinTime"`
	LeaveTime          interface{} `json:"leaveTime"`
	ParticipationLevel *string     `json:"participationLevel"`
}

type SubmitFeedbackInput struct {
	SessionID    string  `json:"sessionId"`
	Rating       int     `json:"rating"`
	Comments     *string `json:"comments"`
	TopicClarity *int    `json:"topicClarity"`
	PaceRating   *int    `json:"paceRating"`
}
