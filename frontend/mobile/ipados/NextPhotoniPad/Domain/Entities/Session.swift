// Session.swift
// NextPhoton EduCare iPadOS Application
// Domain Entity: Session
//
// Represents a tutoring/learning session between learner and educator

import Foundation
import SwiftUI

/// Session status enumeration
enum SessionStatus: String, Codable, CaseIterable {
    case scheduled = "SCHEDULED"
    case confirmed = "CONFIRMED"
    case inProgress = "IN_PROGRESS"
    case completed = "COMPLETED"
    case cancelled = "CANCELLED"
    case rescheduled = "RESCHEDULED"
    case noShow = "NO_SHOW"

    var displayName: String {
        switch self {
        case .scheduled: return "Scheduled"
        case .confirmed: return "Confirmed"
        case .inProgress: return "In Progress"
        case .completed: return "Completed"
        case .cancelled: return "Cancelled"
        case .rescheduled: return "Rescheduled"
        case .noShow: return "No Show"
        }
    }
}

/// Session type enumeration
enum SessionType: String, Codable {
    case oneOnOne = "ONE_ON_ONE"
    case group = "GROUP"
    case workshop = "WORKSHOP"
    case assessment = "ASSESSMENT"

    var displayName: String {
        switch self {
        case .oneOnOne: return "1-on-1"
        case .group: return "Group"
        case .workshop: return "Workshop"
        case .assessment: return "Assessment"
        }
    }
}

/// Session domain entity
/// Represents a learning session between a learner and an educator
struct Session: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Core Properties

    let id: String
    let title: String
    let description: String
    let subject: String
    let topic: String

    // MARK: - Participants

    let educatorId: String
    let educatorName: String
    let educatorAvatarURL: URL?
    let learnerId: String
    let learnerName: String

    // MARK: - Scheduling

    let startTime: Date
    let endTime: Date
    let duration: TimeInterval
    let timezone: String

    // MARK: - Status & Type

    let status: SessionStatus
    let sessionType: SessionType

    // MARK: - Session Details

    let meetingURL: URL?
    let whiteboardEnabled: Bool
    let recordingEnabled: Bool
    let notes: String?

    // MARK: - Materials

    let attachments: [Attachment]
    let relatedAssignments: [String]

    // MARK: - Feedback

    let learnerRating: Int?
    let learnerFeedback: String?
    let educatorNotes: String?

    // MARK: - Metadata

    let createdAt: Date
    let updatedAt: Date

    // MARK: - Computed Properties

    var isLive: Bool {
        status == .inProgress
    }

    var isUpcoming: Bool {
        status == .scheduled || status == .confirmed
    }

    var isPast: Bool {
        status == .completed || status == .cancelled || status == .noShow
    }

    var canJoin: Bool {
        guard isUpcoming || isLive else { return false }
        let now = Date()
        let joinWindowStart = startTime.addingTimeInterval(-15 * 60) // 15 minutes before
        let joinWindowEnd = endTime
        return now >= joinWindowStart && now <= joinWindowEnd
    }

    var formattedDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: startTime)
    }

    var formattedDuration: String {
        let minutes = Int(duration / 60)
        if minutes >= 60 {
            let hours = minutes / 60
            let remainingMinutes = minutes % 60
            if remainingMinutes == 0 {
                return "\(hours)h"
            }
            return "\(hours)h \(remainingMinutes)m"
        }
        return "\(minutes) min"
    }

    var timeUntilStart: TimeInterval {
        startTime.timeIntervalSinceNow
    }

    var formattedTimeUntilStart: String {
        let interval = timeUntilStart
        if interval < 0 {
            return "Started"
        }
        if interval < 60 {
            return "Starting now"
        }
        if interval < 3600 {
            let minutes = Int(interval / 60)
            return "In \(minutes) min"
        }
        if interval < 86400 {
            let hours = Int(interval / 3600)
            return "In \(hours)h"
        }
        let days = Int(interval / 86400)
        return "In \(days)d"
    }

    var statusColor: Color {
        switch status {
        case .scheduled: return .blue
        case .confirmed: return .green
        case .inProgress: return .red
        case .completed: return .gray
        case .cancelled: return .orange
        case .rescheduled: return .purple
        case .noShow: return .red
        }
    }

    // MARK: - Initialization

    init(
        id: String,
        title: String,
        description: String = "",
        subject: String,
        topic: String = "",
        educatorId: String,
        educatorName: String,
        educatorAvatarURL: URL? = nil,
        learnerId: String,
        learnerName: String,
        startTime: Date,
        endTime: Date,
        duration: TimeInterval,
        timezone: String = "UTC",
        status: SessionStatus = .scheduled,
        sessionType: SessionType = .oneOnOne,
        meetingURL: URL? = nil,
        whiteboardEnabled: Bool = true,
        recordingEnabled: Bool = false,
        notes: String? = nil,
        attachments: [Attachment] = [],
        relatedAssignments: [String] = [],
        learnerRating: Int? = nil,
        learnerFeedback: String? = nil,
        educatorNotes: String? = nil,
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.subject = subject
        self.topic = topic
        self.educatorId = educatorId
        self.educatorName = educatorName
        self.educatorAvatarURL = educatorAvatarURL
        self.learnerId = learnerId
        self.learnerName = learnerName
        self.startTime = startTime
        self.endTime = endTime
        self.duration = duration
        self.timezone = timezone
        self.status = status
        self.sessionType = sessionType
        self.meetingURL = meetingURL
        self.whiteboardEnabled = whiteboardEnabled
        self.recordingEnabled = recordingEnabled
        self.notes = notes
        self.attachments = attachments
        self.relatedAssignments = relatedAssignments
        self.learnerRating = learnerRating
        self.learnerFeedback = learnerFeedback
        self.educatorNotes = educatorNotes
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Attachment

/// Represents a file attachment for sessions
struct Attachment: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let name: String
    let type: AttachmentType
    let url: URL
    let size: Int64
    let uploadedAt: Date

    enum AttachmentType: String, Codable {
        case document = "DOCUMENT"
        case image = "IMAGE"
        case video = "VIDEO"
        case audio = "AUDIO"
        case drawing = "DRAWING"

        var icon: String {
            switch self {
            case .document: return "doc.fill"
            case .image: return "photo.fill"
            case .video: return "video.fill"
            case .audio: return "waveform"
            case .drawing: return "pencil.tip"
            }
        }
    }

    var formattedSize: String {
        ByteCountFormatter.string(fromByteCount: size, countStyle: .file)
    }
}

// MARK: - Sample Data

extension Session {
    static let sample = Session(
        id: "session-001",
        title: "Advanced Algebra Review",
        description: "Covering quadratic equations and polynomial factoring",
        subject: "Mathematics",
        topic: "Algebra",
        educatorId: "educator-001",
        educatorName: "Dr. Sarah Williams",
        educatorAvatarURL: URL(string: "https://example.com/avatar.jpg"),
        learnerId: "user-001",
        learnerName: "Alex Johnson",
        startTime: Date().addingTimeInterval(3600),
        endTime: Date().addingTimeInterval(3600 + 2700),
        duration: 2700,
        timezone: "America/New_York",
        status: .confirmed,
        sessionType: .oneOnOne,
        meetingURL: URL(string: "https://meet.nextphoton.com/session-001"),
        whiteboardEnabled: true,
        recordingEnabled: true,
        notes: "Focus on practice problems",
        attachments: [],
        relatedAssignments: ["assignment-001"]
    )

    static let liveSample = Session(
        id: "session-002",
        title: "Physics Lab Discussion",
        description: "Review of recent lab experiments",
        subject: "Physics",
        topic: "Mechanics",
        educatorId: "educator-002",
        educatorName: "Prof. Michael Chen",
        learnerId: "user-001",
        learnerName: "Alex Johnson",
        startTime: Date().addingTimeInterval(-1800),
        endTime: Date().addingTimeInterval(1800),
        duration: 3600,
        status: .inProgress,
        sessionType: .oneOnOne,
        meetingURL: URL(string: "https://meet.nextphoton.com/session-002"),
        whiteboardEnabled: true
    )

    static let samples: [Session] = [
        sample,
        liveSample,
        Session(
            id: "session-003",
            title: "Chemistry Fundamentals",
            description: "Introduction to organic chemistry",
            subject: "Chemistry",
            topic: "Organic Chemistry",
            educatorId: "educator-003",
            educatorName: "Dr. Emily Brown",
            learnerId: "user-001",
            learnerName: "Alex Johnson",
            startTime: Date().addingTimeInterval(86400),
            endTime: Date().addingTimeInterval(86400 + 3600),
            duration: 3600,
            status: .scheduled,
            sessionType: .oneOnOne,
            whiteboardEnabled: true
        ),
        Session(
            id: "session-004",
            title: "Biology Review",
            description: "Cell biology and genetics",
            subject: "Biology",
            topic: "Cell Biology",
            educatorId: "educator-004",
            educatorName: "Dr. James Wilson",
            learnerId: "user-001",
            learnerName: "Alex Johnson",
            startTime: Date().addingTimeInterval(172800),
            endTime: Date().addingTimeInterval(172800 + 2700),
            duration: 2700,
            status: .scheduled,
            sessionType: .oneOnOne,
            whiteboardEnabled: false
        )
    ]
}
