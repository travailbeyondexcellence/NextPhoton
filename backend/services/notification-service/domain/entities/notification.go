// Package entities contains domain entities for the notification service.
// These entities represent the core business objects and contain business logic
// independent of infrastructure concerns.
package entities

import (
	"time"

	"github.com/google/uuid"
)

// NotificationType represents the category of notification.
// Each type has specific handling rules and display characteristics.
type NotificationType string

const (
	// NotificationTypeSystem represents system-generated notifications
	// such as maintenance alerts and service updates.
	NotificationTypeSystem NotificationType = "SYSTEM"

	// NotificationTypeSession represents session-related notifications
	// including booking confirmations and reminders.
	NotificationTypeSession NotificationType = "SESSION"

	// NotificationTypePayment represents payment-related notifications
	// such as receipts, refunds, and payment failures.
	NotificationTypePayment NotificationType = "PAYMENT"

	// NotificationTypeAssignment represents assignment-related notifications
	// including due date reminders and submission confirmations.
	NotificationTypeAssignment NotificationType = "ASSIGNMENT"

	// NotificationTypeProgress represents learning progress notifications
	// such as milestone achievements and progress reports.
	NotificationTypeProgress NotificationType = "PROGRESS"

	// NotificationTypeMessage represents direct messaging notifications
	// between users (educators, learners, guardians).
	NotificationTypeMessage NotificationType = "MESSAGE"

	// NotificationTypeAnnouncement represents broadcast announcements
	// from administrators or educators.
	NotificationTypeAnnouncement NotificationType = "ANNOUNCEMENT"
)

// NotificationChannel represents the delivery channel for a notification.
// Multiple channels can be used simultaneously for the same notification.
type NotificationChannel string

const (
	// ChannelInApp delivers notifications within the application UI.
	// These appear in the notification center and can be real-time via WebSocket.
	ChannelInApp NotificationChannel = "IN_APP"

	// ChannelEmail delivers notifications via email using SendGrid.
	ChannelEmail NotificationChannel = "EMAIL"

	// ChannelPush delivers notifications via push notifications using Firebase.
	ChannelPush NotificationChannel = "PUSH"

	// ChannelSMS delivers notifications via SMS using Twilio.
	ChannelSMS NotificationChannel = "SMS"
)

// NotificationPriority indicates the urgency of a notification.
// Higher priority notifications may bypass certain rate limits and preferences.
type NotificationPriority string

const (
	// PriorityLow for non-urgent informational notifications.
	PriorityLow NotificationPriority = "LOW"

	// PriorityNormal for standard notifications.
	PriorityNormal NotificationPriority = "NORMAL"

	// PriorityHigh for important notifications requiring attention.
	PriorityHigh NotificationPriority = "HIGH"

	// PriorityUrgent for critical notifications that may bypass preferences.
	PriorityUrgent NotificationPriority = "URGENT"
)

// NotificationStatus represents the delivery status of a notification.
type NotificationStatus string

const (
	// StatusPending indicates the notification is queued for delivery.
	StatusPending NotificationStatus = "PENDING"

	// StatusSent indicates the notification was sent successfully.
	StatusSent NotificationStatus = "SENT"

	// StatusDelivered indicates the notification was confirmed delivered.
	StatusDelivered NotificationStatus = "DELIVERED"

	// StatusRead indicates the recipient has viewed the notification.
	StatusRead NotificationStatus = "READ"

	// StatusFailed indicates the notification delivery failed.
	StatusFailed NotificationStatus = "FAILED"

	// StatusCancelled indicates the notification was cancelled before delivery.
	StatusCancelled NotificationStatus = "CANCELLED"
)

// Notification represents a notification to be sent to a user.
// Notifications can be delivered through multiple channels and support
// templating for consistent formatting.
type Notification struct {
	// ID is the unique identifier for this notification.
	ID uuid.UUID `json:"id"`

	// UserID is the recipient user's unique identifier.
	UserID uuid.UUID `json:"userId"`

	// Type categorizes the notification for filtering and display.
	Type NotificationType `json:"type"`

	// Title is the notification headline displayed prominently.
	Title string `json:"title"`

	// Body is the main notification message content.
	Body string `json:"body"`

	// Data contains additional structured data for the notification.
	// This is used for deep linking and contextual information.
	Data map[string]interface{} `json:"data,omitempty"`

	// Priority indicates the urgency of this notification.
	Priority NotificationPriority `json:"priority"`

	// Channels lists all channels this notification should be delivered to.
	Channels []NotificationChannel `json:"channels"`

	// TemplateID references a notification template if one was used.
	TemplateID *uuid.UUID `json:"templateId,omitempty"`

	// TemplateData contains variables for template substitution.
	TemplateData map[string]string `json:"templateData,omitempty"`

	// Status tracks the current delivery status.
	Status NotificationStatus `json:"status"`

	// DeliveryStatuses tracks status per channel for multi-channel notifications.
	DeliveryStatuses map[NotificationChannel]DeliveryStatus `json:"deliveryStatuses,omitempty"`

	// ActionURL is an optional link for the notification action.
	ActionURL *string `json:"actionUrl,omitempty"`

	// ActionLabel is the text for the action button if ActionURL is set.
	ActionLabel *string `json:"actionLabel,omitempty"`

	// ImageURL is an optional image to display with the notification.
	ImageURL *string `json:"imageUrl,omitempty"`

	// GroupKey groups related notifications together in the UI.
	GroupKey *string `json:"groupKey,omitempty"`

	// ExpiresAt is when this notification should no longer be shown.
	ExpiresAt *time.Time `json:"expiresAt,omitempty"`

	// ScheduledAt is when this notification should be sent (for scheduled notifications).
	ScheduledAt *time.Time `json:"scheduledAt,omitempty"`

	// ReadAt records when the user read this notification.
	ReadAt *time.Time `json:"readAt,omitempty"`

	// CreatedAt is when this notification was created.
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt is when this notification was last modified.
	UpdatedAt time.Time `json:"updatedAt"`

	// DeletedAt is when this notification was soft deleted.
	DeletedAt *time.Time `json:"deletedAt,omitempty"`
}

// DeliveryStatus tracks the delivery status for a specific channel.
type DeliveryStatus struct {
	// Channel is the delivery channel.
	Channel NotificationChannel `json:"channel"`

	// Status is the current status for this channel.
	Status NotificationStatus `json:"status"`

	// SentAt records when the notification was sent on this channel.
	SentAt *time.Time `json:"sentAt,omitempty"`

	// DeliveredAt records when delivery was confirmed.
	DeliveredAt *time.Time `json:"deliveredAt,omitempty"`

	// FailedAt records when delivery failed.
	FailedAt *time.Time `json:"failedAt,omitempty"`

	// FailureReason describes why delivery failed.
	FailureReason *string `json:"failureReason,omitempty"`

	// ExternalID is the ID from the external service (e.g., SendGrid message ID).
	ExternalID *string `json:"externalId,omitempty"`
}

// NewNotification creates a new notification with default values.
// The notification is created with PENDING status and timestamps set to now.
func NewNotification(userID uuid.UUID, notifType NotificationType, title, body string) *Notification {
	now := time.Now().UTC()
	return &Notification{
		ID:               uuid.New(),
		UserID:           userID,
		Type:             notifType,
		Title:            title,
		Body:             body,
		Priority:         PriorityNormal,
		Channels:         []NotificationChannel{ChannelInApp},
		Status:           StatusPending,
		DeliveryStatuses: make(map[NotificationChannel]DeliveryStatus),
		Data:             make(map[string]interface{}),
		CreatedAt:        now,
		UpdatedAt:        now,
	}
}

// WithPriority sets the notification priority.
func (n *Notification) WithPriority(priority NotificationPriority) *Notification {
	n.Priority = priority
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithChannels sets the delivery channels for this notification.
func (n *Notification) WithChannels(channels ...NotificationChannel) *Notification {
	n.Channels = channels
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithTemplate sets the template for this notification.
func (n *Notification) WithTemplate(templateID uuid.UUID, data map[string]string) *Notification {
	n.TemplateID = &templateID
	n.TemplateData = data
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithAction sets an action button for the notification.
func (n *Notification) WithAction(url, label string) *Notification {
	n.ActionURL = &url
	n.ActionLabel = &label
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithData adds custom data to the notification.
func (n *Notification) WithData(data map[string]interface{}) *Notification {
	for k, v := range data {
		n.Data[k] = v
	}
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithSchedule schedules the notification for future delivery.
func (n *Notification) WithSchedule(scheduledAt time.Time) *Notification {
	n.ScheduledAt = &scheduledAt
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithExpiry sets when this notification should expire.
func (n *Notification) WithExpiry(expiresAt time.Time) *Notification {
	n.ExpiresAt = &expiresAt
	n.UpdatedAt = time.Now().UTC()
	return n
}

// WithGroup sets the group key for notification grouping.
func (n *Notification) WithGroup(groupKey string) *Notification {
	n.GroupKey = &groupKey
	n.UpdatedAt = time.Now().UTC()
	return n
}

// MarkAsRead marks the notification as read by the user.
func (n *Notification) MarkAsRead() {
	now := time.Now().UTC()
	n.ReadAt = &now
	n.Status = StatusRead
	n.UpdatedAt = now
}

// MarkAsSent updates the status to sent for a specific channel.
func (n *Notification) MarkAsSent(channel NotificationChannel, externalID string) {
	now := time.Now().UTC()
	status := n.DeliveryStatuses[channel]
	status.Channel = channel
	status.Status = StatusSent
	status.SentAt = &now
	if externalID != "" {
		status.ExternalID = &externalID
	}
	n.DeliveryStatuses[channel] = status
	n.UpdatedAt = now

	// Update overall status if all channels are sent
	n.updateOverallStatus()
}

// MarkAsDelivered updates the status to delivered for a specific channel.
func (n *Notification) MarkAsDelivered(channel NotificationChannel) {
	now := time.Now().UTC()
	status := n.DeliveryStatuses[channel]
	status.Status = StatusDelivered
	status.DeliveredAt = &now
	n.DeliveryStatuses[channel] = status
	n.UpdatedAt = now

	n.updateOverallStatus()
}

// MarkAsFailed updates the status to failed for a specific channel.
func (n *Notification) MarkAsFailed(channel NotificationChannel, reason string) {
	now := time.Now().UTC()
	status := n.DeliveryStatuses[channel]
	status.Status = StatusFailed
	status.FailedAt = &now
	status.FailureReason = &reason
	n.DeliveryStatuses[channel] = status
	n.UpdatedAt = now

	n.updateOverallStatus()
}

// updateOverallStatus updates the notification's overall status based on channel statuses.
func (n *Notification) updateOverallStatus() {
	if len(n.DeliveryStatuses) == 0 {
		return
	}

	// Count statuses
	sentCount := 0
	deliveredCount := 0
	failedCount := 0

	for _, status := range n.DeliveryStatuses {
		switch status.Status {
		case StatusSent:
			sentCount++
		case StatusDelivered:
			deliveredCount++
		case StatusFailed:
			failedCount++
		}
	}

	totalChannels := len(n.Channels)

	// Update overall status based on channel statuses
	if deliveredCount > 0 {
		n.Status = StatusDelivered
	} else if sentCount > 0 {
		n.Status = StatusSent
	} else if failedCount == totalChannels {
		n.Status = StatusFailed
	}
}

// IsRead returns true if the notification has been read.
func (n *Notification) IsRead() bool {
	return n.ReadAt != nil
}

// IsExpired returns true if the notification has expired.
func (n *Notification) IsExpired() bool {
	if n.ExpiresAt == nil {
		return false
	}
	return time.Now().UTC().After(*n.ExpiresAt)
}

// IsScheduled returns true if this notification is scheduled for future delivery.
func (n *Notification) IsScheduled() bool {
	if n.ScheduledAt == nil {
		return false
	}
	return time.Now().UTC().Before(*n.ScheduledAt)
}

// ShouldSendNow returns true if this notification should be sent immediately.
func (n *Notification) ShouldSendNow() bool {
	if n.Status != StatusPending {
		return false
	}
	if n.IsExpired() {
		return false
	}
	if n.ScheduledAt != nil && time.Now().UTC().Before(*n.ScheduledAt) {
		return false
	}
	return true
}

// NotificationTemplate represents a reusable notification template.
// Templates support variable substitution and channel-specific content.
type NotificationTemplate struct {
	// ID is the unique identifier for this template.
	ID uuid.UUID `json:"id"`

	// Name is a human-readable name for the template.
	Name string `json:"name"`

	// Description explains when this template should be used.
	Description string `json:"description"`

	// Type is the notification type this template is for.
	Type NotificationType `json:"type"`

	// Subject is the email subject line (for email channel).
	Subject string `json:"subject"`

	// TitleTemplate is the template for the notification title.
	// Supports {{variable}} syntax for substitution.
	TitleTemplate string `json:"titleTemplate"`

	// BodyTemplate is the template for the notification body.
	// Supports {{variable}} syntax for substitution.
	BodyTemplate string `json:"bodyTemplate"`

	// HTMLTemplate is the HTML template for email content.
	HTMLTemplate string `json:"htmlTemplate,omitempty"`

	// Variables lists the expected template variables.
	Variables []string `json:"variables"`

	// DefaultPriority is the default priority for notifications using this template.
	DefaultPriority NotificationPriority `json:"defaultPriority"`

	// DefaultChannels are the default delivery channels.
	DefaultChannels []NotificationChannel `json:"defaultChannels"`

	// IsActive indicates if this template is currently in use.
	IsActive bool `json:"isActive"`

	// CreatedAt is when this template was created.
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt is when this template was last modified.
	UpdatedAt time.Time `json:"updatedAt"`
}

// NewNotificationTemplate creates a new template with default values.
func NewNotificationTemplate(name string, notifType NotificationType) *NotificationTemplate {
	now := time.Now().UTC()
	return &NotificationTemplate{
		ID:              uuid.New(),
		Name:            name,
		Type:            notifType,
		DefaultPriority: PriorityNormal,
		DefaultChannels: []NotificationChannel{ChannelInApp},
		Variables:       []string{},
		IsActive:        true,
		CreatedAt:       now,
		UpdatedAt:       now,
	}
}
