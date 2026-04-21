// Package middleware provides HTTP middleware functions for the API Gateway.
// This file implements JWT authentication and ABAC authorization middleware.
package middleware

import (
	"context"
	"crypto/rsa"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/nextphoton/api-gateway/config"
	"go.uber.org/zap"
)

// contextKey is a custom type for context keys to avoid collisions.
type contextKey string

const (
	// ContextKeyUser is the context key for storing authenticated user data.
	ContextKeyUser contextKey = "user"

	// ContextKeyCorrelationID is the context key for the correlation ID.
	ContextKeyCorrelationID contextKey = "correlation_id"

	// ContextKeyRequestID is the context key for the request ID.
	ContextKeyRequestID contextKey = "request_id"
)

// UserClaims represents the JWT claims for an authenticated user.
// These claims are extracted from the JWT token and made available
// throughout the request lifecycle.
type UserClaims struct {
	// UserID is the unique identifier for the user.
	UserID string `json:"user_id"`

	// Email is the user's email address.
	Email string `json:"email"`

	// Roles is a list of role names assigned to the user.
	Roles []string `json:"roles"`

	// Permissions is a list of specific permissions granted to the user.
	Permissions []string `json:"permissions"`

	// OrganizationID is the ID of the user's primary organization.
	OrganizationID string `json:"organization_id,omitempty"`

	// TenantID is the ID of the tenant (for multi-tenant scenarios).
	TenantID string `json:"tenant_id,omitempty"`

	// SessionID is the unique identifier for this authentication session.
	SessionID string `json:"session_id,omitempty"`

	// IssuedAt is when the token was issued.
	IssuedAt time.Time `json:"iat"`

	// ExpiresAt is when the token expires.
	ExpiresAt time.Time `json:"exp"`
}

// JWTClaims is the full JWT claims structure including standard claims.
type JWTClaims struct {
	jwt.RegisteredClaims
	UserID         string   `json:"user_id"`
	Email          string   `json:"email"`
	Roles          []string `json:"roles"`
	Permissions    []string `json:"permissions"`
	OrganizationID string   `json:"organization_id,omitempty"`
	TenantID       string   `json:"tenant_id,omitempty"`
	SessionID      string   `json:"session_id,omitempty"`
}

// AuthMiddleware provides JWT authentication middleware.
type AuthMiddleware struct {
	config    *config.JWTConfig
	logger    *zap.Logger
	publicKey *rsa.PublicKey // For RS256 algorithm
}

// NewAuthMiddleware creates a new authentication middleware instance.
func NewAuthMiddleware(cfg *config.JWTConfig, logger *zap.Logger) (*AuthMiddleware, error) {
	am := &AuthMiddleware{
		config: cfg,
		logger: logger,
	}

	// Parse RSA public key if provided (for RS256 algorithm)
	if cfg.PublicKey != "" && cfg.Algorithm == "RS256" {
		pubKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(cfg.PublicKey))
		if err != nil {
			return nil, fmt.Errorf("failed to parse RSA public key: %w", err)
		}
		am.publicKey = pubKey
	}

	return am, nil
}

// Authenticate is a middleware that validates JWT tokens.
// It extracts the token from the Authorization header, validates it,
// and stores the user claims in the request context.
func (am *AuthMiddleware) Authenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Extract correlation ID for logging
		correlationID := r.Context().Value(ContextKeyCorrelationID)

		// Extract token from Authorization header
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			am.logger.Debug("No authorization header present",
				zap.Any("correlation_id", correlationID),
			)
			am.sendUnauthorizedResponse(w, "Authorization header required")
			return
		}

		// Validate Bearer token format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			am.logger.Debug("Invalid authorization header format",
				zap.Any("correlation_id", correlationID),
			)
			am.sendUnauthorizedResponse(w, "Invalid authorization header format")
			return
		}

		tokenString := parts[1]

		// Parse and validate the JWT token
		claims, err := am.validateToken(tokenString)
		if err != nil {
			am.logger.Debug("Token validation failed",
				zap.Error(err),
				zap.Any("correlation_id", correlationID),
			)
			am.sendUnauthorizedResponse(w, err.Error())
			return
		}

		// Create user claims from JWT claims
		userClaims := &UserClaims{
			UserID:         claims.UserID,
			Email:          claims.Email,
			Roles:          claims.Roles,
			Permissions:    claims.Permissions,
			OrganizationID: claims.OrganizationID,
			TenantID:       claims.TenantID,
			SessionID:      claims.SessionID,
			IssuedAt:       claims.IssuedAt.Time,
			ExpiresAt:      claims.ExpiresAt.Time,
		}

		// Store user claims in context
		ctx := context.WithValue(r.Context(), ContextKeyUser, userClaims)

		am.logger.Debug("User authenticated successfully",
			zap.String("user_id", userClaims.UserID),
			zap.Any("correlation_id", correlationID),
		)

		// Call the next handler with the updated context
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// OptionalAuthenticate is a middleware that attempts to authenticate
// but allows the request to proceed even if no token is present.
// This is useful for endpoints that behave differently for authenticated users.
func (am *AuthMiddleware) OptionalAuthenticate(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")

		// If no auth header, proceed without authentication
		if authHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		// Validate Bearer token format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			// Invalid format, but proceed without authentication
			next.ServeHTTP(w, r)
			return
		}

		tokenString := parts[1]

		// Try to validate the token
		claims, err := am.validateToken(tokenString)
		if err != nil {
			// Token invalid, but proceed without authentication
			am.logger.Debug("Optional auth token validation failed",
				zap.Error(err),
			)
			next.ServeHTTP(w, r)
			return
		}

		// Create user claims and add to context
		userClaims := &UserClaims{
			UserID:         claims.UserID,
			Email:          claims.Email,
			Roles:          claims.Roles,
			Permissions:    claims.Permissions,
			OrganizationID: claims.OrganizationID,
			TenantID:       claims.TenantID,
			SessionID:      claims.SessionID,
			IssuedAt:       claims.IssuedAt.Time,
			ExpiresAt:      claims.ExpiresAt.Time,
		}

		ctx := context.WithValue(r.Context(), ContextKeyUser, userClaims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

// validateToken parses and validates a JWT token string.
func (am *AuthMiddleware) validateToken(tokenString string) (*JWTClaims, error) {
	// Parse the token with claims
	token, err := jwt.ParseWithClaims(tokenString, &JWTClaims{}, func(token *jwt.Token) (interface{}, error) {
		// Validate the signing algorithm
		switch am.config.Algorithm {
		case "HS256":
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(am.config.Secret), nil

		case "RS256":
			if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			if am.publicKey == nil {
				return nil, errors.New("RSA public key not configured")
			}
			return am.publicKey, nil

		default:
			return nil, fmt.Errorf("unsupported algorithm: %s", am.config.Algorithm)
		}
	})

	if err != nil {
		return nil, fmt.Errorf("failed to parse token: %w", err)
	}

	if !token.Valid {
		return nil, errors.New("invalid token")
	}

	claims, ok := token.Claims.(*JWTClaims)
	if !ok {
		return nil, errors.New("invalid token claims")
	}

	// Validate issuer if configured
	if am.config.Issuer != "" {
		issuer, err := claims.GetIssuer()
		if err != nil || issuer != am.config.Issuer {
			return nil, errors.New("invalid token issuer")
		}
	}

	// Validate audience if configured
	if am.config.Audience != "" {
		audiences, err := claims.GetAudience()
		if err != nil {
			return nil, errors.New("invalid token audience")
		}
		found := false
		for _, aud := range audiences {
			if aud == am.config.Audience {
				found = true
				break
			}
		}
		if !found {
			return nil, errors.New("token audience mismatch")
		}
	}

	return claims, nil
}

// sendUnauthorizedResponse sends a standardized 401 response.
func (am *AuthMiddleware) sendUnauthorizedResponse(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("WWW-Authenticate", "Bearer")
	w.WriteHeader(http.StatusUnauthorized)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":    "UNAUTHORIZED",
			"message": message,
		},
	}
	json.NewEncoder(w).Encode(response)
}

// RequireRole creates a middleware that requires the user to have at least one
// of the specified roles.
func (am *AuthMiddleware) RequireRole(roles ...string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userClaims := GetUserFromContext(r.Context())
			if userClaims == nil {
				am.sendForbiddenResponse(w, "Authentication required")
				return
			}

			// Check if user has at least one of the required roles
			for _, requiredRole := range roles {
				for _, userRole := range userClaims.Roles {
					if userRole == requiredRole {
						next.ServeHTTP(w, r)
						return
					}
				}
			}

			am.logger.Debug("User lacks required role",
				zap.String("user_id", userClaims.UserID),
				zap.Strings("required_roles", roles),
				zap.Strings("user_roles", userClaims.Roles),
			)

			am.sendForbiddenResponse(w, "Insufficient permissions")
		})
	}
}

// RequirePermission creates a middleware that requires the user to have
// a specific permission.
func (am *AuthMiddleware) RequirePermission(permission string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userClaims := GetUserFromContext(r.Context())
			if userClaims == nil {
				am.sendForbiddenResponse(w, "Authentication required")
				return
			}

			// Check if user has the required permission
			for _, userPerm := range userClaims.Permissions {
				if userPerm == permission {
					next.ServeHTTP(w, r)
					return
				}
			}

			am.logger.Debug("User lacks required permission",
				zap.String("user_id", userClaims.UserID),
				zap.String("required_permission", permission),
				zap.Strings("user_permissions", userClaims.Permissions),
			)

			am.sendForbiddenResponse(w, "Insufficient permissions")
		})
	}
}

// sendForbiddenResponse sends a standardized 403 response.
func (am *AuthMiddleware) sendForbiddenResponse(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":    "FORBIDDEN",
			"message": message,
		},
	}
	json.NewEncoder(w).Encode(response)
}

// GetUserFromContext extracts user claims from the request context.
// Returns nil if no user is authenticated.
func GetUserFromContext(ctx context.Context) *UserClaims {
	if claims, ok := ctx.Value(ContextKeyUser).(*UserClaims); ok {
		return claims
	}
	return nil
}

// GetCorrelationID extracts the correlation ID from the request context.
func GetCorrelationID(ctx context.Context) string {
	if id, ok := ctx.Value(ContextKeyCorrelationID).(string); ok {
		return id
	}
	return ""
}

// GetRequestID extracts the request ID from the request context.
func GetRequestID(ctx context.Context) string {
	if id, ok := ctx.Value(ContextKeyRequestID).(string); ok {
		return id
	}
	return ""
}

// ABACAuthorizer provides Attribute-Based Access Control authorization.
type ABACAuthorizer struct {
	logger *zap.Logger
	// In production, this would integrate with the auth-service for policy evaluation
}

// NewABACAuthorizer creates a new ABAC authorizer instance.
func NewABACAuthorizer(logger *zap.Logger) *ABACAuthorizer {
	return &ABACAuthorizer{
		logger: logger,
	}
}

// Authorize creates a middleware that checks ABAC policies for a specific
// resource and action.
func (a *ABACAuthorizer) Authorize(resource, action string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			userClaims := GetUserFromContext(r.Context())
			if userClaims == nil {
				a.sendForbiddenResponse(w, "Authentication required")
				return
			}

			// Build the permission string in format "resource:action"
			requiredPermission := fmt.Sprintf("%s:%s", resource, action)

			// Check direct permissions
			for _, perm := range userClaims.Permissions {
				if perm == requiredPermission || perm == fmt.Sprintf("%s:*", resource) || perm == "*:*" {
					next.ServeHTTP(w, r)
					return
				}
			}

			// In production, this would call the auth-service to evaluate
			// more complex ABAC policies considering:
			// - User attributes (roles, organization, department)
			// - Resource attributes (owner, type, sensitivity)
			// - Environment attributes (time, location, device)
			// - Contextual policies (data classification, compliance requirements)

			a.logger.Debug("ABAC authorization denied",
				zap.String("user_id", userClaims.UserID),
				zap.String("resource", resource),
				zap.String("action", action),
				zap.Strings("user_permissions", userClaims.Permissions),
			)

			a.sendForbiddenResponse(w, "Access denied by policy")
		})
	}
}

// sendForbiddenResponse sends a standardized 403 response.
func (a *ABACAuthorizer) sendForbiddenResponse(w http.ResponseWriter, message string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusForbidden)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":    "FORBIDDEN",
			"message": message,
		},
	}
	json.NewEncoder(w).Encode(response)
}
