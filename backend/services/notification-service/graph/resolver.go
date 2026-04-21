package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/notification-service/internal/middleware"
	"github.com/nextphoton/notification-service/internal/service"
)

type Resolver struct {
	NotificationService *service.NotificationService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *queryResolver) Notifications(ctx context.Context, limit *int, offset *int) (*NotificationList, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	l, o := 20, 0
	if limit != nil {
		l = *limit
	}
	if offset != nil {
		o = *offset
	}
	notifications, total, err := r.NotificationService.GetNotifications(ctx, claims.UserID, l, o)
	if err != nil {
		return nil, err
	}
	return &NotificationList{Notifications: notifications, TotalCount: total}, nil
}

func (r *queryResolver) UnreadCount(ctx context.Context) (int, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return 0, fmt.Errorf("not authenticated")
	}
	return r.NotificationService.GetUnreadCount(ctx, claims.UserID)
}

func (r *queryResolver) Announcements(ctx context.Context, limit *int, offset *int) ([]*service.Announcement, error) {
	l, o := 10, 0
	if limit != nil {
		l = *limit
	}
	if offset != nil {
		o = *offset
	}
	return r.NotificationService.GetAnnouncements(ctx, l, o)
}

func (r *queryResolver) Announcement(ctx context.Context, id string) (*service.Announcement, error) {
	return r.NotificationService.GetAnnouncement(ctx, id)
}

func (r *mutationResolver) CreateNotification(ctx context.Context, input CreateNotificationInput) (*service.Notification, error) {
	n := &service.Notification{
		UserID: input.UserID, Title: input.Title, Body: input.Body,
		Type: input.Type, Channel: input.Channel, ActionURL: input.ActionURL,
	}
	return r.NotificationService.CreateNotification(ctx, n)
}

func (r *mutationResolver) MarkAsRead(ctx context.Context, id string) (bool, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return false, fmt.Errorf("not authenticated")
	}
	err := r.NotificationService.MarkAsRead(ctx, id, claims.UserID)
	return err == nil, err
}

func (r *mutationResolver) MarkAllAsRead(ctx context.Context) (int, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return 0, fmt.Errorf("not authenticated")
	}
	return r.NotificationService.MarkAllAsRead(ctx, claims.UserID)
}

func (r *mutationResolver) CreateAnnouncement(ctx context.Context, input CreateAnnouncementInput) (*service.Announcement, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	a := &service.Announcement{
		Title: input.Title, Content: input.Content, Priority: input.Priority,
		Scope: input.Scope, CreatedByID: claims.UserID, StartsAt: input.StartsAt,
		ExpiresAt: input.ExpiresAt,
	}
	return r.NotificationService.CreateAnnouncement(ctx, a)
}

type NotificationList struct {
	Notifications []*service.Notification `json:"notifications"`
	TotalCount    int                     `json:"totalCount"`
}

type CreateNotificationInput struct {
	UserID    string  `json:"userId"`
	Title     string  `json:"title"`
	Body      string  `json:"body"`
	Type      string  `json:"type"`
	Channel   string  `json:"channel"`
	ActionURL *string `json:"actionUrl"`
}

type CreateAnnouncementInput struct {
	Title     string      `json:"title"`
	Content   string      `json:"content"`
	Priority  string      `json:"priority"`
	Scope     string      `json:"scope"`
	StartsAt  interface{} `json:"startsAt"`
	ExpiresAt interface{} `json:"expiresAt"`
}
