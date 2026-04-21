/**
 * NextPhoton EduCare - Domain Layer
 * Assignment Entity - Core domain model for assignments and homework
 *
 * This entity represents an assignment in the NextPhoton platform.
 * Assignments are tasks given by educators to learners, with
 * support for various submission types and grading.
 *
 * Assignment lifecycle:
 * DRAFT -> PUBLISHED -> (submissions) -> GRADED
 */
package com.nextphoton.domain.entities

import java.time.Duration
import java.time.Instant

/**
 * Represents an assignment in the NextPhoton platform
 *
 * @property id Unique identifier for the assignment
 * @property title Assignment title
 * @property description Detailed description and instructions
 * @property subject Academic subject for the assignment
 * @property educatorId ID of the educator who created the assignment
 * @property educatorName Name of the educator
 * @property learnerId ID of the learner assigned (if individual)
 * @property learnerName Name of the learner
 * @property dueDate Due date for submission
 * @property createdAt Assignment creation timestamp
 * @property updatedAt Last update timestamp
 * @property status Current status of the assignment
 * @property priority Assignment priority level
 * @property type Type of assignment
 * @property maxScore Maximum possible score
 * @property attachments List of attached files/resources
 * @property submission Learner's submission (if any)
 * @property estimatedDuration Estimated time to complete
 */
data class Assignment(
    val id: String,
    val title: String,
    val description: String,
    val subject: Subject,
    val educatorId: String,
    val educatorName: String,
    val learnerId: String,
    val learnerName: String,
    val dueDate: Instant,
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now(),
    val status: AssignmentStatus = AssignmentStatus.PENDING,
    val priority: AssignmentPriority = AssignmentPriority.MEDIUM,
    val type: AssignmentType = AssignmentType.HOMEWORK,
    val maxScore: Int = 100,
    val attachments: List<Attachment> = emptyList(),
    val submission: Submission? = null,
    val estimatedDuration: Duration? = null
) {
    /**
     * Checks if the assignment is overdue
     */
    val isOverdue: Boolean
        get() = Instant.now().isAfter(dueDate) && !isCompleted

    /**
     * Checks if the assignment is completed (submitted or graded)
     */
    val isCompleted: Boolean
        get() = status in listOf(
            AssignmentStatus.SUBMITTED,
            AssignmentStatus.GRADED,
            AssignmentStatus.LATE_SUBMITTED
        )

    /**
     * Checks if the assignment can still be submitted
     */
    val canSubmit: Boolean
        get() = status in listOf(
            AssignmentStatus.PENDING,
            AssignmentStatus.IN_PROGRESS,
            AssignmentStatus.OVERDUE
        )

    /**
     * Time remaining until due date
     */
    val timeRemaining: Duration?
        get() {
            val remaining = Duration.between(Instant.now(), dueDate)
            return if (remaining.isNegative) null else remaining
        }

    /**
     * Formats the time remaining as a human-readable string
     */
    val formattedTimeRemaining: String
        get() {
            val remaining = timeRemaining ?: return "Overdue"
            val days = remaining.toDays()
            val hours = remaining.toHours() % 24
            val minutes = remaining.toMinutes() % 60

            return when {
                days > 0 -> "$days day${if (days > 1) "s" else ""} left"
                hours > 0 -> "$hours hour${if (hours > 1) "s" else ""} left"
                minutes > 0 -> "$minutes minute${if (minutes > 1) "s" else ""} left"
                else -> "Due soon"
            }
        }

    /**
     * Gets the score as a percentage (if graded)
     */
    val scorePercentage: Float?
        get() = submission?.score?.let { (it.toFloat() / maxScore) * 100 }

    /**
     * Gets the grade letter (if graded)
     */
    val gradeLetter: String?
        get() = scorePercentage?.let { percentage ->
            when {
                percentage >= 90 -> "A"
                percentage >= 80 -> "B"
                percentage >= 70 -> "C"
                percentage >= 60 -> "D"
                else -> "F"
            }
        }
}

/**
 * Enumeration of assignment statuses
 */
enum class AssignmentStatus(val displayName: String) {
    DRAFT("Draft"),
    PENDING("Pending"),
    IN_PROGRESS("In Progress"),
    SUBMITTED("Submitted"),
    LATE_SUBMITTED("Late Submitted"),
    GRADED("Graded"),
    OVERDUE("Overdue"),
    CANCELLED("Cancelled")
}

/**
 * Enumeration of assignment priority levels
 */
enum class AssignmentPriority(val displayName: String, val weight: Int) {
    LOW("Low", 1),
    MEDIUM("Medium", 2),
    HIGH("High", 3),
    URGENT("Urgent", 4)
}

/**
 * Enumeration of assignment types
 */
enum class AssignmentType(val displayName: String) {
    HOMEWORK("Homework"),
    QUIZ("Quiz"),
    TEST("Test"),
    PROJECT("Project"),
    ESSAY("Essay"),
    LAB_REPORT("Lab Report"),
    PRESENTATION("Presentation"),
    READING("Reading"),
    PRACTICE("Practice")
}

/**
 * Represents a file attachment for an assignment
 */
data class Attachment(
    val id: String,
    val name: String,
    val url: String,
    val mimeType: String,
    val sizeBytes: Long,
    val uploadedAt: Instant = Instant.now()
) {
    /**
     * Formats the file size as a human-readable string
     */
    val formattedSize: String
        get() {
            val kb = sizeBytes / 1024.0
            val mb = kb / 1024.0
            val gb = mb / 1024.0

            return when {
                gb >= 1 -> String.format("%.2f GB", gb)
                mb >= 1 -> String.format("%.2f MB", mb)
                kb >= 1 -> String.format("%.2f KB", kb)
                else -> "$sizeBytes B"
            }
        }

    /**
     * Gets the file extension
     */
    val extension: String
        get() = name.substringAfterLast('.', "")

    /**
     * Checks if the attachment is an image
     */
    val isImage: Boolean
        get() = mimeType.startsWith("image/")

    /**
     * Checks if the attachment is a PDF
     */
    val isPdf: Boolean
        get() = mimeType == "application/pdf"
}

/**
 * Represents a learner's submission for an assignment
 */
data class Submission(
    val id: String,
    val assignmentId: String,
    val learnerId: String,
    val submittedAt: Instant,
    val content: String? = null,
    val attachments: List<Attachment> = emptyList(),
    val score: Int? = null,
    val feedback: String? = null,
    val gradedAt: Instant? = null,
    val gradedBy: String? = null
) {
    /**
     * Checks if the submission has been graded
     */
    val isGraded: Boolean
        get() = score != null && gradedAt != null
}

/**
 * Data class for assignment filter criteria
 */
data class AssignmentFilter(
    val status: AssignmentStatus? = null,
    val subject: Subject? = null,
    val educatorId: String? = null,
    val learnerId: String? = null,
    val priority: AssignmentPriority? = null,
    val type: AssignmentType? = null,
    val overdueOnly: Boolean = false,
    val dueBefore: Instant? = null,
    val dueAfter: Instant? = null
)

/**
 * Data class for assignment creation request
 */
data class CreateAssignmentRequest(
    val title: String,
    val description: String,
    val subject: Subject,
    val learnerId: String,
    val dueDate: Instant,
    val priority: AssignmentPriority = AssignmentPriority.MEDIUM,
    val type: AssignmentType = AssignmentType.HOMEWORK,
    val maxScore: Int = 100,
    val estimatedDuration: Duration? = null
)
