// domain/entities.rs - Core Business Entities
// =============================================================================
// This file defines all the core business entities used throughout the
// NextPhoton desktop application. These entities represent the fundamental
// data structures in the education management domain.
//
// All entities are serializable for:
// - Database persistence (SQLite via SQLx)
// - IPC communication with frontend (via Tauri)
// - API communication (GraphQL/REST)
// =============================================================================

use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// =============================================================================
// USER ENTITIES
// =============================================================================

/// User role enumeration matching the NextPhoton ABAC system
/// Defines the six core roles in the platform
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum UserRole {
    /// Student/Learner role - Primary users of educational content
    Learner,
    /// Parent/Guardian role - Oversees learner progress
    Guardian,
    /// Teacher/Educator role - Creates and delivers content
    Educator,
    /// EduCare Manager role - Administrative and care management
    #[serde(rename = "ECM")]
    Ecm,
    /// Employee role - Staff members
    Employee,
    /// Intern role - Training staff
    Intern,
    /// Administrator role - Full system access
    Admin,
}

impl std::fmt::Display for UserRole {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            UserRole::Learner => write!(f, "learner"),
            UserRole::Guardian => write!(f, "guardian"),
            UserRole::Educator => write!(f, "educator"),
            UserRole::Ecm => write!(f, "ecm"),
            UserRole::Employee => write!(f, "employee"),
            UserRole::Intern => write!(f, "intern"),
            UserRole::Admin => write!(f, "admin"),
        }
    }
}

/// User entity representing an authenticated user in the system
/// Contains all user profile information and authentication state
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    /// Unique identifier (UUID)
    pub id: String,
    /// User's email address (used for authentication)
    pub email: String,
    /// User's display name
    pub name: String,
    /// User's first name
    pub first_name: Option<String>,
    /// User's last name
    pub last_name: Option<String>,
    /// User's role in the system
    pub role: UserRole,
    /// URL to user's avatar image
    pub avatar_url: Option<String>,
    /// User's phone number
    pub phone: Option<String>,
    /// Whether the user's email is verified
    pub email_verified: bool,
    /// Account creation timestamp
    pub created_at: DateTime<Utc>,
    /// Last update timestamp
    pub updated_at: DateTime<Utc>,
    /// Last login timestamp
    pub last_login_at: Option<DateTime<Utc>>,
}

impl User {
    /// Creates a new User with default values
    pub fn new(id: String, email: String, name: String, role: UserRole) -> Self {
        let now = Utc::now();
        Self {
            id,
            email,
            name,
            first_name: None,
            last_name: None,
            role,
            avatar_url: None,
            phone: None,
            email_verified: false,
            created_at: now,
            updated_at: now,
            last_login_at: None,
        }
    }
}

// =============================================================================
// SESSION ENTITIES
// =============================================================================

/// Session status enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum SessionStatus {
    /// Session is scheduled but not started
    Scheduled,
    /// Session is currently in progress
    InProgress,
    /// Session has been completed
    Completed,
    /// Session was cancelled
    Cancelled,
    /// Session was rescheduled
    Rescheduled,
}

/// Session type enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum SessionType {
    /// One-on-one tutoring session
    OneOnOne,
    /// Group session with multiple learners
    Group,
    /// Workshop or seminar
    Workshop,
    /// Assessment or examination
    Assessment,
    /// Practice or revision session
    Practice,
}

/// Session entity representing a tutoring/class session
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    /// Unique session identifier
    pub id: String,
    /// Session title/name
    pub title: String,
    /// Detailed description
    pub description: Option<String>,
    /// Subject/topic of the session
    pub subject: String,
    /// Educator conducting the session
    pub educator_id: String,
    /// Educator's name (denormalized for display)
    pub educator_name: Option<String>,
    /// Session type
    pub session_type: SessionType,
    /// Current status
    pub status: SessionStatus,
    /// Scheduled start time
    pub start_time: DateTime<Utc>,
    /// Scheduled end time
    pub end_time: DateTime<Utc>,
    /// Duration in minutes
    pub duration_minutes: i32,
    /// Maximum number of participants
    pub max_participants: Option<i32>,
    /// Current number of enrolled participants
    pub enrolled_count: i32,
    /// Meeting link (for online sessions)
    pub meeting_link: Option<String>,
    /// Physical location (for in-person sessions)
    pub location: Option<String>,
    /// Session notes
    pub notes: Option<String>,
    /// Creation timestamp
    pub created_at: DateTime<Utc>,
    /// Last update timestamp
    pub updated_at: DateTime<Utc>,
}

impl Session {
    /// Creates a new Session with required fields
    pub fn new(
        title: String,
        subject: String,
        educator_id: String,
        session_type: SessionType,
        start_time: DateTime<Utc>,
        end_time: DateTime<Utc>,
    ) -> Self {
        let duration = (end_time - start_time).num_minutes() as i32;
        let now = Utc::now();
        Self {
            id: Uuid::new_v4().to_string(),
            title,
            description: None,
            subject,
            educator_id,
            educator_name: None,
            session_type,
            status: SessionStatus::Scheduled,
            start_time,
            end_time,
            duration_minutes: duration,
            max_participants: None,
            enrolled_count: 0,
            meeting_link: None,
            location: None,
            notes: None,
            created_at: now,
            updated_at: now,
        }
    }
}

/// Session booking/enrollment record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SessionBooking {
    /// Unique booking identifier
    pub id: String,
    /// Reference to the session
    pub session_id: String,
    /// Learner who booked the session
    pub learner_id: String,
    /// Guardian who approved (if applicable)
    pub guardian_id: Option<String>,
    /// Booking status
    pub status: BookingStatus,
    /// Booking timestamp
    pub booked_at: DateTime<Utc>,
    /// Cancellation timestamp (if cancelled)
    pub cancelled_at: Option<DateTime<Utc>>,
    /// Attendance status
    pub attended: Option<bool>,
    /// Additional notes
    pub notes: Option<String>,
}

/// Booking status enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum BookingStatus {
    /// Booking is pending approval
    Pending,
    /// Booking is confirmed
    Confirmed,
    /// Booking was cancelled
    Cancelled,
    /// Learner attended the session
    Attended,
    /// Learner did not attend (no-show)
    NoShow,
}

// =============================================================================
// ASSIGNMENT ENTITIES
// =============================================================================

/// Assignment status enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum AssignmentStatus {
    /// Assignment is not yet started
    NotStarted,
    /// Assignment is in progress
    InProgress,
    /// Assignment has been submitted
    Submitted,
    /// Assignment is being graded
    Grading,
    /// Assignment has been graded
    Graded,
    /// Assignment is overdue
    Overdue,
}

/// Assignment entity for homework and tasks
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Assignment {
    /// Unique assignment identifier
    pub id: String,
    /// Assignment title
    pub title: String,
    /// Assignment description/instructions
    pub description: Option<String>,
    /// Subject area
    pub subject: String,
    /// Educator who created the assignment
    pub educator_id: String,
    /// Assigned learner (for individual assignments)
    pub learner_id: Option<String>,
    /// Due date
    pub due_date: DateTime<Utc>,
    /// Maximum score possible
    pub max_score: Option<f64>,
    /// Actual score received
    pub score: Option<f64>,
    /// Current status
    pub status: AssignmentStatus,
    /// Submission timestamp
    pub submitted_at: Option<DateTime<Utc>>,
    /// Feedback from educator
    pub feedback: Option<String>,
    /// File attachments (JSON array of URLs)
    pub attachments: Option<String>,
    /// Creation timestamp
    pub created_at: DateTime<Utc>,
    /// Last update timestamp
    pub updated_at: DateTime<Utc>,
}

// =============================================================================
// NOTIFICATION ENTITIES
// =============================================================================

/// Notification type enumeration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "TEXT")]
#[sqlx(rename_all = "lowercase")]
pub enum NotificationType {
    /// Session-related notification
    Session,
    /// Assignment notification
    Assignment,
    /// Message notification
    Message,
    /// System announcement
    Announcement,
    /// Reminder
    Reminder,
    /// Alert (urgent)
    Alert,
}

/// Notification entity for user notifications
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    /// Unique notification identifier
    pub id: String,
    /// Recipient user ID
    pub user_id: String,
    /// Notification type
    pub notification_type: NotificationType,
    /// Notification title
    pub title: String,
    /// Notification message body
    pub message: String,
    /// Whether the notification has been read
    pub is_read: bool,
    /// Action URL (for clickable notifications)
    pub action_url: Option<String>,
    /// Related entity ID
    pub related_id: Option<String>,
    /// Creation timestamp
    pub created_at: DateTime<Utc>,
    /// Read timestamp
    pub read_at: Option<DateTime<Utc>>,
}

// =============================================================================
// SYNC ENTITIES
// =============================================================================

/// Sync status for offline-first functionality
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncStatus {
    /// Last successful sync timestamp
    pub last_sync: Option<DateTime<Utc>>,
    /// Number of pending changes to upload
    pub pending_changes: usize,
    /// Whether sync is currently in progress
    pub is_syncing: bool,
    /// Last sync error message (if any)
    pub last_error: Option<String>,
}

/// Sync conflict record
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncConflict {
    /// Entity type that has conflict
    pub entity_type: String,
    /// Entity ID
    pub entity_id: String,
    /// Local version timestamp
    pub local_version: DateTime<Utc>,
    /// Remote version timestamp
    pub remote_version: DateTime<Utc>,
    /// Resolution strategy applied
    pub resolution: Option<String>,
}

/// Result of a sync operation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SyncResult {
    /// Number of items synced
    pub synced_items: usize,
    /// Number of items uploaded
    pub uploaded_items: usize,
    /// Number of items downloaded
    pub downloaded_items: usize,
    /// List of conflicts encountered
    pub conflicts: Vec<SyncConflict>,
    /// Sync completion timestamp
    pub completed_at: DateTime<Utc>,
}

// =============================================================================
// AUTHENTICATION ENTITIES
// =============================================================================

/// Authentication credentials for login
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginCredentials {
    /// User's email address
    pub email: String,
    /// User's password (plain text, will be hashed server-side)
    pub password: String,
    /// Whether to remember the login
    pub remember_me: bool,
}

/// Login response containing user and tokens
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LoginResponse {
    /// Authenticated user information
    pub user: User,
    /// JWT access token
    pub access_token: String,
    /// JWT refresh token
    pub refresh_token: String,
    /// Token expiration time (Unix timestamp)
    pub expires_at: i64,
}

/// Registration request data
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct RegisterRequest {
    /// User's email address
    pub email: String,
    /// User's password
    pub password: String,
    /// User's display name
    pub name: String,
    /// User's first name
    pub first_name: Option<String>,
    /// User's last name
    pub last_name: Option<String>,
    /// Requested role
    pub role: UserRole,
    /// Phone number
    pub phone: Option<String>,
}

// =============================================================================
// APPLICATION INFO
// =============================================================================

/// Application information for display and updates
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppInfo {
    /// Application name
    pub name: String,
    /// Application version
    pub version: String,
    /// Build timestamp
    pub build_date: String,
    /// Target platform
    pub platform: String,
    /// Architecture
    pub arch: String,
}

/// System information for diagnostics
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SystemInfo {
    /// Operating system name
    pub os_name: String,
    /// OS version
    pub os_version: String,
    /// Total system memory (bytes)
    pub total_memory: u64,
    /// Available system memory (bytes)
    pub available_memory: u64,
    /// Application data directory path
    pub app_data_dir: String,
}

// =============================================================================
// UNIT TESTS
// =============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_user_creation() {
        let user = User::new(
            "test-uuid".to_string(),
            "test@example.com".to_string(),
            "Test User".to_string(),
            UserRole::Learner,
        );

        assert_eq!(user.email, "test@example.com");
        assert_eq!(user.role, UserRole::Learner);
        assert!(!user.email_verified);
    }

    #[test]
    fn test_user_role_display() {
        assert_eq!(format!("{}", UserRole::Learner), "learner");
        assert_eq!(format!("{}", UserRole::Guardian), "guardian");
        assert_eq!(format!("{}", UserRole::Educator), "educator");
        assert_eq!(format!("{}", UserRole::Ecm), "ecm");
        assert_eq!(format!("{}", UserRole::Admin), "admin");
    }

    #[test]
    fn test_session_creation() {
        let start = Utc::now();
        let end = start + chrono::Duration::hours(1);

        let session = Session::new(
            "Math Tutorial".to_string(),
            "Mathematics".to_string(),
            "educator-uuid".to_string(),
            SessionType::OneOnOne,
            start,
            end,
        );

        assert_eq!(session.title, "Math Tutorial");
        assert_eq!(session.status, SessionStatus::Scheduled);
        assert_eq!(session.duration_minutes, 60);
    }
}
