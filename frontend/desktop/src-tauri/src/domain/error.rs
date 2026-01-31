// domain/error.rs - Domain Error Types
// =============================================================================
// This file defines all domain-specific error types for the application.
// Using thiserror for ergonomic error handling with proper Display/Error impls.
// =============================================================================

use serde::{Deserialize, Serialize};
use thiserror::Error;

/// Main domain error enum encompassing all error types
#[derive(Debug, Error, Serialize, Deserialize, Clone)]
pub enum DomainError {
    // =========================================================================
    // Authentication Errors
    // =========================================================================
    #[error("Invalid credentials provided")]
    InvalidCredentials,

    #[error("User not authenticated")]
    NotAuthenticated,

    #[error("Authentication token expired")]
    TokenExpired,

    #[error("Invalid authentication token")]
    InvalidToken,

    #[error("User account is locked")]
    AccountLocked,

    #[error("Email not verified")]
    EmailNotVerified,

    // =========================================================================
    // Authorization Errors
    // =========================================================================
    #[error("Access denied: insufficient permissions")]
    AccessDenied,

    #[error("Operation not allowed for role: {0}")]
    RoleNotAllowed(String),

    // =========================================================================
    // Resource Errors
    // =========================================================================
    #[error("User not found: {0}")]
    UserNotFound(String),

    #[error("Session not found: {0}")]
    SessionNotFound(String),

    #[error("Assignment not found: {0}")]
    AssignmentNotFound(String),

    #[error("Booking not found: {0}")]
    BookingNotFound(String),

    #[error("Resource not found: {0}")]
    NotFound(String),

    #[error("Resource already exists: {0}")]
    AlreadyExists(String),

    // =========================================================================
    // Validation Errors
    // =========================================================================
    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Invalid email format: {0}")]
    InvalidEmail(String),

    #[error("Password too weak: {0}")]
    WeakPassword(String),

    #[error("Invalid date range")]
    InvalidDateRange,

    // =========================================================================
    // Business Logic Errors
    // =========================================================================
    #[error("Session is already full")]
    SessionFull,

    #[error("Session has already started")]
    SessionAlreadyStarted,

    #[error("Session has been cancelled")]
    SessionCancelled,

    #[error("Booking already exists for this session")]
    BookingAlreadyExists,

    #[error("Cannot cancel booking: {0}")]
    CannotCancelBooking(String),

    #[error("Assignment already submitted")]
    AssignmentAlreadySubmitted,

    #[error("Assignment submission deadline passed")]
    AssignmentDeadlinePassed,

    // =========================================================================
    // Infrastructure Errors
    // =========================================================================
    #[error("Database error: {0}")]
    DatabaseError(String),

    #[error("Network error: {0}")]
    NetworkError(String),

    #[error("Sync error: {0}")]
    SyncError(String),

    #[error("Credential storage error: {0}")]
    CredentialError(String),

    #[error("File system error: {0}")]
    FileSystemError(String),

    // =========================================================================
    // System Errors
    // =========================================================================
    #[error("Internal error: {0}")]
    InternalError(String),

    #[error("Configuration error: {0}")]
    ConfigError(String),

    #[error("Operation timed out")]
    Timeout,

    #[error("Service unavailable")]
    ServiceUnavailable,
}

// Convert from sqlx errors
impl From<sqlx::Error> for DomainError {
    fn from(err: sqlx::Error) -> Self {
        match err {
            sqlx::Error::RowNotFound => DomainError::NotFound("Row not found".to_string()),
            _ => DomainError::DatabaseError(err.to_string()),
        }
    }
}

// Convert from reqwest errors
impl From<reqwest::Error> for DomainError {
    fn from(err: reqwest::Error) -> Self {
        if err.is_timeout() {
            DomainError::Timeout
        } else if err.is_connect() {
            DomainError::ServiceUnavailable
        } else {
            DomainError::NetworkError(err.to_string())
        }
    }
}

// Convert from keyring errors
impl From<keyring::Error> for DomainError {
    fn from(err: keyring::Error) -> Self {
        DomainError::CredentialError(err.to_string())
    }
}

// Convert from std::io errors
impl From<std::io::Error> for DomainError {
    fn from(err: std::io::Error) -> Self {
        DomainError::FileSystemError(err.to_string())
    }
}

// Convert from serde_json errors
impl From<serde_json::Error> for DomainError {
    fn from(err: serde_json::Error) -> Self {
        DomainError::ValidationError(format!("JSON parse error: {}", err))
    }
}

// Convert to String for Tauri error handling
impl From<DomainError> for String {
    fn from(err: DomainError) -> Self {
        err.to_string()
    }
}

/// Error response structure for API/IPC responses
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    /// Error code for programmatic handling
    pub code: String,
    /// Human-readable error message
    pub message: String,
    /// Additional error details (optional)
    pub details: Option<String>,
}

impl From<DomainError> for ErrorResponse {
    fn from(err: DomainError) -> Self {
        let code = match &err {
            DomainError::InvalidCredentials => "AUTH_INVALID_CREDENTIALS",
            DomainError::NotAuthenticated => "AUTH_NOT_AUTHENTICATED",
            DomainError::TokenExpired => "AUTH_TOKEN_EXPIRED",
            DomainError::InvalidToken => "AUTH_INVALID_TOKEN",
            DomainError::AccessDenied => "AUTH_ACCESS_DENIED",
            DomainError::UserNotFound(_) => "USER_NOT_FOUND",
            DomainError::SessionNotFound(_) => "SESSION_NOT_FOUND",
            DomainError::NotFound(_) => "NOT_FOUND",
            DomainError::AlreadyExists(_) => "ALREADY_EXISTS",
            DomainError::ValidationError(_) => "VALIDATION_ERROR",
            DomainError::SessionFull => "SESSION_FULL",
            DomainError::DatabaseError(_) => "DATABASE_ERROR",
            DomainError::NetworkError(_) => "NETWORK_ERROR",
            DomainError::InternalError(_) => "INTERNAL_ERROR",
            _ => "UNKNOWN_ERROR",
        };

        Self {
            code: code.to_string(),
            message: err.to_string(),
            details: None,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_error_display() {
        let err = DomainError::InvalidCredentials;
        assert_eq!(err.to_string(), "Invalid credentials provided");
    }

    #[test]
    fn test_error_response_conversion() {
        let err = DomainError::UserNotFound("user-123".to_string());
        let response: ErrorResponse = err.into();

        assert_eq!(response.code, "USER_NOT_FOUND");
        assert!(response.message.contains("user-123"));
    }

    #[test]
    fn test_error_to_string_conversion() {
        let err = DomainError::SessionFull;
        let s: String = err.into();
        assert_eq!(s, "Session is already full");
    }
}
