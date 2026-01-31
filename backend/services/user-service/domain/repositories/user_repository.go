package repositories

import (
	"context"

	"github.com/nextphoton/user-service/domain/entities"
)

// UserRepository defines the interface for user data operations
type UserRepository interface {
	// User CRUD operations
	Create(ctx context.Context, user *entities.User) (*entities.User, error)
	GetByID(ctx context.Context, id string) (*entities.User, error)
	GetByAuthID(ctx context.Context, authID string) (*entities.User, error)
	GetByEmail(ctx context.Context, email string) (*entities.User, error)
	Update(ctx context.Context, user *entities.User) (*entities.User, error)
	Delete(ctx context.Context, id string) error
	SoftDelete(ctx context.Context, id string) error
	List(ctx context.Context, filter UserFilter, pagination Pagination) (*UserList, error)

	// Role operations
	AssignRole(ctx context.Context, userRole *entities.UserRole) (*entities.UserRole, error)
	RemoveRole(ctx context.Context, userID string, roleID string) error
	GetUserRoles(ctx context.Context, userID string) ([]entities.UserRole, error)
	UpdateUserRole(ctx context.Context, userRole *entities.UserRole) (*entities.UserRole, error)

	// Permission operations
	GrantPermission(ctx context.Context, permission *entities.UserPermission) (*entities.UserPermission, error)
	RevokePermission(ctx context.Context, userID string, permissionID string) error
	GetUserPermissions(ctx context.Context, userID string) ([]entities.UserPermission, error)
	CheckPermission(ctx context.Context, userID string, resource string, action string) (bool, error)

	// Organization membership
	GetByOrganization(ctx context.Context, orgID string, pagination Pagination) (*UserList, error)
	AddToOrganization(ctx context.Context, userID string, orgID string, role string) error
	RemoveFromOrganization(ctx context.Context, userID string, orgID string) error
}

// ProfileRepository defines the interface for profile data operations
type ProfileRepository interface {
	// Learner Profile
	CreateLearnerProfile(ctx context.Context, profile *entities.LearnerProfile) (*entities.LearnerProfile, error)
	GetLearnerProfile(ctx context.Context, userID string) (*entities.LearnerProfile, error)
	UpdateLearnerProfile(ctx context.Context, profile *entities.LearnerProfile) (*entities.LearnerProfile, error)
	DeleteLearnerProfile(ctx context.Context, userID string) error

	// Guardian Profile
	CreateGuardianProfile(ctx context.Context, profile *entities.GuardianProfile) (*entities.GuardianProfile, error)
	GetGuardianProfile(ctx context.Context, userID string) (*entities.GuardianProfile, error)
	UpdateGuardianProfile(ctx context.Context, profile *entities.GuardianProfile) (*entities.GuardianProfile, error)
	DeleteGuardianProfile(ctx context.Context, userID string) error
	GetGuardiansByLearner(ctx context.Context, learnerID string) ([]entities.GuardianProfile, error)

	// Educator Profile
	CreateEducatorProfile(ctx context.Context, profile *entities.EducatorProfile) (*entities.EducatorProfile, error)
	GetEducatorProfile(ctx context.Context, userID string) (*entities.EducatorProfile, error)
	UpdateEducatorProfile(ctx context.Context, profile *entities.EducatorProfile) (*entities.EducatorProfile, error)
	DeleteEducatorProfile(ctx context.Context, userID string) error
	GetEducatorsByDepartment(ctx context.Context, department string) ([]entities.EducatorProfile, error)

	// ECM Profile
	CreateECMProfile(ctx context.Context, profile *entities.ECMProfile) (*entities.ECMProfile, error)
	GetECMProfile(ctx context.Context, userID string) (*entities.ECMProfile, error)
	UpdateECMProfile(ctx context.Context, profile *entities.ECMProfile) (*entities.ECMProfile, error)
	DeleteECMProfile(ctx context.Context, userID string) error

	// Employee Profile
	CreateEmployeeProfile(ctx context.Context, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	GetEmployeeProfile(ctx context.Context, userID string) (*entities.EmployeeProfile, error)
	UpdateEmployeeProfile(ctx context.Context, profile *entities.EmployeeProfile) (*entities.EmployeeProfile, error)
	DeleteEmployeeProfile(ctx context.Context, userID string) error
	GetEmployeesByDepartment(ctx context.Context, department string) ([]entities.EmployeeProfile, error)
	GetDirectReports(ctx context.Context, managerID string) ([]entities.EmployeeProfile, error)

	// Intern Profile
	CreateInternProfile(ctx context.Context, profile *entities.InternProfile) (*entities.InternProfile, error)
	GetInternProfile(ctx context.Context, userID string) (*entities.InternProfile, error)
	UpdateInternProfile(ctx context.Context, profile *entities.InternProfile) (*entities.InternProfile, error)
	DeleteInternProfile(ctx context.Context, userID string) error
	GetInternsByMentor(ctx context.Context, mentorID string) ([]entities.InternProfile, error)

	// Admin Profile
	CreateAdminProfile(ctx context.Context, profile *entities.AdminProfile) (*entities.AdminProfile, error)
	GetAdminProfile(ctx context.Context, userID string) (*entities.AdminProfile, error)
	UpdateAdminProfile(ctx context.Context, profile *entities.AdminProfile) (*entities.AdminProfile, error)
	DeleteAdminProfile(ctx context.Context, userID string) error

	// Profile Summary
	GetProfileSummary(ctx context.Context, userID string) (*entities.ProfileSummary, error)
}

// RoleRepository defines the interface for role data operations
type RoleRepository interface {
	Create(ctx context.Context, role *entities.Role) (*entities.Role, error)
	GetByID(ctx context.Context, id string) (*entities.Role, error)
	GetByName(ctx context.Context, name entities.RoleType) (*entities.Role, error)
	Update(ctx context.Context, role *entities.Role) (*entities.Role, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]entities.Role, error)

	// Role permissions
	AddPermissionToRole(ctx context.Context, roleID string, permissionID string) error
	RemovePermissionFromRole(ctx context.Context, roleID string, permissionID string) error
	GetRolePermissions(ctx context.Context, roleID string) ([]entities.Permission, error)
}

// PermissionRepository defines the interface for permission data operations
type PermissionRepository interface {
	Create(ctx context.Context, permission *entities.Permission) (*entities.Permission, error)
	GetByID(ctx context.Context, id string) (*entities.Permission, error)
	GetByResourceAction(ctx context.Context, resource string, action string) (*entities.Permission, error)
	Update(ctx context.Context, permission *entities.Permission) (*entities.Permission, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context) ([]entities.Permission, error)
	ListByResource(ctx context.Context, resource string) ([]entities.Permission, error)
}

// OrganizationRepository defines the interface for organization data operations
type OrganizationRepository interface {
	Create(ctx context.Context, org *entities.Organization) (*entities.Organization, error)
	GetByID(ctx context.Context, id string) (*entities.Organization, error)
	GetBySlug(ctx context.Context, slug string) (*entities.Organization, error)
	Update(ctx context.Context, org *entities.Organization) (*entities.Organization, error)
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, pagination Pagination) (*OrganizationList, error)

	// Membership
	AddMember(ctx context.Context, member *entities.OrganizationMember) (*entities.OrganizationMember, error)
	RemoveMember(ctx context.Context, orgID string, userID string) error
	GetMembers(ctx context.Context, orgID string, pagination Pagination) ([]entities.OrganizationMember, error)
	GetUserOrganizations(ctx context.Context, userID string) ([]entities.Organization, error)
	UpdateMemberRole(ctx context.Context, orgID string, userID string, role string) error
}

// UserFilter contains filter options for listing users
type UserFilter struct {
	Email          *string
	FirstName      *string
	LastName       *string
	IsActive       *bool
	IsVerified     *bool
	OrganizationID *string
	RoleType       *entities.RoleType
	Search         *string // Full-text search
	CreatedAfter   *string // ISO date
	CreatedBefore  *string // ISO date
}

// Pagination contains pagination options
type Pagination struct {
	First  *int
	After  *string
	Last   *int
	Before *string
	Offset *int
	Limit  *int
}

// UserList contains a paginated list of users
type UserList struct {
	Users      []entities.User
	TotalCount int
	HasMore    bool
	Cursor     *string
}

// OrganizationList contains a paginated list of organizations
type OrganizationList struct {
	Organizations []entities.Organization
	TotalCount    int
	HasMore       bool
	Cursor        *string
}

// UnitOfWork defines the interface for transaction management
type UnitOfWork interface {
	Begin(ctx context.Context) (UnitOfWork, error)
	Commit() error
	Rollback() error
	UserRepository() UserRepository
	ProfileRepository() ProfileRepository
	RoleRepository() RoleRepository
	PermissionRepository() PermissionRepository
	OrganizationRepository() OrganizationRepository
}
