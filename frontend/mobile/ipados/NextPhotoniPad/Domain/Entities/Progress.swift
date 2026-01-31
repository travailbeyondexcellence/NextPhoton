// Progress.swift
// NextPhoton EduCare iPadOS Application
// Domain Entity: Progress
//
// Represents learning progress and analytics for learners

import Foundation
import SwiftUI

/// Progress domain entity
/// Tracks learning progress across subjects and over time
struct Progress: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Core Properties

    let id: String
    let learnerId: String
    let learnerName: String

    // MARK: - Overall Progress

    let overallScore: Double
    let totalSessionsAttended: Int
    let totalSessionsScheduled: Int
    let totalAssignmentsCompleted: Int
    let totalAssignmentsAssigned: Int
    let averageAssignmentScore: Double
    let streakDays: Int
    let longestStreak: Int

    // MARK: - Subject Progress

    let subjectProgress: [SubjectProgress]

    // MARK: - Time-Based Analytics

    let weeklyStudyHours: [WeeklyStudyData]
    let monthlyProgress: [MonthlyProgressData]

    // MARK: - Achievements

    let achievements: [Achievement]
    let recentMilestones: [Milestone]

    // MARK: - Goals

    let currentGoals: [LearningGoal]

    // MARK: - Metadata

    let lastUpdated: Date

    // MARK: - Computed Properties

    var sessionAttendanceRate: Double {
        guard totalSessionsScheduled > 0 else { return 0 }
        return Double(totalSessionsAttended) / Double(totalSessionsScheduled) * 100
    }

    var assignmentCompletionRate: Double {
        guard totalAssignmentsAssigned > 0 else { return 0 }
        return Double(totalAssignmentsCompleted) / Double(totalAssignmentsAssigned) * 100
    }

    var overallGrade: String {
        switch overallScore {
        case 90...100: return "A"
        case 80..<90: return "B"
        case 70..<80: return "C"
        case 60..<70: return "D"
        default: return "F"
        }
    }

    // MARK: - Initialization

    init(
        id: String,
        learnerId: String,
        learnerName: String,
        overallScore: Double = 0,
        totalSessionsAttended: Int = 0,
        totalSessionsScheduled: Int = 0,
        totalAssignmentsCompleted: Int = 0,
        totalAssignmentsAssigned: Int = 0,
        averageAssignmentScore: Double = 0,
        streakDays: Int = 0,
        longestStreak: Int = 0,
        subjectProgress: [SubjectProgress] = [],
        weeklyStudyHours: [WeeklyStudyData] = [],
        monthlyProgress: [MonthlyProgressData] = [],
        achievements: [Achievement] = [],
        recentMilestones: [Milestone] = [],
        currentGoals: [LearningGoal] = [],
        lastUpdated: Date = Date()
    ) {
        self.id = id
        self.learnerId = learnerId
        self.learnerName = learnerName
        self.overallScore = overallScore
        self.totalSessionsAttended = totalSessionsAttended
        self.totalSessionsScheduled = totalSessionsScheduled
        self.totalAssignmentsCompleted = totalAssignmentsCompleted
        self.totalAssignmentsAssigned = totalAssignmentsAssigned
        self.averageAssignmentScore = averageAssignmentScore
        self.streakDays = streakDays
        self.longestStreak = longestStreak
        self.subjectProgress = subjectProgress
        self.weeklyStudyHours = weeklyStudyHours
        self.monthlyProgress = monthlyProgress
        self.achievements = achievements
        self.recentMilestones = recentMilestones
        self.currentGoals = currentGoals
        self.lastUpdated = lastUpdated
    }
}

// MARK: - Subject Progress

/// Progress for a specific subject
struct SubjectProgress: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let subject: String
    let score: Double
    let sessionsCompleted: Int
    let assignmentsCompleted: Int
    let averageScore: Double
    let trend: Trend
    let topicsCompleted: [String]
    let topicsInProgress: [String]
    let color: String

    enum Trend: String, Codable {
        case improving = "IMPROVING"
        case stable = "STABLE"
        case declining = "DECLINING"

        var icon: String {
            switch self {
            case .improving: return "arrow.up.right"
            case .stable: return "arrow.right"
            case .declining: return "arrow.down.right"
            }
        }

        var color: Color {
            switch self {
            case .improving: return .green
            case .stable: return .blue
            case .declining: return .red
            }
        }
    }
}

// MARK: - Weekly Study Data

/// Study hours data for a week
struct WeeklyStudyData: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let weekStartDate: Date
    let totalHours: Double
    let dailyBreakdown: [DailyStudyHours]
}

struct DailyStudyHours: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let date: Date
    let hours: Double
    let subjects: [String: Double]
}

// MARK: - Monthly Progress Data

/// Progress data for a month
struct MonthlyProgressData: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let month: Date
    let averageScore: Double
    let sessionsCompleted: Int
    let assignmentsCompleted: Int
    let hoursStudied: Double
}

// MARK: - Achievement

/// Represents an achievement earned by the learner
struct Achievement: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let title: String
    let description: String
    let icon: String
    let earnedDate: Date
    let category: AchievementCategory
    let rarity: AchievementRarity

    enum AchievementCategory: String, Codable {
        case attendance = "ATTENDANCE"
        case performance = "PERFORMANCE"
        case consistency = "CONSISTENCY"
        case milestone = "MILESTONE"
        case special = "SPECIAL"
    }

    enum AchievementRarity: String, Codable {
        case common = "COMMON"
        case uncommon = "UNCOMMON"
        case rare = "RARE"
        case epic = "EPIC"
        case legendary = "LEGENDARY"

        var color: Color {
            switch self {
            case .common: return .gray
            case .uncommon: return .green
            case .rare: return .blue
            case .epic: return .purple
            case .legendary: return .orange
            }
        }
    }
}

// MARK: - Milestone

/// Represents a learning milestone
struct Milestone: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let title: String
    let description: String
    let achievedDate: Date
    let subject: String?
    let value: Int
}

// MARK: - Learning Goal

/// Represents a learning goal set by the learner or guardian
struct LearningGoal: Identifiable, Equatable, Hashable, Codable, Sendable {
    let id: String
    let title: String
    let description: String
    let targetValue: Double
    let currentValue: Double
    let unit: String
    let startDate: Date
    let targetDate: Date
    let subject: String?
    let status: GoalStatus

    enum GoalStatus: String, Codable {
        case active = "ACTIVE"
        case completed = "COMPLETED"
        case failed = "FAILED"
        case paused = "PAUSED"
    }

    var progressPercentage: Double {
        guard targetValue > 0 else { return 0 }
        return min(currentValue / targetValue * 100, 100)
    }

    var isCompleted: Bool {
        currentValue >= targetValue
    }
}

// MARK: - Sample Data

extension Progress {
    static let sample = Progress(
        id: "progress-001",
        learnerId: "user-001",
        learnerName: "Alex Johnson",
        overallScore: 85.5,
        totalSessionsAttended: 42,
        totalSessionsScheduled: 45,
        totalAssignmentsCompleted: 38,
        totalAssignmentsAssigned: 42,
        averageAssignmentScore: 88.2,
        streakDays: 12,
        longestStreak: 21,
        subjectProgress: [
            SubjectProgress(
                id: "math-progress",
                subject: "Mathematics",
                score: 92.0,
                sessionsCompleted: 15,
                assignmentsCompleted: 12,
                averageScore: 90.5,
                trend: .improving,
                topicsCompleted: ["Algebra", "Geometry"],
                topicsInProgress: ["Calculus"],
                color: "#3B82F6"
            ),
            SubjectProgress(
                id: "physics-progress",
                subject: "Physics",
                score: 85.0,
                sessionsCompleted: 12,
                assignmentsCompleted: 10,
                averageScore: 84.0,
                trend: .stable,
                topicsCompleted: ["Mechanics"],
                topicsInProgress: ["Thermodynamics"],
                color: "#10B981"
            ),
            SubjectProgress(
                id: "chemistry-progress",
                subject: "Chemistry",
                score: 78.0,
                sessionsCompleted: 10,
                assignmentsCompleted: 8,
                averageScore: 80.0,
                trend: .improving,
                topicsCompleted: [],
                topicsInProgress: ["Organic Chemistry"],
                color: "#F59E0B"
            ),
            SubjectProgress(
                id: "biology-progress",
                subject: "Biology",
                score: 88.0,
                sessionsCompleted: 8,
                assignmentsCompleted: 8,
                averageScore: 91.0,
                trend: .improving,
                topicsCompleted: ["Cell Biology"],
                topicsInProgress: ["Genetics"],
                color: "#8B5CF6"
            )
        ],
        achievements: [
            Achievement(
                id: "ach-001",
                title: "First Steps",
                description: "Complete your first session",
                icon: "star.fill",
                earnedDate: Date().addingTimeInterval(-86400 * 30),
                category: .milestone,
                rarity: .common
            ),
            Achievement(
                id: "ach-002",
                title: "Consistent Learner",
                description: "Maintain a 7-day streak",
                icon: "flame.fill",
                earnedDate: Date().addingTimeInterval(-86400 * 7),
                category: .consistency,
                rarity: .uncommon
            ),
            Achievement(
                id: "ach-003",
                title: "Perfect Score",
                description: "Get 100% on an assignment",
                icon: "crown.fill",
                earnedDate: Date().addingTimeInterval(-86400 * 14),
                category: .performance,
                rarity: .rare
            )
        ],
        currentGoals: [
            LearningGoal(
                id: "goal-001",
                title: "Complete 50 Sessions",
                description: "Attend 50 tutoring sessions",
                targetValue: 50,
                currentValue: 42,
                unit: "sessions",
                startDate: Date().addingTimeInterval(-86400 * 90),
                targetDate: Date().addingTimeInterval(86400 * 30),
                subject: nil,
                status: .active
            ),
            LearningGoal(
                id: "goal-002",
                title: "Master Algebra",
                description: "Complete all algebra topics with 90%+ score",
                targetValue: 90,
                currentValue: 85,
                unit: "%",
                startDate: Date().addingTimeInterval(-86400 * 60),
                targetDate: Date().addingTimeInterval(86400 * 60),
                subject: "Mathematics",
                status: .active
            )
        ],
        lastUpdated: Date()
    )
}
