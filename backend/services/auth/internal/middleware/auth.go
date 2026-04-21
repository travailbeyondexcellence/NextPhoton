package middleware

import (
	"context"
	"net/http"
	"strings"

	"github.com/nextphoton/auth-service/internal/service"
)

type contextKey string

const UserClaimsKey contextKey = "user_claims"

func AuthMiddleware(authService *service.AuthService) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			authHeader := r.Header.Get("Authorization")
			if authHeader == "" {
				next.ServeHTTP(w, r)
				return
			}

			tokenString := strings.TrimPrefix(authHeader, "Bearer ")
			if tokenString == authHeader {
				next.ServeHTTP(w, r)
				return
			}

			claims, err := authService.ValidateToken(tokenString)
			if err != nil {
				next.ServeHTTP(w, r)
				return
			}

			ctx := context.WithValue(r.Context(), UserClaimsKey, claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}

func GetUserClaims(ctx context.Context) *service.Claims {
	claims, ok := ctx.Value(UserClaimsKey).(*service.Claims)
	if !ok {
		return nil
	}
	return claims
}
