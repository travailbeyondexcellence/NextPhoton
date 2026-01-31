package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the user service
type Config struct {
	// Server
	ServerPort string
	GRPCPort   string

	// Database
	DatabaseURL string

	// JWT (for validating tokens from auth-service)
	JWTSecret string

	// CORS
	CORSOrigin string

	// NATS
	NATSUrl string

	// Environment
	Environment string

	// Service Discovery
	AuthServiceURL string
}

// Load loads configuration from environment variables
func Load() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		ServerPort:     getEnv("USER_SERVICE_PORT", "3964"),
		GRPCPort:       getEnv("USER_SERVICE_GRPC_PORT", "50052"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		CORSOrigin:     getEnv("CORS_ORIGIN", "http://localhost:369"),
		NATSUrl:        getEnv("NATS_URL", "nats://localhost:4222"),
		Environment:    getEnv("NODE_ENV", "development"),
		AuthServiceURL: getEnv("AUTH_SERVICE_URL", "http://localhost:3963"),
	}

	// Validate required fields
	if cfg.DatabaseURL == "" {
		return nil, fmt.Errorf("DATABASE_URL is required")
	}
	if cfg.JWTSecret == "" {
		return nil, fmt.Errorf("JWT_SECRET is required")
	}

	return cfg, nil
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt gets an environment variable as an integer or returns a default value
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsBool gets an environment variable as a boolean or returns a default value
func getEnvAsBool(key string, defaultValue bool) bool {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseBool(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}
