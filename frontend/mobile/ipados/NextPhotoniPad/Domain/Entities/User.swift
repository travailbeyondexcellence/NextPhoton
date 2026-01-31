// User.swift
// NextPhoton EduCare iPadOS Application
// Domain Entity: User
//
// Represents the user domain entity with all business properties
// This is a pure domain object, independent of persistence or API layers

import Foundation

/// User role types in the NextPhoton ecosystem
enum UserRole: String, Codable, CaseIterable {
    case learner = "LEARNER"
    case guardian = "GUARDIAN"
    case educator = "EDUCATOR"
    case eduCareManager = "ECM"
    case employee = "EMPLOYEE"
    case intern = "INTERN"
    case admin = "ADMIN"

    var displayName: String {
        switch self {
        case .learner: return "Learner"
        case .guardian: return "Guardian"
        case .educator: return "Educator"
        case .eduCareManager: return "EduCare Manager"
        case .employee: return "Employee"
        case .intern: return "Intern"
        case .admin: return "Administrator"
        }
    }
}

/// Account status for users
enum AccountStatus: String, Codable {
    case active = "ACTIVE"
    case pending = "PENDING"
    case suspended = "SUSPENDED"
    case inactive = "INACTIVE"
}

/// User domain entity
/// Represents a user in the NextPhoton EduCare platform
struct User: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Core Properties

    let id: String
    let email: String
    let firstName: String
    let lastName: String
    let role: UserRole
    let status: AccountStatus

    // MARK: - Profile Properties

    let avatarURL: URL?
    let phoneNumber: String?
    let dateOfBirth: Date?
    let timezone: String
    let locale: String

    // MARK: - Educational Properties (for Learners)

    let gradeLevel: String?
    let subjects: [String]
    let learningPreferences: LearningPreferences?

    // MARK: - Guardian Properties

    let linkedLearners: [String]

    // MARK: - Educator Properties

    let specializations: [String]
    let qualifications: [String]
    let rating: Double?
    let totalSessions: Int

    // MARK: - Metadata

    let createdAt: Date
    let updatedAt: Date
    let lastActiveAt: Date?

    // MARK: - Computed Properties

    var fullName: String {
        "\(firstName) \(lastName)"
    }

    var initials: String {
        let firstInitial = firstName.first.map(String.init) ?? ""
        let lastInitial = lastName.first.map(String.init) ?? ""
        return "\(firstInitial)\(lastInitial)".uppercased()
    }

    var isLearner: Bool {
        role == .learner
    }

    var isEducator: Bool {
        role == .educator
    }

    var isGuardian: Bool {
        role == .guardian
    }

    var isStaff: Bool {
        [.eduCareManager, .employee, .intern, .admin].contains(role)
    }

    // MARK: - Initialization

    init(
        id: String,
        email: String,
        firstName: String,
        lastName: String,
        role: UserRole,
        status: AccountStatus = .active,
        avatarURL: URL? = nil,
        phoneNumber: String? = nil,
        dateOfBirth: Date? = nil,
        timezone: String = "UTC",
        locale: String = "en_US",
        gradeLevel: String? = nil,
        subjects: [String] = [],
        learningPreferences: LearningPreferences? = nil,
        linkedLearners: [String] = [],
        specializations: [String] = [],
        qualifications: [String] = [],
        rating: Double? = nil,
        totalSessions: Int = 0,
        createdAt: Date = Date(),
        updatedAt: Date = Date(),
        lastActiveAt: Date? = nil
    ) {
        self.id = id
        self.email = email
        self.firstName = firstName
        self.lastName = lastName
        self.role = role
        self.status = status
        self.avatarURL = avatarURL
        self.phoneNumber = phoneNumber
        self.dateOfBirth = dateOfBirth
        self.timezone = timezone
        self.locale = locale
        self.gradeLevel = gradeLevel
        self.subjects = subjects
        self.learningPreferences = learningPreferences
        self.linkedLearners = linkedLearners
        self.specializations = specializations
        self.qualifications = qualifications
        self.rating = rating
        self.totalSessions = totalSessions
        self.createdAt = createdAt
        self.updatedAt = updatedAt
        self.lastActiveAt = lastActiveAt
    }
}

// MARK: - Learning Preferences

/// Learning preferences for personalized education
struct LearningPreferences: Codable, Equatable, Hashable, Sendable {
    let preferredLearningStyle: LearningStyle
    let sessionDurationPreference: SessionDurationPreference
    let preferredSessionTimes: [TimeSlot]
    let communicationPreference: CommunicationPreference
    let difficultyLevel: DifficultyLevel

    enum LearningStyle: String, Codable {
        case visual = "VISUAL"
        case auditory = "AUDITORY"
        case reading = "READING"
        case kinesthetic = "KINESTHETIC"
    }

    enum SessionDurationPreference: String, Codable {
        case short = "30_MINUTES"
        case medium = "45_MINUTES"
        case long = "60_MINUTES"
        case extended = "90_MINUTES"
    }

    enum CommunicationPreference: String, Codable {
        case chat = "CHAT"
        case video = "VIDEO"
        case both = "BOTH"
    }

    enum DifficultyLevel: String, Codable {
        case beginner = "BEGINNER"
        case intermediate = "INTERMEDIATE"
        case advanced = "ADVANCED"
    }
}

/// Time slot for scheduling preferences
struct TimeSlot: Codable, Equatable, Hashable, Sendable {
    let dayOfWeek: DayOfWeek
    let startTime: String // HH:mm format
    let endTime: String

    enum DayOfWeek: String, Codable, CaseIterable {
        case sunday, monday, tuesday, wednesday, thursday, friday, saturday
    }
}

// MARK: - Sample Data

extension User {
    static let sample = User(
        id: "user-001",
        email: "student@example.com",
        firstName: "Alex",
        lastName: "Johnson",
        role: .learner,
        status: .active,
        avatarURL: URL(string: "https://example.com/avatar.jpg"),
        phoneNumber: "+1234567890",
        dateOfBirth: Calendar.current.date(from: DateComponents(year: 2010, month: 5, day: 15)),
        timezone: "America/New_York",
        locale: "en_US",
        gradeLevel: "Grade 8",
        subjects: ["Mathematics", "Physics", "Chemistry"],
        learningPreferences: LearningPreferences(
            preferredLearningStyle: .visual,
            sessionDurationPreference: .medium,
            preferredSessionTimes: [],
            communicationPreference: .video,
            difficultyLevel: .intermediate
        ),
        linkedLearners: [],
        specializations: [],
        qualifications: [],
        rating: nil,
        totalSessions: 45,
        createdAt: Date().addingTimeInterval(-86400 * 365),
        updatedAt: Date(),
        lastActiveAt: Date()
    )

    static let sampleEducator = User(
        id: "educator-001",
        email: "educator@example.com",
        firstName: "Dr. Sarah",
        lastName: "Williams",
        role: .educator,
        status: .active,
        avatarURL: URL(string: "https://example.com/educator-avatar.jpg"),
        phoneNumber: "+1987654321",
        timezone: "America/Los_Angeles",
        locale: "en_US",
        specializations: ["Mathematics", "Physics"],
        qualifications: ["Ph.D. Mathematics", "M.Ed."],
        rating: 4.8,
        totalSessions: 1250,
        createdAt: Date().addingTimeInterval(-86400 * 730),
        updatedAt: Date(),
        lastActiveAt: Date()
    )
}
