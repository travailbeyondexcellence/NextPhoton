package config

import (
	"fmt"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	// Server
	ServerPort string
	GRPCPort   string

	// Database
	DatabaseURL string

	// JWT
	JWTSecret     string
	JWTExpiration string

	// CORS
	CORSOrigin string

	// NATS
	NATSUrl string

	// Environment
	Environment string
}

func Load() (*Config, error) {
	// Load .env file if it exists
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		ServerPort:    getEnv("BACKEND_PORT", "3963"),
		GRPCPort:      getEnv("GRPC_PORT", "50051"),
		DatabaseURL:   getEnv("DATABASE_URL", ""),
		JWTSecret:     getEnv("JWT_SECRET", ""),
		JWTExpiration: getEnv("JWT_EXPIRATION", "7d"),
		CORSOrigin:    getEnv("CORS_ORIGIN", "http://localhost:369"),
		NATSUrl:       getEnv("NATS_URL", "nats://localhost:4222"),
		Environment:   getEnv("NODE_ENV", "development"),
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

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}
