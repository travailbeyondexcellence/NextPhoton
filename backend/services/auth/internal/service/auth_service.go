package service

import (
	"context"
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/ent/account"
	"github.com/nextphoton/auth-service/ent/role"
	"github.com/nextphoton/auth-service/ent/session"
	"github.com/nextphoton/auth-service/ent/user"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	Client *ent.Client
	Config *config.Config
}

type Claims struct {
	UserID string   `json:"userId"`
	Email  string   `json:"email"`
	Roles  []string `json:"roles"`
	jwt.RegisteredClaims
}

func NewAuthService(client *ent.Client, cfg *config.Config) *AuthService {
	return &AuthService{
		Client: client,
		Config: cfg,
	}
}

func (s *AuthService) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	return string(bytes), err
}

func (s *AuthService) CheckPassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}

func (s *AuthService) GenerateToken(userID, email string, roles []string) (string, error) {
	expirationTime := time.Now().Add(7 * 24 * time.Hour)

	claims := &Claims{
		UserID: userID,
		Email:  email,
		Roles:  roles,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Subject:   userID,
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.Config.JWTSecret))
}

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

func (s *AuthService) Register(ctx context.Context, name, email, password, roleName string) (*ent.User, string, error) {
	exists, err := s.Client.User.Query().Where(user.Email(email)).Exist(ctx)
	if err != nil {
		return nil, "", err
	}
	if exists {
		return nil, "", fmt.Errorf("user with email %s already exists", email)
	}

	hashedPassword, err := s.HashPassword(password)
	if err != nil {
		return nil, "", fmt.Errorf("failed to hash password: %w", err)
	}

	tx, err := s.Client.Tx(ctx)
	if err != nil {
		return nil, "", fmt.Errorf("failed to start transaction: %w", err)
	}

	now := time.Now()
	userID := fmt.Sprintf("user_%d", now.UnixNano())

	u, err := tx.User.Create().
		SetID(userID).
		SetName(name).
		SetEmail(email).
		SetEmailVerified(false).
		SetCreatedAt(now).
		SetUpdatedAt(now).
		Save(ctx)
	if err != nil {
		tx.Rollback()
		return nil, "", fmt.Errorf("failed to create user: %w", err)
	}

	accountID := fmt.Sprintf("account_%d", now.UnixNano())
	_, err = tx.Account.Create().
		SetID(accountID).
		SetAccountID(email).
		SetProviderID("credentials").
		SetUserID(userID).
		SetPassword(hashedPassword).
		SetCreatedAt(now).
		SetUpdatedAt(now).
		Save(ctx)
	if err != nil {
		tx.Rollback()
		return nil, "", fmt.Errorf("failed to create account: %w", err)
	}

	// Assign role if specified
	if roleName != "" {
		r, err := tx.Role.Query().Where(role.Name(roleName)).Only(ctx)
		if err != nil {
			if ent.IsNotFound(err) {
				// Create the role if it doesn't exist
				r, err = tx.Role.Create().
					SetID(fmt.Sprintf("role_%s", roleName)).
					SetName(roleName).
					SetDisplayName(roleName).
					SetIsActive(true).
					SetCreatedAt(now).
					SetUpdatedAt(now).
					Save(ctx)
				if err != nil {
					tx.Rollback()
					return nil, "", fmt.Errorf("failed to create role: %w", err)
				}
			} else {
				tx.Rollback()
				return nil, "", fmt.Errorf("failed to query role: %w", err)
			}
		}

		userRoleID := fmt.Sprintf("ur_%d", now.UnixNano())
		_, err = tx.UserRole.Create().
			SetID(userRoleID).
			SetUserID(userID).
			SetRoleID(r.ID).
			SetIsActive(true).
			SetAssignedAt(now).
			SetAssignedBy("system").
			Save(ctx)
		if err != nil {
			tx.Rollback()
			return nil, "", fmt.Errorf("failed to assign role: %w", err)
		}
	}

	if err := tx.Commit(); err != nil {
		return nil, "", fmt.Errorf("failed to commit transaction: %w", err)
	}

	// Generate token
	roles := []string{}
	if roleName != "" {
		roles = append(roles, roleName)
	}
	token, err := s.GenerateToken(u.ID, u.Email, roles)
	if err != nil {
		return nil, "", fmt.Errorf("failed to generate token: %w", err)
	}

	// Create session
	sessionID := fmt.Sprintf("session_%d", now.UnixNano())
	_, _ = s.Client.Session.Create().
		SetID(sessionID).
		SetUserID(u.ID).
		SetToken(token).
		SetExpiresAt(now.Add(7 * 24 * time.Hour)).
		SetCreatedAt(now).
		Save(ctx)

	return u, token, nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (*ent.User, string, []string, error) {
	u, err := s.Client.User.Query().Where(user.Email(email)).Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, "", nil, fmt.Errorf("invalid email or password")
		}
		return nil, "", nil, err
	}

	acc, err := s.Client.Account.Query().
		Where(account.UserID(u.ID), account.ProviderID("credentials")).
		Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, "", nil, fmt.Errorf("invalid email or password")
		}
		return nil, "", nil, err
	}

	if acc.Password == nil {
		return nil, "", nil, fmt.Errorf("password authentication not enabled")
	}

	if !s.CheckPassword(*acc.Password, password) {
		return nil, "", nil, fmt.Errorf("invalid email or password")
	}

	// Get user roles
	roles, err := s.GetUserRoles(ctx, u.ID)
	if err != nil {
		roles = []string{}
	}

	token, err := s.GenerateToken(u.ID, u.Email, roles)
	if err != nil {
		return nil, "", nil, fmt.Errorf("failed to generate token: %w", err)
	}

	// Create session
	sessionID := fmt.Sprintf("session_%d", time.Now().UnixNano())
	_, _ = s.Client.Session.Create().
		SetID(sessionID).
		SetUserID(u.ID).
		SetToken(token).
		SetExpiresAt(time.Now().Add(7 * 24 * time.Hour)).
		SetCreatedAt(time.Now()).
		Save(ctx)

	return u, token, roles, nil
}

func (s *AuthService) Logout(ctx context.Context, userID string) error {
	_, err := s.Client.Session.Delete().Where(session.UserID(userID)).Exec(ctx)
	return err
}

func (s *AuthService) GetUserByID(ctx context.Context, userID string) (*ent.User, error) {
	u, err := s.Client.User.Query().Where(user.ID(userID)).Only(ctx)
	if err != nil {
		if ent.IsNotFound(err) {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return u, nil
}

func (s *AuthService) GetUserRoles(ctx context.Context, userID string) ([]string, error) {
	userRoles, err := s.Client.User.Query().
		Where(user.ID(userID)).
		QueryUserRoles().
		WithRole().
		All(ctx)
	if err != nil {
		return nil, err
	}

	roles := make([]string, 0, len(userRoles))
	for _, ur := range userRoles {
		if ur.Edges.Role != nil {
			roles = append(roles, ur.Edges.Role.Name)
		}
	}
	return roles, nil
}

func (s *AuthService) GetAllUsers(ctx context.Context, limit, offset int) ([]*ent.User, int, error) {
	if limit <= 0 {
		limit = 10
	}

	total, err := s.Client.User.Query().Count(ctx)
	if err != nil {
		return nil, 0, err
	}

	users, err := s.Client.User.Query().
		Limit(limit).
		Offset(offset).
		Order(ent.Desc("created_at")).
		All(ctx)
	if err != nil {
		return nil, 0, err
	}

	return users, total, nil
}

func (s *AuthService) RefreshToken(ctx context.Context, userID string) (*ent.User, string, []string, error) {
	u, err := s.GetUserByID(ctx, userID)
	if err != nil {
		return nil, "", nil, err
	}

	roles, err := s.GetUserRoles(ctx, u.ID)
	if err != nil {
		roles = []string{}
	}

	token, err := s.GenerateToken(u.ID, u.Email, roles)
	if err != nil {
		return nil, "", nil, err
	}

	return u, token, roles, nil
}

// SeedDefaultRoles creates default roles if they don't exist
func (s *AuthService) SeedDefaultRoles(ctx context.Context) error {
	defaultRoles := []struct {
		Name        string
		DisplayName string
	}{
		{"learner", "Learner"},
		{"guardian", "Guardian"},
		{"educator", "Educator"},
		{"ecm", "Education Care Manager"},
		{"employee", "Employee"},
		{"intern", "Intern"},
		{"admin", "Admin"},
	}

	for _, r := range defaultRoles {
		exists, err := s.Client.Role.Query().Where(role.Name(r.Name)).Exist(ctx)
		if err != nil {
			return err
		}
		if !exists {
			_, err = s.Client.Role.Create().
				SetID(fmt.Sprintf("role_%s", r.Name)).
				SetName(r.Name).
				SetDisplayName(r.DisplayName).
				SetIsActive(true).
				SetCreatedAt(time.Now()).
				SetUpdatedAt(time.Now()).
				Save(ctx)
			if err != nil {
				return fmt.Errorf("failed to create role %s: %w", r.Name, err)
			}
		}
	}
	return nil
}
