// Assignment.swift
// NextPhoton EduCare iPadOS Application
// Domain Entity: Assignment
//
// Represents an assignment given to learners by educators

import Foundation
import SwiftUI

/// Assignment status enumeration
enum AssignmentStatus: String, Codable, CaseIterable {
    case pending = "PENDING"
    case inProgress = "IN_PROGRESS"
    case submitted = "SUBMITTED"
    case underReview = "UNDER_REVIEW"
    case graded = "GRADED"
    case returned = "RETURNED"
    case overdue = "OVERDUE"

    var displayName: String {
        switch self {
        case .pending: return "Pending"
        case .inProgress: return "In Progress"
        case .submitted: return "Submitted"
        case .underReview: return "Under Review"
        case .graded: return "Graded"
        case .returned: return "Returned"
        case .overdue: return "Overdue"
        }
    }

    var color: Color {
        switch self {
        case .pending: return .blue
        case .inProgress: return .orange
        case .submitted: return .green
        case .underReview: return .purple
        case .graded: return .teal
        case .returned: return .yellow
        case .overdue: return .red
        }
    }
}

/// Assignment type enumeration
enum AssignmentType: String, Codable {
    case homework = "HOMEWORK"
    case quiz = "QUIZ"
    case test = "TEST"
    case project = "PROJECT"
    case practice = "PRACTICE"
    case worksheet = "WORKSHEET"

    var displayName: String {
        switch self {
        case .homework: return "Homework"
        case .quiz: return "Quiz"
        case .test: return "Test"
        case .project: return "Project"
        case .practice: return "Practice"
        case .worksheet: return "Worksheet"
        }
    }

    var icon: String {
        switch self {
        case .homework: return "book.fill"
        case .quiz: return "questionmark.circle.fill"
        case .test: return "doc.text.fill"
        case .project: return "folder.fill"
        case .practice: return "pencil.and.outline"
        case .worksheet: return "doc.richtext.fill"
        }
    }
}

/// Assignment domain entity
struct Assignment: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Core Properties

    let id: String
    let title: String
    let description: String
    let instructions: String
    let subject: String
    let topic: String

    // MARK: - Type & Status

    let type: AssignmentType
    var status: AssignmentStatus

    // MARK: - Participants

    let educatorId: String
    let educatorName: String
    let learnerId: String
    let learnerName: String

    // MARK: - Scheduling

    let assignedDate: Date
    let dueDate: Date
    let submittedDate: Date?

    // MARK: - Grading

    let maxPoints: Int
    let earnedPoints: Int?
    let grade: String?
    let feedback: String?
    let rubric: [RubricItem]

    // MARK: - Content

    let attachments: [Attachment]
    let submissionAttachments: [Attachment]
    let allowedSubmissionTypes: [SubmissionType]
    let allowLateSub: Bool
    let lateSubmissionPenalty: Double?

    // MARK: - Related

    let relatedSessionId: String?
    let tags: [String]

    // MARK: - Metadata

    let createdAt: Date
    let updatedAt: Date

    // MARK: - Computed Properties

    var isCompleted: Bool {
        [.submitted, .underReview, .graded].contains(status)
    }

    var isOverdue: Bool {
        !isCompleted && Date() > dueDate
    }

    var formattedDueDate: String {
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: dueDate)
    }

    var timeRemaining: String {
        let now = Date()
        if now > dueDate {
            return "Overdue"
        }

        let interval = dueDate.timeIntervalSince(now)

        if interval < 3600 {
            let minutes = Int(interval / 60)
            return "\(minutes) min left"
        }
        if interval < 86400 {
            let hours = Int(interval / 3600)
            return "\(hours)h left"
        }
        let days = Int(interval / 86400)
        return "\(days)d left"
    }

    var percentageScore: Double? {
        guard let earned = earnedPoints else { return nil }
        return Double(earned) / Double(maxPoints) * 100
    }

    var formattedScore: String? {
        guard let earned = earnedPoints else { return nil }
        return "\(earned)/\(maxPoints)"
    }

    // MARK: - Initialization

    init(
        id: String,
        title: String,
        description: String = "",
        instructions: String = "",
        subject: String,
        topic: String = "",
        type: AssignmentType = .homework,
        status: AssignmentStatus = .pending,
        educatorId: String,
        educatorName: String,
        learnerId: String,
        learnerName: String,
        assignedDate: Date = Date(),
        dueDate: Date,
        submittedDate: Date? = nil,
        maxPoints: Int = 100,
        earnedPoints: Int? = nil,
        grade: String? = nil,
        feedback: String? = nil,
        rubric: [RubricItem] = [],
        attachments: [Attachment] = [],
        submissionAttachments: [Attachment] = [],
        allowedSubmissionTypes: [SubmissionType] = [.file, .drawing],
        allowLateSub: Bool = true,
        lateSubmissionPenalty: Double? = 0.1,
        relatedSessionId: String? = nil,
        tags: [String] = [],
        createdAt: Date = Date(),
        updatedAt: Date = Date()
    ) {
        self.id = id
        self.title = title
        self.description = description
        self.instructions = instructions
        self.subject = subject
        self.topic = topic
        self.type = type
        self.status = status
        self.educatorId = educatorId
        self.educatorName = educatorName
        self.learnerId = learnerId
        self.learnerName = learnerName
        self.assignedDate = assignedDate
        self.dueDate = dueDate
        self.submittedDate = submittedDate
        self.maxPoints = maxPoints
        self.earnedPoints = earnedPoints
        self.grade = grade
        self.feedback = feedback
        self.rubric = rubric
        self.attachments = attachments
        self.submissionAttachments = submissionAttachments
        self.allowedSubmissionTypes = allowedSubmissionTypes
        self.allowLateSub = allowLateSub
        self.lateSubmissionPenalty = lateSubmissionPenalty
        self.relatedSessionId = relatedSessionId
        self.tags = tags
        self.createdAt = createdAt
        self.updatedAt = updatedAt
    }
}

// MARK: - Rubric Item

/// Represents a rubric criterion for grading
struct RubricItem: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let criterion: String
    let description: String
    let maxPoints: Int
    let earnedPoints: Int?
    let feedback: String?
}

// MARK: - Submission Type

/// Types of submissions allowed for an assignment
enum SubmissionType: String, Codable, CaseIterable {
    case file = "FILE"
    case text = "TEXT"
    case drawing = "DRAWING"
    case url = "URL"
    case video = "VIDEO"
    case audio = "AUDIO"

    var displayName: String {
        switch self {
        case .file: return "File Upload"
        case .text: return "Text Entry"
        case .drawing: return "Drawing"
        case .url: return "URL Link"
        case .video: return "Video"
        case .audio: return "Audio"
        }
    }

    var icon: String {
        switch self {
        case .file: return "doc.fill"
        case .text: return "text.alignleft"
        case .drawing: return "pencil.tip"
        case .url: return "link"
        case .video: return "video.fill"
        case .audio: return "waveform"
        }
    }
}

// MARK: - Sample Data

extension Assignment {
    static let sample = Assignment(
        id: "assignment-001",
        title: "Quadratic Equations Practice",
        description: "Complete the practice problems on quadratic equations",
        instructions: "Solve all 10 problems. Show your work for full credit.",
        subject: "Mathematics",
        topic: "Algebra",
        type: .homework,
        status: .pending,
        educatorId: "educator-001",
        educatorName: "Dr. Sarah Williams",
        learnerId: "user-001",
        learnerName: "Alex Johnson",
        dueDate: Date().addingTimeInterval(86400 * 2),
        maxPoints: 100,
        attachments: [],
        allowedSubmissionTypes: [.file, .drawing],
        relatedSessionId: "session-001",
        tags: ["algebra", "quadratic", "practice"]
    )

    static let completedSample = Assignment(
        id: "assignment-002",
        title: "Physics Lab Report",
        description: "Write a report on the pendulum experiment",
        instructions: "Include hypothesis, methodology, results, and conclusion.",
        subject: "Physics",
        topic: "Mechanics",
        type: .project,
        status: .graded,
        educatorId: "educator-002",
        educatorName: "Prof. Michael Chen",
        learnerId: "user-001",
        learnerName: "Alex Johnson",
        dueDate: Date().addingTimeInterval(-86400),
        submittedDate: Date().addingTimeInterval(-86400 * 2),
        maxPoints: 100,
        earnedPoints: 92,
        grade: "A",
        feedback: "Excellent work! Your analysis was thorough and well-documented.",
        tags: ["physics", "lab", "report"]
    )

    static let samples: [Assignment] = [
        sample,
        completedSample,
        Assignment(
            id: "assignment-003",
            title: "Chemistry Worksheet",
            description: "Balance chemical equations",
            subject: "Chemistry",
            topic: "Chemical Reactions",
            type: .worksheet,
            status: .inProgress,
            educatorId: "educator-003",
            educatorName: "Dr. Emily Brown",
            learnerId: "user-001",
            learnerName: "Alex Johnson",
            dueDate: Date().addingTimeInterval(86400),
            maxPoints: 50,
            tags: ["chemistry", "equations"]
        ),
        Assignment(
            id: "assignment-004",
            title: "Biology Quiz",
            description: "Quiz on cell structure",
            subject: "Biology",
            topic: "Cell Biology",
            type: .quiz,
            status: .pending,
            educatorId: "educator-004",
            educatorName: "Dr. James Wilson",
            learnerId: "user-001",
            learnerName: "Alex Johnson",
            dueDate: Date().addingTimeInterval(86400 * 3),
            maxPoints: 25,
            tags: ["biology", "cells", "quiz"]
        ),
        Assignment(
            id: "assignment-005",
            title: "Math Test Prep",
            description: "Practice test for midterm exam",
            subject: "Mathematics",
            topic: "Multiple Topics",
            type: .test,
            status: .pending,
            educatorId: "educator-001",
            educatorName: "Dr. Sarah Williams",
            learnerId: "user-001",
            learnerName: "Alex Johnson",
            dueDate: Date().addingTimeInterval(-3600),
            maxPoints: 100,
            tags: ["math", "test", "midterm"]
        )
    ]
}
