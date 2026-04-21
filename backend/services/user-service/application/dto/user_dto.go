package dto

import (
	"time"

	"github.com/nextphoton/user-service/domain/entities"
)

// CreateUserInput represents the input for creating a new user
type CreateUserInput struct {
	AuthID         string   `json:"authId"`
	Email          string   `json:"email"`
	FirstName      string   `json:"firstName"`
	LastName       string   `json:"lastName"`
	DisplayName    *string  `json:"displayName,omitempty"`
	AvatarURL      *string  `json:"avatarUrl,omitempty"`
	PhoneNumber    *string  `json:"phoneNumber,omitempty"`
	DateOfBirth    *string  `json:"dateOfBirth,omitempty"` // ISO date string
	Gender         *string  `json:"gender,omitempty"`
	Timezone       *string  `json:"timezone,omitempty"`
	Locale         *string  `json:"locale,omitempty"`
	OrganizationID *string  `json:"organizationId,omitempty"`
	Roles          []string `json:"roles,omitempty"` // Initial roles to assign
}

// UpdateUserInput represents the input for updating a user
type UpdateUserInput struct {
	ID             string  `json:"id"`
	FirstName      *string `json:"firstName,omitempty"`
	LastName       *string `json:"lastName,omitempty"`
	DisplayName    *string `json:"displayName,omitempty"`
	AvatarURL      *string `json:"avatarUrl,omitempty"`
	PhoneNumber    *string `json:"phoneNumber,omitempty"`
	DateOfBirth    *string `json:"dateOfBirth,omitempty"`
	Gender         *string `json:"gender,omitempty"`
	Timezone       *string `json:"timezone,omitempty"`
	Locale         *string `json:"locale,omitempty"`
	IsActive       *bool   `json:"isActive,omitempty"`
	IsVerified     *bool   `json:"isVerified,omitempty"`
	OrganizationID *string `json:"organizationId,omitempty"`
}

// UserResponse represents the response for a user
type UserResponse struct {
	ID             string              `json:"id"`
	AuthID         string              `json:"authId"`
	Email          string              `json:"email"`
	FirstName      string              `json:"firstName"`
	LastName       string              `json:"lastName"`
	DisplayName    string              `json:"displayName"`
	AvatarURL      *string             `json:"avatarUrl,omitempty"`
	PhoneNumber    *string             `json:"phoneNumber,omitempty"`
	DateOfBirth    *time.Time          `json:"dateOfBirth,omitempty"`
	Gender         *string             `json:"gender,omitempty"`
	Timezone       string              `json:"timezone"`
	Locale         string              `json:"locale"`
	IsActive       bool                `json:"isActive"`
	IsVerified     bool                `json:"isVerified"`
	LastLoginAt    *time.Time          `json:"lastLoginAt,omitempty"`
	OrganizationID *string             `json:"organizationId,omitempty"`
	Roles          []UserRoleResponse  `json:"roles,omitempty"`
	CreatedAt      time.Time           `json:"createdAt"`
	UpdatedAt      time.Time           `json:"updatedAt"`
}

// UserRoleResponse represents a role assigned to a user
type UserRoleResponse struct {
	ID         string           `json:"id"`
	RoleID     string           `json:"roleId"`
	RoleType   entities.RoleType `json:"roleType"`
	IsActive   bool             `json:"isActive"`
	AssignedAt time.Time        `json:"assignedAt"`
	ExpiresAt  *time.Time       `json:"expiresAt,omitempty"`
}

// UserListResponse represents a paginated list of users
type UserListResponse struct {
	Users      []UserResponse `json:"users"`
	TotalCount int            `json:"totalCount"`
	HasMore    bool           `json:"hasMore"`
	Cursor     *string        `json:"cursor,omitempty"`
}

// AssignRoleInput represents the input for assigning a role to a user
type AssignRoleInput struct {
	UserID         string  `json:"userId"`
	RoleType       string  `json:"roleType"`
	OrganizationID *string `json:"organizationId,omitempty"`
	ExpiresAt      *string `json:"expiresAt,omitempty"` // ISO date string
}

// RemoveRoleInput represents the input for removing a role from a user
type RemoveRoleInput struct {
	UserID string `json:"userId"`
	RoleID string `json:"roleId"`
}

// GrantPermissionInput represents the input for granting a permission to a user
type GrantPermissionInput struct {
	UserID         string            `json:"userId"`
	Resource       string            `json:"resource"`
	Action         string            `json:"action"`
	Conditions     map[string]string `json:"conditions,omitempty"`
	OrganizationID *string           `json:"organizationId,omitempty"`
	ExpiresAt      *string           `json:"expiresAt,omitempty"`
}

// RevokePermissionInput represents the input for revoking a permission from a user
type RevokePermissionInput struct {
	UserID       string `json:"userId"`
	PermissionID string `json:"permissionId"`
}

// UserPermissionResponse represents a permission granted to a user
type UserPermissionResponse struct {
	ID             string            `json:"id"`
	PermissionID   string            `json:"permissionId"`
	Resource       string            `json:"resource"`
	Action         string            `json:"action"`
	IsGranted      bool              `json:"isGranted"`
	Conditions     map[string]string `json:"conditions,omitempty"`
	OrganizationID *string           `json:"organizationId,omitempty"`
	GrantedAt      time.Time         `json:"grantedAt"`
	ExpiresAt      *time.Time        `json:"expiresAt,omitempty"`
}

// CreateLearnerProfileInput represents the input for creating a learner profile
type CreateLearnerProfileInput struct {
	UserID            string   `json:"userId"`
	StudentID         *string  `json:"studentId,omitempty"`
	GradeLevel        *string  `json:"gradeLevel,omitempty"`
	EnrollmentDate    *string  `json:"enrollmentDate,omitempty"`
	GraduationDate    *string  `json:"graduationDate,omitempty"`
	LearningStyle     *string  `json:"learningStyle,omitempty"`
	SpecialNeeds      *string  `json:"specialNeeds,omitempty"`
	GuardianIDs       []string `json:"guardianIds,omitempty"`
	PreferredSubjects []string `json:"preferredSubjects,omitempty"`
	OrganizationID    *string  `json:"organizationId,omitempty"`
}

// UpdateLearnerProfileInput represents the input for updating a learner profile
type UpdateLearnerProfileInput struct {
	UserID            string   `json:"userId"`
	StudentID         *string  `json:"studentId,omitempty"`
	GradeLevel        *string  `json:"gradeLevel,omitempty"`
	EnrollmentDate    *string  `json:"enrollmentDate,omitempty"`
	GraduationDate    *string  `json:"graduationDate,omitempty"`
	LearningStyle     *string  `json:"learningStyle,omitempty"`
	SpecialNeeds      *string  `json:"specialNeeds,omitempty"`
	GuardianIDs       []string `json:"guardianIds,omitempty"`
	PreferredSubjects []string `json:"preferredSubjects,omitempty"`
	Status            *string  `json:"status,omitempty"`
}

// CreateGuardianProfileInput represents the input for creating a guardian profile
type CreateGuardianProfileInput struct {
	UserID                 string   `json:"userId"`
	Relationship           string   `json:"relationship"`
	LearnerIDs             []string `json:"learnerIds,omitempty"`
	Occupation             *string  `json:"occupation,omitempty"`
	WorkPhone              *string  `json:"workPhone,omitempty"`
	EmergencyContact       bool     `json:"emergencyContact"`
	CanPickup              bool     `json:"canPickup"`
	CanReceiveGrades       bool     `json:"canReceiveGrades"`
	CanReceiveAlerts       bool     `json:"canReceiveAlerts"`
	PreferredContactMethod *string  `json:"preferredContactMethod,omitempty"`
	OrganizationID         *string  `json:"organizationId,omitempty"`
}

// UpdateGuardianProfileInput represents the input for updating a guardian profile
type UpdateGuardianProfileInput struct {
	UserID                 string   `json:"userId"`
	Relationship           *string  `json:"relationship,omitempty"`
	LearnerIDs             []string `json:"learnerIds,omitempty"`
	Occupation             *string  `json:"occupation,omitempty"`
	WorkPhone              *string  `json:"workPhone,omitempty"`
	EmergencyContact       *bool    `json:"emergencyContact,omitempty"`
	CanPickup              *bool    `json:"canPickup,omitempty"`
	CanReceiveGrades       *bool    `json:"canReceiveGrades,omitempty"`
	CanReceiveAlerts       *bool    `json:"canReceiveAlerts,omitempty"`
	PreferredContactMethod *string  `json:"preferredContactMethod,omitempty"`
	Status                 *string  `json:"status,omitempty"`
}

// CreateEducatorProfileInput represents the input for creating an educator profile
type CreateEducatorProfileInput struct {
	UserID            string   `json:"userId"`
	EmployeeID        *string  `json:"employeeId,omitempty"`
	Title             *string  `json:"title,omitempty"`
	Department        *string  `json:"department,omitempty"`
	Specializations   []string `json:"specializations,omitempty"`
	Certifications    []string `json:"certifications,omitempty"`
	YearsOfExperience *int     `json:"yearsOfExperience,omitempty"`
	Education         *string  `json:"education,omitempty"`
	Bio               *string  `json:"bio,omitempty"`
	OfficeLocation    *string  `json:"officeLocation,omitempty"`
	OfficeHours       *string  `json:"officeHours,omitempty"`
	MaxStudents       *int     `json:"maxStudents,omitempty"`
	HireDate          *string  `json:"hireDate,omitempty"`
	OrganizationID    *string  `json:"organizationId,omitempty"`
}

// UpdateEducatorProfileInput represents the input for updating an educator profile
type UpdateEducatorProfileInput struct {
	UserID            string   `json:"userId"`
	EmployeeID        *string  `json:"employeeId,omitempty"`
	Title             *string  `json:"title,omitempty"`
	Department        *string  `json:"department,omitempty"`
	Specializations   []string `json:"specializations,omitempty"`
	Certifications    []string `json:"certifications,omitempty"`
	YearsOfExperience *int     `json:"yearsOfExperience,omitempty"`
	Education         *string  `json:"education,omitempty"`
	Bio               *string  `json:"bio,omitempty"`
	OfficeLocation    *string  `json:"officeLocation,omitempty"`
	OfficeHours       *string  `json:"officeHours,omitempty"`
	MaxStudents       *int     `json:"maxStudents,omitempty"`
	Status            *string  `json:"status,omitempty"`
}

// CreateECMProfileInput represents the input for creating an ECM profile
type CreateECMProfileInput struct {
	UserID               string   `json:"userId"`
	EmployeeID           *string  `json:"employeeId,omitempty"`
	Title                *string  `json:"title,omitempty"`
	Department           *string  `json:"department,omitempty"`
	ContentAreas         []string `json:"contentAreas,omitempty"`
	ManagedCurriculumIDs []string `json:"managedCurriculumIds,omitempty"`
	ApprovalLevel        *int     `json:"approvalLevel,omitempty"`
	CanPublish           bool     `json:"canPublish"`
	CanArchive           bool     `json:"canArchive"`
	CanApprove           bool     `json:"canApprove"`
	OrganizationID       *string  `json:"organizationId,omitempty"`
}

// UpdateECMProfileInput represents the input for updating an ECM profile
type UpdateECMProfileInput struct {
	UserID               string   `json:"userId"`
	EmployeeID           *string  `json:"employeeId,omitempty"`
	Title                *string  `json:"title,omitempty"`
	Department           *string  `json:"department,omitempty"`
	ContentAreas         []string `json:"contentAreas,omitempty"`
	ManagedCurriculumIDs []string `json:"managedCurriculumIds,omitempty"`
	ApprovalLevel        *int     `json:"approvalLevel,omitempty"`
	CanPublish           *bool    `json:"canPublish,omitempty"`
	CanArchive           *bool    `json:"canArchive,omitempty"`
	CanApprove           *bool    `json:"canApprove,omitempty"`
	Status               *string  `json:"status,omitempty"`
}

// CreateEmployeeProfileInput represents the input for creating an employee profile
type CreateEmployeeProfileInput struct {
	UserID         string   `json:"userId"`
	EmployeeID     *string  `json:"employeeId,omitempty"`
	Title          *string  `json:"title,omitempty"`
	Department     *string  `json:"department,omitempty"`
	ManagerID      *string  `json:"managerId,omitempty"`
	EmploymentType *string  `json:"employmentType,omitempty"`
	HireDate       *string  `json:"hireDate,omitempty"`
	WorkLocation   *string  `json:"workLocation,omitempty"`
	Skills         []string `json:"skills,omitempty"`
	OrganizationID *string  `json:"organizationId,omitempty"`
}

// UpdateEmployeeProfileInput represents the input for updating an employee profile
type UpdateEmployeeProfileInput struct {
	UserID         string   `json:"userId"`
	EmployeeID     *string  `json:"employeeId,omitempty"`
	Title          *string  `json:"title,omitempty"`
	Department     *string  `json:"department,omitempty"`
	ManagerID      *string  `json:"managerId,omitempty"`
	EmploymentType *string  `json:"employmentType,omitempty"`
	EndDate        *string  `json:"endDate,omitempty"`
	WorkLocation   *string  `json:"workLocation,omitempty"`
	Skills         []string `json:"skills,omitempty"`
	Status         *string  `json:"status,omitempty"`
}

// CreateInternProfileInput represents the input for creating an intern profile
type CreateInternProfileInput struct {
	UserID             string   `json:"userId"`
	InternID           *string  `json:"internId,omitempty"`
	University         *string  `json:"university,omitempty"`
	Major              *string  `json:"major,omitempty"`
	ExpectedGraduation *string  `json:"expectedGraduation,omitempty"`
	InternshipStart    *string  `json:"internshipStart,omitempty"`
	InternshipEnd      *string  `json:"internshipEnd,omitempty"`
	Department         *string  `json:"department,omitempty"`
	MentorID           *string  `json:"mentorId,omitempty"`
	SupervisorID       *string  `json:"supervisorId,omitempty"`
	Projects           []string `json:"projects,omitempty"`
	Goals              *string  `json:"goals,omitempty"`
	HoursPerWeek       *int     `json:"hoursPerWeek,omitempty"`
	IsPaid             bool     `json:"isPaid"`
	OrganizationID     *string  `json:"organizationId,omitempty"`
}

// UpdateInternProfileInput represents the input for updating an intern profile
type UpdateInternProfileInput struct {
	UserID             string   `json:"userId"`
	InternID           *string  `json:"internId,omitempty"`
	University         *string  `json:"university,omitempty"`
	Major              *string  `json:"major,omitempty"`
	ExpectedGraduation *string  `json:"expectedGraduation,omitempty"`
	InternshipEnd      *string  `json:"internshipEnd,omitempty"`
	Department         *string  `json:"department,omitempty"`
	MentorID           *string  `json:"mentorId,omitempty"`
	SupervisorID       *string  `json:"supervisorId,omitempty"`
	Projects           []string `json:"projects,omitempty"`
	Goals              *string  `json:"goals,omitempty"`
	FeedbackNotes      *string  `json:"feedbackNotes,omitempty"`
	HoursPerWeek       *int     `json:"hoursPerWeek,omitempty"`
	IsPaid             *bool    `json:"isPaid,omitempty"`
	Status             *string  `json:"status,omitempty"`
}

// CreateAdminProfileInput represents the input for creating an admin profile
type CreateAdminProfileInput struct {
	UserID            string   `json:"userId"`
	EmployeeID        *string  `json:"employeeId,omitempty"`
	AdminLevel        int      `json:"adminLevel"`
	ManagedOrgIDs     []string `json:"managedOrgIds,omitempty"`
	ManagedDepts      []string `json:"managedDepts,omitempty"`
	CanManageUsers    bool     `json:"canManageUsers"`
	CanManageRoles    bool     `json:"canManageRoles"`
	CanManageOrgs     bool     `json:"canManageOrgs"`
	CanViewAnalytics  bool     `json:"canViewAnalytics"`
	CanManageBilling  bool     `json:"canManageBilling"`
	AuditLogAccess    bool     `json:"auditLogAccess"`
	APIAccess         bool     `json:"apiAccess"`
	TwoFactorRequired bool     `json:"twoFactorRequired"`
	OrganizationID    *string  `json:"organizationId,omitempty"`
}

// UpdateAdminProfileInput represents the input for updating an admin profile
type UpdateAdminProfileInput struct {
	UserID            string   `json:"userId"`
	EmployeeID        *string  `json:"employeeId,omitempty"`
	AdminLevel        *int     `json:"adminLevel,omitempty"`
	ManagedOrgIDs     []string `json:"managedOrgIds,omitempty"`
	ManagedDepts      []string `json:"managedDepts,omitempty"`
	CanManageUsers    *bool    `json:"canManageUsers,omitempty"`
	CanManageRoles    *bool    `json:"canManageRoles,omitempty"`
	CanManageOrgs     *bool    `json:"canManageOrgs,omitempty"`
	CanViewAnalytics  *bool    `json:"canViewAnalytics,omitempty"`
	CanManageBilling  *bool    `json:"canManageBilling,omitempty"`
	AuditLogAccess    *bool    `json:"auditLogAccess,omitempty"`
	APIAccess         *bool    `json:"apiAccess,omitempty"`
	TwoFactorRequired *bool    `json:"twoFactorRequired,omitempty"`
	Status            *string  `json:"status,omitempty"`
}

// ProfileResponse represents a generic profile response
type ProfileResponse struct {
	ID             string                `json:"id"`
	UserID         string                `json:"userId"`
	Status         entities.ProfileStatus `json:"status"`
	OrganizationID *string               `json:"organizationId,omitempty"`
	CreatedAt      time.Time             `json:"createdAt"`
	UpdatedAt      time.Time             `json:"updatedAt"`
}

// OrganizationInput represents the input for creating/updating an organization
type OrganizationInput struct {
	Name        string  `json:"name"`
	Slug        *string `json:"slug,omitempty"`
	Description *string `json:"description,omitempty"`
	LogoURL     *string `json:"logoUrl,omitempty"`
	Website     *string `json:"website,omitempty"`
	IsActive    *bool   `json:"isActive,omitempty"`
	Settings    *string `json:"settings,omitempty"`
}

// OrganizationResponse represents an organization response
type OrganizationResponse struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description,omitempty"`
	LogoURL     *string    `json:"logoUrl,omitempty"`
	Website     *string    `json:"website,omitempty"`
	IsActive    bool       `json:"isActive"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// ToUserResponse converts a User entity to a UserResponse DTO
func ToUserResponse(user *entities.User) *UserResponse {
	if user == nil {
		return nil
	}

	response := &UserResponse{
		ID:             user.ID,
		AuthID:         user.AuthID,
		Email:          user.Email,
		FirstName:      user.FirstName,
		LastName:       user.LastName,
		DisplayName:    user.DisplayName,
		AvatarURL:      user.AvatarURL,
		PhoneNumber:    user.PhoneNumber,
		DateOfBirth:    user.DateOfBirth,
		Gender:         user.Gender,
		Timezone:       user.Timezone,
		Locale:         user.Locale,
		IsActive:       user.IsActive,
		IsVerified:     user.IsVerified,
		LastLoginAt:    user.LastLoginAt,
		OrganizationID: user.OrganizationID,
		CreatedAt:      user.CreatedAt,
		UpdatedAt:      user.UpdatedAt,
	}

	// Convert roles
	for _, role := range user.Roles {
		response.Roles = append(response.Roles, UserRoleResponse{
			ID:         role.ID,
			RoleID:     role.RoleID,
			RoleType:   role.RoleType,
			IsActive:   role.IsActive,
			AssignedAt: role.AssignedAt,
			ExpiresAt:  role.ExpiresAt,
		})
	}

	return response
}

// ToUserListResponse converts a list of User entities to a UserListResponse DTO
func ToUserListResponse(users []entities.User, totalCount int, hasMore bool, cursor *string) *UserListResponse {
	response := &UserListResponse{
		TotalCount: totalCount,
		HasMore:    hasMore,
		Cursor:     cursor,
	}

	for _, user := range users {
		userCopy := user // Create a copy to avoid pointer issues
		response.Users = append(response.Users, *ToUserResponse(&userCopy))
	}

	return response
}
