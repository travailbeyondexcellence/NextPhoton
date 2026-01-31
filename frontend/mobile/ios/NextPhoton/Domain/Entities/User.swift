// User.swift
// NextPhoton EduCare - iOS Application
//
// Domain entity representing a user in the NextPhoton system.
// This is a pure domain model with no dependencies on external frameworks.

import Foundation

/// Represents a user in the NextPhoton EduCare system
///
/// Users can have different roles:
/// - Learner: Students who receive tutoring
/// - Guardian: Parents/guardians who monitor learners
/// - Educator: Tutors who provide educational services
/// - EduCare Manager (ECM): Managers who oversee operations
/// - Employee: Staff members
/// - Intern: Temporary staff
/// - Admin: System administrators
struct User: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Properties

    /// Unique identifier for the user
    let id: String

    /// User's email address (used for authentication)
    let email: String

    /// User's first name
    let firstName: String

    /// User's last name
    let lastName: String

    /// User's display name (optional custom name)
    var displayName: String?

    /// URL to the user's profile avatar image
    var avatarURL: URL?

    /// User's phone number
    var phoneNumber: String?

    /// User's role in the system
    let role: UserRole

    /// Account creation timestamp
    let createdAt: Date

    /// Last profile update timestamp
    var updatedAt: Date

    /// Whether the user's email is verified
    var isEmailVerified: Bool

    /// Whether the user's account is active
    var isActive: Bool

    /// User's timezone preference
    var timezone: String

    /// User's preferred language
    var preferredLanguage: String

    /// Additional metadata for the user
    var metadata: UserMetadata?

    // MARK: - Computed Properties

    /// Full name combining first and last name
    var fullName: String {
        "\(firstName) \(lastName)"
    }

    /// Display name or full name if display name is not set
    var nameToDisplay: String {
        displayName ?? fullName
    }

    /// Initials for avatar placeholder
    var initials: String {
        let firstInitial = firstName.first.map(String.init) ?? ""
        let lastInitial = lastName.first.map(String.init) ?? ""
        return "\(firstInitial)\(lastInitial)".uppercased()
    }
}

// MARK: - User Role

/// Enumeration of possible user roles in NextPhoton
///
/// Each role has specific permissions and capabilities within the system.
enum UserRole: String, Codable, CaseIterable, Sendable {
    case learner = "LEARNER"
    case guardian = "GUARDIAN"
    case educator = "EDUCATOR"
    case educareManager = "EDUCARE_MANAGER"
    case employee = "EMPLOYEE"
    case intern = "INTERN"
    case admin = "ADMIN"

    /// Human-readable display name for the role
    var displayName: String {
        switch self {
        case .learner: return "Learner"
        case .guardian: return "Guardian"
        case .educator: return "Educator"
        case .educareManager: return "EduCare Manager"
        case .employee: return "Employee"
        case .intern: return "Intern"
        case .admin: return "Administrator"
        }
    }

    /// Icon name for the role
    var iconName: String {
        switch self {
        case .learner: return "graduationcap.fill"
        case .guardian: return "figure.2.and.child.holdinghands"
        case .educator: return "person.crop.rectangle.stack.fill"
        case .educareManager: return "person.3.fill"
        case .employee: return "person.badge.key.fill"
        case .intern: return "person.badge.clock.fill"
        case .admin: return "shield.checkered"
        }
    }

    /// Color associated with the role for UI
    var colorName: String {
        switch self {
        case .learner: return "blue"
        case .guardian: return "purple"
        case .educator: return "green"
        case .educareManager: return "orange"
        case .employee: return "cyan"
        case .intern: return "mint"
        case .admin: return "red"
        }
    }
}

// MARK: - User Metadata

/// Additional metadata associated with a user
struct UserMetadata: Codable, Equatable, Hashable, Sendable {
    /// For learners: Grade level
    var gradeLevel: String?

    /// For learners: Subjects of interest
    var subjects: [String]?

    /// For educators: Specialization areas
    var specializations: [String]?

    /// For educators: Years of experience
    var yearsOfExperience: Int?

    /// For educators: Hourly rate
    var hourlyRate: Decimal?

    /// For educators: Rating (0-5)
    var rating: Double?

    /// For educators: Total number of sessions completed
    var totalSessions: Int?

    /// For guardians: List of linked learner IDs
    var linkedLearnerIds: [String]?

    /// Bio or description
    var bio: String?

    /// Education qualifications
    var qualifications: [String]?

    /// Preferred session times
    var preferredTimes: [String]?
}

// MARK: - Authentication Tokens

/// Authentication tokens returned after login
struct AuthTokens: Equatable, Sendable {
    /// JWT access token for API authentication
    let accessToken: String

    /// Refresh token for obtaining new access tokens
    let refreshToken: String

    /// Access token expiration timestamp
    let expiresAt: Date

    /// Refresh token expiration timestamp
    let refreshExpiresAt: Date
}

// MARK: - Login Credentials

/// Credentials for user login
struct LoginCredentials: Sendable {
    /// User's email address
    let email: String

    /// User's password
    let password: String
}

// MARK: - Registration Data

/// Data required for user registration
struct RegistrationData: Sendable {
    /// User's email address
    let email: String

    /// User's password
    let password: String

    /// User's first name
    let firstName: String

    /// User's last name
    let lastName: String

    /// User's selected role
    let role: UserRole

    /// User's phone number (optional)
    var phoneNumber: String?

    /// User's timezone
    var timezone: String = TimeZone.current.identifier
}

// MARK: - Profile Update Data

/// Data for updating user profile
struct ProfileUpdateData: Sendable {
    /// Updated first name
    var firstName: String?

    /// Updated last name
    var lastName: String?

    /// Updated display name
    var displayName: String?

    /// Updated phone number
    var phoneNumber: String?

    /// Updated timezone
    var timezone: String?

    /// Updated preferred language
    var preferredLanguage: String?

    /// Updated avatar URL
    var avatarURL: URL?

    /// Updated metadata
    var metadata: UserMetadata?
}
