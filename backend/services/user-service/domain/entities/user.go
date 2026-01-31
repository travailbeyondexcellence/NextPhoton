package entities

import (
	"time"
)

// RoleType represents the type of role a user can have
type RoleType string

const (
	RoleLearner  RoleType = "learner"
	RoleGuardian RoleType = "guardian"
	RoleEducator RoleType = "educator"
	RoleECM      RoleType = "ecm"
	RoleEmployee RoleType = "employee"
	RoleIntern   RoleType = "intern"
	RoleAdmin    RoleType = "admin"
)

// AllRoles returns all available role types
func AllRoles() []RoleType {
	return []RoleType{
		RoleLearner,
		RoleGuardian,
		RoleEducator,
		RoleECM,
		RoleEmployee,
		RoleIntern,
		RoleAdmin,
	}
}

// IsValid checks if the role type is valid
func (r RoleType) IsValid() bool {
	switch r {
	case RoleLearner, RoleGuardian, RoleEducator, RoleECM, RoleEmployee, RoleIntern, RoleAdmin:
		return true
	}
	return false
}

// String returns the string representation of the role type
func (r RoleType) String() string {
	return string(r)
}

// User represents the core user entity
type User struct {
	ID              string     `json:"id"`
	AuthID          string     `json:"authId"`          // Reference to auth-service user
	Email           string     `json:"email"`
	FirstName       string     `json:"firstName"`
	LastName        string     `json:"lastName"`
	DisplayName     string     `json:"displayName"`
	AvatarURL       *string    `json:"avatarUrl,omitempty"`
	PhoneNumber     *string    `json:"phoneNumber,omitempty"`
	DateOfBirth     *time.Time `json:"dateOfBirth,omitempty"`
	Gender          *string    `json:"gender,omitempty"`
	Timezone        string     `json:"timezone"`
	Locale          string     `json:"locale"`
	IsActive        bool       `json:"isActive"`
	IsVerified      bool       `json:"isVerified"`
	LastLoginAt     *time.Time `json:"lastLoginAt,omitempty"`
	OrganizationID  *string    `json:"organizationId,omitempty"`
	CreatedAt       time.Time  `json:"createdAt"`
	UpdatedAt       time.Time  `json:"updatedAt"`
	DeletedAt       *time.Time `json:"deletedAt,omitempty"`

	// Relationships (loaded as needed)
	Roles       []UserRole       `json:"roles,omitempty"`
	Permissions []UserPermission `json:"permissions,omitempty"`
}

// FullName returns the user's full name
func (u *User) FullName() string {
	return u.FirstName + " " + u.LastName
}

// HasRole checks if the user has a specific role
func (u *User) HasRole(roleType RoleType) bool {
	for _, role := range u.Roles {
		if role.RoleType == roleType && role.IsActive {
			return true
		}
	}
	return false
}

// HasPermission checks if the user has a specific permission
func (u *User) HasPermission(resource, action string) bool {
	for _, perm := range u.Permissions {
		if perm.Resource == resource && perm.Action == action && perm.IsGranted {
			return true
		}
	}
	return false
}

// UserRole represents a role assigned to a user
type UserRole struct {
	ID             string     `json:"id"`
	UserID         string     `json:"userId"`
	RoleID         string     `json:"roleId"`
	RoleType       RoleType   `json:"roleType"`
	OrganizationID *string    `json:"organizationId,omitempty"`
	IsActive       bool       `json:"isActive"`
	AssignedAt     time.Time  `json:"assignedAt"`
	AssignedBy     *string    `json:"assignedBy,omitempty"`
	ExpiresAt      *time.Time `json:"expiresAt,omitempty"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}

// IsExpired checks if the role assignment has expired
func (ur *UserRole) IsExpired() bool {
	if ur.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*ur.ExpiresAt)
}

// UserPermission represents a direct permission granted to a user (ABAC)
type UserPermission struct {
	ID             string            `json:"id"`
	UserID         string            `json:"userId"`
	PermissionID   string            `json:"permissionId"`
	Resource       string            `json:"resource"`
	Action         string            `json:"action"`
	IsGranted      bool              `json:"isGranted"` // Can be used to explicitly deny
	Conditions     map[string]string `json:"conditions,omitempty"` // ABAC conditions
	OrganizationID *string           `json:"organizationId,omitempty"`
	GrantedAt      time.Time         `json:"grantedAt"`
	GrantedBy      *string           `json:"grantedBy,omitempty"`
	ExpiresAt      *time.Time        `json:"expiresAt,omitempty"`
	CreatedAt      time.Time         `json:"createdAt"`
	UpdatedAt      time.Time         `json:"updatedAt"`
}

// IsExpired checks if the permission has expired
func (up *UserPermission) IsExpired() bool {
	if up.ExpiresAt == nil {
		return false
	}
	return time.Now().After(*up.ExpiresAt)
}

// Role represents a role definition
type Role struct {
	ID          string     `json:"id"`
	Name        RoleType   `json:"name"`
	DisplayName string     `json:"displayName"`
	Description *string    `json:"description,omitempty"`
	IsActive    bool       `json:"isActive"`
	IsDefault   bool       `json:"isDefault"`
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
}

// Permission represents a permission definition
type Permission struct {
	ID          string    `json:"id"`
	Resource    string    `json:"resource"`
	Action      string    `json:"action"`
	Description *string   `json:"description,omitempty"`
	CreatedAt   time.Time `json:"createdAt"`
}

// RolePermission represents a permission assigned to a role
type RolePermission struct {
	ID           string    `json:"id"`
	RoleID       string    `json:"roleId"`
	PermissionID string    `json:"permissionId"`
	CreatedAt    time.Time `json:"createdAt"`
}

// Organization represents a tenant/organization in the multi-tenant system
type Organization struct {
	ID          string     `json:"id"`
	Name        string     `json:"name"`
	Slug        string     `json:"slug"`
	Description *string    `json:"description,omitempty"`
	LogoURL     *string    `json:"logoUrl,omitempty"`
	Website     *string    `json:"website,omitempty"`
	IsActive    bool       `json:"isActive"`
	Settings    *string    `json:"settings,omitempty"` // JSON settings
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"deletedAt,omitempty"`
}

// OrganizationMember represents a user's membership in an organization
type OrganizationMember struct {
	ID             string     `json:"id"`
	OrganizationID string     `json:"organizationId"`
	UserID         string     `json:"userId"`
	RoleInOrg      string     `json:"roleInOrg"` // owner, admin, member
	IsActive       bool       `json:"isActive"`
	JoinedAt       time.Time  `json:"joinedAt"`
	InvitedBy      *string    `json:"invitedBy,omitempty"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
}
