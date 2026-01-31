// Package config provides configuration management for the Analytics Service.
// It handles loading environment variables and validating required settings
// for database connections, messaging, and server configuration.
package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration settings for the Analytics Service.
// It includes database connections (PostgreSQL and ClickHouse), NATS messaging,
// server settings, and various analytics-specific configurations.
type Config struct {
	// Server configuration
	ServerPort  string        // HTTP server port (default: 3965)
	GRPCPort    string        // gRPC server port (default: 50053)
	Environment string        // Environment (development, staging, production)
	ReadTimeout time.Duration // HTTP read timeout
	WriteTimeout time.Duration // HTTP write timeout
	IdleTimeout  time.Duration // HTTP idle timeout

	// PostgreSQL configuration (primary operational database)
	PostgresURL string // PostgreSQL connection URL

	// ClickHouse configuration (analytics database)
	ClickHouseHost     string // ClickHouse host
	ClickHousePort     int    // ClickHouse port (default: 9000)
	ClickHouseDatabase string // ClickHouse database name
	ClickHouseUser     string // ClickHouse username
	ClickHousePassword string // ClickHouse password

	// NATS configuration (event messaging)
	NATSUrl      string // NATS server URL
	NATSCluster  string // NATS cluster ID
	NATSClientID string // NATS client ID for this service

	// CORS configuration
	CORSOrigin string // Allowed CORS origin

	// Analytics-specific settings
	EventBatchSize    int           // Number of events to batch before flushing
	EventFlushInterval time.Duration // Interval to flush events even if batch not full
	RetentionDays     int           // Days to retain detailed event data
	AggregationInterval time.Duration // Interval for metric aggregation jobs
}

// Load reads configuration from environment variables and validates required fields.
// It first attempts to load a .env file from the project root, then reads
// environment variables with sensible defaults where appropriate.
func Load() (*Config, error) {
	// Load .env file if it exists (useful for local development)
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		// Server settings
		ServerPort:   getEnv("ANALYTICS_PORT", "3965"),
		GRPCPort:     getEnv("ANALYTICS_GRPC_PORT", "50053"),
		Environment:  getEnv("NODE_ENV", "development"),
		ReadTimeout:  time.Duration(getEnvAsInt("READ_TIMEOUT_SECONDS", 15)) * time.Second,
		WriteTimeout: time.Duration(getEnvAsInt("WRITE_TIMEOUT_SECONDS", 15)) * time.Second,
		IdleTimeout:  time.Duration(getEnvAsInt("IDLE_TIMEOUT_SECONDS", 60)) * time.Second,

		// PostgreSQL (primary database for operational data)
		PostgresURL: getEnv("DATABASE_URL", ""),

		// ClickHouse (analytics/OLAP database)
		ClickHouseHost:     getEnv("CLICKHOUSE_HOST", "localhost"),
		ClickHousePort:     getEnvAsInt("CLICKHOUSE_PORT", 9000),
		ClickHouseDatabase: getEnv("CLICKHOUSE_DATABASE", "nextphoton_analytics"),
		ClickHouseUser:     getEnv("CLICKHOUSE_USER", "default"),
		ClickHousePassword: getEnv("CLICKHOUSE_PASSWORD", ""),

		// NATS messaging
		NATSUrl:      getEnv("NATS_URL", "nats://localhost:4222"),
		NATSCluster:  getEnv("NATS_CLUSTER", "nextphoton-cluster"),
		NATSClientID: getEnv("NATS_CLIENT_ID", "analytics-service"),

		// CORS
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:369"),

		// Analytics settings
		EventBatchSize:      getEnvAsInt("EVENT_BATCH_SIZE", 100),
		EventFlushInterval:  time.Duration(getEnvAsInt("EVENT_FLUSH_INTERVAL_SECONDS", 5)) * time.Second,
		RetentionDays:       getEnvAsInt("RETENTION_DAYS", 730), // 2 years default
		AggregationInterval: time.Duration(getEnvAsInt("AGGREGATION_INTERVAL_MINUTES", 15)) * time.Minute,
	}

	// Validate required fields
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// validate checks that all required configuration fields are set.
// Returns an error if any required field is missing or invalid.
func (c *Config) validate() error {
	if c.PostgresURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	if c.NATSUrl == "" {
		return fmt.Errorf("NATS_URL is required")
	}
	return nil
}

// IsDevelopment returns true if the service is running in development mode.
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if the service is running in production mode.
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

// getEnvAsInt retrieves an environment variable as an integer or returns the default.
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsBool retrieves an environment variable as a boolean or returns the default.
func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultValue
}
