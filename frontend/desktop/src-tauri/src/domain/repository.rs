// domain/repository.rs - Repository Trait Definitions
// =============================================================================
// This file defines the repository traits for data access abstraction.
// These traits define the contract that infrastructure implementations must follow.
//
// Repository Pattern Benefits:
// - Decouples domain logic from data access implementation
// - Enables easy testing through mock implementations
// - Allows switching between different storage backends
// =============================================================================

use async_trait::async_trait;

use super::entities::{
    Assignment, AssignmentStatus, Notification, Session, SessionBooking, SessionStatus, User,
};
use super::error::DomainError;

// =============================================================================
// USER REPOSITORY
// =============================================================================

/// Repository trait for User entity data access
/// Implementations handle the actual storage (SQLite, remote API, etc.)
#[async_trait]
pub trait UserRepository: Send + Sync {
    /// Find a user by their unique identifier
    /// Returns None if user doesn't exist
    async fn find_by_id(&self, id: &str) -> Result<Option<User>, DomainError>;

    /// Find a user by their email address
    /// Returns None if user doesn't exist
    async fn find_by_email(&self, email: &str) -> Result<Option<User>, DomainError>;

    /// Save a user (insert or update)
    /// If user with same ID exists, updates; otherwise inserts
    async fn save(&self, user: &User) -> Result<(), DomainError>;

    /// Delete a user by their ID
    /// Returns error if user doesn't exist
    async fn delete(&self, id: &str) -> Result<(), DomainError>;

    /// Update the last login timestamp for a user
    async fn update_last_login(&self, id: &str) -> Result<(), DomainError>;

    /// Get all users (for admin purposes)
    /// Should implement pagination in production
    async fn find_all(&self) -> Result<Vec<User>, DomainError>;
}

// =============================================================================
// SESSION REPOSITORY
// =============================================================================

/// Repository trait for Session entity data access
#[async_trait]
pub trait SessionRepository: Send + Sync {
    /// Find a session by its unique identifier
    async fn find_by_id(&self, id: &str) -> Result<Option<Session>, DomainError>;

    /// Find all sessions for a specific educator
    async fn find_by_educator(&self, educator_id: &str) -> Result<Vec<Session>, DomainError>;

    /// Find all sessions for a specific learner (through bookings)
    async fn find_by_learner(&self, learner_id: &str) -> Result<Vec<Session>, DomainError>;

    /// Find sessions within a date range
    async fn find_by_date_range(
        &self,
        start: chrono::DateTime<chrono::Utc>,
        end: chrono::DateTime<chrono::Utc>,
    ) -> Result<Vec<Session>, DomainError>;

    /// Find upcoming sessions (scheduled in the future)
    async fn find_upcoming(&self, limit: i32) -> Result<Vec<Session>, DomainError>;

    /// Find sessions by status
    async fn find_by_status(&self, status: SessionStatus) -> Result<Vec<Session>, DomainError>;

    /// Save a session (insert or update)
    async fn save(&self, session: &Session) -> Result<(), DomainError>;

    /// Update session status
    async fn update_status(&self, id: &str, status: SessionStatus) -> Result<(), DomainError>;

    /// Delete a session by ID
    async fn delete(&self, id: &str) -> Result<(), DomainError>;

    /// Get all sessions with pagination
    async fn find_all(&self, offset: i32, limit: i32) -> Result<Vec<Session>, DomainError>;
}

// =============================================================================
// SESSION BOOKING REPOSITORY
// =============================================================================

/// Repository trait for SessionBooking entity data access
#[async_trait]
pub trait BookingRepository: Send + Sync {
    /// Find a booking by its unique identifier
    async fn find_by_id(&self, id: &str) -> Result<Option<SessionBooking>, DomainError>;

    /// Find all bookings for a session
    async fn find_by_session(&self, session_id: &str) -> Result<Vec<SessionBooking>, DomainError>;

    /// Find all bookings for a learner
    async fn find_by_learner(&self, learner_id: &str) -> Result<Vec<SessionBooking>, DomainError>;

    /// Find a specific booking for a learner and session
    async fn find_by_learner_and_session(
        &self,
        learner_id: &str,
        session_id: &str,
    ) -> Result<Option<SessionBooking>, DomainError>;

    /// Save a booking (insert or update)
    async fn save(&self, booking: &SessionBooking) -> Result<(), DomainError>;

    /// Cancel a booking
    async fn cancel(&self, id: &str) -> Result<(), DomainError>;

    /// Mark attendance for a booking
    async fn mark_attendance(&self, id: &str, attended: bool) -> Result<(), DomainError>;
}

// =============================================================================
// ASSIGNMENT REPOSITORY
// =============================================================================

/// Repository trait for Assignment entity data access
#[async_trait]
pub trait AssignmentRepository: Send + Sync {
    /// Find an assignment by its unique identifier
    async fn find_by_id(&self, id: &str) -> Result<Option<Assignment>, DomainError>;

    /// Find all assignments for a learner
    async fn find_by_learner(&self, learner_id: &str) -> Result<Vec<Assignment>, DomainError>;

    /// Find all assignments created by an educator
    async fn find_by_educator(&self, educator_id: &str) -> Result<Vec<Assignment>, DomainError>;

    /// Find assignments by status for a learner
    async fn find_by_learner_and_status(
        &self,
        learner_id: &str,
        status: AssignmentStatus,
    ) -> Result<Vec<Assignment>, DomainError>;

    /// Find overdue assignments for a learner
    async fn find_overdue_by_learner(&self, learner_id: &str) -> Result<Vec<Assignment>, DomainError>;

    /// Save an assignment (insert or update)
    async fn save(&self, assignment: &Assignment) -> Result<(), DomainError>;

    /// Update assignment status
    async fn update_status(&self, id: &str, status: AssignmentStatus) -> Result<(), DomainError>;

    /// Submit an assignment
    async fn submit(&self, id: &str) -> Result<(), DomainError>;

    /// Grade an assignment
    async fn grade(&self, id: &str, score: f64, feedback: Option<String>) -> Result<(), DomainError>;

    /// Delete an assignment by ID
    async fn delete(&self, id: &str) -> Result<(), DomainError>;
}

// =============================================================================
// NOTIFICATION REPOSITORY
// =============================================================================

/// Repository trait for Notification entity data access
#[async_trait]
pub trait NotificationRepository: Send + Sync {
    /// Find a notification by its unique identifier
    async fn find_by_id(&self, id: &str) -> Result<Option<Notification>, DomainError>;

    /// Find all notifications for a user
    async fn find_by_user(&self, user_id: &str) -> Result<Vec<Notification>, DomainError>;

    /// Find unread notifications for a user
    async fn find_unread_by_user(&self, user_id: &str) -> Result<Vec<Notification>, DomainError>;

    /// Count unread notifications for a user
    async fn count_unread(&self, user_id: &str) -> Result<i64, DomainError>;

    /// Save a notification
    async fn save(&self, notification: &Notification) -> Result<(), DomainError>;

    /// Mark a notification as read
    async fn mark_as_read(&self, id: &str) -> Result<(), DomainError>;

    /// Mark all notifications as read for a user
    async fn mark_all_as_read(&self, user_id: &str) -> Result<(), DomainError>;

    /// Delete a notification by ID
    async fn delete(&self, id: &str) -> Result<(), DomainError>;

    /// Delete all notifications for a user
    async fn delete_all_by_user(&self, user_id: &str) -> Result<(), DomainError>;
}

// =============================================================================
// SYNC REPOSITORY
// =============================================================================

/// Repository trait for sync-related operations
#[async_trait]
pub trait SyncRepository: Send + Sync {
    /// Get the last sync timestamp
    async fn get_last_sync(&self) -> Result<Option<chrono::DateTime<chrono::Utc>>, DomainError>;

    /// Set the last sync timestamp
    async fn set_last_sync(&self, timestamp: chrono::DateTime<chrono::Utc>) -> Result<(), DomainError>;

    /// Get count of pending changes to sync
    async fn get_pending_changes_count(&self) -> Result<usize, DomainError>;

    /// Get all pending changes
    async fn get_pending_changes(&self) -> Result<Vec<PendingChange>, DomainError>;

    /// Mark a change as synced
    async fn mark_as_synced(&self, change_id: &str) -> Result<(), DomainError>;

    /// Record a local change for later sync
    async fn record_change(&self, change: &PendingChange) -> Result<(), DomainError>;
}

/// Pending change record for offline-first sync
#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct PendingChange {
    /// Unique change identifier
    pub id: String,
    /// Type of entity changed
    pub entity_type: String,
    /// ID of the changed entity
    pub entity_id: String,
    /// Type of operation (create, update, delete)
    pub operation: ChangeOperation,
    /// Serialized entity data (JSON)
    pub data: String,
    /// Timestamp of the change
    pub created_at: chrono::DateTime<chrono::Utc>,
    /// Number of sync attempts
    pub attempts: i32,
}

/// Type of change operation
#[derive(Debug, Clone, Copy, PartialEq, Eq, serde::Serialize, serde::Deserialize)]
pub enum ChangeOperation {
    Create,
    Update,
    Delete,
}

// =============================================================================
// CREDENTIAL REPOSITORY
// =============================================================================

/// Repository trait for secure credential storage
#[async_trait]
pub trait CredentialRepository: Send + Sync {
    /// Store an access token securely
    async fn store_access_token(&self, token: &str) -> Result<(), DomainError>;

    /// Retrieve the stored access token
    async fn get_access_token(&self) -> Result<Option<String>, DomainError>;

    /// Store a refresh token securely
    async fn store_refresh_token(&self, token: &str) -> Result<(), DomainError>;

    /// Retrieve the stored refresh token
    async fn get_refresh_token(&self) -> Result<Option<String>, DomainError>;

    /// Clear all stored credentials (on logout)
    async fn clear_credentials(&self) -> Result<(), DomainError>;

    /// Check if credentials exist
    async fn has_credentials(&self) -> Result<bool, DomainError>;
}
