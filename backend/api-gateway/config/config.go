// Package config provides configuration management for the API Gateway.
// It loads configuration from environment variables and provides a typed
// configuration structure for all gateway components.
package config

import (
	"os"
	"strconv"
	"strings"
	"time"
)

// Config holds all configuration for the API Gateway.
// Configuration is loaded from environment variables with sensible defaults.
type Config struct {
	// Server configuration
	Server ServerConfig

	// JWT authentication configuration
	JWT JWTConfig

	// Rate limiting configuration
	RateLimit RateLimitConfig

	// CORS configuration
	CORS CORSConfig

	// Redis configuration for caching and rate limiting
	Redis RedisConfig

	// NATS configuration for service communication
	NATS NATSConfig

	// Service discovery configuration
	Services ServicesConfig

	// Logging configuration
	Logging LoggingConfig

	// GraphQL configuration
	GraphQL GraphQLConfig
}

// ServerConfig holds HTTP server settings.
type ServerConfig struct {
	// Host to bind the server to (default: "0.0.0.0")
	Host string

	// Port to listen on (default: 8080)
	Port int

	// ReadTimeout for incoming requests (default: 30s)
	ReadTimeout time.Duration

	// WriteTimeout for responses (default: 30s)
	WriteTimeout time.Duration

	// IdleTimeout for keep-alive connections (default: 120s)
	IdleTimeout time.Duration

	// ShutdownTimeout for graceful shutdown (default: 30s)
	ShutdownTimeout time.Duration
}

// JWTConfig holds JWT validation settings.
type JWTConfig struct {
	// Secret key for HMAC signing (for HS256 algorithm)
	Secret string

	// PublicKey for RSA/ECDSA signing (for RS256/ES256 algorithms)
	PublicKey string

	// Issuer expected in JWT claims
	Issuer string

	// Audience expected in JWT claims
	Audience string

	// Algorithm used for signing (HS256, RS256, ES256)
	Algorithm string

	// AccessTokenDuration is the validity period for access tokens
	AccessTokenDuration time.Duration

	// RefreshTokenDuration is the validity period for refresh tokens
	RefreshTokenDuration time.Duration
}

// RateLimitConfig holds rate limiting settings.
type RateLimitConfig struct {
	// Enabled toggles rate limiting
	Enabled bool

	// RequestsPerSecond per IP/user (default: 100)
	RequestsPerSecond int

	// BurstSize allows temporary bursts above the rate limit
	BurstSize int

	// WindowDuration for sliding window rate limiting
	WindowDuration time.Duration

	// UseRedis enables distributed rate limiting via Redis
	UseRedis bool
}

// CORSConfig holds CORS settings.
type CORSConfig struct {
	// AllowedOrigins is a list of origins allowed to make requests
	AllowedOrigins []string

	// AllowedMethods is a list of HTTP methods allowed
	AllowedMethods []string

	// AllowedHeaders is a list of headers allowed in requests
	AllowedHeaders []string

	// ExposedHeaders is a list of headers exposed to the client
	ExposedHeaders []string

	// AllowCredentials allows cookies in cross-origin requests
	AllowCredentials bool

	// MaxAge is the max time for preflight request caching (seconds)
	MaxAge int
}

// RedisConfig holds Redis connection settings.
type RedisConfig struct {
	// Host is the Redis server address
	Host string

	// Port is the Redis server port
	Port int

	// Password for Redis authentication
	Password string

	// DB is the Redis database number
	DB int

	// PoolSize is the maximum number of connections
	PoolSize int

	// MinIdleConns is the minimum number of idle connections
	MinIdleConns int

	// TLSEnabled enables TLS for Redis connections
	TLSEnabled bool
}

// NATSConfig holds NATS connection settings.
type NATSConfig struct {
	// URL is the NATS server URL
	URL string

	// ClusterID for NATS Streaming (JetStream)
	ClusterID string

	// ClientID for this gateway instance
	ClientID string

	// MaxReconnects is the maximum number of reconnection attempts
	MaxReconnects int

	// ReconnectWait is the time between reconnection attempts
	ReconnectWait time.Duration

	// Timeout for NATS requests
	Timeout time.Duration
}

// ServicesConfig holds service discovery settings.
type ServicesConfig struct {
	// AuthService URL
	AuthServiceURL string

	// UserService URL
	UserServiceURL string

	// SessionService URL
	SessionServiceURL string

	// CurriculumService URL
	CurriculumServiceURL string

	// NotificationService URL
	NotificationServiceURL string

	// PaymentService URL
	PaymentServiceURL string

	// AnalyticsService URL
	AnalyticsServiceURL string

	// MediaService URL
	MediaServiceURL string

	// DiscoveryEnabled enables dynamic service discovery
	DiscoveryEnabled bool

	// HealthCheckInterval is the interval between service health checks
	HealthCheckInterval time.Duration
}

// LoggingConfig holds logging settings.
type LoggingConfig struct {
	// Level is the minimum log level (debug, info, warn, error)
	Level string

	// Format is the log format (json, console)
	Format string

	// OutputPath is the log output destination
	OutputPath string

	// EnableStackTrace includes stack traces in error logs
	EnableStackTrace bool
}

// GraphQLConfig holds GraphQL settings.
type GraphQLConfig struct {
	// PlaygroundEnabled enables the GraphQL playground UI
	PlaygroundEnabled bool

	// IntrospectionEnabled enables GraphQL introspection
	IntrospectionEnabled bool

	// MaxQueryDepth limits query nesting depth
	MaxQueryDepth int

	// MaxQueryComplexity limits query complexity
	MaxQueryComplexity int

	// FederationEnabled enables GraphQL Federation
	FederationEnabled bool

	// SchemaPath is the path to the federated schema file
	SchemaPath string
}

// Load reads configuration from environment variables.
// It provides sensible defaults for development environments.
func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Host:            getEnv("SERVER_HOST", "0.0.0.0"),
			Port:            getEnvInt("SERVER_PORT", 8080),
			ReadTimeout:     getEnvDuration("SERVER_READ_TIMEOUT", 30*time.Second),
			WriteTimeout:    getEnvDuration("SERVER_WRITE_TIMEOUT", 30*time.Second),
			IdleTimeout:     getEnvDuration("SERVER_IDLE_TIMEOUT", 120*time.Second),
			ShutdownTimeout: getEnvDuration("SERVER_SHUTDOWN_TIMEOUT", 30*time.Second),
		},
		JWT: JWTConfig{
			Secret:               getEnv("JWT_SECRET", "your-super-secret-jwt-key-change-in-production"),
			PublicKey:            getEnv("JWT_PUBLIC_KEY", ""),
			Issuer:               getEnv("JWT_ISSUER", "nextphoton"),
			Audience:             getEnv("JWT_AUDIENCE", "nextphoton-api"),
			Algorithm:            getEnv("JWT_ALGORITHM", "HS256"),
			AccessTokenDuration:  getEnvDuration("JWT_ACCESS_TOKEN_DURATION", 15*time.Minute),
			RefreshTokenDuration: getEnvDuration("JWT_REFRESH_TOKEN_DURATION", 7*24*time.Hour),
		},
		RateLimit: RateLimitConfig{
			Enabled:           getEnvBool("RATELIMIT_ENABLED", true),
			RequestsPerSecond: getEnvInt("RATELIMIT_RPS", 100),
			BurstSize:         getEnvInt("RATELIMIT_BURST", 200),
			WindowDuration:    getEnvDuration("RATELIMIT_WINDOW", time.Minute),
			UseRedis:          getEnvBool("RATELIMIT_USE_REDIS", false),
		},
		CORS: CORSConfig{
			AllowedOrigins:   getEnvSlice("CORS_ALLOWED_ORIGINS", []string{"http://localhost:3000", "http://localhost:5173"}),
			AllowedMethods:   getEnvSlice("CORS_ALLOWED_METHODS", []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"}),
			AllowedHeaders:   getEnvSlice("CORS_ALLOWED_HEADERS", []string{"Accept", "Authorization", "Content-Type", "X-Correlation-ID", "X-Request-ID"}),
			ExposedHeaders:   getEnvSlice("CORS_EXPOSED_HEADERS", []string{"X-Correlation-ID", "X-Request-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"}),
			AllowCredentials: getEnvBool("CORS_ALLOW_CREDENTIALS", true),
			MaxAge:           getEnvInt("CORS_MAX_AGE", 86400),
		},
		Redis: RedisConfig{
			Host:         getEnv("REDIS_HOST", "localhost"),
			Port:         getEnvInt("REDIS_PORT", 6379),
			Password:     getEnv("REDIS_PASSWORD", ""),
			DB:           getEnvInt("REDIS_DB", 0),
			PoolSize:     getEnvInt("REDIS_POOL_SIZE", 10),
			MinIdleConns: getEnvInt("REDIS_MIN_IDLE_CONNS", 2),
			TLSEnabled:   getEnvBool("REDIS_TLS_ENABLED", false),
		},
		NATS: NATSConfig{
			URL:           getEnv("NATS_URL", "nats://localhost:4222"),
			ClusterID:     getEnv("NATS_CLUSTER_ID", "nextphoton-cluster"),
			ClientID:      getEnv("NATS_CLIENT_ID", "api-gateway"),
			MaxReconnects: getEnvInt("NATS_MAX_RECONNECTS", 10),
			ReconnectWait: getEnvDuration("NATS_RECONNECT_WAIT", 2*time.Second),
			Timeout:       getEnvDuration("NATS_TIMEOUT", 10*time.Second),
		},
		Services: ServicesConfig{
			AuthServiceURL:         getEnv("AUTH_SERVICE_URL", "http://localhost:8081"),
			UserServiceURL:         getEnv("USER_SERVICE_URL", "http://localhost:8082"),
			SessionServiceURL:      getEnv("SESSION_SERVICE_URL", "http://localhost:8083"),
			CurriculumServiceURL:   getEnv("CURRICULUM_SERVICE_URL", "http://localhost:8084"),
			NotificationServiceURL: getEnv("NOTIFICATION_SERVICE_URL", "http://localhost:8085"),
			PaymentServiceURL:      getEnv("PAYMENT_SERVICE_URL", "http://localhost:8086"),
			AnalyticsServiceURL:    getEnv("ANALYTICS_SERVICE_URL", "http://localhost:8087"),
			MediaServiceURL:        getEnv("MEDIA_SERVICE_URL", "http://localhost:8088"),
			DiscoveryEnabled:       getEnvBool("SERVICE_DISCOVERY_ENABLED", false),
			HealthCheckInterval:    getEnvDuration("SERVICE_HEALTH_CHECK_INTERVAL", 30*time.Second),
		},
		Logging: LoggingConfig{
			Level:            getEnv("LOG_LEVEL", "info"),
			Format:           getEnv("LOG_FORMAT", "json"),
			OutputPath:       getEnv("LOG_OUTPUT_PATH", "stdout"),
			EnableStackTrace: getEnvBool("LOG_ENABLE_STACK_TRACE", true),
		},
		GraphQL: GraphQLConfig{
			PlaygroundEnabled:    getEnvBool("GRAPHQL_PLAYGROUND_ENABLED", true),
			IntrospectionEnabled: getEnvBool("GRAPHQL_INTROSPECTION_ENABLED", true),
			MaxQueryDepth:        getEnvInt("GRAPHQL_MAX_QUERY_DEPTH", 10),
			MaxQueryComplexity:   getEnvInt("GRAPHQL_MAX_QUERY_COMPLEXITY", 100),
			FederationEnabled:    getEnvBool("GRAPHQL_FEDERATION_ENABLED", true),
			SchemaPath:           getEnv("GRAPHQL_SCHEMA_PATH", "./schema/federated.graphql"),
		},
	}
}

// Helper functions for environment variable parsing

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return defaultValue
}

func getEnvDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func getEnvSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		return strings.Split(value, ",")
	}
	return defaultValue
}
