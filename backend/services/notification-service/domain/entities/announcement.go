// Package entities contains domain entities for the notification service.
package entities

import (
	"time"

	"github.com/google/uuid"
)

// AnnouncementScope defines who can see the announcement.
// Scopes determine the audience for broadcast messages.
type AnnouncementScope string

const (
	// ScopeGlobal sends the announcement to all users.
	ScopeGlobal AnnouncementScope = "GLOBAL"

	// ScopeOrganization sends to all users in a specific organization.
	ScopeOrganization AnnouncementScope = "ORGANIZATION"

	// ScopeRole sends to all users with a specific role.
	ScopeRole AnnouncementScope = "ROLE"

	// ScopeCourse sends to all users enrolled in a specific course.
	ScopeCourse AnnouncementScope = "COURSE"

	// ScopeSession sends to participants of a specific session.
	ScopeSession AnnouncementScope = "SESSION"

	// ScopeCustom allows specifying a custom list of user IDs.
	ScopeCustom AnnouncementScope = "CUSTOM"
)

// AnnouncementStatus represents the current state of an announcement.
type AnnouncementStatus string

const (
	// AnnouncementDraft is not yet published.
	AnnouncementDraft AnnouncementStatus = "DRAFT"

	// AnnouncementScheduled is set to publish at a future time.
	AnnouncementScheduled AnnouncementStatus = "SCHEDULED"

	// AnnouncementPublished is live and visible to recipients.
	AnnouncementPublished AnnouncementStatus = "PUBLISHED"

	// AnnouncementArchived is no longer active but kept for records.
	AnnouncementArchived AnnouncementStatus = "ARCHIVED"

	// AnnouncementCancelled was cancelled before being published.
	AnnouncementCancelled AnnouncementStatus = "CANCELLED"
)

// Announcement represents a broadcast message to multiple users.
// Announcements support scheduling, scoping, and multi-channel delivery.
type Announcement struct {
	// ID is the unique identifier for this announcement.
	ID uuid.UUID `json:"id"`

	// AuthorID is the user who created this announcement.
	AuthorID uuid.UUID `json:"authorId"`

	// Title is the announcement headline.
	Title string `json:"title"`

	// Content is the full announcement message.
	Content string `json:"content"`

	// HTMLContent is optional rich HTML content for email delivery.
	HTMLContent *string `json:"htmlContent,omitempty"`

	// Scope defines the audience for this announcement.
	Scope AnnouncementScope `json:"scope"`

	// ScopeValue is the identifier for scoped announcements.
	// For ScopeOrganization: organization ID
	// For ScopeRole: role name
	// For ScopeCourse: course ID
	// For ScopeSession: session ID
	ScopeValue *string `json:"scopeValue,omitempty"`

	// TargetUserIDs is used for ScopeCustom to specify exact recipients.
	TargetUserIDs []uuid.UUID `json:"targetUserIds,omitempty"`

	// Channels lists the delivery channels for this announcement.
	Channels []NotificationChannel `json:"channels"`

	// Priority indicates the urgency of this announcement.
	Priority NotificationPriority `json:"priority"`

	// Status is the current state of the announcement.
	Status AnnouncementStatus `json:"status"`

	// ActionURL is an optional link for more information.
	ActionURL *string `json:"actionUrl,omitempty"`

	// ActionLabel is the text for the action button.
	ActionLabel *string `json:"actionLabel,omitempty"`

	// ImageURL is an optional banner image for the announcement.
	ImageURL *string `json:"imageUrl,omitempty"`

	// IsPinned indicates if this announcement should be pinned at top.
	IsPinned bool `json:"isPinned"`

	// RequiresAcknowledgment requires users to confirm they've read it.
	RequiresAcknowledgment bool `json:"requiresAcknowledgment"`

	// Acknowledgments tracks which users have acknowledged.
	Acknowledgments []AnnouncementAcknowledgment `json:"acknowledgments,omitempty"`

	// PublishedAt is when the announcement was published.
	PublishedAt *time.Time `json:"publishedAt,omitempty"`

	// ScheduledAt is when the announcement should be published.
	ScheduledAt *time.Time `json:"scheduledAt,omitempty"`

	// ExpiresAt is when the announcement should no longer be shown.
	ExpiresAt *time.Time `json:"expiresAt,omitempty"`

	// NotificationsSentCount tracks how many notifications were sent.
	NotificationsSentCount int `json:"notificationsSentCount"`

	// NotificationsFailedCount tracks how many notifications failed.
	NotificationsFailedCount int `json:"notificationsFailedCount"`

	// CreatedAt is when this announcement was created.
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt is when this announcement was last modified.
	UpdatedAt time.Time `json:"updatedAt"`

	// DeletedAt is when this announcement was soft deleted.
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

// AnnouncementAcknowledgment records a user's acknowledgment of an announcement.
type AnnouncementAcknowledgment struct {
	// UserID is the user who acknowledged.
	UserID uuid.UUID `json:"userId"`

	// AcknowledgedAt is when they acknowledged.
	AcknowledgedAt time.Time `json:"acknowledgedAt"`
}

// NewAnnouncement creates a new announcement with default values.
func NewAnnouncement(authorID uuid.UUID, title, content string) *Announcement {
	now := time.Now().UTC()
	return &Announcement{
		ID:                       uuid.New(),
		AuthorID:                 authorID,
		Title:                    title,
		Content:                  content,
		Scope:                    ScopeGlobal,
		Channels:                 []NotificationChannel{ChannelInApp},
		Priority:                 PriorityNormal,
		Status:                   AnnouncementDraft,
		IsPinned:                 false,
		RequiresAcknowledgment:   false,
		Acknowledgments:          []AnnouncementAcknowledgment{},
		TargetUserIDs:            []uuid.UUID{},
		NotificationsSentCount:   0,
		NotificationsFailedCount: 0,
		CreatedAt:                now,
		UpdatedAt:                now,
	}
}

// WithScope sets the announcement scope.
func (a *Announcement) WithScope(scope AnnouncementScope, value *string) *Announcement {
	a.Scope = scope
	a.ScopeValue = value
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithTargetUsers sets specific target users for custom scope.
func (a *Announcement) WithTargetUsers(userIDs []uuid.UUID) *Announcement {
	a.Scope = ScopeCustom
	a.TargetUserIDs = userIDs
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithChannels sets the delivery channels.
func (a *Announcement) WithChannels(channels ...NotificationChannel) *Announcement {
	a.Channels = channels
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithPriority sets the announcement priority.
func (a *Announcement) WithPriority(priority NotificationPriority) *Announcement {
	a.Priority = priority
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithAction sets an action button for the announcement.
func (a *Announcement) WithAction(url, label string) *Announcement {
	a.ActionURL = &url
	a.ActionLabel = &label
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithImage sets a banner image for the announcement.
func (a *Announcement) WithImage(imageURL string) *Announcement {
	a.ImageURL = &imageURL
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithHTMLContent sets rich HTML content for emails.
func (a *Announcement) WithHTMLContent(html string) *Announcement {
	a.HTMLContent = &html
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithSchedule schedules the announcement for future publication.
func (a *Announcement) WithSchedule(scheduledAt time.Time) *Announcement {
	a.ScheduledAt = &scheduledAt
	a.Status = AnnouncementScheduled
	a.UpdatedAt = time.Now().UTC()
	return a
}

// WithExpiry sets when the announcement should expire.
func (a *Announcement) WithExpiry(expiresAt time.Time) *Announcement {
	a.ExpiresAt = &expiresAt
	a.UpdatedAt = time.Now().UTC()
	return a
}

// SetPinned pins or unpins the announcement.
func (a *Announcement) SetPinned(pinned bool) *Announcement {
	a.IsPinned = pinned
	a.UpdatedAt = time.Now().UTC()
	return a
}

// RequireAcknowledgment sets whether users must acknowledge the announcement.
func (a *Announcement) RequireAcknowledgment(required bool) *Announcement {
	a.RequiresAcknowledgment = required
	a.UpdatedAt = time.Now().UTC()
	return a
}

// Publish publishes the announcement immediately.
func (a *Announcement) Publish() error {
	if a.Status == AnnouncementPublished {
		return ErrAlreadyPublished
	}
	if a.Status == AnnouncementCancelled {
		return ErrCannotPublishCancelled
	}
	if a.Status == AnnouncementArchived {
		return ErrCannotPublishArchived
	}

	now := time.Now().UTC()
	a.Status = AnnouncementPublished
	a.PublishedAt = &now
	a.UpdatedAt = now
	return nil
}

// Archive archives the announcement.
func (a *Announcement) Archive() {
	now := time.Now().UTC()
	a.Status = AnnouncementArchived
	a.UpdatedAt = now
}

// Cancel cancels the announcement.
func (a *Announcement) Cancel() error {
	if a.Status == AnnouncementPublished {
		return ErrCannotCancelPublished
	}

	now := time.Now().UTC()
	a.Status = AnnouncementCancelled
	a.UpdatedAt = now
	return nil
}

// Acknowledge records a user's acknowledgment.
func (a *Announcement) Acknowledge(userID uuid.UUID) {
	// Check if already acknowledged
	for _, ack := range a.Acknowledgments {
		if ack.UserID == userID {
			return
		}
	}

	a.Acknowledgments = append(a.Acknowledgments, AnnouncementAcknowledgment{
		UserID:         userID,
		AcknowledgedAt: time.Now().UTC(),
	})
	a.UpdatedAt = time.Now().UTC()
}

// HasUserAcknowledged checks if a user has acknowledged the announcement.
func (a *Announcement) HasUserAcknowledged(userID uuid.UUID) bool {
	for _, ack := range a.Acknowledgments {
		if ack.UserID == userID {
			return true
		}
	}
	return false
}

// IncrementSentCount increments the notifications sent counter.
func (a *Announcement) IncrementSentCount() {
	a.NotificationsSentCount++
	a.UpdatedAt = time.Now().UTC()
}

// IncrementFailedCount increments the notifications failed counter.
func (a *Announcement) IncrementFailedCount() {
	a.NotificationsFailedCount++
	a.UpdatedAt = time.Now().UTC()
}

// IsPublished returns true if the announcement is currently published.
func (a *Announcement) IsPublished() bool {
	return a.Status == AnnouncementPublished
}

// IsExpired returns true if the announcement has expired.
func (a *Announcement) IsExpired() bool {
	if a.ExpiresAt == nil {
		return false
	}
	return time.Now().UTC().After(*a.ExpiresAt)
}

// ShouldPublishNow returns true if a scheduled announcement should be published.
func (a *Announcement) ShouldPublishNow() bool {
	if a.Status != AnnouncementScheduled {
		return false
	}
	if a.ScheduledAt == nil {
		return false
	}
	return time.Now().UTC().After(*a.ScheduledAt)
}

// Common announcement errors
var (
	ErrAlreadyPublished       = &AnnouncementError{Message: "announcement is already published"}
	ErrCannotPublishCancelled = &AnnouncementError{Message: "cannot publish a cancelled announcement"}
	ErrCannotPublishArchived  = &AnnouncementError{Message: "cannot publish an archived announcement"}
	ErrCannotCancelPublished  = &AnnouncementError{Message: "cannot cancel a published announcement"}
)

// AnnouncementError represents an announcement-related error.
type AnnouncementError struct {
	Message string
}

func (e *AnnouncementError) Error() string {
	return e.Message
}
