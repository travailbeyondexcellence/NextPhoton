package entities

import (
	"time"
)

// ProfileStatus represents the status of a user profile
type ProfileStatus string

const (
	ProfileStatusPending  ProfileStatus = "pending"
	ProfileStatusActive   ProfileStatus = "active"
	ProfileStatusInactive ProfileStatus = "inactive"
	ProfileStatusSuspended ProfileStatus = "suspended"
)

// BaseProfile contains common fields for all profile types
type BaseProfile struct {
	ID             string        `json:"id"`
	UserID         string        `json:"userId"`
	Status         ProfileStatus `json:"status"`
	OrganizationID *string       `json:"organizationId,omitempty"`
	Notes          *string       `json:"notes,omitempty"`
	Metadata       *string       `json:"metadata,omitempty"` // JSON for extensibility
	CreatedAt      time.Time     `json:"createdAt"`
	UpdatedAt      time.Time     `json:"updatedAt"`
	DeletedAt      *time.Time    `json:"deletedAt,omitempty"`
}

// LearnerProfile represents a learner/student profile
type LearnerProfile struct {
	BaseProfile
	StudentID          *string    `json:"studentId,omitempty"`
	GradeLevel         *string    `json:"gradeLevel,omitempty"`
	EnrollmentDate     *time.Time `json:"enrollmentDate,omitempty"`
	GraduationDate     *time.Time `json:"graduationDate,omitempty"`
	LearningStyle      *string    `json:"learningStyle,omitempty"`
	SpecialNeeds       *string    `json:"specialNeeds,omitempty"`
	GuardianIDs        []string   `json:"guardianIds,omitempty"`
	CurrentCourseIDs   []string   `json:"currentCourseIds,omitempty"`
	CompletedCourseIDs []string   `json:"completedCourseIds,omitempty"`
	Achievements       []string   `json:"achievements,omitempty"`
	PreferredSubjects  []string   `json:"preferredSubjects,omitempty"`
}

// GuardianProfile represents a parent/guardian profile
type GuardianProfile struct {
	BaseProfile
	Relationship    string   `json:"relationship"` // parent, guardian, other
	LearnerIDs      []string `json:"learnerIds,omitempty"`
	Occupation      *string  `json:"occupation,omitempty"`
	WorkPhone       *string  `json:"workPhone,omitempty"`
	EmergencyContact bool    `json:"emergencyContact"`
	CanPickup       bool     `json:"canPickup"`
	CanReceiveGrades bool    `json:"canReceiveGrades"`
	CanReceiveAlerts bool    `json:"canReceiveAlerts"`
	PreferredContactMethod *string `json:"preferredContactMethod,omitempty"`
}

// EducatorProfile represents a teacher/educator profile
type EducatorProfile struct {
	BaseProfile
	EmployeeID         *string    `json:"employeeId,omitempty"`
	Title              *string    `json:"title,omitempty"`
	Department         *string    `json:"department,omitempty"`
	Specializations    []string   `json:"specializations,omitempty"`
	Certifications     []string   `json:"certifications,omitempty"`
	YearsOfExperience  *int       `json:"yearsOfExperience,omitempty"`
	Education          *string    `json:"education,omitempty"`
	Bio                *string    `json:"bio,omitempty"`
	OfficeLocation     *string    `json:"officeLocation,omitempty"`
	OfficeHours        *string    `json:"officeHours,omitempty"`
	CurrentCourseIDs   []string   `json:"currentCourseIds,omitempty"`
	MaxStudents        *int       `json:"maxStudents,omitempty"`
	Rating             *float64   `json:"rating,omitempty"`
	HireDate           *time.Time `json:"hireDate,omitempty"`
}

// ECMProfile represents an Education Content Manager profile
type ECMProfile struct {
	BaseProfile
	EmployeeID           *string  `json:"employeeId,omitempty"`
	Title                *string  `json:"title,omitempty"`
	Department           *string  `json:"department,omitempty"`
	ContentAreas         []string `json:"contentAreas,omitempty"`
	ManagedCurriculumIDs []string `json:"managedCurriculumIds,omitempty"`
	ApprovalLevel        *int     `json:"approvalLevel,omitempty"` // 1, 2, 3 for multi-tier approval
	CanPublish           bool     `json:"canPublish"`
	CanArchive           bool     `json:"canArchive"`
	CanApprove           bool     `json:"canApprove"`
	QualityMetrics       *string  `json:"qualityMetrics,omitempty"` // JSON
}

// EmployeeProfile represents a general employee profile
type EmployeeProfile struct {
	BaseProfile
	EmployeeID     *string    `json:"employeeId,omitempty"`
	Title          *string    `json:"title,omitempty"`
	Department     *string    `json:"department,omitempty"`
	ManagerID      *string    `json:"managerId,omitempty"`
	EmploymentType *string    `json:"employmentType,omitempty"` // full-time, part-time, contract
	HireDate       *time.Time `json:"hireDate,omitempty"`
	EndDate        *time.Time `json:"endDate,omitempty"`
	Salary         *string    `json:"salary,omitempty"` // Encrypted or reference
	WorkLocation   *string    `json:"workLocation,omitempty"`
	Skills         []string   `json:"skills,omitempty"`
	DirectReports  []string   `json:"directReports,omitempty"`
}

// InternProfile represents an intern profile
type InternProfile struct {
	BaseProfile
	InternID          *string    `json:"internId,omitempty"`
	University        *string    `json:"university,omitempty"`
	Major             *string    `json:"major,omitempty"`
	ExpectedGraduation *time.Time `json:"expectedGraduation,omitempty"`
	InternshipStart   *time.Time `json:"internshipStart,omitempty"`
	InternshipEnd     *time.Time `json:"internshipEnd,omitempty"`
	Department        *string    `json:"department,omitempty"`
	MentorID          *string    `json:"mentorId,omitempty"`
	SupervisorID      *string    `json:"supervisorId,omitempty"`
	Projects          []string   `json:"projects,omitempty"`
	Goals             *string    `json:"goals,omitempty"`
	FeedbackNotes     *string    `json:"feedbackNotes,omitempty"`
	HoursPerWeek      *int       `json:"hoursPerWeek,omitempty"`
	IsPaid            bool       `json:"isPaid"`
}

// AdminProfile represents an administrator profile
type AdminProfile struct {
	BaseProfile
	EmployeeID       *string   `json:"employeeId,omitempty"`
	AdminLevel       int       `json:"adminLevel"` // 1=super, 2=org, 3=department
	ManagedOrgIDs    []string  `json:"managedOrgIds,omitempty"`
	ManagedDepts     []string  `json:"managedDepts,omitempty"`
	CanManageUsers   bool      `json:"canManageUsers"`
	CanManageRoles   bool      `json:"canManageRoles"`
	CanManageOrgs    bool      `json:"canManageOrgs"`
	CanViewAnalytics bool      `json:"canViewAnalytics"`
	CanManageBilling bool      `json:"canManageBilling"`
	AuditLogAccess   bool      `json:"auditLogAccess"`
	APIAccess        bool      `json:"apiAccess"`
	TwoFactorRequired bool     `json:"twoFactorRequired"`
}

// ProfileSummary provides a summary of all profiles for a user
type ProfileSummary struct {
	UserID          string           `json:"userId"`
	LearnerProfile  *LearnerProfile  `json:"learnerProfile,omitempty"`
	GuardianProfile *GuardianProfile `json:"guardianProfile,omitempty"`
	EducatorProfile *EducatorProfile `json:"educatorProfile,omitempty"`
	ECMProfile      *ECMProfile      `json:"ecmProfile,omitempty"`
	EmployeeProfile *EmployeeProfile `json:"employeeProfile,omitempty"`
	InternProfile   *InternProfile   `json:"internProfile,omitempty"`
	AdminProfile    *AdminProfile    `json:"adminProfile,omitempty"`
}

// HasProfile checks if a specific profile type exists
func (ps *ProfileSummary) HasProfile(roleType RoleType) bool {
	switch roleType {
	case RoleLearner:
		return ps.LearnerProfile != nil
	case RoleGuardian:
		return ps.GuardianProfile != nil
	case RoleEducator:
		return ps.EducatorProfile != nil
	case RoleECM:
		return ps.ECMProfile != nil
	case RoleEmployee:
		return ps.EmployeeProfile != nil
	case RoleIntern:
		return ps.InternProfile != nil
	case RoleAdmin:
		return ps.AdminProfile != nil
	}
	return false
}

// ActiveProfiles returns a list of active profile types
func (ps *ProfileSummary) ActiveProfiles() []RoleType {
	var active []RoleType
	if ps.LearnerProfile != nil && ps.LearnerProfile.Status == ProfileStatusActive {
		active = append(active, RoleLearner)
	}
	if ps.GuardianProfile != nil && ps.GuardianProfile.Status == ProfileStatusActive {
		active = append(active, RoleGuardian)
	}
	if ps.EducatorProfile != nil && ps.EducatorProfile.Status == ProfileStatusActive {
		active = append(active, RoleEducator)
	}
	if ps.ECMProfile != nil && ps.ECMProfile.Status == ProfileStatusActive {
		active = append(active, RoleECM)
	}
	if ps.EmployeeProfile != nil && ps.EmployeeProfile.Status == ProfileStatusActive {
		active = append(active, RoleEmployee)
	}
	if ps.InternProfile != nil && ps.InternProfile.Status == ProfileStatusActive {
		active = append(active, RoleIntern)
	}
	if ps.AdminProfile != nil && ps.AdminProfile.Status == ProfileStatusActive {
		active = append(active, RoleAdmin)
	}
	return active
}
