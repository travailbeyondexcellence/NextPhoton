package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/nextphoton/analytics-service/internal/db"
)

type AnalyticsService struct {
	DB *db.DB
}

func NewAnalyticsService(database *db.DB) *AnalyticsService {
	return &AnalyticsService{DB: database}
}

type AnalyticsEvent struct {
	ID         string                 `json:"id"`
	UserID     *string                `json:"userId"`
	EventType  string                 `json:"eventType"`
	EventName  string                 `json:"eventName"`
	Properties map[string]interface{} `json:"properties"`
	SessionID  *string                `json:"sessionId"`
	Platform   *string                `json:"platform"`
	CreatedAt  time.Time              `json:"createdAt"`
}

type DashboardMetric struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	Category string  `json:"category"`
	Value    float64 `json:"value"`
	Period   string  `json:"period"`
	Date     time.Time `json:"date"`
}

type LearningAnalytics struct {
	LearnerID        string  `json:"learnerId"`
	TotalStudyTime   float64 `json:"totalStudyTime"`
	TotalSessions    int     `json:"totalSessions"`
	AverageScore     float64 `json:"averageScore"`
	AssignmentsCompleted int `json:"assignmentsCompleted"`
	ProgressRate     float64 `json:"progressRate"`
	ConsistencyScore float64 `json:"consistencyScore"`
}

func (s *AnalyticsService) TrackEvent(ctx context.Context, event *AnalyticsEvent) (*AnalyticsEvent, error) {
	event.ID = uuid.New().String()
	event.CreatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO analytics_event (id, "userId", "eventType", "eventName", properties, "sessionId", platform, "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		event.ID, event.UserID, event.EventType, event.EventName, event.Properties,
		event.SessionID, event.Platform, event.CreatedAt)
	if err != nil { return nil, fmt.Errorf("failed to track event: %w", err) }
	return event, nil
}

func (s *AnalyticsService) GetDashboardMetrics(ctx context.Context, category, period string) ([]*DashboardMetric, error) {
	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, name, category, value, period, date
		FROM dashboard_metric WHERE category = $1 AND period = $2
		ORDER BY date DESC LIMIT 30`, category, period)
	if err != nil { return nil, err }
	defer rows.Close()

	var metrics []*DashboardMetric
	for rows.Next() {
		var m DashboardMetric
		if err := rows.Scan(&m.ID, &m.Name, &m.Category, &m.Value, &m.Period, &m.Date); err != nil {
			return nil, err
		}
		metrics = append(metrics, &m)
	}
	return metrics, nil
}

func (s *AnalyticsService) GetLearningAnalytics(ctx context.Context, learnerID string) (*LearningAnalytics, error) {
	var la LearningAnalytics
	la.LearnerID = learnerID

	// Aggregate from learning sessions
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT COALESCE(COUNT(*), 0),
		COALESCE(SUM(EXTRACT(EPOCH FROM ("actualEnd" - "actualStart"))/3600), 0)
		FROM "learning_session" WHERE "learnerId" = $1 AND status = 'completed'`, learnerID).
		Scan(&la.TotalSessions, &la.TotalStudyTime)
	if err != nil { return nil, err }

	return &la, nil
}
