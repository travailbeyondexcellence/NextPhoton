// Package entities defines the core domain models for the Analytics Service.
// These entities represent the fundamental concepts in our analytics domain
// and are independent of any persistence or transport concerns.
package entities

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

// EventCategory represents the high-level category of an analytics event.
// Categories help organize events for filtering and reporting purposes.
type EventCategory string

const (
	// CategoryAuth represents authentication-related events (login, logout, signup)
	CategoryAuth EventCategory = "auth"
	// CategorySession represents learning session events (booked, started, completed)
	CategorySession EventCategory = "session"
	// CategoryAssignment represents assignment-related events (submitted, graded)
	CategoryAssignment EventCategory = "assignment"
	// CategoryPayment represents payment events (initiated, completed, failed)
	CategoryPayment EventCategory = "payment"
	// CategoryEngagement represents user engagement events (page views, clicks)
	CategoryEngagement EventCategory = "engagement"
	// CategorySystem represents system events (errors, performance)
	CategorySystem EventCategory = "system"
	// CategoryECM represents EduCare Manager events (interventions, progress updates)
	CategoryECM EventCategory = "ecm"
)

// EventType represents specific types of analytics events.
// Each event type belongs to a category and has a defined set of expected properties.
type EventType string

// Authentication event types
const (
	EventUserSignedUp   EventType = "user_signed_up"
	EventUserLoggedIn   EventType = "user_logged_in"
	EventUserLoggedOut  EventType = "user_logged_out"
	EventPasswordReset  EventType = "password_reset"
	EventEmailVerified  EventType = "email_verified"
)

// Session event types
const (
	EventSessionBooked     EventType = "session_booked"
	EventSessionStarted    EventType = "session_started"
	EventSessionCompleted  EventType = "session_completed"
	EventSessionCancelled  EventType = "session_cancelled"
	EventSessionRated      EventType = "session_rated"
	EventSessionNoShow     EventType = "session_no_show"
)

// Assignment event types
const (
	EventAssignmentCreated   EventType = "assignment_created"
	EventAssignmentSubmitted EventType = "assignment_submitted"
	EventAssignmentGraded    EventType = "assignment_graded"
	EventAssignmentLate      EventType = "assignment_late"
)

// Payment event types
const (
	EventPaymentInitiated EventType = "payment_initiated"
	EventPaymentCompleted EventType = "payment_completed"
	EventPaymentFailed    EventType = "payment_failed"
	EventRefundProcessed  EventType = "refund_processed"
	EventSubscriptionStarted EventType = "subscription_started"
	EventSubscriptionCancelled EventType = "subscription_cancelled"
)

// Engagement event types
const (
	EventPageView       EventType = "page_view"
	EventFeatureUsed    EventType = "feature_used"
	EventButtonClicked  EventType = "button_clicked"
	EventSearchPerformed EventType = "search_performed"
)

// ECM event types
const (
	EventECMInterventionCreated  EventType = "ecm_intervention_created"
	EventECMProgressUpdated      EventType = "ecm_progress_updated"
	EventECMLearnerAssigned      EventType = "ecm_learner_assigned"
	EventECMReportGenerated      EventType = "ecm_report_generated"
)

// Event represents a single analytics event captured from user actions or system processes.
// Events are the fundamental unit of analytics data and are stored in ClickHouse for analysis.
type Event struct {
	// ID is the unique identifier for this event
	ID uuid.UUID `json:"id"`

	// UserID is the ID of the user who triggered the event (may be empty for system events)
	UserID string `json:"user_id,omitempty"`

	// SessionID is the browser/app session ID for grouping related events
	SessionID string `json:"session_id,omitempty"`

	// Category is the high-level category of the event
	Category EventCategory `json:"category"`

	// Type is the specific type of event
	Type EventType `json:"event_type"`

	// Properties contains event-specific data as key-value pairs
	Properties map[string]interface{} `json:"properties"`

	// Timestamp is when the event occurred
	Timestamp time.Time `json:"timestamp"`

	// ReceivedAt is when the event was received by the analytics service
	ReceivedAt time.Time `json:"received_at"`

	// Source indicates where the event originated (web, mobile, api, system)
	Source string `json:"source"`

	// Version is the event schema version for handling schema evolution
	Version string `json:"version"`

	// UserAgent contains browser/client information
	UserAgent string `json:"user_agent,omitempty"`

	// IPAddress is the client IP (may be anonymized based on privacy settings)
	IPAddress string `json:"ip_address,omitempty"`

	// GeoLocation contains derived geographic information
	GeoLocation *GeoLocation `json:"geo_location,omitempty"`

	// DeviceInfo contains device-specific information
	DeviceInfo *DeviceInfo `json:"device_info,omitempty"`

	// Context provides additional contextual information
	Context map[string]interface{} `json:"context,omitempty"`
}

// GeoLocation represents geographic information derived from IP address.
type GeoLocation struct {
	Country     string  `json:"country,omitempty"`
	CountryCode string  `json:"country_code,omitempty"`
	Region      string  `json:"region,omitempty"`
	City        string  `json:"city,omitempty"`
	Latitude    float64 `json:"latitude,omitempty"`
	Longitude   float64 `json:"longitude,omitempty"`
	Timezone    string  `json:"timezone,omitempty"`
}

// DeviceInfo contains information about the user's device.
type DeviceInfo struct {
	Type       string `json:"type,omitempty"`       // desktop, mobile, tablet
	OS         string `json:"os,omitempty"`         // Windows, macOS, iOS, Android
	OSVersion  string `json:"os_version,omitempty"` // OS version
	Browser    string `json:"browser,omitempty"`    // Chrome, Firefox, Safari
	BrowserVersion string `json:"browser_version,omitempty"`
	ScreenWidth  int  `json:"screen_width,omitempty"`
	ScreenHeight int  `json:"screen_height,omitempty"`
}

// NewEvent creates a new Event with a generated ID and current timestamps.
func NewEvent(userID string, category EventCategory, eventType EventType, properties map[string]interface{}) *Event {
	now := time.Now().UTC()
	return &Event{
		ID:         uuid.New(),
		UserID:     userID,
		Category:   category,
		Type:       eventType,
		Properties: properties,
		Timestamp:  now,
		ReceivedAt: now,
		Version:    "1.0",
		Source:     "api",
	}
}

// WithSessionID sets the session ID and returns the event for chaining.
func (e *Event) WithSessionID(sessionID string) *Event {
	e.SessionID = sessionID
	return e
}

// WithSource sets the source and returns the event for chaining.
func (e *Event) WithSource(source string) *Event {
	e.Source = source
	return e
}

// WithUserAgent sets the user agent and returns the event for chaining.
func (e *Event) WithUserAgent(userAgent string) *Event {
	e.UserAgent = userAgent
	return e
}

// WithContext sets the context and returns the event for chaining.
func (e *Event) WithContext(context map[string]interface{}) *Event {
	e.Context = context
	return e
}

// GetProperty retrieves a property value by key, returning nil if not found.
func (e *Event) GetProperty(key string) interface{} {
	if e.Properties == nil {
		return nil
	}
	return e.Properties[key]
}

// GetPropertyString retrieves a property value as a string, returning empty if not found or wrong type.
func (e *Event) GetPropertyString(key string) string {
	val := e.GetProperty(key)
	if str, ok := val.(string); ok {
		return str
	}
	return ""
}

// GetPropertyInt retrieves a property value as an int, returning 0 if not found or wrong type.
func (e *Event) GetPropertyInt(key string) int {
	val := e.GetProperty(key)
	switch v := val.(type) {
	case int:
		return v
	case int64:
		return int(v)
	case float64:
		return int(v)
	default:
		return 0
	}
}

// GetPropertyFloat retrieves a property value as a float64, returning 0 if not found or wrong type.
func (e *Event) GetPropertyFloat(key string) float64 {
	val := e.GetProperty(key)
	switch v := val.(type) {
	case float64:
		return v
	case int:
		return float64(v)
	case int64:
		return float64(v)
	default:
		return 0
	}
}

// ToJSON serializes the event to JSON bytes.
func (e *Event) ToJSON() ([]byte, error) {
	return json.Marshal(e)
}

// EventFromJSON deserializes an event from JSON bytes.
func EventFromJSON(data []byte) (*Event, error) {
	var event Event
	if err := json.Unmarshal(data, &event); err != nil {
		return nil, err
	}
	return &event, nil
}

// EventBatch represents a collection of events for batch processing.
type EventBatch struct {
	Events    []*Event  `json:"events"`
	BatchID   uuid.UUID `json:"batch_id"`
	CreatedAt time.Time `json:"created_at"`
	Size      int       `json:"size"`
}

// NewEventBatch creates a new batch with the given events.
func NewEventBatch(events []*Event) *EventBatch {
	return &EventBatch{
		Events:    events,
		BatchID:   uuid.New(),
		CreatedAt: time.Now().UTC(),
		Size:      len(events),
	}
}
