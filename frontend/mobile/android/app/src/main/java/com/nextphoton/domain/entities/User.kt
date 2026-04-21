/**
 * NextPhoton EduCare - Domain Layer
 * User Entity - Core domain model for user data
 *
 * This entity represents a user in the NextPhoton platform.
 * It follows Clean Architecture principles by being a pure Kotlin
 * data class with no dependencies on external frameworks.
 *
 * User roles in NextPhoton:
 * - LEARNER: Students receiving education
 * - GUARDIAN: Parents/guardians monitoring learners
 * - EDUCATOR: Teachers providing sessions
 * - ECM: EduCare Managers overseeing educators
 * - EMPLOYEE: Staff members
 * - INTERN: Training staff
 * - ADMIN: System administrators
 */
package com.nextphoton.domain.entities

import java.time.Instant

/**
 * Represents a user in the NextPhoton EduCare platform
 *
 * @property id Unique identifier for the user
 * @property email User's email address (unique)
 * @property firstName User's first name
 * @property lastName User's last name
 * @property displayName Full display name (computed from first + last)
 * @property avatarUrl URL to user's profile picture
 * @property role User's role in the system
 * @property phoneNumber User's phone number (optional)
 * @property isEmailVerified Whether the user's email is verified
 * @property isActive Whether the user account is active
 * @property timezone User's preferred timezone
 * @property languageCode User's preferred language
 * @property createdAt Account creation timestamp
 * @property updatedAt Last update timestamp
 */
data class User(
    val id: String,
    val email: String,
    val firstName: String,
    val lastName: String,
    val displayName: String = "$firstName $lastName",
    val avatarUrl: String? = null,
    val role: UserRole,
    val phoneNumber: String? = null,
    val isEmailVerified: Boolean = false,
    val isActive: Boolean = true,
    val timezone: String = "UTC",
    val languageCode: String = "en",
    val createdAt: Instant = Instant.now(),
    val updatedAt: Instant = Instant.now()
) {
    /**
     * Returns the user's initials for avatar placeholder
     */
    val initials: String
        get() = "${firstName.firstOrNull()?.uppercase() ?: ""}${lastName.firstOrNull()?.uppercase() ?: ""}"

    /**
     * Checks if the user has a specific permission based on role
     */
    fun hasPermission(permission: Permission): Boolean {
        return role.permissions.contains(permission)
    }

    /**
     * Checks if the user can view another user's data
     */
    fun canView(otherUser: User): Boolean {
        return when (role) {
            UserRole.ADMIN -> true
            UserRole.ECM -> otherUser.role in listOf(UserRole.EDUCATOR, UserRole.LEARNER)
            UserRole.EDUCATOR -> otherUser.role == UserRole.LEARNER
            UserRole.GUARDIAN -> false // Handled separately with relationships
            else -> id == otherUser.id
        }
    }
}

/**
 * Enumeration of user roles in the NextPhoton platform
 *
 * Each role has a specific set of permissions that determine
 * what actions the user can perform in the system.
 */
enum class UserRole(val displayName: String, val permissions: Set<Permission>) {
    LEARNER(
        displayName = "Learner",
        permissions = setOf(
            Permission.VIEW_OWN_SESSIONS,
            Permission.VIEW_OWN_ASSIGNMENTS,
            Permission.SUBMIT_ASSIGNMENTS,
            Permission.VIEW_OWN_PROGRESS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    GUARDIAN(
        displayName = "Guardian",
        permissions = setOf(
            Permission.VIEW_LEARNER_SESSIONS,
            Permission.VIEW_LEARNER_ASSIGNMENTS,
            Permission.VIEW_LEARNER_PROGRESS,
            Permission.BOOK_SESSIONS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    EDUCATOR(
        displayName = "Educator",
        permissions = setOf(
            Permission.VIEW_OWN_SESSIONS,
            Permission.CREATE_SESSIONS,
            Permission.MANAGE_ASSIGNMENTS,
            Permission.VIEW_LEARNER_PROGRESS,
            Permission.GRADE_ASSIGNMENTS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    ECM(
        displayName = "EduCare Manager",
        permissions = setOf(
            Permission.VIEW_ALL_SESSIONS,
            Permission.MANAGE_EDUCATORS,
            Permission.VIEW_ANALYTICS,
            Permission.MANAGE_ASSIGNMENTS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    EMPLOYEE(
        displayName = "Employee",
        permissions = setOf(
            Permission.VIEW_ANALYTICS,
            Permission.VIEW_ALL_SESSIONS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    INTERN(
        displayName = "Intern",
        permissions = setOf(
            Permission.VIEW_OWN_SESSIONS,
            Permission.UPDATE_OWN_PROFILE
        )
    ),

    ADMIN(
        displayName = "Administrator",
        permissions = Permission.entries.toSet() // All permissions
    )
}

/**
 * Enumeration of permissions in the NextPhoton platform
 *
 * These permissions are used for ABAC (Attribute-Based Access Control)
 * to determine what actions users can perform.
 */
enum class Permission {
    // Session permissions
    VIEW_OWN_SESSIONS,
    VIEW_ALL_SESSIONS,
    VIEW_LEARNER_SESSIONS,
    CREATE_SESSIONS,
    BOOK_SESSIONS,

    // Assignment permissions
    VIEW_OWN_ASSIGNMENTS,
    VIEW_LEARNER_ASSIGNMENTS,
    MANAGE_ASSIGNMENTS,
    SUBMIT_ASSIGNMENTS,
    GRADE_ASSIGNMENTS,

    // Progress permissions
    VIEW_OWN_PROGRESS,
    VIEW_LEARNER_PROGRESS,
    VIEW_ALL_PROGRESS,

    // User management permissions
    UPDATE_OWN_PROFILE,
    MANAGE_EDUCATORS,
    MANAGE_USERS,

    // Analytics permissions
    VIEW_ANALYTICS,
    VIEW_REPORTS,

    // Admin permissions
    SYSTEM_SETTINGS,
    MANAGE_ROLES
}
