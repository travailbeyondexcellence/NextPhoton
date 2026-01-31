// Progress.swift
// NextPhoton EduCare - iOS Application
//
// Domain entity representing learning progress in NextPhoton.
// Tracks learner achievements, milestones, and analytics.

import Foundation

/// Represents a learner's progress in NextPhoton
///
/// Progress tracking is a core feature of NextPhoton's focus on
/// micromanagement and outside-classroom monitoring.
struct Progress: Identifiable, Equatable, Hashable, Sendable {
    // MARK: - Properties

    /// Unique identifier
    let id: String

    /// Learner ID
    let learnerId: String

    /// Subject area
    let subject: String

    /// Overall progress percentage (0-100)
    var overallProgress: Double

    /// Current skill level
    var skillLevel: SkillLevel

    /// Total sessions completed
    var totalSessionsCompleted: Int

    /// Total assignments completed
    var totalAssignmentsCompleted: Int

    /// Total time spent learning (in minutes)
    var totalTimeSpentMinutes: Int

    /// Average assignment score
    var averageScore: Double?

    /// Streak (consecutive days of activity)
    var currentStreak: Int

    /// Longest streak achieved
    var longestStreak: Int

    /// Achievements earned
    var achievements: [Achievement]

    /// Milestones reached
    var milestones: [Milestone]

    /// Weekly activity data
    var weeklyActivity: [WeeklyActivity]

    /// Last activity timestamp
    var lastActivityAt: Date

    /// Progress start date
    let startedAt: Date

    /// Last update timestamp
    var updatedAt: Date

    // MARK: - Computed Properties

    /// Total hours spent learning
    var totalHoursSpent: Double {
        Double(totalTimeSpentMinutes) / 60.0
    }

    /// Formatted total time
    var formattedTotalTime: String {
        let hours = totalTimeSpentMinutes / 60
        let minutes = totalTimeSpentMinutes % 60

        if hours > 0 {
            return "\(hours)h \(minutes)m"
        }
        return "\(minutes)m"
    }

    /// Days since last activity
    var daysSinceLastActivity: Int {
        Calendar.current.dateComponents([.day], from: lastActivityAt, to: Date()).day ?? 0
    }
}

// MARK: - Skill Level

/// Skill level enumeration
enum SkillLevel: String, Codable, CaseIterable, Sendable {
    case beginner = "BEGINNER"
    case elementary = "ELEMENTARY"
    case intermediate = "INTERMEDIATE"
    case upperIntermediate = "UPPER_INTERMEDIATE"
    case advanced = "ADVANCED"
    case expert = "EXPERT"

    /// Human-readable display name
    var displayName: String {
        switch self {
        case .beginner: return "Beginner"
        case .elementary: return "Elementary"
        case .intermediate: return "Intermediate"
        case .upperIntermediate: return "Upper Intermediate"
        case .advanced: return "Advanced"
        case .expert: return "Expert"
        }
    }

    /// Numeric level (1-6)
    var numericLevel: Int {
        switch self {
        case .beginner: return 1
        case .elementary: return 2
        case .intermediate: return 3
        case .upperIntermediate: return 4
        case .advanced: return 5
        case .expert: return 6
        }
    }

    /// Color name for UI
    var colorName: String {
        switch self {
        case .beginner: return "green"
        case .elementary: return "mint"
        case .intermediate: return "blue"
        case .upperIntermediate: return "purple"
        case .advanced: return "orange"
        case .expert: return "red"
        }
    }
}

// MARK: - Achievement

/// Represents an achievement earned by a learner
struct Achievement: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// Unique identifier
    let id: String

    /// Achievement title
    let title: String

    /// Achievement description
    let description: String

    /// Icon name
    let iconName: String

    /// Badge color
    let colorName: String

    /// Category
    let category: AchievementCategory

    /// Points awarded
    let points: Int

    /// Date earned
    let earnedAt: Date

    /// Whether this is a rare achievement
    let isRare: Bool

    enum AchievementCategory: String, Codable, CaseIterable, Sendable {
        case sessions = "SESSIONS"
        case assignments = "ASSIGNMENTS"
        case streak = "STREAK"
        case performance = "PERFORMANCE"
        case engagement = "ENGAGEMENT"
        case special = "SPECIAL"

        var displayName: String {
            switch self {
            case .sessions: return "Sessions"
            case .assignments: return "Assignments"
            case .streak: return "Streaks"
            case .performance: return "Performance"
            case .engagement: return "Engagement"
            case .special: return "Special"
            }
        }
    }
}

// MARK: - Milestone

/// Represents a learning milestone
struct Milestone: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// Unique identifier
    let id: String

    /// Milestone title
    let title: String

    /// Milestone description
    let description: String

    /// Target value to reach
    let targetValue: Int

    /// Current value
    var currentValue: Int

    /// Whether completed
    var isCompleted: Bool

    /// Completion date
    var completedAt: Date?

    /// Milestone type
    let milestoneType: MilestoneType

    /// Progress percentage
    var progressPercentage: Double {
        guard targetValue > 0 else { return 0 }
        return min(100, Double(currentValue) / Double(targetValue) * 100)
    }

    enum MilestoneType: String, Codable, CaseIterable, Sendable {
        case sessions = "SESSIONS"
        case assignments = "ASSIGNMENTS"
        case hours = "HOURS"
        case score = "SCORE"
        case streak = "STREAK"

        var displayName: String {
            switch self {
            case .sessions: return "Sessions"
            case .assignments: return "Assignments"
            case .hours: return "Hours"
            case .score: return "Score"
            case .streak: return "Streak"
            }
        }

        var iconName: String {
            switch self {
            case .sessions: return "video.fill"
            case .assignments: return "doc.text.fill"
            case .hours: return "clock.fill"
            case .score: return "star.fill"
            case .streak: return "flame.fill"
            }
        }
    }
}

// MARK: - Weekly Activity

/// Weekly activity data for charts
struct WeeklyActivity: Identifiable, Equatable, Hashable, Codable, Sendable {
    /// Unique identifier
    var id: String { "\(weekStartDate)" }

    /// Start date of the week
    let weekStartDate: Date

    /// Number of sessions attended
    var sessionsAttended: Int

    /// Number of assignments completed
    var assignmentsCompleted: Int

    /// Time spent (in minutes)
    var timeSpentMinutes: Int

    /// Average score for the week
    var averageScore: Double?

    /// Days active
    var daysActive: Int
}

// MARK: - Progress Summary

/// Summary of a learner's progress across all subjects
struct ProgressSummary: Equatable, Sendable {
    /// Total sessions completed (all subjects)
    let totalSessions: Int

    /// Total assignments completed (all subjects)
    let totalAssignments: Int

    /// Total time spent (all subjects, in minutes)
    let totalTimeMinutes: Int

    /// Overall average score
    let overallAverageScore: Double?

    /// Current streak
    let currentStreak: Int

    /// Total achievements earned
    let totalAchievements: Int

    /// Total points earned
    let totalPoints: Int

    /// Subject-wise breakdown
    let subjectProgress: [SubjectProgress]

    /// Recent activity
    let recentActivity: [ActivityItem]
}

// MARK: - Subject Progress

/// Progress in a specific subject
struct SubjectProgress: Identifiable, Equatable, Sendable {
    var id: String { subject }

    /// Subject name
    let subject: String

    /// Progress percentage
    let progressPercentage: Double

    /// Skill level
    let skillLevel: SkillLevel

    /// Sessions completed
    let sessionsCompleted: Int

    /// Assignments completed
    let assignmentsCompleted: Int

    /// Average score
    let averageScore: Double?

    /// Last activity date
    let lastActivityAt: Date
}

// MARK: - Activity Item

/// Represents a recent activity item
struct ActivityItem: Identifiable, Equatable, Sendable {
    /// Unique identifier
    let id: String

    /// Activity type
    let activityType: ActivityType

    /// Activity title
    let title: String

    /// Activity description
    let description: String

    /// Related entity ID (session, assignment, etc.)
    var relatedId: String?

    /// Subject
    var subject: String?

    /// Timestamp
    let timestamp: Date

    /// Points earned (if any)
    var pointsEarned: Int?

    enum ActivityType: String, Codable, Sendable {
        case sessionCompleted = "SESSION_COMPLETED"
        case assignmentSubmitted = "ASSIGNMENT_SUBMITTED"
        case assignmentGraded = "ASSIGNMENT_GRADED"
        case achievementEarned = "ACHIEVEMENT_EARNED"
        case milestoneReached = "MILESTONE_REACHED"
        case streakMaintained = "STREAK_MAINTAINED"

        var displayName: String {
            switch self {
            case .sessionCompleted: return "Session Completed"
            case .assignmentSubmitted: return "Assignment Submitted"
            case .assignmentGraded: return "Assignment Graded"
            case .achievementEarned: return "Achievement Earned"
            case .milestoneReached: return "Milestone Reached"
            case .streakMaintained: return "Streak Maintained"
            }
        }

        var iconName: String {
            switch self {
            case .sessionCompleted: return "video.fill"
            case .assignmentSubmitted: return "arrow.up.doc.fill"
            case .assignmentGraded: return "checkmark.seal.fill"
            case .achievementEarned: return "star.fill"
            case .milestoneReached: return "flag.fill"
            case .streakMaintained: return "flame.fill"
            }
        }

        var colorName: String {
            switch self {
            case .sessionCompleted: return "blue"
            case .assignmentSubmitted: return "orange"
            case .assignmentGraded: return "green"
            case .achievementEarned: return "yellow"
            case .milestoneReached: return "purple"
            case .streakMaintained: return "red"
            }
        }
    }
}
