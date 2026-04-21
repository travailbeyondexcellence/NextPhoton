package testutils

import (
	"context"
	"fmt"
	"testing"
	"time"

	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/ent/enttest"
	"golang.org/x/crypto/bcrypt"

	_ "github.com/mattn/go-sqlite3"
)

// TestConfig returns a config suitable for testing
func TestConfig() *config.Config {
	return &config.Config{
		ServerPort:    "3963",
		GRPCPort:      "50051",
		DatabaseURL:   "file:ent?mode=memory&cache=shared&_fk=1",
		JWTSecret:     "test-jwt-secret-key-for-testing-32chars",
		JWTExpiration: "7d",
		CORSOrigin:    "http://localhost:3000",
		NATSUrl:       "nats://localhost:4222",
		Environment:   "test",
	}
}

// TestClient creates a new ent client for testing with SQLite in-memory
func TestClient(t *testing.T) *ent.Client {
	return enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
}

// UserFixture represents a test user fixture
type UserFixture struct {
	ID            string
	Name          string
	Email         string
	Password      string // Plain text password
	HashedPass    string // Hashed password
	EmailVerified bool
	Image         *string
	CreatedAt     time.Time
	UpdatedAt     time.Time
}

// DefaultUserFixtures returns a set of default test users
func DefaultUserFixtures() []UserFixture {
	now := time.Now()
	img := "https://example.com/avatar.png"

	return []UserFixture{
		{
			ID:            "user_admin_001",
			Name:          "Admin User",
			Email:         "admin@nextphoton.edu",
			Password:      "AdminPass123!",
			EmailVerified: true,
			Image:         &img,
			CreatedAt:     now.Add(-30 * 24 * time.Hour),
			UpdatedAt:     now,
		},
		{
			ID:            "user_educator_001",
			Name:          "John Educator",
			Email:         "educator@nextphoton.edu",
			Password:      "EducatorPass123!",
			EmailVerified: true,
			Image:         nil,
			CreatedAt:     now.Add(-15 * 24 * time.Hour),
			UpdatedAt:     now,
		},
		{
			ID:            "user_learner_001",
			Name:          "Jane Learner",
			Email:         "learner@nextphoton.edu",
			Password:      "LearnerPass123!",
			EmailVerified: false,
			Image:         nil,
			CreatedAt:     now.Add(-7 * 24 * time.Hour),
			UpdatedAt:     now,
		},
		{
			ID:            "user_guardian_001",
			Name:          "Parent Guardian",
			Email:         "guardian@nextphoton.edu",
			Password:      "GuardianPass123!",
			EmailVerified: true,
			Image:         nil,
			CreatedAt:     now.Add(-3 * 24 * time.Hour),
			UpdatedAt:     now,
		},
	}
}

// CreateUserFixture creates a single user in the database
func CreateUserFixture(ctx context.Context, client *ent.Client, fixture UserFixture) (*ent.User, error) {
	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(fixture.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}
	fixture.HashedPass = string(hashedPassword)

	// Create user
	userCreate := client.User.Create().
		SetID(fixture.ID).
		SetName(fixture.Name).
		SetEmail(fixture.Email).
		SetEmailVerified(fixture.EmailVerified).
		SetCreatedAt(fixture.CreatedAt).
		SetUpdatedAt(fixture.UpdatedAt)

	if fixture.Image != nil {
		userCreate.SetImage(*fixture.Image)
	}

	user, err := userCreate.Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Create account with password
	accountID := fmt.Sprintf("account_%s", fixture.ID)
	_, err = client.Account.Create().
		SetID(accountID).
		SetAccountID(fixture.Email).
		SetProviderID("credentials").
		SetUserID(fixture.ID).
		SetPassword(fixture.HashedPass).
		SetCreatedAt(fixture.CreatedAt).
		SetUpdatedAt(fixture.UpdatedAt).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create account: %w", err)
	}

	return user, nil
}

// CreateAllDefaultFixtures creates all default fixtures in the database
func CreateAllDefaultFixtures(ctx context.Context, client *ent.Client) ([]*ent.User, error) {
	fixtures := DefaultUserFixtures()
	users := make([]*ent.User, 0, len(fixtures))

	for _, fixture := range fixtures {
		user, err := CreateUserFixture(ctx, client, fixture)
		if err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return users, nil
}

// RoleFixture represents a test role fixture
type RoleFixture struct {
	ID          string
	Name        string
	Description string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// DefaultRoleFixtures returns a set of default test roles
func DefaultRoleFixtures() []RoleFixture {
	now := time.Now()

	return []RoleFixture{
		{
			ID:          "role_admin",
			Name:        "ADMIN",
			Description: "Administrator with full access",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "role_educator",
			Name:        "EDUCATOR",
			Description: "Educator/Teacher role",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "role_learner",
			Name:        "LEARNER",
			Description: "Student/Learner role",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "role_guardian",
			Name:        "GUARDIAN",
			Description: "Parent/Guardian role",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "role_intern",
			Name:        "INTERN",
			Description: "Intern role",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "role_employee",
			Name:        "EMPLOYEE",
			Description: "Employee role",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
	}
}

// CreateRoleFixture creates a single role in the database
func CreateRoleFixture(ctx context.Context, client *ent.Client, fixture RoleFixture) (*ent.Role, error) {
	role, err := client.Role.Create().
		SetID(fixture.ID).
		SetName(fixture.Name).
		SetDescription(fixture.Description).
		SetCreatedAt(fixture.CreatedAt).
		SetUpdatedAt(fixture.UpdatedAt).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create role: %w", err)
	}
	return role, nil
}

// PermissionFixture represents a test permission fixture
type PermissionFixture struct {
	ID          string
	Name        string
	Description string
	Resource    string
	Action      string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

// DefaultPermissionFixtures returns a set of default test permissions
func DefaultPermissionFixtures() []PermissionFixture {
	now := time.Now()

	return []PermissionFixture{
		{
			ID:          "perm_user_read",
			Name:        "USER_READ",
			Description: "Read user data",
			Resource:    "user",
			Action:      "read",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "perm_user_write",
			Name:        "USER_WRITE",
			Description: "Create/update user data",
			Resource:    "user",
			Action:      "write",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "perm_user_delete",
			Name:        "USER_DELETE",
			Description: "Delete user data",
			Resource:    "user",
			Action:      "delete",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "perm_session_manage",
			Name:        "SESSION_MANAGE",
			Description: "Manage class sessions",
			Resource:    "session",
			Action:      "manage",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
		{
			ID:          "perm_assignment_manage",
			Name:        "ASSIGNMENT_MANAGE",
			Description: "Manage assignments",
			Resource:    "assignment",
			Action:      "manage",
			CreatedAt:   now,
			UpdatedAt:   now,
		},
	}
}

// SessionFixture represents a test session fixture
type SessionFixture struct {
	ID        string
	UserID    string
	Token     string
	ExpiresAt time.Time
	CreatedAt time.Time
}

// CreateSessionFixture creates a session fixture
func CreateSessionFixture(ctx context.Context, client *ent.Client, userID string) (*ent.Session, error) {
	now := time.Now()
	sessionID := fmt.Sprintf("session_%d", now.UnixNano())

	session, err := client.Session.Create().
		SetID(sessionID).
		SetUserID(userID).
		SetToken(fmt.Sprintf("token_%s", sessionID)).
		SetExpiresAt(now.Add(7 * 24 * time.Hour)).
		SetCreatedAt(now).
		Save(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create session: %w", err)
	}
	return session, nil
}

// CleanupDatabase removes all data from the database
func CleanupDatabase(ctx context.Context, client *ent.Client) error {
	// Delete in order respecting foreign keys
	if _, err := client.Session.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.Account.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.UserRole.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.UserPermission.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.RolePermission.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.Permission.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.Role.Delete().Exec(ctx); err != nil {
		return err
	}
	if _, err := client.User.Delete().Exec(ctx); err != nil {
		return err
	}
	return nil
}

// TestHelper provides common test utilities
type TestHelper struct {
	Client *ent.Client
	Config *config.Config
	Ctx    context.Context
}

// NewTestHelper creates a new test helper
func NewTestHelper(t *testing.T) *TestHelper {
	return &TestHelper{
		Client: TestClient(t),
		Config: TestConfig(),
		Ctx:    context.Background(),
	}
}

// Close cleans up test resources
func (h *TestHelper) Close() {
	h.Client.Close()
}

// SetupDefaultData sets up all default fixtures
func (h *TestHelper) SetupDefaultData() ([]*ent.User, error) {
	return CreateAllDefaultFixtures(h.Ctx, h.Client)
}

// GetFixtureByEmail returns a fixture by email
func GetFixtureByEmail(email string) *UserFixture {
	for _, f := range DefaultUserFixtures() {
		if f.Email == email {
			return &f
		}
	}
	return nil
}
