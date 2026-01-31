// domain/mod.rs - Domain Layer Module
// =============================================================================
// The domain layer contains the core business logic of the application.
// It is independent of any external frameworks or infrastructure concerns.
//
// Components:
// - entities: Core business objects (User, Session, Assignment, etc.)
// - repository: Traits defining data access contracts
// - services: Business logic service traits
// - error: Domain-specific error types
// =============================================================================

/// Business entities representing core domain objects
pub mod entities;

/// Repository trait definitions for data access abstraction
pub mod repository;

/// Domain-specific error types
pub mod error;

// Re-export for convenience
pub use entities::*;
pub use error::DomainError;
pub use repository::*;
