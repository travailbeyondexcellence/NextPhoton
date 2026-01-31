// Package middleware provides HTTP middleware functions for the API Gateway.
// This file implements rate limiting middleware with support for both
// in-memory and Redis-backed distributed rate limiting.
package middleware

import (
	"context"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/nextphoton/api-gateway/config"
	"github.com/redis/go-redis/v9"
	"go.uber.org/zap"
	"golang.org/x/time/rate"
)

// RateLimiter provides rate limiting functionality.
// It supports both per-IP and per-user rate limiting with either
// in-memory or Redis-backed storage for distributed environments.
type RateLimiter struct {
	config      *config.RateLimitConfig
	logger      *zap.Logger
	redisClient *redis.Client

	// In-memory rate limiters (used when Redis is not enabled)
	limiters map[string]*rate.Limiter
	mu       sync.RWMutex

	// Cleanup ticker for expired limiters
	cleanupTicker *time.Ticker
	done          chan struct{}
}

// RateLimiterEntry tracks rate limit state for a specific key.
type RateLimiterEntry struct {
	limiter  *rate.Limiter
	lastSeen time.Time
}

// NewRateLimiter creates a new rate limiter instance.
func NewRateLimiter(cfg *config.RateLimitConfig, logger *zap.Logger, redisClient *redis.Client) *RateLimiter {
	rl := &RateLimiter{
		config:      cfg,
		logger:      logger,
		redisClient: redisClient,
		limiters:    make(map[string]*rate.Limiter),
		done:        make(chan struct{}),
	}

	// Start cleanup goroutine for in-memory limiters
	if !cfg.UseRedis {
		rl.cleanupTicker = time.NewTicker(5 * time.Minute)
		go rl.cleanupLoop()
	}

	logger.Info("Rate limiter initialized",
		zap.Bool("enabled", cfg.Enabled),
		zap.Int("requests_per_second", cfg.RequestsPerSecond),
		zap.Int("burst_size", cfg.BurstSize),
		zap.Bool("use_redis", cfg.UseRedis),
	)

	return rl
}

// Handler returns the rate limiting middleware handler.
func (rl *RateLimiter) Handler() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Skip if rate limiting is disabled
			if !rl.config.Enabled {
				next.ServeHTTP(w, r)
				return
			}

			// Get the rate limit key (user ID if authenticated, otherwise IP)
			key := rl.getKey(r)

			// Check rate limit
			allowed, remaining, resetTime := rl.checkLimit(r.Context(), key)

			// Set rate limit headers
			w.Header().Set("X-RateLimit-Limit", strconv.Itoa(rl.config.RequestsPerSecond))
			w.Header().Set("X-RateLimit-Remaining", strconv.Itoa(remaining))
			w.Header().Set("X-RateLimit-Reset", strconv.FormatInt(resetTime.Unix(), 10))

			if !allowed {
				rl.logger.Warn("Rate limit exceeded",
					zap.String("key", key),
					zap.String("path", r.URL.Path),
				)

				w.Header().Set("Retry-After", strconv.FormatInt(int64(time.Until(resetTime).Seconds()), 10))
				rl.sendRateLimitResponse(w, resetTime)
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// getKey determines the rate limit key for a request.
// If the user is authenticated, use user ID; otherwise, use IP address.
func (rl *RateLimiter) getKey(r *http.Request) string {
	// Check for authenticated user
	if userClaims := GetUserFromContext(r.Context()); userClaims != nil {
		return fmt.Sprintf("user:%s", userClaims.UserID)
	}

	// Fall back to IP address
	ip := rl.getClientIP(r)
	return fmt.Sprintf("ip:%s", ip)
}

// getClientIP extracts the client's IP address from the request.
// It checks X-Forwarded-For and X-Real-IP headers for proxy scenarios.
func (rl *RateLimiter) getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header (set by proxies/load balancers)
	if xff := r.Header.Get("X-Forwarded-For"); xff != "" {
		// X-Forwarded-For can contain multiple IPs; take the first one
		if idx := len(xff) - 1; idx > 0 {
			for i := 0; i < len(xff); i++ {
				if xff[i] == ',' {
					return xff[:i]
				}
			}
		}
		return xff
	}

	// Check X-Real-IP header
	if xri := r.Header.Get("X-Real-IP"); xri != "" {
		return xri
	}

	// Fall back to RemoteAddr
	ip, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return ip
}

// checkLimit checks if the request should be rate limited.
// Returns: (allowed bool, remaining int, resetTime time.Time)
func (rl *RateLimiter) checkLimit(ctx context.Context, key string) (bool, int, time.Time) {
	if rl.config.UseRedis && rl.redisClient != nil {
		return rl.checkLimitRedis(ctx, key)
	}
	return rl.checkLimitInMemory(key)
}

// checkLimitInMemory implements in-memory rate limiting using token bucket algorithm.
func (rl *RateLimiter) checkLimitInMemory(key string) (bool, int, time.Time) {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.limiters[key]
	if !exists {
		// Create a new rate limiter for this key
		// rate.Limit is tokens per second, burst is the bucket size
		limiter = rate.NewLimiter(rate.Limit(rl.config.RequestsPerSecond), rl.config.BurstSize)
		rl.limiters[key] = limiter
	}

	// Try to consume a token
	allowed := limiter.Allow()

	// Calculate remaining tokens (approximate)
	tokens := int(limiter.Tokens())
	if tokens < 0 {
		tokens = 0
	}

	// Calculate reset time (when bucket will be full again)
	resetTime := time.Now().Add(rl.config.WindowDuration)

	return allowed, tokens, resetTime
}

// checkLimitRedis implements distributed rate limiting using Redis.
// Uses a sliding window log algorithm for more accurate rate limiting.
func (rl *RateLimiter) checkLimitRedis(ctx context.Context, key string) (bool, int, time.Time) {
	now := time.Now()
	windowStart := now.Add(-rl.config.WindowDuration)
	resetTime := now.Add(rl.config.WindowDuration)

	// Use a Redis sorted set for sliding window rate limiting
	redisKey := fmt.Sprintf("ratelimit:%s", key)

	// Lua script for atomic rate limiting operation
	script := redis.NewScript(`
		local key = KEYS[1]
		local window_start = tonumber(ARGV[1])
		local now = tonumber(ARGV[2])
		local limit = tonumber(ARGV[3])
		local window_size = tonumber(ARGV[4])

		-- Remove old entries outside the window
		redis.call('ZREMRANGEBYSCORE', key, '-inf', window_start)

		-- Count current entries in the window
		local count = redis.call('ZCARD', key)

		if count < limit then
			-- Add current request
			redis.call('ZADD', key, now, now .. ':' .. math.random())
			-- Set expiry on the key
			redis.call('EXPIRE', key, window_size)
			return {1, limit - count - 1}
		else
			return {0, 0}
		end
	`)

	result, err := script.Run(ctx, rl.redisClient, []string{redisKey},
		windowStart.UnixNano(),
		now.UnixNano(),
		rl.config.RequestsPerSecond,
		int(rl.config.WindowDuration.Seconds()),
	).Result()

	if err != nil {
		rl.logger.Error("Redis rate limit check failed, falling back to allow",
			zap.Error(err),
			zap.String("key", key),
		)
		// Fail open - allow the request if Redis is unavailable
		return true, rl.config.RequestsPerSecond, resetTime
	}

	// Parse the result
	resultSlice, ok := result.([]interface{})
	if !ok || len(resultSlice) != 2 {
		rl.logger.Error("Unexpected Redis result format")
		return true, rl.config.RequestsPerSecond, resetTime
	}

	allowed := resultSlice[0].(int64) == 1
	remaining := int(resultSlice[1].(int64))

	return allowed, remaining, resetTime
}

// sendRateLimitResponse sends a standardized 429 Too Many Requests response.
func (rl *RateLimiter) sendRateLimitResponse(w http.ResponseWriter, resetTime time.Time) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusTooManyRequests)

	response := map[string]interface{}{
		"error": map[string]interface{}{
			"code":       "RATE_LIMIT_EXCEEDED",
			"message":    "Too many requests. Please try again later.",
			"retry_after": time.Until(resetTime).Seconds(),
			"reset_at":   resetTime.Format(time.RFC3339),
		},
	}
	json.NewEncoder(w).Encode(response)
}

// cleanupLoop periodically removes expired rate limiters from memory.
func (rl *RateLimiter) cleanupLoop() {
	for {
		select {
		case <-rl.cleanupTicker.C:
			rl.cleanup()
		case <-rl.done:
			return
		}
	}
}

// cleanup removes rate limiters that haven't been used recently.
func (rl *RateLimiter) cleanup() {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	// For simplicity, clear all limiters periodically
	// A more sophisticated approach would track last access time
	if len(rl.limiters) > 10000 {
		rl.limiters = make(map[string]*rate.Limiter)
		rl.logger.Info("Cleaned up rate limiters")
	}
}

// Close stops the rate limiter and cleans up resources.
func (rl *RateLimiter) Close() {
	if rl.cleanupTicker != nil {
		rl.cleanupTicker.Stop()
	}
	close(rl.done)
}

// IPWhitelist creates a middleware that bypasses rate limiting for whitelisted IPs.
func (rl *RateLimiter) IPWhitelist(whitelist []string) func(http.Handler) http.Handler {
	// Convert to map for O(1) lookup
	whitelistMap := make(map[string]struct{})
	for _, ip := range whitelist {
		whitelistMap[ip] = struct{}{}
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ip := rl.getClientIP(r)
			if _, ok := whitelistMap[ip]; ok {
				// Skip rate limiting for whitelisted IPs
				next.ServeHTTP(w, r)
				return
			}

			// Apply normal rate limiting
			rl.Handler()(next).ServeHTTP(w, r)
		})
	}
}

// EndpointRateLimiter allows setting different rate limits for specific endpoints.
type EndpointRateLimiter struct {
	defaultLimiter *RateLimiter
	endpointLimits map[string]*RateLimiter
	logger         *zap.Logger
}

// NewEndpointRateLimiter creates a rate limiter with per-endpoint configuration.
func NewEndpointRateLimiter(defaultLimiter *RateLimiter, logger *zap.Logger) *EndpointRateLimiter {
	return &EndpointRateLimiter{
		defaultLimiter: defaultLimiter,
		endpointLimits: make(map[string]*RateLimiter),
		logger:         logger,
	}
}

// SetEndpointLimit configures a custom rate limit for a specific endpoint.
func (erl *EndpointRateLimiter) SetEndpointLimit(path string, requestsPerSecond, burstSize int) {
	cfg := &config.RateLimitConfig{
		Enabled:           true,
		RequestsPerSecond: requestsPerSecond,
		BurstSize:         burstSize,
		WindowDuration:    time.Minute,
		UseRedis:          erl.defaultLimiter.config.UseRedis,
	}

	erl.endpointLimits[path] = NewRateLimiter(cfg, erl.logger, erl.defaultLimiter.redisClient)
}

// Handler returns the endpoint-aware rate limiting middleware.
func (erl *EndpointRateLimiter) Handler() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Check for endpoint-specific limiter
			if limiter, ok := erl.endpointLimits[r.URL.Path]; ok {
				limiter.Handler()(next).ServeHTTP(w, r)
				return
			}

			// Fall back to default limiter
			erl.defaultLimiter.Handler()(next).ServeHTTP(w, r)
		})
	}
}
