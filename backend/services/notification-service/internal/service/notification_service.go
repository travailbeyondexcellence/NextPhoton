package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/nextphoton/notification-service/internal/db"
)

type NotificationService struct {
	DB *db.DB
}

func NewNotificationService(database *db.DB) *NotificationService {
	return &NotificationService{DB: database}
}

type Notification struct {
	ID        string     `json:"id"`
	UserID    string     `json:"userId"`
	Title     string     `json:"title"`
	Body      string     `json:"body"`
	Type      string     `json:"type"`
	Channel   string     `json:"channel"`
	IsRead    bool       `json:"isRead"`
	ReadAt    *time.Time `json:"readAt"`
	ActionURL *string    `json:"actionUrl"`
	CreatedAt time.Time  `json:"createdAt"`
}

type Announcement struct {
	ID          string     `json:"id"`
	Title       string     `json:"title"`
	Content     string     `json:"content"`
	Priority    string     `json:"priority"`
	Scope       string     `json:"scope"`
	CreatedByID string     `json:"createdById"`
	StartsAt    time.Time  `json:"startsAt"`
	ExpiresAt   *time.Time `json:"expiresAt"`
	IsActive    bool       `json:"isActive"`
	CreatedAt   time.Time  `json:"createdAt"`
}

func (s *NotificationService) CreateNotification(ctx context.Context, n *Notification) (*Notification, error) {
	n.ID = uuid.New().String()
	n.IsRead = false
	n.CreatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO notification (id, "userId", title, body, type, channel, "isRead", "actionUrl", "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		n.ID, n.UserID, n.Title, n.Body, n.Type, n.Channel, n.IsRead, n.ActionURL, n.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create notification: %w", err)
	}
	return n, nil
}

func (s *NotificationService) GetNotifications(ctx context.Context, userID string, limit, offset int) ([]*Notification, int, error) {
	if limit <= 0 {
		limit = 20
	}

	var total int
	err := s.DB.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM notification WHERE "userId" = $1`, userID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "userId", title, body, type, channel, "isRead", "readAt", "actionUrl", "createdAt"
		FROM notification WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var notifications []*Notification
	for rows.Next() {
		var n Notification
		if err := rows.Scan(&n.ID, &n.UserID, &n.Title, &n.Body, &n.Type, &n.Channel, &n.IsRead, &n.ReadAt, &n.ActionURL, &n.CreatedAt); err != nil {
			return nil, 0, err
		}
		notifications = append(notifications, &n)
	}
	return notifications, total, nil
}

func (s *NotificationService) MarkAsRead(ctx context.Context, id, userID string) error {
	now := time.Now()
	result, err := s.DB.Pool.Exec(ctx,
		`UPDATE notification SET "isRead" = true, "readAt" = $1 WHERE id = $2 AND "userId" = $3`,
		now, id, userID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("notification not found")
	}
	return nil
}

func (s *NotificationService) MarkAllAsRead(ctx context.Context, userID string) (int, error) {
	now := time.Now()
	result, err := s.DB.Pool.Exec(ctx,
		`UPDATE notification SET "isRead" = true, "readAt" = $1 WHERE "userId" = $2 AND "isRead" = false`,
		now, userID)
	if err != nil {
		return 0, err
	}
	return int(result.RowsAffected()), nil
}

func (s *NotificationService) GetUnreadCount(ctx context.Context, userID string) (int, error) {
	var count int
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT COUNT(*) FROM notification WHERE "userId" = $1 AND "isRead" = false`, userID).Scan(&count)
	return count, err
}

func (s *NotificationService) CreateAnnouncement(ctx context.Context, a *Announcement) (*Announcement, error) {
	a.ID = uuid.New().String()
	a.IsActive = true
	a.CreatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO announcement (id, title, content, priority, scope, "createdById", "startsAt", "expiresAt", "isActive", "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
		a.ID, a.Title, a.Content, a.Priority, a.Scope, a.CreatedByID, a.StartsAt, a.ExpiresAt, a.IsActive, a.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to create announcement: %w", err)
	}
	return a, nil
}

func (s *NotificationService) GetAnnouncements(ctx context.Context, limit, offset int) ([]*Announcement, error) {
	if limit <= 0 {
		limit = 10
	}
	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, title, content, priority, scope, "createdById", "startsAt", "expiresAt", "isActive", "createdAt"
		FROM announcement WHERE "isActive" = true ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var announcements []*Announcement
	for rows.Next() {
		var a Announcement
		if err := rows.Scan(&a.ID, &a.Title, &a.Content, &a.Priority, &a.Scope, &a.CreatedByID, &a.StartsAt, &a.ExpiresAt, &a.IsActive, &a.CreatedAt); err != nil {
			return nil, err
		}
		announcements = append(announcements, &a)
	}
	return announcements, nil
}

func (s *NotificationService) GetAnnouncement(ctx context.Context, id string) (*Announcement, error) {
	var a Announcement
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, title, content, priority, scope, "createdById", "startsAt", "expiresAt", "isActive", "createdAt"
		FROM announcement WHERE id = $1`, id).
		Scan(&a.ID, &a.Title, &a.Content, &a.Priority, &a.Scope, &a.CreatedByID, &a.StartsAt, &a.ExpiresAt, &a.IsActive, &a.CreatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("announcement not found")
		}
		return nil, err
	}
	return &a, nil
}
