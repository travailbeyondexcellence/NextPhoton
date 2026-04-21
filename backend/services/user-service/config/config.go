package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort  string
	DatabaseURL string
	JWTSecret   string
	CORSOrigin  string
	NATSUrl     string
	Environment string
	AuthServiceURL string
}

func Load() (*Config, error) {
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		ServerPort:     getEnv("USER_SERVICE_PORT", "3964"),
		DatabaseURL:    getEnv("DATABASE_URL", ""),
		JWTSecret:      getEnv("JWT_SECRET", ""),
		CORSOrigin:     getEnv("CORS_ORIGIN", "http://localhost:369"),
		NATSUrl:        getEnv("NATS_URL", "nats://localhost:4222"),
		Environment:    getEnv("NODE_ENV", "development"),
		AuthServiceURL: getEnv("AUTH_SERVICE_URL", "http://localhost:3963"),
	}

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
