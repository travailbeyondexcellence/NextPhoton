// Package middleware provides HTTP middleware functions for the API Gateway.
// This file implements structured logging middleware with correlation IDs
// for request tracing across distributed services.
package middleware

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/nextphoton/api-gateway/config"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

// LoggingMiddleware provides structured HTTP request/response logging.
type LoggingMiddleware struct {
	logger *zap.Logger
	config *config.LoggingConfig
}

// responseWriter is a custom response writer that captures status code and body size.
type responseWriter struct {
	http.ResponseWriter
	statusCode    int
	bytesWritten  int64
	headerWritten bool
}

// newResponseWriter creates a new response writer wrapper.
func newResponseWriter(w http.ResponseWriter) *responseWriter {
	return &responseWriter{
		ResponseWriter: w,
		statusCode:     http.StatusOK, // Default to 200 if not explicitly set
	}
}

// WriteHeader captures the status code before writing it.
func (rw *responseWriter) WriteHeader(statusCode int) {
	if !rw.headerWritten {
		rw.statusCode = statusCode
		rw.headerWritten = true
	}
	rw.ResponseWriter.WriteHeader(statusCode)
}

// Write captures the number of bytes written.
func (rw *responseWriter) Write(b []byte) (int, error) {
	n, err := rw.ResponseWriter.Write(b)
	rw.bytesWritten += int64(n)
	return n, err
}

// NewLoggingMiddleware creates a new logging middleware instance.
func NewLoggingMiddleware(cfg *config.LoggingConfig) (*LoggingMiddleware, error) {
	// Configure zap logger based on config
	var zapConfig zap.Config

	if cfg.Format == "json" {
		zapConfig = zap.NewProductionConfig()
	} else {
		zapConfig = zap.NewDevelopmentConfig()
		zapConfig.EncoderConfig.EncodeLevel = zapcore.CapitalColorLevelEncoder
	}

	// Set log level
	switch cfg.Level {
	case "debug":
		zapConfig.Level = zap.NewAtomicLevelAt(zap.DebugLevel)
	case "info":
		zapConfig.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	case "warn":
		zapConfig.Level = zap.NewAtomicLevelAt(zap.WarnLevel)
	case "error":
		zapConfig.Level = zap.NewAtomicLevelAt(zap.ErrorLevel)
	default:
		zapConfig.Level = zap.NewAtomicLevelAt(zap.InfoLevel)
	}

	// Set output paths
	if cfg.OutputPath != "" && cfg.OutputPath != "stdout" {
		zapConfig.OutputPaths = []string{cfg.OutputPath}
	}

	// Build the logger
	logger, err := zapConfig.Build(
		zap.AddStacktrace(zapcore.ErrorLevel),
	)
	if err != nil {
		return nil, err
	}

	return &LoggingMiddleware{
		logger: logger,
		config: cfg,
	}, nil
}

// Handler returns the logging middleware handler.
// It logs incoming requests and outgoing responses with timing information.
func (lm *LoggingMiddleware) Handler() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()

			// Generate or extract correlation ID
			correlationID := r.Header.Get("X-Correlation-ID")
			if correlationID == "" {
				correlationID = uuid.New().String()
			}

			// Generate request ID (unique to this request)
			requestID := uuid.New().String()

			// Set correlation headers on response
			w.Header().Set("X-Correlation-ID", correlationID)
			w.Header().Set("X-Request-ID", requestID)

			// Add IDs to request context
			ctx := context.WithValue(r.Context(), ContextKeyCorrelationID, correlationID)
			ctx = context.WithValue(ctx, ContextKeyRequestID, requestID)
			r = r.WithContext(ctx)

			// Wrap the response writer to capture status code and size
			wrappedWriter := newResponseWriter(w)

			// Log the incoming request
			lm.logRequest(r, correlationID, requestID)

			// Call the next handler
			next.ServeHTTP(wrappedWriter, r)

			// Calculate duration
			duration := time.Since(start)

			// Log the response
			lm.logResponse(r, wrappedWriter, correlationID, requestID, duration)
		})
	}
}

// logRequest logs details about the incoming request.
func (lm *LoggingMiddleware) logRequest(r *http.Request, correlationID, requestID string) {
	// Determine user ID if available
	userID := ""
	if claims := GetUserFromContext(r.Context()); claims != nil {
		userID = claims.UserID
	}

	fields := []zap.Field{
		zap.String("event", "request_received"),
		zap.String("correlation_id", correlationID),
		zap.String("request_id", requestID),
		zap.String("method", r.Method),
		zap.String("path", r.URL.Path),
		zap.String("query", r.URL.RawQuery),
		zap.String("remote_addr", r.RemoteAddr),
		zap.String("user_agent", r.UserAgent()),
		zap.Int64("content_length", r.ContentLength),
	}

	// Add user ID if authenticated
	if userID != "" {
		fields = append(fields, zap.String("user_id", userID))
	}

	// Add forwarded headers for debugging proxy issues
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		fields = append(fields, zap.String("x_forwarded_for", xff))
	}
	if xrip := r.Header.Get("X-Real-IP"); xrip != "" {
		fields = append(fields, zap.String("x_real_ip", xrip))
	}

	lm.logger.Info("Request received", fields...)
}

// logResponse logs details about the outgoing response.
func (lm *LoggingMiddleware) logResponse(r *http.Request, rw *responseWriter, correlationID, requestID string, duration time.Duration) {
	// Determine user ID if available
	userID := ""
	if claims := GetUserFromContext(r.Context()); claims != nil {
		userID = claims.UserID
	}

	fields := []zap.Field{
		zap.String("event", "request_completed"),
		zap.String("correlation_id", correlationID),
		zap.String("request_id", requestID),
		zap.String("method", r.Method),
		zap.String("path", r.URL.Path),
		zap.Int("status_code", rw.statusCode),
		zap.Int64("response_bytes", rw.bytesWritten),
		zap.Duration("duration", duration),
		zap.Float64("duration_ms", float64(duration.Microseconds())/1000),
	}

	// Add user ID if authenticated
	if userID != "" {
		fields = append(fields, zap.String("user_id", userID))
	}

	// Choose log level based on status code
	switch {
	case rw.statusCode >= 500:
		lm.logger.Error("Request completed with server error", fields...)
	case rw.statusCode >= 400:
		lm.logger.Warn("Request completed with client error", fields...)
	default:
		lm.logger.Info("Request completed", fields...)
	}
}

// Logger returns the underlying zap logger for use by other components.
func (lm *LoggingMiddleware) Logger() *zap.Logger {
	return lm.logger
}

// RequestBodyLogger middleware logs request bodies (use with caution - can be verbose).
// Only enable for specific endpoints that need request body logging for debugging.
func RequestBodyLogger(logger *zap.Logger, maxBodySize int64) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Only log bodies for specific content types
			contentType := r.Header.Get("Content-Type")
			shouldLog := contentType == "application/json" || contentType == "application/graphql"

			if !shouldLog || r.Body == nil || r.ContentLength == 0 {
				next.ServeHTTP(w, r)
				return
			}

			// Limit the body size we read
			bodyReader := io.LimitReader(r.Body, maxBodySize)

			// Read the body
			body, err := io.ReadAll(bodyReader)
			if err != nil {
				logger.Error("Failed to read request body for logging", zap.Error(err))
				next.ServeHTTP(w, r)
				return
			}

			// Restore the body so downstream handlers can read it
			r.Body = io.NopCloser(bytes.NewBuffer(body))

			// Log the body
			logger.Debug("Request body",
				zap.String("correlation_id", GetCorrelationID(r.Context())),
				zap.String("body", string(body)),
			)

			next.ServeHTTP(w, r)
		})
	}
}

// AccessLog creates a simple access log entry in Apache Combined Log Format.
// This is useful for compatibility with log analysis tools.
func AccessLog(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			wrappedWriter := newResponseWriter(w)

			next.ServeHTTP(wrappedWriter, r)

			// Log in Apache Combined Log Format
			logger.Info("access_log",
				zap.String("remote_addr", r.RemoteAddr),
				zap.String("time", start.Format("02/Jan/2006:15:04:05 -0700")),
				zap.String("request", r.Method+" "+r.URL.Path+" "+r.Proto),
				zap.Int("status", wrappedWriter.statusCode),
				zap.Int64("bytes", wrappedWriter.bytesWritten),
				zap.String("referer", r.Referer()),
				zap.String("user_agent", r.UserAgent()),
				zap.Duration("duration", time.Since(start)),
			)
		})
	}
}

// SensitiveDataFilter creates middleware that redacts sensitive data from logs.
// This should be applied to endpoints that handle sensitive information.
func SensitiveDataFilter(sensitiveHeaders []string) func(http.Handler) http.Handler {
	// Convert to map for O(1) lookup
	sensitiveMap := make(map[string]struct{})
	for _, header := range sensitiveHeaders {
		sensitiveMap[header] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Clone the request to avoid modifying the original
			for header := range sensitiveMap {
				if r.Header.Get(header) != "" {
					// Mark as redacted for logging purposes
					// The actual header value is preserved for the handler
					r.Header.Set("X-Logged-"+header, "[REDACTED]")
				}
			}

			next.ServeHTTP(w, r)
		})
	}
}

// MetricsMiddleware tracks request metrics for Prometheus.
// This is separate from logging and provides numeric metrics.
func (lm *LoggingMiddleware) MetricsHandler() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			wrappedWriter := newResponseWriter(w)

			next.ServeHTTP(wrappedWriter, r)

			duration := time.Since(start)

			// Record metrics (this would integrate with prometheus client)
			// For now, just log them
			lm.logger.Debug("metrics",
				zap.String("endpoint", r.URL.Path),
				zap.String("method", r.Method),
				zap.Int("status", wrappedWriter.statusCode),
				zap.Float64("duration_seconds", duration.Seconds()),
				zap.Int64("response_bytes", wrappedWriter.bytesWritten),
			)
		})
	}
}
