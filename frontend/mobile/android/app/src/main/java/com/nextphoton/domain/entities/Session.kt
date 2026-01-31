/**
 * NextPhoton EduCare - Domain Layer
 * Session Entity - Core domain model for tutoring sessions
 *
 * This entity represents a tutoring session in the NextPhoton platform.
 * Sessions are the core product of NextPhoton, connecting educators
 * with learners for personalized education.
 *
 * Session lifecycle:
 * SCHEDULED -> IN_PROGRESS -> COMPLETED
 *           -> CANCELLED (from any state)
 */
package com.nextphoton.domain.entities

import java.time.Duration
import java.time.Instant
import java.time.LocalDate
import java.time.LocalTime
import java.time.ZoneId

/**
 * Represents a tutoring session in the NextPhoton platform
 *
 * @property id Unique identifier for the session
 * @property title Session title or subject
 * @property description Detailed description of session content
 * @property subject Academic subject for the session
 * @property educatorId ID of the educator conducting the session
 * @property educatorName Display name of the educator
 * @property educatorAvatarUrl Educator's profile picture URL
 * @property learnerId ID of the learner attending the session
 * @property learnerName Display name of the learner
 * @property scheduledAt Scheduled start time of the session
 * @property duration Duration of the session
 * @property status Current status of the session
 * @property sessionType Type of session (online/in-person)
 * @property meetingUrl URL for online sessions (Zoom, Meet, etc.)
 * @property location Physical location for in-person sessions
 * @property notes Additional notes for the session
 * @property rating Learner's rating of the session (1-5)
 * @property feedback Learner's feedback text
 * @property createdAt Session creation timestamp
 * @property updatedAt Last update timestamp
 */
data class Session(
    val id: String,
    val title: String,
    val description: String? = null,
    val subject: Subject,
    val educatorId: String,
    val educatorName: String,
    val educatorAvatarUrl: String? = null,
    val learnerId: String,
    val learnerName: String,
    val scheduledAt: Instant,
    val duration: Duration = Duration.ofHours(1),
    val status: SessionStatus = SessionStatus.SCHEDULED,
    val sessionType: SessionType = SessionType.ONLINE,
    val meetingUrl: String? = null,
    val location: String? = null,
    val notes: String? = null,
    val rating: Int? = null,
    val feedback: String? = null,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
) {
    /**
     * Calculated end time of the session
     */
    val endTime: Instant
        get() = scheduledAt.plus(duration)

    /**
     * Checks if the session is happening today
     */
    fun isToday(zoneId: ZoneId = ZoneId.systemDefault()): Boolean {
        val sessionDate = LocalDate.ofInstant(scheduledAt, zoneId)
        val today = LocalDate.now(zoneId)
        return sessionDate == today
    }

    /**
     * Checks if the session is in the future
     */
    val isUpcoming: Boolean
        get() = scheduledAt.isAfter(Instant.now()) && status == SessionStatus.SCHEDULED

    /**
     * Checks if the session is currently in progress
     */
    val isInProgress: Boolean
        get() {
            val now = Instant.now()
            return now.isAfter(scheduledAt) && now.isBefore(endTime) &&
                    status == SessionStatus.IN_PROGRESS
        }

    /**
     * Checks if the session can be cancelled
     */
    val canCancel: Boolean
        get() = status == SessionStatus.SCHEDULED &&
                scheduledAt.isAfter(Instant.now().plus(Duration.ofHours(24)))

    /**
     * Checks if the session can be rescheduled
     */
    val canReschedule: Boolean
        get() = status == SessionStatus.SCHEDULED &&
                scheduledAt.isAfter(Instant.now().plus(Duration.ofHours(48)))

    /**
     * Gets the session time as LocalTime for display
     */
    fun getLocalTime(zoneId: ZoneId = ZoneId.systemDefault()): LocalTime {
        return LocalTime.ofInstant(scheduledAt, zoneId)
    }

    /**
     * Gets the session date as LocalDate for display
     */
    fun getLocalDate(zoneId: ZoneId = ZoneId.systemDefault()): LocalDate {
        return LocalDate.ofInstant(scheduledAt, zoneId)
    }

    /**
     * Formats the duration as a human-readable string
     */
    val formattedDuration: String
        get() {
            val hours = duration.toHours()
            val minutes = duration.toMinutes() % 60
            return when {
                hours > 0 && minutes > 0 -> "${hours}h ${minutes}m"
                hours > 0 -> "${hours}h"
                else -> "${minutes}m"
            }
        }
}

/**
 * Enumeration of session statuses
 */
enum class SessionStatus(val displayName: String) {
    SCHEDULED("Scheduled"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled"),
    NO_SHOW("No Show")
}

/**
 * Enumeration of session types
 */
enum class SessionType(val displayName: String) {
    ONLINE("Online"),
    IN_PERSON("In Person"),
    HYBRID("Hybrid")
}

/**
 * Enumeration of academic subjects
 */
enum class Subject(val displayName: String, val icon: String) {
    MATHEMATICS("Mathematics", "calculate"),
    PHYSICS("Physics", "science"),
    CHEMISTRY("Chemistry", "science"),
    BIOLOGY("Biology", "biotech"),
    ENGLISH("English", "menu_book"),
    HISTORY("History", "history_edu"),
    GEOGRAPHY("Geography", "public"),
    COMPUTER_SCIENCE("Computer Science", "computer"),
    ECONOMICS("Economics", "trending_up"),
    BUSINESS("Business Studies", "business"),
    ART("Art", "palette"),
    MUSIC("Music", "music_note"),
    PHYSICAL_EDUCATION("Physical Education", "fitness_center"),
    FOREIGN_LANGUAGE("Foreign Language", "translate"),
    GENERAL("General", "school")
}

/**
 * Data class for session booking request
 */
data class SessionBookingRequest(
    val educatorId: String,
    val learnerId: String,
    val subject: Subject,
    val title: String,
    val description: String? = null,
    val scheduledAt: Instant,
    val duration: Duration,
    val sessionType: SessionType,
    val notes: String? = null
)

/**
 * Data class for session filter criteria
 */
data class SessionFilter(
    val status: SessionStatus? = null,
    val subject: Subject? = null,
    val educatorId: String? = null,
    val learnerId: String? = null,
    val fromDate: LocalDate? = null,
    val toDate: LocalDate? = null,
    val sessionType: SessionType? = null
)
