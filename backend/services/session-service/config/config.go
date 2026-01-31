// Package config provides configuration loading and management for the session-service.
// It loads configuration from environment variables with sensible defaults for development.
package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration values for the session-service.
// These values are loaded from environment variables at startup.
type Config struct {
	// Server configuration
	ServerPort string // HTTP server port (default: 3964)
	GRPCPort   string // gRPC server port for internal service communication (default: 50052)

	// Database configuration
	DatabaseURL string // PostgreSQL connection URL (required)

	// JWT configuration for token validation
	JWTSecret string // Secret key for JWT validation (required)

	// CORS configuration
	CORSOrigin string // Allowed CORS origin (default: http://localhost:369)

	// NATS configuration for event messaging
	NATSUrl string // NATS server URL (default: nats://localhost:4222)

	// Redis configuration for caching
	RedisURL string // Redis server URL (default: redis://localhost:6379)

	// Environment
	Environment string // Runtime environment: development, staging, production
}

// Load reads configuration from environment variables and returns a Config struct.
// It first attempts to load a .env file from the services root directory.
// Required fields (DatabaseURL, JWTSecret) must be set or Load returns an error.
func Load() (*Config, error) {
	// Attempt to load .env file - ignore error if file doesn't exist
	// This allows for both local development with .env and production with env vars
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		ServerPort:  getEnv("SESSION_SERVICE_PORT", "3964"),
		GRPCPort:    getEnv("SESSION_GRPC_PORT", "50052"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
		JWTSecret:   getEnv("JWT_SECRET", ""),
		CORSOrigin:  getEnv("CORS_ORIGIN", "http://localhost:369"),
		NATSUrl:     getEnv("NATS_URL", "nats://localhost:4222"),
		RedisURL:    getEnv("REDIS_URL", "redis://localhost:6379"),
		Environment: getEnv("NODE_ENV", "development"),
	}

	// Validate required configuration fields
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL environment variable is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET environment variable is required")
	}

	return cfg, nil
}

// getEnv retrieves an environment variable value or returns a default value if not set.
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt retrieves an environment variable as an integer or returns a default value.
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsBool retrieves an environment variable as a boolean or returns a default value.
func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// IsDevelopment returns true if the environment is set to development.
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if the environment is set to production.
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}
