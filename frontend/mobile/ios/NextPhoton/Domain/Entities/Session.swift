// Session.swift
// NextPhoton EduCare - iOS Application
//
// Domain entity representing a tutoring session in NextPhoton.
// Sessions are the core service offering - scheduled meetings between
// educators and learners.

import Foundation

/// Represents a tutoring session in NextPhoton
///
/// A session is a scheduled educational meeting between an educator and
/// one or more learners. Sessions can be one-on-one or group-based.
struct Session: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Properties

    /// Unique identifier for the session
    let id: String

    /// Title or topic of the session
    let title: String

    /// Detailed description of what will be covered
    var description: String?

    /// Subject area (e.g., "Mathematics", "Physics")
    let subject: String

    /// Specific topic within the subject
    var topic: String?

    /// Educator conducting the session
    let educator: SessionParticipant

    /// List of learners attending the session
    var learners: [SessionParticipant]

    /// Scheduled start time
    let startTime: Date

    /// Scheduled end time
    let endTime: Date

    /// Actual start time (when session was started)
    var actualStartTime: Date?

    /// Actual end time (when session was ended)
    var actualEndTime: Date?

    /// Current status of the session
    var status: SessionStatus

    /// Type of session (online, in-person, hybrid)
    let sessionType: SessionType

    /// Meeting link for online sessions
    var meetingLink: URL?

    /// Physical location for in-person sessions
    var location: SessionLocation?

    /// Maximum number of participants allowed
    let maxParticipants: Int

    /// Price for the session
    let price: Decimal

    /// Currency for the price
    let currency: String

    /// Whether the session is recurring
    let isRecurring: Bool

    /// Recurrence pattern if recurring
    var recurrencePattern: RecurrencePattern?

    /// Notes from the educator
    var educatorNotes: String?

    /// Feedback from participants
    var feedback: [SessionFeedback]?

    /// Session creation timestamp
    let createdAt: Date

    /// Last update timestamp
    var updatedAt: Date

    // MARK: - Computed Properties

    /// Duration of the scheduled session in minutes
    var scheduledDurationMinutes: Int {
        Int(endTime.timeIntervalSince(startTime) / 60)
    }

    /// Actual duration if session has ended
    var actualDurationMinutes: Int? {
        guard let start = actualStartTime, let end = actualEndTime else {
            return nil
        }
        return Int(end.timeIntervalSince(start) / 60)
    }

    /// Whether the session is in the past
    var isPast: Bool {
        endTime < Date()
    }

    /// Whether the session is currently ongoing
    var isOngoing: Bool {
        let now = Date()
        return startTime <= now && endTime >= now && status == .inProgress
    }

    /// Whether the session can be joined
    var canJoin: Bool {
        let now = Date()
        let joinWindowStart = startTime.addingTimeInterval(-15 * 60) // 15 minutes before
        return now >= joinWindowStart && now <= endTime && (status == .scheduled || status == .inProgress)
    }

    /// Whether the session can be cancelled
    var canCancel: Bool {
        status == .scheduled && startTime > Date().addingTimeInterval(24 * 60 * 60) // 24 hours before
    }

    /// Formatted price string
    var formattedPrice: String {
        let formatter = NumberFormatter()
        formatter.numberStyle = .currency
        formatter.currencyCode = currency
        return formatter.string(from: price as NSDecimalNumber) ?? "\(currency) \(price)"
    }

    /// Number of current participants
    var participantCount: Int {
        learners.count + 1 // +1 for educator
    }

    /// Available spots
    var availableSpots: Int {
        max(0, maxParticipants - participantCount)
    }
}

// MARK: - Session Status

/// Status of a tutoring session
enum SessionStatus: String, Codable, CaseIterable, Sendable {
    case scheduled = "SCHEDULED"
    case inProgress = "IN_PROGRESS"
    case completed = "COMPLETED"
    case cancelled = "CANCELLED"
    case noShow = "NO_SHOW"
    case rescheduled = "RESCHEDULED"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .scheduled: return "Scheduled"
        case .inProgress: return "In Progress"
        case .completed: return "Completed"
        case .cancelled: return "Cancelled"
        case .noShow: return "No Show"
        case .rescheduled: return "Rescheduled"
        }
    }

    /// Color name for UI representation
    var colorName: String {
        switch self {
        case .scheduled: return "blue"
        case .inProgress: return "green"
        case .completed: return "gray"
        case .cancelled: return "red"
        case .noShow: return "orange"
        case .rescheduled: return "yellow"
        }
    }

    /// Icon name for UI
    var iconName: String {
        switch self {
        case .scheduled: return "calendar.badge.clock"
        case .inProgress: return "video.fill"
        case .completed: return "checkmark.circle.fill"
        case .cancelled: return "xmark.circle.fill"
        case .noShow: return "person.crop.circle.badge.xmark"
        case .rescheduled: return "calendar.badge.exclamationmark"
        }
    }
}

// MARK: - Session Type

/// Type of tutoring session
enum SessionType: String, Codable, CaseIterable, Sendable {
    case online = "ONLINE"
    case inPerson = "IN_PERSON"
    case hybrid = "HYBRID"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .online: return "Online"
        case .inPerson: return "In Person"
        case .hybrid: return "Hybrid"
        }
    }

    /// Icon name for UI
    var iconName: String {
        switch self {
        case .online: return "video.fill"
        case .inPerson: return "person.2.fill"
        case .hybrid: return "person.and.arrowtriangle.right.and.arrowtriangle.left"
        }
    }
}

// MARK: - Session Participant

/// Represents a participant in a session
struct SessionParticipant: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// User ID of the participant
    let id: String

    /// Display name of the participant
    let displayName: String

    /// Avatar URL
    var avatarURL: URL?

    /// Role in the session (educator or learner)
    let role: ParticipantRole

    /// Whether the participant has joined
    var hasJoined: Bool

    /// Join timestamp
    var joinedAt: Date?

    /// Leave timestamp
    var leftAt: Date?

    /// Attendance status
    var attendanceStatus: AttendanceStatus

    enum ParticipantRole: String, Codable, Sendable {
        case educator = "EDUCATOR"
        case learner = "LEARNER"
    }

    enum AttendanceStatus: String, Codable, Sendable {
        case pending = "PENDING"
        case present = "PRESENT"
        case absent = "ABSENT"
        case late = "LATE"
    }
}

// MARK: - Session Location

/// Physical location for in-person sessions
struct SessionLocation: Equatable, Hashable, Codable, Sendable {
    /// Address line 1
    let address: String

    /// City
    let city: String

    /// State/Province
    var state: String?

    /// Country
    let country: String

    /// Postal/ZIP code
    var postalCode: String?

    /// Latitude coordinate
    var latitude: Double?

    /// Longitude coordinate
    var longitude: Double?

    /// Additional location notes
    var notes: String?

    /// Full formatted address
    var formattedAddress: String {
        var parts = [address, city]
        if let state = state {
            parts.append(state)
        }
        parts.append(country)
        if let postalCode = postalCode {
            parts.append(postalCode)
        }
        return parts.joined(separator: ", ")
    }
}

// MARK: - Recurrence Pattern

/// Pattern for recurring sessions
struct RecurrencePattern: Equatable, Hashable, Codable, Sendable {
    /// Frequency of recurrence
    let frequency: RecurrenceFrequency

    /// Interval (e.g., every 2 weeks)
    let interval: Int

    /// Days of week for weekly recurrence
    var daysOfWeek: [DayOfWeek]?

    /// Day of month for monthly recurrence
    var dayOfMonth: Int?

    /// End date for recurrence
    var endDate: Date?

    /// Number of occurrences
    var occurrences: Int?

    enum RecurrenceFrequency: String, Codable, Sendable {
        case daily = "DAILY"
        case weekly = "WEEKLY"
        case biweekly = "BIWEEKLY"
        case monthly = "MONTHLY"
    }

    enum DayOfWeek: Int, Codable, CaseIterable, Sendable {
        case sunday = 1
        case monday = 2
        case tuesday = 3
        case wednesday = 4
        case thursday = 5
        case friday = 6
        case saturday = 7

        var shortName: String {
            switch self {
            case .sunday: return "Sun"
            case .monday: return "Mon"
            case .tuesday: return "Tue"
            case .wednesday: return "Wed"
            case .thursday: return "Thu"
            case .friday: return "Fri"
            case .saturday: return "Sat"
            }
        }
    }
}

// MARK: - Session Feedback

/// Feedback for a completed session
struct SessionFeedback: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// Unique identifier
    let id: String

    /// User who provided feedback
    let userId: String

    /// User's display name
    let userDisplayName: String

    /// Rating (1-5)
    let rating: Int

    /// Written feedback
    var comment: String?

    /// Timestamp
    let createdAt: Date

    /// Whether this is from the educator or learner
    let fromRole: SessionParticipant.ParticipantRole
}

// MARK: - Session Filter

/// Filters for querying sessions
struct SessionFilter: Sendable {
    var status: [SessionStatus]?
    var sessionType: [SessionType]?
    var subject: String?
    var educatorId: String?
    var learnerId: String?
    var startDateFrom: Date?
    var startDateTo: Date?
    var minPrice: Decimal?
    var maxPrice: Decimal?
}

// MARK: - Session Booking Request

/// Request to book a new session
struct SessionBookingRequest: Sendable {
    let educatorId: String
    let subject: String
    var topic: String?
    let startTime: Date
    let endTime: Date
    let sessionType: SessionType
    var meetingLink: URL?
    var location: SessionLocation?
    var notes: String?
}
