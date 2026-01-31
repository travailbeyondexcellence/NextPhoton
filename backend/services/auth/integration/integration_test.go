package integration

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/ent/enttest"
	"github.com/nextphoton/auth-service/internal/service"
	"github.com/nextphoton/auth-service/testutils"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"github.com/stretchr/testify/suite"

	_ "github.com/mattn/go-sqlite3"
)

// AuthIntegrationTestSuite is the integration test suite
type AuthIntegrationTestSuite struct {
	suite.Suite
	client      *ent.Client
	authService *service.AuthService
	router      *gin.Engine
	ctx         context.Context
}

// SetupSuite runs once before all tests
func (s *AuthIntegrationTestSuite) SetupSuite() {
	gin.SetMode(gin.TestMode)
}

// SetupTest runs before each test
func (s *AuthIntegrationTestSuite) SetupTest() {
	s.client = enttest.Open(s.T(), "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	s.ctx = context.Background()

	cfg := testutils.TestConfig()
	s.authService = service.NewAuthService(s.client, cfg)
	s.router = setupTestRouter(s.authService, cfg)
}

// TearDownTest runs after each test
func (s *AuthIntegrationTestSuite) TearDownTest() {
	s.client.Close()
}

// TestAuthIntegrationTestSuite runs the integration test suite
func TestAuthIntegrationTestSuite(t *testing.T) {
	suite.Run(t, new(AuthIntegrationTestSuite))
}

// setupTestRouter creates a test HTTP router
func setupTestRouter(authService *service.AuthService, cfg *config.Config) *gin.Engine {
	router := gin.New()
	router.Use(gin.Recovery())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "healthy"})
	})

	// Auth routes
	auth := router.Group("/auth")
	{
		auth.POST("/register", registerHandler(authService))
		auth.POST("/login", loginHandler(authService))
		auth.GET("/me", authMiddleware(authService), meHandler(authService))
		auth.POST("/logout", authMiddleware(authService), logoutHandler(authService))
	}

	return router
}

// Request/Response types
type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	User  *UserResponse `json:"user"`
	Token string        `json:"token"`
}

type UserResponse struct {
	ID            string    `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	EmailVerified bool      `json:"emailVerified"`
	Image         *string   `json:"image,omitempty"`
	CreatedAt     time.Time `json:"createdAt"`
}

type ErrorResponse struct {
	Error   string `json:"error"`
	Message string `json:"message,omitempty"`
}

// Handlers
func registerHandler(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req RegisterRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid request body"})
			return
		}

		user, err := authService.Register(c.Request.Context(), req.Name, req.Email, req.Password)
		if err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: err.Error()})
			return
		}

		token, err := authService.GenerateToken(user.ID, user.Email)
		if err != nil {
			c.JSON(http.StatusInternalServerError, ErrorResponse{Error: "Failed to generate token"})
			return
		}

		c.JSON(http.StatusCreated, AuthResponse{
			User: &UserResponse{
				ID:            user.ID,
				Name:          user.Name,
				Email:         user.Email,
				EmailVerified: user.EmailVerified,
				Image:         user.Image,
			},
			Token: token,
		})
	}
}

func loginHandler(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req LoginRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, ErrorResponse{Error: "Invalid request body"})
			return
		}

		user, token, err := authService.Login(c.Request.Context(), req.Email, req.Password)
		if err != nil {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid credentials"})
			return
		}

		c.JSON(http.StatusOK, AuthResponse{
			User: &UserResponse{
				ID:            user.ID,
				Name:          user.Name,
				Email:         user.Email,
				EmailVerified: user.EmailVerified,
				Image:         user.Image,
			},
			Token: token,
		})
	}
}

func meHandler(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Unauthorized"})
			return
		}

		user, err := authService.GetUserByID(c.Request.Context(), userID.(string))
		if err != nil {
			c.JSON(http.StatusNotFound, ErrorResponse{Error: "User not found"})
			return
		}

		c.JSON(http.StatusOK, UserResponse{
			ID:            user.ID,
			Name:          user.Name,
			Email:         user.Email,
			EmailVerified: user.EmailVerified,
			Image:         user.Image,
		})
	}
}

func logoutHandler(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		// In a real implementation, we would invalidate the session
		c.JSON(http.StatusOK, gin.H{"message": "Logged out successfully"})
	}
}

func authMiddleware(authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Missing authorization header"})
			c.Abort()
			return
		}

		// Extract token (Bearer <token>)
		token := ""
		if len(authHeader) > 7 && authHeader[:7] == "Bearer " {
			token = authHeader[7:]
		} else {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid authorization format"})
			c.Abort()
			return
		}

		claims, err := authService.ValidateToken(token)
		if err != nil {
			c.JSON(http.StatusUnauthorized, ErrorResponse{Error: "Invalid token"})
			c.Abort()
			return
		}

		c.Set("userID", claims.UserID)
		c.Set("email", claims.Email)
		c.Next()
	}
}

// Integration Tests

func (s *AuthIntegrationTestSuite) TestHealthCheck() {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/health", nil)
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusOK, w.Code)

	var response map[string]string
	err := json.Unmarshal(w.Body.Bytes(), &response)
	s.NoError(err)
	s.Equal("healthy", response["status"])
}

func (s *AuthIntegrationTestSuite) TestRegister_Success() {
	reqBody := RegisterRequest{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: "SecurePass123!",
	}
	body, _ := json.Marshal(reqBody)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusCreated, w.Code)

	var response AuthResponse
	err := json.Unmarshal(w.Body.Bytes(), &response)
	s.NoError(err)
	s.Equal("Test User", response.User.Name)
	s.Equal("test@example.com", response.User.Email)
	s.NotEmpty(response.Token)
}

func (s *AuthIntegrationTestSuite) TestRegister_DuplicateEmail() {
	// Register first user
	reqBody := RegisterRequest{
		Name:     "First User",
		Email:    "duplicate@example.com",
		Password: "SecurePass123!",
	}
	body, _ := json.Marshal(reqBody)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusCreated, w.Code)

	// Try to register with same email
	reqBody.Name = "Second User"
	body, _ = json.Marshal(reqBody)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusBadRequest, w.Code)
}

func (s *AuthIntegrationTestSuite) TestRegister_InvalidJSON() {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/register", bytes.NewBuffer([]byte("invalid json")))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusBadRequest, w.Code)
}

func (s *AuthIntegrationTestSuite) TestLogin_Success() {
	// First register a user
	_, err := s.authService.Register(s.ctx, "Login Test", "logintest@example.com", "SecurePass123!")
	s.NoError(err)

	// Now login
	reqBody := LoginRequest{
		Email:    "logintest@example.com",
		Password: "SecurePass123!",
	}
	body, _ := json.Marshal(reqBody)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusOK, w.Code)

	var response AuthResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	s.NoError(err)
	s.Equal("logintest@example.com", response.User.Email)
	s.NotEmpty(response.Token)
}

func (s *AuthIntegrationTestSuite) TestLogin_InvalidCredentials() {
	reqBody := LoginRequest{
		Email:    "nonexistent@example.com",
		Password: "WrongPass123!",
	}
	body, _ := json.Marshal(reqBody)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusUnauthorized, w.Code)
}

func (s *AuthIntegrationTestSuite) TestMe_Authenticated() {
	// Register and get token
	_, err := s.authService.Register(s.ctx, "Me Test", "metest@example.com", "SecurePass123!")
	s.NoError(err)

	_, token, err := s.authService.Login(s.ctx, "metest@example.com", "SecurePass123!")
	s.NoError(err)

	// Call /me endpoint
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusOK, w.Code)

	var response UserResponse
	err = json.Unmarshal(w.Body.Bytes(), &response)
	s.NoError(err)
	s.Equal("metest@example.com", response.Email)
}

func (s *AuthIntegrationTestSuite) TestMe_Unauthenticated() {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/auth/me", nil)
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusUnauthorized, w.Code)
}

func (s *AuthIntegrationTestSuite) TestMe_InvalidToken() {
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("GET", "/auth/me", nil)
	req.Header.Set("Authorization", "Bearer invalid-token")
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusUnauthorized, w.Code)
}

func (s *AuthIntegrationTestSuite) TestLogout_Success() {
	// Register and get token
	_, err := s.authService.Register(s.ctx, "Logout Test", "logouttest@example.com", "SecurePass123!")
	s.NoError(err)

	_, token, err := s.authService.Login(s.ctx, "logouttest@example.com", "SecurePass123!")
	s.NoError(err)

	// Call /logout endpoint
	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/logout", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	s.router.ServeHTTP(w, req)

	s.Equal(http.StatusOK, w.Code)
}

func (s *AuthIntegrationTestSuite) TestFullAuthFlow() {
	// 1. Register
	registerReq := RegisterRequest{
		Name:     "Full Flow User",
		Email:    "fullflow@example.com",
		Password: "SecurePass123!",
	}
	body, _ := json.Marshal(registerReq)

	w := httptest.NewRecorder()
	req, _ := http.NewRequest("POST", "/auth/register", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusCreated, w.Code)

	var registerResp AuthResponse
	json.Unmarshal(w.Body.Bytes(), &registerResp)
	token := registerResp.Token

	// 2. Access protected route with token from registration
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+token)
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusOK, w.Code)

	// 3. Login with credentials
	loginReq := LoginRequest{
		Email:    "fullflow@example.com",
		Password: "SecurePass123!",
	}
	body, _ = json.Marshal(loginReq)

	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/auth/login", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusOK, w.Code)

	var loginResp AuthResponse
	json.Unmarshal(w.Body.Bytes(), &loginResp)
	newToken := loginResp.Token

	// 4. Access protected route with new token
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("GET", "/auth/me", nil)
	req.Header.Set("Authorization", "Bearer "+newToken)
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusOK, w.Code)

	// 5. Logout
	w = httptest.NewRecorder()
	req, _ = http.NewRequest("POST", "/auth/logout", nil)
	req.Header.Set("Authorization", "Bearer "+newToken)
	s.router.ServeHTTP(w, req)
	s.Equal(http.StatusOK, w.Code)
}

// Standalone integration tests

func TestRegisterAndLoginFlow(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	cfg := testutils.TestConfig()
	authService := service.NewAuthService(client, cfg)
	ctx := context.Background()

	// Register
	user, err := authService.Register(ctx, "Integration User", "integration@test.com", "TestPass123!")
	require.NoError(t, err)
	assert.NotNil(t, user)

	// Login
	loggedInUser, token, err := authService.Login(ctx, "integration@test.com", "TestPass123!")
	require.NoError(t, err)
	assert.NotNil(t, loggedInUser)
	assert.NotEmpty(t, token)

	// Validate token
	claims, err := authService.ValidateToken(token)
	require.NoError(t, err)
	assert.Equal(t, user.ID, claims.UserID)

	// Get user by ID
	fetchedUser, err := authService.GetUserByID(ctx, user.ID)
	require.NoError(t, err)
	assert.Equal(t, user.Email, fetchedUser.Email)
}

func TestMultipleUsersIntegration(t *testing.T) {
	client := enttest.Open(t, "sqlite3", "file:ent?mode=memory&cache=shared&_fk=1")
	defer client.Close()

	cfg := testutils.TestConfig()
	authService := service.NewAuthService(client, cfg)
	ctx := context.Background()

	// Create multiple users
	users := []struct {
		name     string
		email    string
		password string
	}{
		{"User One", "user1@test.com", "Pass1234!"},
		{"User Two", "user2@test.com", "Pass1234!"},
		{"User Three", "user3@test.com", "Pass1234!"},
	}

	createdUsers := make([]*ent.User, 0)
	for _, u := range users {
		user, err := authService.Register(ctx, u.name, u.email, u.password)
		require.NoError(t, err)
		createdUsers = append(createdUsers, user)
	}

	// Login each user
	for i, u := range users {
		user, token, err := authService.Login(ctx, u.email, u.password)
		require.NoError(t, err)
		assert.Equal(t, createdUsers[i].ID, user.ID)
		assert.NotEmpty(t, token)
	}
}
