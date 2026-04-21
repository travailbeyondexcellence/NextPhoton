package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/analytics-service/internal/middleware"
	"github.com/nextphoton/analytics-service/internal/service"
)

type Resolver struct {
	AnalyticsService *service.AnalyticsService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *queryResolver) DashboardMetrics(ctx context.Context, category, period string) ([]*service.DashboardMetric, error) {
	return r.AnalyticsService.GetDashboardMetrics(ctx, category, period)
}

func (r *queryResolver) LearningAnalytics(ctx context.Context, learnerID string) (*service.LearningAnalytics, error) {
	return r.AnalyticsService.GetLearningAnalytics(ctx, learnerID)
}

func (r *mutationResolver) TrackEvent(ctx context.Context, input TrackEventInput) (*service.AnalyticsEvent, error) {
	claims := middleware.GetUserClaims(ctx)
	var userID *string
	if claims != nil { userID = &claims.UserID }
	event := &service.AnalyticsEvent{
		UserID: userID, EventType: input.EventType, EventName: input.EventName,
		SessionID: input.SessionID, Platform: input.Platform,
	}
	return r.AnalyticsService.TrackEvent(ctx, event)
}

type TrackEventInput struct {
	EventType string  `json:"eventType"`
	EventName string  `json:"eventName"`
	SessionID *string `json:"sessionId"`
	Platform  *string `json:"platform"`
}
