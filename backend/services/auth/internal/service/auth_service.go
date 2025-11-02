package service

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/ent/account"
	"github.com/nextphoton/auth-service/ent/user"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	Client *ent.Client
	Config *config.Config
}

type Claims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	jwt.RegisteredClaims
}

func NewAuthService(client *ent.Client, cfg *config.Config) *AuthService {
	return &AuthService{
		Client: client,
		Config: cfg,
	}
}

// HashPassword hashes a password using bcrypt
func (s *AuthService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

// CheckPassword compares a hashed password with a plain text password
func (s *AuthService) CheckPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

// GenerateToken generates a JWT token for a user
func (s *AuthService) GenerateToken(userID, email string) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour) // 7 days

	claims := &Claims{
		UserID: userID,
		Email:  email,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(s.Config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateToken validates a JWT token and returns the claims
func (s *AuthService) ValidateToken(tokenString string) (*Claims, error) {
	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(s.Config.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

// Register creates a new user with password
func (s *AuthService) Register(ctx context.Context, name, email, password string) (*ent.User, error) {
	// Check if user already exists
	exists, err := s.Client.User.Query().
		Where(user.Email(email)).
		Exist(ctx)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, fmt.Errorf("user with email %s already exists", email)
	}

	// Hash password
	hashedPassword, err := s.HashPassword(password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password: %w", err)
	}

	// Generate user ID
	userID := fmt.Sprintf("user_%d", time.Now().UnixNano())

	// Create user in transaction
	tx, err := s.Client.Tx(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to start transaction: %w", err)
	}

	// Create user
	u, err := tx.User.Create().
		SetID(userID).
		SetName(name).
		SetEmail(email).
		SetEmailVerified(false).
		SetCreatedAt(time.Now()).
		SetUpdatedAt(time.Now()).
		Save(ctx)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("failed to create user: %w", err)
	}

	// Create account with password
	accountRecordID := fmt.Sprintf("account_%d", time.Now().UnixNano())
	_, err = tx.Account.Create().
		SetID(accountRecordID).
		SetAccountID(email).
		SetProviderID("credentials").
		SetUserID(userID).
		SetPassword(hashedPassword).
		SetCreatedAt(time.Now()).
		SetUpdatedAt(time.Now()).
		Save(ctx)
	if err != nil {
		tx.Rollback()
		return nil, fmt.Errorf("failed to create account: %w", err)
	}

	// Commit transaction
	err = tx.Commit()
	if err != nil {
		return nil, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return u, nil
}

// Login authenticates a user with email and password
func (s *AuthService) Login(ctx context.Context, email, password string) (*ent.User, string, error) {
	// Find user by email
	u, err := s.Client.User.Query().
		Where(user.Email(email)).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, "", fmt.Errorf("invalid email or password")
		}
		return nil, "", err
	}

	// Get user's account
	acc, err := s.Client.Account.Query().
		Where(
			account.UserID(u.ID),
			account.ProviderID("credentials"),
		).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, "", fmt.Errorf("invalid email or password")
		}
		return nil, "", err
	}

	// Check if account has a password
	if acc.Password == nil {
		return nil, "", fmt.Errorf("password authentication not enabled for this account")
	}

	// Verify password
	if !s.CheckPassword(*acc.Password, password) {
		return nil, "", fmt.Errorf("invalid email or password")
	}

	// Generate token
	token, err := s.GenerateToken(u.ID, u.Email)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	// Create session (optional)
	sessionID := fmt.Sprintf("session_%d", time.Now().UnixNano())
	_, err = s.Client.Session.Create().
		SetID(sessionID).
		SetUserID(u.ID).
		SetToken(token).
		SetExpiresAt(time.Now().Add(7 * 24 * time.Hour)).
		SetCreatedAt(time.Now()).
		Save(ctx)
	if err != nil {
		// Log error but don't fail login
		fmt.Printf("Warning: failed to create session: %v\n", err)
	}

	return u, token, nil
}

// GetUserByID retrieves a user by their ID
func (s *AuthService) GetUserByID(ctx context.Context, userID string) (*ent.User, error) {
	u, err := s.Client.User.Query().
		Where(user.ID(userID)).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return u, nil
}
