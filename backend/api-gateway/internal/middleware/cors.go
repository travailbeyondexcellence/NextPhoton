// Package middleware provides HTTP middleware functions for the API Gateway.
// This file implements CORS (Cross-Origin Resource Sharing) middleware.
package middleware

import (
	"net/http"

	"github.com/go-chi/cors"
	"github.com/nextphoton/api-gateway/config"
	"go.uber.org/zap"
)

// CORSMiddleware provides Cross-Origin Resource Sharing handling.
// It wraps the go-chi/cors middleware with NextPhoton-specific configuration.
type CORSMiddleware struct {
	config  *config.CORSConfig
	logger  *zap.Logger
	handler func(http.Handler) http.Handler
}

// NewCORSMiddleware creates a new CORS middleware instance.
// It configures CORS based on the provided configuration.
func NewCORSMiddleware(cfg *config.CORSConfig, logger *zap.Logger) *CORSMiddleware {
	cm := &CORSMiddleware{
		config: cfg,
		logger: logger,
	}

	// Create the chi CORS handler with our configuration
	cm.handler = cors.Handler(cors.Options{
		// AllowedOrigins is a list of origins a cross-domain request can be executed from.
		// If the special "*" value is present in the list, all origins will be allowed.
		// An origin may contain a wildcard (*) to replace 0 or more characters
		// (i.e.: http://*.domain.com).
		AllowedOrigins: cfg.AllowedOrigins,

		// AllowedMethods is a list of methods the client is allowed to use with
		// cross-domain requests.
		AllowedMethods: cfg.AllowedMethods,

		// AllowedHeaders is list of non simple headers the client is allowed to use with
		// cross-domain requests. If the special "*" value is present in the list, all headers
		// will be allowed.
		AllowedHeaders: cfg.AllowedHeaders,

		// ExposedHeaders indicates which headers are safe to expose to the API of a CORS
		// API specification.
		ExposedHeaders: cfg.ExposedHeaders,

		// AllowCredentials indicates whether the request can include user credentials like
		// cookies, HTTP authentication or client side SSL certificates.
		AllowCredentials: cfg.AllowCredentials,

		// MaxAge indicates how long (in seconds) the results of a preflight request
		// can be cached.
		MaxAge: cfg.MaxAge,

		// Debug mode outputs additional logging for debugging CORS issues
		Debug: false,
	})

	logger.Info("CORS middleware initialized",
		zap.Strings("allowed_origins", cfg.AllowedOrigins),
		zap.Strings("allowed_methods", cfg.AllowedMethods),
		zap.Bool("allow_credentials", cfg.AllowCredentials),
	)

	return cm
}

// Handler returns the CORS middleware handler.
// It can be used in the middleware chain as: r.Use(corsMiddleware.Handler())
func (cm *CORSMiddleware) Handler() func(http.Handler) http.Handler {
	return cm.handler
}

// HandlePreflight is an explicit handler for OPTIONS preflight requests.
// This can be used to handle CORS preflight without going through the full
// middleware chain.
func (cm *CORSMiddleware) HandlePreflight(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	origin := r.Header.Get("Origin")
	if cm.isOriginAllowed(origin) {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	}

	w.Header().Set("Access-Control-Allow-Methods", joinStrings(cm.config.AllowedMethods))
	w.Header().Set("Access-Control-Allow-Headers", joinStrings(cm.config.AllowedHeaders))
	w.Header().Set("Access-Control-Expose-Headers", joinStrings(cm.config.ExposedHeaders))

	if cm.config.AllowCredentials {
		w.Header().Set("Access-Control-Allow-Credentials", "true")
	}

	w.Header().Set("Access-Control-Max-Age", string(rune(cm.config.MaxAge)))

	// Respond to preflight with 204 No Content
	w.WriteHeader(http.StatusNoContent)
}

// isOriginAllowed checks if the given origin is in the allowed origins list.
func (cm *CORSMiddleware) isOriginAllowed(origin string) bool {
	if origin == "" {
		return false
	}

	for _, allowed := range cm.config.AllowedOrigins {
		// Check for wildcard
		if allowed == "*" {
			return true
		}

		// Check for exact match
		if allowed == origin {
			return true
		}

		// TODO: Add support for wildcard subdomain matching (e.g., *.example.com)
	}

	return false
}

// joinStrings joins a slice of strings with comma separator.
func joinStrings(strs []string) string {
	result := ""
	for i, s := range strs {
		if i > 0 {
			result += ", "
		}
		result += s
	}
	return result
}

// SetVaryHeader adds the Vary header to indicate response varies based on Origin.
// This is important for proper caching of CORS responses.
func SetVaryHeader(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Vary", "Origin")
		next.ServeHTTP(w, r)
	})
}

// SecureHeaders adds security-related headers to all responses.
// These headers help protect against common web vulnerabilities.
func SecureHeaders(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// X-Content-Type-Options prevents MIME type sniffing
		w.Header().Set("X-Content-Type-Options", "nosniff")

		// X-Frame-Options prevents clickjacking (unless specifically allowed)
		w.Header().Set("X-Frame-Options", "DENY")

		// X-XSS-Protection enables browser's XSS filter
		w.Header().Set("X-XSS-Protection", "1; mode=block")

		// Referrer-Policy controls how much referrer information is sent
		w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")

		// Content-Security-Policy can be added here for additional security
		// w.Header().Set("Content-Security-Policy", "default-src 'self'")

		// Strict-Transport-Security enforces HTTPS (should be enabled in production)
		// w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")

		next.ServeHTTP(w, r)
	})
}
