// Package config provides configuration management for the notification service.
// It loads settings from environment variables and provides sensible defaults
// for development environments.
package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration values for the notification service.
// Configuration is loaded from environment variables with sensible defaults
// provided for development environments.
type Config struct {
	// Server configuration
	ServerPort    string        // HTTP server port (default: 3964)
	GRPCPort      string        // gRPC server port for internal communication
	Environment   string        // Environment name: development, staging, production
	ReadTimeout   time.Duration // HTTP read timeout
	WriteTimeout  time.Duration // HTTP write timeout
	ShutdownGrace time.Duration // Graceful shutdown timeout

	// Database configuration
	DatabaseURL     string // PostgreSQL connection string
	DatabaseMaxConn int    // Maximum database connections
	DatabaseMinConn int    // Minimum database connections

	// Redis configuration for caching and pub/sub
	RedisURL      string // Redis connection URL
	RedisPassword string // Redis password (optional)
	RedisDB       int    // Redis database number

	// NATS configuration for event-driven messaging
	NATSUrl       string   // NATS server URL
	NATSClusterID string   // NATS cluster identifier
	NATSClientID  string   // Unique client identifier for this service instance
	NATSSubjects  []string // Subjects to subscribe to

	// CORS configuration
	CORSOrigin string // Allowed CORS origins

	// SendGrid configuration for email delivery
	SendGridAPIKey    string // SendGrid API key for authentication
	SendGridFromEmail string // Default sender email address
	SendGridFromName  string // Default sender display name

	// Firebase configuration for push notifications
	FirebaseProjectID      string // Firebase project identifier
	FirebaseCredentialFile string // Path to Firebase service account credentials

	// Twilio configuration for SMS delivery
	TwilioAccountSID string // Twilio account SID
	TwilioAuthToken  string // Twilio authentication token
	TwilioFromNumber string // Twilio phone number for sending SMS

	// WebSocket configuration
	WebSocketPingInterval time.Duration // Interval between ping messages
	WebSocketPongTimeout  time.Duration // Timeout for pong response

	// Rate limiting configuration
	RateLimitPerUser     int           // Maximum notifications per user per window
	RateLimitWindow      time.Duration // Rate limit window duration
	RateLimitBurstFactor int           // Burst factor for rate limiting

	// Template configuration
	TemplateDir string // Directory containing notification templates
}

// Load reads configuration from environment variables and returns a Config struct.
// It loads .env file if present (for local development) and validates required fields.
// Returns an error if required configuration is missing.
func Load() (*Config, error) {
	// Load .env file if it exists - useful for local development
	// In production, environment variables should be set via the deployment system
	_ = godotenv.Load("../../../.env")
	_ = godotenv.Load(".env")

	cfg := &Config{
		// Server settings
		ServerPort:    getEnv("NOTIFICATION_SERVICE_PORT", "3964"),
		GRPCPort:      getEnv("NOTIFICATION_GRPC_PORT", "50054"),
		Environment:   getEnv("NODE_ENV", "development"),
		ReadTimeout:   getEnvAsDuration("SERVER_READ_TIMEOUT", 15*time.Second),
		WriteTimeout:  getEnvAsDuration("SERVER_WRITE_TIMEOUT", 15*time.Second),
		ShutdownGrace: getEnvAsDuration("SHUTDOWN_GRACE_PERIOD", 10*time.Second),

		// Database settings
		DatabaseURL:     getEnv("DATABASE_URL", ""),
		DatabaseMaxConn: getEnvAsInt("DATABASE_MAX_CONNECTIONS", 25),
		DatabaseMinConn: getEnvAsInt("DATABASE_MIN_CONNECTIONS", 5),

		// Redis settings
		RedisURL:      getEnv("REDIS_URL", "redis://localhost:6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvAsInt("REDIS_DB", 0),

		// NATS settings
		NATSUrl:       getEnv("NATS_URL", "nats://localhost:4222"),
		NATSClusterID: getEnv("NATS_CLUSTER_ID", "nextphoton-cluster"),
		NATSClientID:  getEnv("NATS_CLIENT_ID", "notification-service"),
		NATSSubjects:  getEnvAsSlice("NATS_SUBJECTS", []string{
			"nextphoton.user.created.v1",
			"nextphoton.session.booked.v1",
			"nextphoton.session.reminder.v1",
			"nextphoton.payment.completed.v1",
			"nextphoton.assignment.due.v1",
		}),

		// CORS settings
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:369"),

		// SendGrid settings
		SendGridAPIKey:    getEnv("SENDGRID_API_KEY", ""),
		SendGridFromEmail: getEnv("SENDGRID_FROM_EMAIL", "notifications@nextphoton.com"),
		SendGridFromName:  getEnv("SENDGRID_FROM_NAME", "NextPhoton EduCare"),

		// Firebase settings
		FirebaseProjectID:      getEnv("FIREBASE_PROJECT_ID", ""),
		FirebaseCredentialFile: getEnv("FIREBASE_CREDENTIAL_FILE", ""),

		// Twilio settings
		TwilioAccountSID: getEnv("TWILIO_ACCOUNT_SID", ""),
		TwilioAuthToken:  getEnv("TWILIO_AUTH_TOKEN", ""),
		TwilioFromNumber: getEnv("TWILIO_FROM_NUMBER", ""),

		// WebSocket settings
		WebSocketPingInterval: getEnvAsDuration("WS_PING_INTERVAL", 30*time.Second),
		WebSocketPongTimeout:  getEnvAsDuration("WS_PONG_TIMEOUT", 60*time.Second),

		// Rate limiting settings
		RateLimitPerUser:     getEnvAsInt("RATE_LIMIT_PER_USER", 100),
		RateLimitWindow:      getEnvAsDuration("RATE_LIMIT_WINDOW", time.Hour),
		RateLimitBurstFactor: getEnvAsInt("RATE_LIMIT_BURST", 10),

		// Template settings
		TemplateDir: getEnv("TEMPLATE_DIR", "./templates"),
	}

	// Validate required configuration
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// validate checks that all required configuration values are present.
// Returns an error describing any missing required configuration.
func (c *Config) validate() error {
	var missing []string

	if c.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}

	// In production, require external service credentials
	if c.Environment == "production" {
		if c.SendGridAPIKey == "" {
			missing = append(missing, "SENDGRID_API_KEY")
		}
		if c.FirebaseProjectID == "" {
			missing = append(missing, "FIREBASE_PROJECT_ID")
		}
		if c.TwilioAccountSID == "" {
			missing = append(missing, "TWILIO_ACCOUNT_SID")
		}
	}

	if len(missing) > 0 {
		return fmt.Errorf("missing required configuration: %s", strings.Join(missing, ", "))
	}

	return nil
}

// IsDevelopment returns true if running in development mode.
// Development mode enables additional logging and debugging features.
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if running in production mode.
// Production mode enforces stricter security and performance settings.
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

// getEnv retrieves an environment variable or returns the default value.
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt retrieves an environment variable as an integer.
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsDuration retrieves an environment variable as a time.Duration.
func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	valueStr := getEnv(key, "")
	if value, err := time.ParseDuration(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsBool retrieves an environment variable as a boolean.
func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsSlice retrieves an environment variable as a comma-separated slice.
func getEnvAsSlice(key string, defaultValue []string) []string {
	valueStr := getEnv(key, "")
	if valueStr == "" {
		return defaultValue
	}
	return strings.Split(valueStr, ",")
}
