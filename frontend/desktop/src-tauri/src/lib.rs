// lib.rs - NextPhoton Desktop Library Root
// =============================================================================
// This is the library root for the NextPhoton desktop application.
// It exposes all modules for potential use as a library crate.
//
// Module Structure:
// - domain: Business logic, entities, and repository traits
// - infrastructure: External concerns (database, HTTP, security)
// - application: Use cases, commands, and state management
// - di: Dependency injection container
// =============================================================================

/// Domain layer - Core business logic and entities
/// Contains pure business rules that don't depend on external frameworks
pub mod domain;

/// Infrastructure layer - External concerns and implementations
/// Handles database, network, file system, and security operations
pub mod infrastructure;

/// Application layer - Use cases and command handlers
/// Orchestrates the flow of data between domain and infrastructure
pub mod application;

/// Dependency injection - Service container and factory
/// Creates and manages all service instances and their dependencies
pub mod di;

// Re-export commonly used types for convenience
pub use application::state::AppState;
pub use di::Container;
pub use domain::entities::*;
pub use domain::error::DomainError;
