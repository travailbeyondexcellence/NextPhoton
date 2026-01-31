package service

import (
	"context"
	"testing"
	"time"

	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/ent/enttest"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"

	_ "github.com/mattn/go-sqlite3"
)

// AuthServiceTestSuite is the test suite for AuthService
type AuthServiceTestSuite struct {
	suite.Suite
	client  *ent.Client
	service *AuthService
	ctx     context.Context
}

// SetupTest runs before each test
func (s *AuthServiceTestSuite) SetupTest() {
	// Create a new in-memory SQLite client for each test
	s.client = enttest.Open(s.T(), "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	s.ctx = context.Background()

	// Create test config
	cfg := &config.Config{
		JWTSecret:     "test-secret-key-for-testing-purposes-only",
		JWTExpiration: "7d",
		ServerPort:    "3963",
		Environment:   "test",
	}

	s.service = NewAuthService(s.client, cfg)
}

// TearDownTest runs after each test
func (s *AuthServiceTestSuite) TearDownTest() {
	s.client.Close()
}

// TestAuthServiceTestSuite runs the test suite
func TestAuthServiceTestSuite(t *testing.T) {
	suite.Run(t, new(AuthServiceTestSuite))
}

// TestHashPassword tests password hashing
func (s *AuthServiceTestSuite) TestHashPassword() {
	password := "testPassword123!"

	hashedPassword, err := s.service.HashPassword(password)

	s.NoError(err)
	s.NotEmpty(hashedPassword)
	s.NotEqual(password, hashedPassword)
}

// TestHashPassword_EmptyPassword tests hashing empty password
func (s *AuthServiceTestSuite) TestHashPassword_EmptyPassword() {
	password := ""

	hashedPassword, err := s.service.HashPassword(password)

	// bcrypt should still work with empty strings
	s.NoError(err)
	s.NotEmpty(hashedPassword)
}

// TestCheckPassword_ValidPassword tests valid password verification
func (s *AuthServiceTestSuite) TestCheckPassword_ValidPassword() {
	password := "testPassword123!"

	hashedPassword, err := s.service.HashPassword(password)
	s.NoError(err)

	isValid := s.service.CheckPassword(hashedPassword, password)

	s.True(isValid)
}

// TestCheckPassword_InvalidPassword tests invalid password verification
func (s *AuthServiceTestSuite) TestCheckPassword_InvalidPassword() {
	password := "testPassword123!"
	wrongPassword := "wrongPassword456!"

	hashedPassword, err := s.service.HashPassword(password)
	s.NoError(err)

	isValid := s.service.CheckPassword(hashedPassword, wrongPassword)

	s.False(isValid)
}

// TestGenerateToken tests JWT token generation
func (s *AuthServiceTestSuite) TestGenerateToken() {
	userID := "user_123456"
	email := "test@example.com"

	token, err := s.service.GenerateToken(userID, email)

	s.NoError(err)
	s.NotEmpty(token)
	// JWT tokens have 3 parts separated by dots
	s.Contains(token, ".")
}

// TestValidateToken_ValidToken tests valid token validation
func (s *AuthServiceTestSuite) TestValidateToken_ValidToken() {
	userID := "user_123456"
	email := "test@example.com"

	token, err := s.service.GenerateToken(userID, email)
	s.NoError(err)

	claims, err := s.service.ValidateToken(token)

	s.NoError(err)
	s.Equal(userID, claims.UserID)
	s.Equal(email, claims.Email)
}

// TestValidateToken_InvalidToken tests invalid token validation
func (s *AuthServiceTestSuite) TestValidateToken_InvalidToken() {
	invalidToken := "invalid.token.string"

	claims, err := s.service.ValidateToken(invalidToken)

	s.Error(err)
	s.Nil(claims)
}

// TestValidateToken_ExpiredToken tests expired token validation
func (s *AuthServiceTestSuite) TestValidateToken_ExpiredToken() {
	// This test would require manipulating time, skipping for now
	// In production, use a time mocking library
	s.T().Skip("Skipping expired token test - requires time manipulation")
}

// TestValidateToken_WrongSignature tests token with wrong signature
func (s *AuthServiceTestSuite) TestValidateToken_WrongSignature() {
	// Create a service with different secret
	otherService := &AuthService{
		Client: s.client,
		Config: &config.Config{
			JWTSecret: "different-secret-key",
		},
	}

	token, err := otherService.GenerateToken("user_123", "test@example.com")
	s.NoError(err)

	// Try to validate with original service (different secret)
	claims, err := s.service.ValidateToken(token)

	s.Error(err)
	s.Nil(claims)
}

// TestRegister_Success tests successful user registration
func (s *AuthServiceTestSuite) TestRegister_Success() {
	name := "Test User"
	email := "newuser@example.com"
	password := "securePassword123!"

	user, err := s.service.Register(s.ctx, name, email, password)

	s.NoError(err)
	s.NotNil(user)
	s.Equal(name, user.Name)
	s.Equal(email, user.Email)
	s.False(user.EmailVerified)
	s.NotEmpty(user.ID)
}

// TestRegister_DuplicateEmail tests registration with duplicate email
func (s *AuthServiceTestSuite) TestRegister_DuplicateEmail() {
	name := "Test User"
	email := "duplicate@example.com"
	password := "securePassword123!"

	// First registration should succeed
	_, err := s.service.Register(s.ctx, name, email, password)
	s.NoError(err)

	// Second registration with same email should fail
	_, err = s.service.Register(s.ctx, "Another User", email, "anotherPassword")

	s.Error(err)
	s.Contains(err.Error(), "already exists")
}

// TestRegister_EmptyName tests registration with empty name
func (s *AuthServiceTestSuite) TestRegister_EmptyName() {
	email := "test@example.com"
	password := "securePassword123!"

	_, err := s.service.Register(s.ctx, "", email, password)

	// Should fail due to validation
	s.Error(err)
}

// TestRegister_InvalidEmail tests registration with invalid email format
func (s *AuthServiceTestSuite) TestRegister_EmptyEmail() {
	name := "Test User"
	password := "securePassword123!"

	_, err := s.service.Register(s.ctx, name, "", password)

	// Should fail due to validation
	s.Error(err)
}

// TestLogin_Success tests successful login
func (s *AuthServiceTestSuite) TestLogin_Success() {
	// First register a user
	name := "Test User"
	email := "login@example.com"
	password := "securePassword123!"

	_, err := s.service.Register(s.ctx, name, email, password)
	s.NoError(err)

	// Now login
	user, token, err := s.service.Login(s.ctx, email, password)

	s.NoError(err)
	s.NotNil(user)
	s.NotEmpty(token)
	s.Equal(email, user.Email)
}

// TestLogin_WrongPassword tests login with wrong password
func (s *AuthServiceTestSuite) TestLogin_WrongPassword() {
	// First register a user
	name := "Test User"
	email := "wrongpass@example.com"
	password := "securePassword123!"

	_, err := s.service.Register(s.ctx, name, email, password)
	s.NoError(err)

	// Try to login with wrong password
	user, token, err := s.service.Login(s.ctx, email, "wrongPassword!")

	s.Error(err)
	s.Nil(user)
	s.Empty(token)
	s.Contains(err.Error(), "invalid email or password")
}

// TestLogin_NonExistentUser tests login with non-existent user
func (s *AuthServiceTestSuite) TestLogin_NonExistentUser() {
	user, token, err := s.service.Login(s.ctx, "nonexistent@example.com", "somePassword")

	s.Error(err)
	s.Nil(user)
	s.Empty(token)
	s.Contains(err.Error(), "invalid email or password")
}

// TestGetUserByID_Success tests successful user retrieval by ID
func (s *AuthServiceTestSuite) TestGetUserByID_Success() {
	// First register a user
	name := "Test User"
	email := "getbyid@example.com"
	password := "securePassword123!"

	registeredUser, err := s.service.Register(s.ctx, name, email, password)
	s.NoError(err)

	// Get user by ID
	user, err := s.service.GetUserByID(s.ctx, registeredUser.ID)

	s.NoError(err)
	s.NotNil(user)
	s.Equal(registeredUser.ID, user.ID)
	s.Equal(email, user.Email)
}

// TestGetUserByID_NotFound tests user retrieval with non-existent ID
func (s *AuthServiceTestSuite) TestGetUserByID_NotFound() {
	user, err := s.service.GetUserByID(s.ctx, "non_existent_user_id")

	s.Error(err)
	s.Nil(user)
	s.Contains(err.Error(), "not found")
}

// Standalone tests using t *testing.T

func TestHashPasswordDeterministic(t *testing.T) {
	cfg := &config.Config{
		JWTSecret: "test-secret",
	}
	service := &AuthService{Config: cfg}

	password := "testPassword"

	hash1, err1 := service.HashPassword(password)
	hash2, err2 := service.HashPassword(password)

	assert.NoError(t, err1)
	assert.NoError(t, err2)
	// Bcrypt hashes should be different each time (due to random salt)
	assert.NotEqual(t, hash1, hash2)
}

func TestCheckPasswordWithDifferentHashes(t *testing.T) {
	cfg := &config.Config{
		JWTSecret: "test-secret",
	}
	service := &AuthService{Config: cfg}

	password := "testPassword"

	hash1, _ := service.HashPassword(password)
	hash2, _ := service.HashPassword(password)

	// Both hashes should verify the same password
	assert.True(t, service.CheckPassword(hash1, password))
	assert.True(t, service.CheckPassword(hash2, password))
}

func TestTokenContainsCorrectClaims(t *testing.T) {
	// Create a test client
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	cfg := &config.Config{
		JWTSecret: "test-secret-key-minimum-length",
	}
	service := NewAuthService(client, cfg)

	userID := "user_12345"
	email := "test@example.com"

	token, err := service.GenerateToken(userID, email)
	require.NoError(t, err)

	claims, err := service.ValidateToken(token)
	require.NoError(t, err)

	assert.Equal(t, userID, claims.UserID)
	assert.Equal(t, email, claims.Email)
	assert.True(t, claims.ExpiresAt.After(time.Now()))
	assert.True(t, claims.IssuedAt.Before(time.Now().Add(time.Second)))
}

// Benchmark tests

func BenchmarkHashPassword(b *testing.B) {
	cfg := &config.Config{
		JWTSecret: "test-secret",
	}
	service := &AuthService{Config: cfg}

	for i := 0; i < b.N; i++ {
		_, _ = service.HashPassword("testPassword123!")
	}
}

func BenchmarkGenerateToken(b *testing.B) {
	cfg := &config.Config{
		JWTSecret: "test-secret-key-minimum-length",
	}
	service := &AuthService{Config: cfg}

	for i := 0; i < b.N; i++ {
		_, _ = service.GenerateToken("user_123", "test@example.com")
	}
}

func BenchmarkValidateToken(b *testing.B) {
	cfg := &config.Config{
		JWTSecret: "test-secret-key-minimum-length",
	}
	service := &AuthService{Config: cfg}

	token, _ := service.GenerateToken("user_123", "test@example.com")

	b.ResetTimer()
	for i := 0; i < b.N; i++ {
		_, _ = service.ValidateToken(token)
	}
}
