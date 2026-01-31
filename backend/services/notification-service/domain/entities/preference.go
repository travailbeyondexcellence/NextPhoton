// Package entities contains domain entities for the notification service.
package entities

import (
	"time"

	"github.com/google/uuid"
)

// NotificationPreference represents a user's notification preferences.
// Preferences control which channels receive which types of notifications.
type NotificationPreference struct {
	// ID is the unique identifier for this preference record.
	ID uuid.UUID `json:"id"`

	// UserID is the user these preferences belong to.
	UserID uuid.UUID `json:"userId"`

	// GlobalEnabled controls whether the user receives any notifications.
	// When false, all notifications are suppressed except urgent system ones.
	GlobalEnabled bool `json:"globalEnabled"`

	// ChannelPreferences maps each channel to its enabled state.
	ChannelPreferences map[NotificationChannel]bool `json:"channelPreferences"`

	// TypePreferences maps notification types to channel preferences.
	// This allows fine-grained control like "email for payments, push for sessions".
	TypePreferences map[NotificationType]TypeChannelPreference `json:"typePreferences"`

	// QuietHours defines when notifications should be suppressed.
	QuietHours *QuietHoursConfig `json:"quietHours,omitempty"`

	// DigestPreferences controls how notifications are bundled.
	DigestPreferences *DigestConfig `json:"digestPreferences,omitempty"`

	// EmailAddress is the email for notification delivery.
	// Overrides the user's primary email if set.
	EmailAddress *string `json:"emailAddress,omitempty"`

	// PhoneNumber is the phone number for SMS delivery.
	PhoneNumber *string `json:"phoneNumber,omitempty"`

	// PushTokens stores device tokens for push notifications.
	PushTokens []PushToken `json:"pushTokens,omitempty"`

	// Language is the preferred language for notification content.
	Language string `json:"language"`

	// Timezone is used for scheduling and quiet hours.
	Timezone string `json:"timezone"`

	// CreatedAt is when these preferences were created.
	CreatedAt time.Time `json:"createdAt"`

	// UpdatedAt is when these preferences were last modified.
	UpdatedAt time.Time `json:"updatedAt"`
}

// TypeChannelPreference defines channel preferences for a notification type.
type TypeChannelPreference struct {
	// Enabled controls whether this notification type is received at all.
	Enabled bool `json:"enabled"`

	// Channels lists which channels receive this notification type.
	Channels []NotificationChannel `json:"channels"`
}

// QuietHoursConfig defines when notifications should be suppressed.
type QuietHoursConfig struct {
	// Enabled controls whether quiet hours are active.
	Enabled bool `json:"enabled"`

	// StartTime is when quiet hours begin (e.g., "22:00").
	StartTime string `json:"startTime"`

	// EndTime is when quiet hours end (e.g., "07:00").
	EndTime string `json:"endTime"`

	// Days lists which days quiet hours apply (0=Sunday, 6=Saturday).
	Days []int `json:"days"`

	// AllowUrgent allows urgent notifications during quiet hours.
	AllowUrgent bool `json:"allowUrgent"`
}

// DigestConfig controls notification digesting/bundling.
type DigestConfig struct {
	// Enabled controls whether digesting is active.
	Enabled bool `json:"enabled"`

	// Frequency is how often digests are sent.
	Frequency DigestFrequency `json:"frequency"`

	// PreferredTime is when to send the digest (e.g., "09:00").
	PreferredTime string `json:"preferredTime"`

	// IncludeTypes lists which notification types to include in digests.
	IncludeTypes []NotificationType `json:"includeTypes"`
}

// DigestFrequency defines how often digests are sent.
type DigestFrequency string

const (
	// DigestDaily sends a daily digest.
	DigestDaily DigestFrequency = "DAILY"

	// DigestWeekly sends a weekly digest.
	DigestWeekly DigestFrequency = "WEEKLY"

	// DigestNone disables digesting.
	DigestNone DigestFrequency = "NONE"
)

// PushToken represents a device token for push notifications.
type PushToken struct {
	// Token is the device-specific push token.
	Token string `json:"token"`

	// Platform identifies the device platform.
	Platform PushPlatform `json:"platform"`

	// DeviceName is a human-readable device identifier.
	DeviceName string `json:"deviceName"`

	// LastUsed is when this token was last used successfully.
	LastUsed time.Time `json:"lastUsed"`

	// CreatedAt is when this token was registered.
	CreatedAt time.Time `json:"createdAt"`
}

// PushPlatform identifies the push notification platform.
type PushPlatform string

const (
	// PlatformIOS for Apple iOS devices.
	PlatformIOS PushPlatform = "IOS"

	// PlatformAndroid for Android devices.
	PlatformAndroid PushPlatform = "ANDROID"

	// PlatformWeb for web browsers.
	PlatformWeb PushPlatform = "WEB"

	// PlatformDesktop for desktop applications.
	PlatformDesktop PushPlatform = "DESKTOP"
)

// NewNotificationPreference creates default preferences for a user.
func NewNotificationPreference(userID uuid.UUID) *NotificationPreference {
	now := time.Now().UTC()
	return &NotificationPreference{
		ID:            uuid.New(),
		UserID:        userID,
		GlobalEnabled: true,
		ChannelPreferences: map[NotificationChannel]bool{
			ChannelInApp: true,
			ChannelEmail: true,
			ChannelPush:  true,
			ChannelSMS:   false, // SMS disabled by default (cost consideration)
		},
		TypePreferences: defaultTypePreferences(),
		PushTokens:      []PushToken{},
		Language:        "en",
		Timezone:        "UTC",
		CreatedAt:       now,
		UpdatedAt:       now,
	}
}

// defaultTypePreferences returns sensible default type preferences.
func defaultTypePreferences() map[NotificationType]TypeChannelPreference {
	return map[NotificationType]TypeChannelPreference{
		NotificationTypeSystem: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelEmail},
		},
		NotificationTypeSession: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelEmail, ChannelPush},
		},
		NotificationTypePayment: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelEmail},
		},
		NotificationTypeAssignment: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelPush},
		},
		NotificationTypeProgress: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp},
		},
		NotificationTypeMessage: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelPush},
		},
		NotificationTypeAnnouncement: {
			Enabled:  true,
			Channels: []NotificationChannel{ChannelInApp, ChannelEmail},
		},
	}
}

// SetChannelEnabled enables or disables a notification channel.
func (p *NotificationPreference) SetChannelEnabled(channel NotificationChannel, enabled bool) {
	p.ChannelPreferences[channel] = enabled
	p.UpdatedAt = time.Now().UTC()
}

// SetTypePreference sets the preference for a notification type.
func (p *NotificationPreference) SetTypePreference(notifType NotificationType, pref TypeChannelPreference) {
	p.TypePreferences[notifType] = pref
	p.UpdatedAt = time.Now().UTC()
}

// SetQuietHours configures quiet hours.
func (p *NotificationPreference) SetQuietHours(config *QuietHoursConfig) {
	p.QuietHours = config
	p.UpdatedAt = time.Now().UTC()
}

// SetDigestPreferences configures notification digesting.
func (p *NotificationPreference) SetDigestPreferences(config *DigestConfig) {
	p.DigestPreferences = config
	p.UpdatedAt = time.Now().UTC()
}

// AddPushToken registers a new push token.
func (p *NotificationPreference) AddPushToken(token string, platform PushPlatform, deviceName string) {
	// Remove existing token if present (to update)
	p.RemovePushToken(token)

	now := time.Now().UTC()
	p.PushTokens = append(p.PushTokens, PushToken{
		Token:      token,
		Platform:   platform,
		DeviceName: deviceName,
		LastUsed:   now,
		CreatedAt:  now,
	})
	p.UpdatedAt = now
}

// RemovePushToken removes a push token.
func (p *NotificationPreference) RemovePushToken(token string) {
	for i, pt := range p.PushTokens {
		if pt.Token == token {
			p.PushTokens = append(p.PushTokens[:i], p.PushTokens[i+1:]...)
			p.UpdatedAt = time.Now().UTC()
			return
		}
	}
}

// UpdatePushTokenLastUsed updates the last used timestamp for a token.
func (p *NotificationPreference) UpdatePushTokenLastUsed(token string) {
	for i, pt := range p.PushTokens {
		if pt.Token == token {
			p.PushTokens[i].LastUsed = time.Now().UTC()
			p.UpdatedAt = time.Now().UTC()
			return
		}
	}
}

// GetActiveChannelsForType returns the active channels for a notification type.
// This considers global settings, channel settings, and type settings.
func (p *NotificationPreference) GetActiveChannelsForType(notifType NotificationType, priority NotificationPriority) []NotificationChannel {
	// If globally disabled, only allow urgent system notifications
	if !p.GlobalEnabled {
		if priority == PriorityUrgent && notifType == NotificationTypeSystem {
			return []NotificationChannel{ChannelInApp}
		}
		return []NotificationChannel{}
	}

	// Get type preference
	typePref, exists := p.TypePreferences[notifType]
	if !exists || !typePref.Enabled {
		// If type preference doesn't exist, use default behavior
		if !exists {
			return []NotificationChannel{ChannelInApp}
		}
		return []NotificationChannel{}
	}

	// Filter by enabled channels
	var activeChannels []NotificationChannel
	for _, channel := range typePref.Channels {
		if enabled, ok := p.ChannelPreferences[channel]; ok && enabled {
			activeChannels = append(activeChannels, channel)
		}
	}

	return activeChannels
}

// IsInQuietHours checks if the current time is within quiet hours.
func (p *NotificationPreference) IsInQuietHours() bool {
	if p.QuietHours == nil || !p.QuietHours.Enabled {
		return false
	}

	// Get current time in user's timezone
	loc, err := time.LoadLocation(p.Timezone)
	if err != nil {
		loc = time.UTC
	}
	now := time.Now().In(loc)

	// Check if today is a quiet hours day
	dayApplies := false
	currentDay := int(now.Weekday())
	for _, day := range p.QuietHours.Days {
		if day == currentDay {
			dayApplies = true
			break
		}
	}
	if !dayApplies {
		return false
	}

	// Parse start and end times
	startTime, err := time.Parse("15:04", p.QuietHours.StartTime)
	if err != nil {
		return false
	}
	endTime, err := time.Parse("15:04", p.QuietHours.EndTime)
	if err != nil {
		return false
	}

	// Create times for today
	currentMinutes := now.Hour()*60 + now.Minute()
	startMinutes := startTime.Hour()*60 + startTime.Minute()
	endMinutes := endTime.Hour()*60 + endTime.Minute()

	// Handle overnight quiet hours (e.g., 22:00 to 07:00)
	if startMinutes > endMinutes {
		// Quiet hours span midnight
		return currentMinutes >= startMinutes || currentMinutes < endMinutes
	}

	// Normal quiet hours
	return currentMinutes >= startMinutes && currentMinutes < endMinutes
}

// ShouldDeliverNow checks if a notification should be delivered immediately.
// Returns false if in quiet hours (unless urgent), or if should be digested.
func (p *NotificationPreference) ShouldDeliverNow(notifType NotificationType, priority NotificationPriority) bool {
	// Urgent notifications always deliver
	if priority == PriorityUrgent {
		return true
	}

	// Check quiet hours
	if p.IsInQuietHours() {
		if p.QuietHours.AllowUrgent && priority == PriorityHigh {
			return true
		}
		return false
	}

	// Check digest preferences
	if p.DigestPreferences != nil && p.DigestPreferences.Enabled {
		for _, digestType := range p.DigestPreferences.IncludeTypes {
			if digestType == notifType {
				return false // Should be digested
			}
		}
	}

	return true
}

// GetPushTokensForPlatform returns push tokens for a specific platform.
func (p *NotificationPreference) GetPushTokensForPlatform(platform PushPlatform) []string {
	var tokens []string
	for _, pt := range p.PushTokens {
		if pt.Platform == platform {
			tokens = append(tokens, pt.Token)
		}
	}
	return tokens
}

// GetAllPushTokens returns all push tokens.
func (p *NotificationPreference) GetAllPushTokens() []string {
	tokens := make([]string, len(p.PushTokens))
	for i, pt := range p.PushTokens {
		tokens[i] = pt.Token
	}
	return tokens
}

// HasEmail returns true if email delivery is possible.
func (p *NotificationPreference) HasEmail() bool {
	return p.EmailAddress != nil && *p.EmailAddress != ""
}

// HasPhone returns true if SMS delivery is possible.
func (p *NotificationPreference) HasPhone() bool {
	return p.PhoneNumber != nil && *p.PhoneNumber != ""
}

// HasPushTokens returns true if push notifications are possible.
func (p *NotificationPreference) HasPushTokens() bool {
	return len(p.PushTokens) > 0
}
