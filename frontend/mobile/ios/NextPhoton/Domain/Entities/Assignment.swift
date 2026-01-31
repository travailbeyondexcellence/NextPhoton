// Assignment.swift
// NextPhoton EduCare - iOS Application
//
// Domain entity representing an assignment in NextPhoton.
// Assignments are tasks given by educators to learners.

import Foundation

/// Represents an assignment in NextPhoton
///
/// Assignments are educational tasks created by educators for learners.
/// They can include various types of content and have due dates.
struct Assignment: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Properties

    /// Unique identifier for the assignment
    let id: String

    /// Title of the assignment
    let title: String

    /// Detailed description and instructions
    var description: String?

    /// Subject area
    let subject: String

    /// Specific topic
    var topic: String?

    /// Type of assignment
    let assignmentType: AssignmentType

    /// Educator who created the assignment
    let educatorId: String

    /// Educator's display name
    let educatorName: String

    /// Learner the assignment is for
    let learnerId: String

    /// Learner's display name
    let learnerName: String

    /// Related session ID (if any)
    var sessionId: String?

    /// Due date and time
    let dueDate: Date

    /// Assignment creation timestamp
    let createdAt: Date

    /// Last update timestamp
    var updatedAt: Date

    /// Current status
    var status: AssignmentStatus

    /// Priority level
    let priority: AssignmentPriority

    /// Maximum possible score/points
    var maxScore: Int?

    /// Achieved score (after grading)
    var score: Int?

    /// Grade (if applicable)
    var grade: String?

    /// Educator's feedback after submission
    var feedback: String?

    /// Attached files/resources
    var attachments: [AssignmentAttachment]

    /// Submission details
    var submission: AssignmentSubmission?

    /// Estimated time to complete (in minutes)
    var estimatedMinutes: Int?

    /// Tags for categorization
    var tags: [String]

    /// Whether late submission is allowed
    let allowLateSubmission: Bool

    /// Late submission penalty percentage
    var latePenaltyPercent: Int?

    // MARK: - Computed Properties

    /// Whether the assignment is past due
    var isPastDue: Bool {
        dueDate < Date() && status != .submitted && status != .graded
    }

    /// Whether the assignment is completed (submitted or graded)
    var isCompleted: Bool {
        status == .submitted || status == .graded
    }

    /// Time remaining until due date
    var timeRemaining: TimeInterval? {
        guard dueDate > Date() else { return nil }
        return dueDate.timeIntervalSinceNow
    }

    /// Formatted time remaining string
    var formattedTimeRemaining: String? {
        guard let remaining = timeRemaining else {
            return isPastDue ? "Past due" : nil
        }

        let hours = Int(remaining / 3600)
        let days = hours / 24

        if days > 0 {
            return "\(days) day\(days == 1 ? "" : "s") left"
        } else if hours > 0 {
            return "\(hours) hour\(hours == 1 ? "" : "s") left"
        } else {
            let minutes = Int(remaining / 60)
            return "\(minutes) minute\(minutes == 1 ? "" : "s") left"
        }
    }

    /// Score percentage if graded
    var scorePercentage: Double? {
        guard let score = score, let maxScore = maxScore, maxScore > 0 else {
            return nil
        }
        return Double(score) / Double(maxScore) * 100
    }

    /// Formatted score string
    var formattedScore: String? {
        guard let score = score else { return nil }
        if let maxScore = maxScore {
            return "\(score)/\(maxScore)"
        }
        return "\(score)"
    }
}

// MARK: - Assignment Type

/// Type of assignment
enum AssignmentType: String, Codable, CaseIterable, Sendable {
    case homework = "HOMEWORK"
    case quiz = "QUIZ"
    case test = "TEST"
    case project = "PROJECT"
    case essay = "ESSAY"
    case practice = "PRACTICE"
    case reading = "READING"
    case video = "VIDEO"
    case other = "OTHER"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .homework: return "Homework"
        case .quiz: return "Quiz"
        case .test: return "Test"
        case .project: return "Project"
        case .essay: return "Essay"
        case .practice: return "Practice"
        case .reading: return "Reading"
        case .video: return "Video"
        case .other: return "Other"
        }
    }

    /// Icon name for UI
    var iconName: String {
        switch self {
        case .homework: return "book.fill"
        case .quiz: return "questionmark.circle.fill"
        case .test: return "doc.text.fill"
        case .project: return "folder.fill"
        case .essay: return "text.alignleft"
        case .practice: return "pencil.and.outline"
        case .reading: return "book.closed.fill"
        case .video: return "play.rectangle.fill"
        case .other: return "doc.fill"
        }
    }
}

// MARK: - Assignment Status

/// Status of an assignment
enum AssignmentStatus: String, Codable, CaseIterable, Sendable {
    case pending = "PENDING"
    case inProgress = "IN_PROGRESS"
    case submitted = "SUBMITTED"
    case graded = "GRADED"
    case returned = "RETURNED"
    case cancelled = "CANCELLED"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .pending: return "Not Started"
        case .inProgress: return "In Progress"
        case .submitted: return "Submitted"
        case .graded: return "Graded"
        case .returned: return "Returned"
        case .cancelled: return "Cancelled"
        }
    }

    /// Color name for UI
    var colorName: String {
        switch self {
        case .pending: return "gray"
        case .inProgress: return "blue"
        case .submitted: return "orange"
        case .graded: return "green"
        case .returned: return "yellow"
        case .cancelled: return "red"
        }
    }

    /// Icon name for UI
    var iconName: String {
        switch self {
        case .pending: return "circle"
        case .inProgress: return "circle.lefthalf.filled"
        case .submitted: return "arrow.up.circle.fill"
        case .graded: return "checkmark.circle.fill"
        case .returned: return "arrow.uturn.left.circle.fill"
        case .cancelled: return "xmark.circle.fill"
        }
    }
}

// MARK: - Assignment Priority

/// Priority level of an assignment
enum AssignmentPriority: String, Codable, CaseIterable, Sendable {
    case low = "LOW"
    case medium = "MEDIUM"
    case high = "HIGH"
    case urgent = "URGENT"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .low: return "Low"
        case .medium: return "Medium"
        case .high: return "High"
        case .urgent: return "Urgent"
        }
    }

    /// Color name for UI
    var colorName: String {
        switch self {
        case .low: return "green"
        case .medium: return "blue"
        case .high: return "orange"
        case .urgent: return "red"
        }
    }

    /// Sort order value
    var sortOrder: Int {
        switch self {
        case .urgent: return 0
        case .high: return 1
        case .medium: return 2
        case .low: return 3
        }
    }
}

// MARK: - Assignment Attachment

/// File attachment for an assignment
struct AssignmentAttachment: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// Unique identifier
    let id: String

    /// File name
    let fileName: String

    /// File type/extension
    let fileType: String

    /// File size in bytes
    let fileSize: Int

    /// URL to download the file
    let url: URL

    /// Thumbnail URL for images/videos
    var thumbnailURL: URL?

    /// Upload timestamp
    let uploadedAt: Date

    /// MIME type
    var mimeType: String?

    /// Formatted file size string
    var formattedFileSize: String {
        let formatter = ByteCountFormatter()
        formatter.countStyle = .file
        return formatter.string(fromByteCount: Int64(fileSize))
    }

    /// Icon name based on file type
    var iconName: String {
        switch fileType.lowercased() {
        case "pdf": return "doc.fill"
        case "doc", "docx": return "doc.text.fill"
        case "xls", "xlsx": return "tablecells.fill"
        case "ppt", "pptx": return "rectangle.on.rectangle.angled"
        case "jpg", "jpeg", "png", "gif", "heic": return "photo.fill"
        case "mp4", "mov", "avi": return "video.fill"
        case "mp3", "wav", "m4a": return "music.note"
        case "zip", "rar": return "doc.zipper"
        default: return "doc.fill"
        }
    }
}

// MARK: - Assignment Submission

/// Submission details for an assignment
struct AssignmentSubmission: Equatable, Hashable, Codable, Sendable {
    /// Submission timestamp
    let submittedAt: Date

    /// Text content of submission
    var content: String?

    /// Attached files
    var attachments: [AssignmentAttachment]

    /// Whether submitted late
    var isLate: Bool

    /// Notes from learner
    var notes: String?

    /// Time spent (in minutes) reported by learner
    var timeSpentMinutes: Int?
}

// MARK: - Assignment Filter

/// Filters for querying assignments
struct AssignmentFilter: Sendable {
    var status: [AssignmentStatus]?
    var assignmentType: [AssignmentType]?
    var priority: [AssignmentPriority]?
    var subject: String?
    var educatorId: String?
    var learnerId: String?
    var dueDateFrom: Date?
    var dueDateTo: Date?
    var isPastDue: Bool?
    var sessionId: String?
}

// MARK: - Assignment Create Request

/// Request to create a new assignment
struct AssignmentCreateRequest: Sendable {
    let title: String
    var description: String?
    let subject: String
    var topic: String?
    let assignmentType: AssignmentType
    let learnerId: String
    let dueDate: Date
    let priority: AssignmentPriority
    var maxScore: Int?
    var estimatedMinutes: Int?
    var attachments: [URL]
    var sessionId: String?
    var tags: [String]
    var allowLateSubmission: Bool
    var latePenaltyPercent: Int?
}

// MARK: - Assignment Submit Request

/// Request to submit an assignment
struct AssignmentSubmitRequest: Sendable {
    let assignmentId: String
    var content: String?
    var attachments: [URL]
    var notes: String?
    var timeSpentMinutes: Int?
}
