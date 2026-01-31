// Package middleware provides HTTP middleware functions for the API Gateway.
// This file implements panic recovery middleware to prevent server crashes
// from propagating to clients.
package middleware

import (
	"encoding/json"
	"fmt"
	"net/http"
	"runtime/debug"

	"go.uber.org/zap"
)

// RecoveryMiddleware provides panic recovery for HTTP handlers.
// It catches panics, logs them with stack traces, and returns a
// standardized error response to the client.
type RecoveryMiddleware struct {
	logger          *zap.Logger
	enableStackTrace bool
}

// NewRecoveryMiddleware creates a new recovery middleware instance.
func NewRecoveryMiddleware(logger *zap.Logger, enableStackTrace bool) *RecoveryMiddleware {
	return &RecoveryMiddleware{
		logger:          logger,
		enableStackTrace: enableStackTrace,
	}
}

// Handler returns the recovery middleware handler.
// It wraps the next handler and recovers from any panics.
func (rm *RecoveryMiddleware) Handler() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					// Get the stack trace
					stack := debug.Stack()

					// Extract correlation ID for tracing
					correlationID := GetCorrelationID(r.Context())
					requestID := GetRequestID(r.Context())

					// Log the panic with full context
					rm.logger.Error("Panic recovered",
						zap.Any("error", err),
						zap.String("correlation_id", correlationID),
						zap.String("request_id", requestID),
						zap.String("method", r.Method),
						zap.String("path", r.URL.Path),
						zap.String("remote_addr", r.RemoteAddr),
						zap.ByteString("stack_trace", stack),
					)

					// Send error response to client
					rm.sendErrorResponse(w, correlationID, requestID, err)
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}

// sendErrorResponse sends a standardized 500 Internal Server Error response.
func (rm *RecoveryMiddleware) sendErrorResponse(w http.ResponseWriter, correlationID, requestID string, panicErr interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)

	// Build the error response
	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":           "INTERNAL_SERVER_ERROR",
			"message":        "An unexpected error occurred. Please try again later.",
			"correlation_id": correlationID,
			"request_id":     requestID,
		},
	}

	// Optionally include the actual error message in development
	if rm.enableStackTrace {
		response["error"].(map[string]interface{})["details"] = fmt.Sprintf("%v", panicErr)
	}

	json.NewEncoder(w).Encode(response)
}

// RecoveryWithCustomHandler creates a recovery middleware with a custom error handler.
// This allows for custom error responses or additional error processing.
type CustomRecoveryHandler func(w http.ResponseWriter, r *http.Request, err interface{})

// RecoveryWithHandler creates a recovery middleware that uses a custom handler.
func RecoveryWithHandler(logger *zap.Logger, handler CustomRecoveryHandler) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					// Log the panic
					stack := debug.Stack()
					logger.Error("Panic recovered (custom handler)",
						zap.Any("error", err),
						zap.String("correlation_id", GetCorrelationID(r.Context())),
						zap.String("method", r.Method),
						zap.String("path", r.URL.Path),
						zap.ByteString("stack_trace", stack),
					)

					// Call the custom handler
					handler(w, r, err)
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}

// PanicNotifier is an interface for sending panic notifications.
// Implementations might send to Slack, PagerDuty, email, etc.
type PanicNotifier interface {
	Notify(err interface{}, stack []byte, r *http.Request) error
}

// RecoveryWithNotification creates a recovery middleware that notifies external services.
func RecoveryWithNotification(logger *zap.Logger, notifier PanicNotifier) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if err := recover(); err != nil {
					stack := debug.Stack()

					// Log the panic
					logger.Error("Panic recovered (with notification)",
						zap.Any("error", err),
						zap.String("correlation_id", GetCorrelationID(r.Context())),
						zap.String("method", r.Method),
						zap.String("path", r.URL.Path),
						zap.ByteString("stack_trace", stack),
					)

					// Send notification (non-blocking)
					go func() {
						if notifyErr := notifier.Notify(err, stack, r); notifyErr != nil {
							logger.Error("Failed to send panic notification",
								zap.Error(notifyErr),
							)
						}
					}()

					// Send error response
					sendInternalError(w)
				}
			}()

			next.ServeHTTP(w, r)
		})
	}
}

// sendInternalError is a helper function to send a generic internal server error.
func sendInternalError(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusInternalServerError)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":    "INTERNAL_SERVER_ERROR",
			"message": "An unexpected error occurred. Please try again later.",
		},
	}
	json.NewEncoder(w).Encode(response)
}

// CircuitBreaker implements a simple circuit breaker pattern to prevent
// cascading failures when a service is experiencing issues.
type CircuitBreaker struct {
	logger        *zap.Logger
	failureCount  int
	threshold     int
	state         string // "closed", "open", "half-open"
	lastFailure   int64
	cooldownNanos int64
}

// NewCircuitBreaker creates a new circuit breaker.
func NewCircuitBreaker(logger *zap.Logger, threshold int, cooldownSeconds int) *CircuitBreaker {
	return &CircuitBreaker{
		logger:        logger,
		threshold:     threshold,
		state:         "closed",
		cooldownNanos: int64(cooldownSeconds) * 1e9,
	}
}

// Execute runs a function with circuit breaker protection.
func (cb *CircuitBreaker) Execute(fn func() error) error {
	// Check circuit state
	if cb.state == "open" {
		// Check if cooldown has passed
		// In production, this would use proper time tracking
		return fmt.Errorf("circuit breaker is open")
	}

	// Execute the function
	err := fn()

	if err != nil {
		cb.failureCount++
		if cb.failureCount >= cb.threshold {
			cb.state = "open"
			cb.logger.Warn("Circuit breaker opened",
				zap.Int("failure_count", cb.failureCount),
				zap.Int("threshold", cb.threshold),
			)
		}
		return err
	}

	// Reset on success
	cb.failureCount = 0
	cb.state = "closed"
	return nil
}

// GracefulDegradation provides fallback responses when services fail.
type GracefulDegradation struct {
	logger         *zap.Logger
	fallbackCache  map[string][]byte
	serviceHealthy map[string]bool
}

// NewGracefulDegradation creates a new graceful degradation handler.
func NewGracefulDegradation(logger *zap.Logger) *GracefulDegradation {
	return &GracefulDegradation{
		logger:         logger,
		fallbackCache:  make(map[string][]byte),
		serviceHealthy: make(map[string]bool),
	}
}

// SetFallback sets a fallback response for a specific endpoint.
func (gd *GracefulDegradation) SetFallback(path string, response []byte) {
	gd.fallbackCache[path] = response
}

// MarkServiceUnhealthy marks a service as unhealthy, triggering fallbacks.
func (gd *GracefulDegradation) MarkServiceUnhealthy(serviceName string) {
	gd.serviceHealthy[serviceName] = false
	gd.logger.Warn("Service marked unhealthy",
		zap.String("service", serviceName),
	)
}

// MarkServiceHealthy marks a service as healthy.
func (gd *GracefulDegradation) MarkServiceHealthy(serviceName string) {
	gd.serviceHealthy[serviceName] = true
	gd.logger.Info("Service marked healthy",
		zap.String("service", serviceName),
	)
}

// Handler returns middleware that provides fallback responses.
func (gd *GracefulDegradation) Handler(serviceName string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check if service is healthy
			if healthy, ok := gd.serviceHealthy[serviceName]; ok && !healthy {
				// Try to serve from fallback cache
				if fallback, exists := gd.fallbackCache[r.URL.Path]; exists {
					w.Header().Set("Content-Type", "application/json")
					w.Header().Set("X-Fallback-Response", "true")
					w.WriteHeader(http.StatusOK)
					w.Write(fallback)

					gd.logger.Debug("Served fallback response",
						zap.String("path", r.URL.Path),
						zap.String("service", serviceName),
					)
					return
				}

				// No fallback available, return service unavailable
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusServiceUnavailable)
				json.NewEncoder(w).Encode(map[string]interface{}{
					"error": map[string]interface{}{
						"code":    "SERVICE_UNAVAILABLE",
						"message": "Service temporarily unavailable. Please try again later.",
					},
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
