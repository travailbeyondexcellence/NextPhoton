package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/nextphoton/session-service/internal/db"
)

type SessionService struct {
	DB *db.DB
}

func NewSessionService(database *db.DB) *SessionService {
	return &SessionService{DB: database}
}

type LearningSession struct {
	ID              string     `json:"id"`
	LearnerID       string     `json:"learnerId"`
	EducatorID      string     `json:"educatorId"`
	SubjectID       *string    `json:"subjectId"`
	SessionType     string     `json:"sessionType"`
	SessionFormat   string     `json:"sessionFormat"`
	Status          string     `json:"status"`
	ScheduledStart  time.Time  `json:"scheduledStart"`
	ScheduledEnd    time.Time  `json:"scheduledEnd"`
	ActualStart     *time.Time `json:"actualStart"`
	ActualEnd       *time.Time `json:"actualEnd"`
	Title           string     `json:"title"`
	Description     *string    `json:"description"`
	MeetingLink     *string    `json:"meetingLink"`
	Notes           *string    `json:"notes"`
	CancellationReason *string `json:"cancellationReason"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
}

type SessionBooking struct {
	ID             string    `json:"id"`
	LearnerID      string    `json:"learnerId"`
	EducatorID     *string   `json:"educatorId"`
	SubjectID      *string   `json:"subjectId"`
	Status         string    `json:"status"`
	PreferredDates []string  `json:"preferredDates"`
	LearningGoals  *string   `json:"learningGoals"`
	CreatedAt      time.Time `json:"createdAt"`
	UpdatedAt      time.Time `json:"updatedAt"`
}

type AttendanceRecord struct {
	ID               string     `json:"id"`
	SessionID        string     `json:"sessionId"`
	LearnerID        string     `json:"learnerId"`
	Status           string     `json:"status"`
	JoinTime         *time.Time `json:"joinTime"`
	LeaveTime        *time.Time `json:"leaveTime"`
	ParticipationLevel *string  `json:"participationLevel"`
	CreatedAt        time.Time  `json:"createdAt"`
}

type SessionFeedback struct {
	ID           string    `json:"id"`
	SessionID    string    `json:"sessionId"`
	GivenByID    string    `json:"givenById"`
	Rating       int       `json:"rating"`
	Comments     *string   `json:"comments"`
	TopicClarity *int      `json:"topicClarity"`
	PaceRating   *int      `json:"paceRating"`
	CreatedAt    time.Time `json:"createdAt"`
}

// CreateSession creates a new learning session
func (s *SessionService) CreateSession(ctx context.Context, sess *LearningSession) (*LearningSession, error) {
	sess.ID = uuid.New().String()
	sess.Status = "scheduled"
	sess.CreatedAt = time.Now()
	sess.UpdatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO "learning_session" (id, "learnerId", "educatorId", "subjectId",
		"sessionType", "sessionFormat", status, "scheduledStart", "scheduledEnd",
		title, description, "meetingLink", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
		sess.ID, sess.LearnerID, sess.EducatorID, sess.SubjectID,
		sess.SessionType, sess.SessionFormat, sess.Status,
		sess.ScheduledStart, sess.ScheduledEnd,
		sess.Title, sess.Description, sess.MeetingLink,
		sess.CreatedAt, sess.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}

	return sess, nil
}

// GetSession gets a session by ID
func (s *SessionService) GetSession(ctx context.Context, id string) (*LearningSession, error) {
	var sess LearningSession
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "learnerId", "educatorId", "subjectId",
		"sessionType", "sessionFormat", status, "scheduledStart", "scheduledEnd",
		"actualStart", "actualEnd", title, description, "meetingLink", notes,
		"cancellationReason", "createdAt", "updatedAt"
		FROM "learning_session" WHERE id = $1`, id).
		Scan(&sess.ID, &sess.LearnerID, &sess.EducatorID, &sess.SubjectID,
			&sess.SessionType, &sess.SessionFormat, &sess.Status,
			&sess.ScheduledStart, &sess.ScheduledEnd,
			&sess.ActualStart, &sess.ActualEnd, &sess.Title, &sess.Description,
			&sess.MeetingLink, &sess.Notes, &sess.CancellationReason,
			&sess.CreatedAt, &sess.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("session not found")
		}
		return nil, err
	}
	return &sess, nil
}

// GetSessionsByLearner gets sessions for a learner
func (s *SessionService) GetSessionsByLearner(ctx context.Context, learnerID string, limit, offset int) ([]*LearningSession, int, error) {
	if limit <= 0 {
		limit = 10
	}

	var total int
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM "learning_session" WHERE "learnerId" = $1`, learnerID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "learnerId", "educatorId", "subjectId",
		"sessionType", "sessionFormat", status, "scheduledStart", "scheduledEnd",
		"actualStart", "actualEnd", title, description, "meetingLink", notes,
		"cancellationReason", "createdAt", "updatedAt"
		FROM "learning_session" WHERE "learnerId" = $1
		ORDER BY "scheduledStart" DESC LIMIT $2 OFFSET $3`, learnerID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var sessions []*LearningSession
	for rows.Next() {
		var sess LearningSession
		if err := rows.Scan(&sess.ID, &sess.LearnerID, &sess.EducatorID, &sess.SubjectID,
			&sess.SessionType, &sess.SessionFormat, &sess.Status,
			&sess.ScheduledStart, &sess.ScheduledEnd,
			&sess.ActualStart, &sess.ActualEnd, &sess.Title, &sess.Description,
			&sess.MeetingLink, &sess.Notes, &sess.CancellationReason,
			&sess.CreatedAt, &sess.UpdatedAt); err != nil {
			return nil, 0, err
		}
		sessions = append(sessions, &sess)
	}

	return sessions, total, nil
}

// GetSessionsByEducator gets sessions for an educator
func (s *SessionService) GetSessionsByEducator(ctx context.Context, educatorID string, limit, offset int) ([]*LearningSession, int, error) {
	if limit <= 0 {
		limit = 10
	}

	var total int
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM "learning_session" WHERE "educatorId" = $1`, educatorID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "learnerId", "educatorId", "subjectId",
		"sessionType", "sessionFormat", status, "scheduledStart", "scheduledEnd",
		"actualStart", "actualEnd", title, description, "meetingLink", notes,
		"cancellationReason", "createdAt", "updatedAt"
		FROM "learning_session" WHERE "educatorId" = $1
		ORDER BY "scheduledStart" DESC LIMIT $2 OFFSET $3`, educatorID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var sessions []*LearningSession
	for rows.Next() {
		var sess LearningSession
		if err := rows.Scan(&sess.ID, &sess.LearnerID, &sess.EducatorID, &sess.SubjectID,
			&sess.SessionType, &sess.SessionFormat, &sess.Status,
			&sess.ScheduledStart, &sess.ScheduledEnd,
			&sess.ActualStart, &sess.ActualEnd, &sess.Title, &sess.Description,
			&sess.MeetingLink, &sess.Notes, &sess.CancellationReason,
			&sess.CreatedAt, &sess.UpdatedAt); err != nil {
			return nil, 0, err
		}
		sessions = append(sessions, &sess)
	}

	return sessions, total, nil
}

// UpdateSessionStatus updates a session's status
func (s *SessionService) UpdateSessionStatus(ctx context.Context, id, status string) (*LearningSession, error) {
	now := time.Now()

	var extraUpdate string
	switch status {
	case "in_progress":
		extraUpdate = fmt.Sprintf(`, "actualStart" = '%s'`, now.Format(time.RFC3339))
	case "completed":
		extraUpdate = fmt.Sprintf(`, "actualEnd" = '%s'`, now.Format(time.RFC3339))
	}

	_, err := s.DB.Pool.Exec(ctx,
		fmt.Sprintf(`UPDATE "learning_session" SET status = $1, "updatedAt" = $2%s WHERE id = $3`, extraUpdate),
		status, now, id)
	if err != nil {
		return nil, err
	}

	return s.GetSession(ctx, id)
}

// CancelSession cancels a session with a reason
func (s *SessionService) CancelSession(ctx context.Context, id, reason string) (*LearningSession, error) {
	_, err := s.DB.Pool.Exec(ctx,
		`UPDATE "learning_session" SET status = 'cancelled', "cancellationReason" = $1, "updatedAt" = $2 WHERE id = $3`,
		reason, time.Now(), id)
	if err != nil {
		return nil, err
	}
	return s.GetSession(ctx, id)
}

// CreateBooking creates a session booking request
func (s *SessionService) CreateBooking(ctx context.Context, booking *SessionBooking) (*SessionBooking, error) {
	booking.ID = uuid.New().String()
	booking.Status = "pending"
	booking.CreatedAt = time.Now()
	booking.UpdatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO "session_booking" (id, "learnerId", "educatorId", "subjectId",
		status, "learningGoals", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		booking.ID, booking.LearnerID, booking.EducatorID, booking.SubjectID,
		booking.Status, booking.LearningGoals, booking.CreatedAt, booking.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create booking: %w", err)
	}

	return booking, nil
}

// RecordAttendance records attendance for a session
func (s *SessionService) RecordAttendance(ctx context.Context, record *AttendanceRecord) (*AttendanceRecord, error) {
	record.ID = uuid.New().String()
	record.CreatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO "attendance_record" (id, "sessionId", "learnerId", status,
		"joinTime", "leaveTime", "participationLevel", "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		record.ID, record.SessionID, record.LearnerID, record.Status,
		record.JoinTime, record.LeaveTime, record.ParticipationLevel, record.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to record attendance: %w", err)
	}

	return record, nil
}

// SubmitFeedback submits feedback for a session
func (s *SessionService) SubmitFeedback(ctx context.Context, feedback *SessionFeedback) (*SessionFeedback, error) {
	feedback.ID = uuid.New().String()
	feedback.CreatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO "session_feedback" (id, "sessionId", "givenById", rating,
		comments, "topicClarity", "paceRating", "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		feedback.ID, feedback.SessionID, feedback.GivenByID, feedback.Rating,
		feedback.Comments, feedback.TopicClarity, feedback.PaceRating, feedback.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to submit feedback: %w", err)
	}

	return feedback, nil
}
