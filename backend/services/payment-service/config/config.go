// Package config provides configuration management for the payment service.
// It loads environment variables and provides type-safe access to all configuration options
// including database connections, payment gateway credentials, and service settings.
package config

import (
	"fmt"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration for the payment service.
// This includes server settings, database connections, payment gateway credentials,
// and messaging configuration for NATS integration.
type Config struct {
	// Server configuration
	ServerPort string // HTTP server port (default: 3964)
	GRPCPort   string // gRPC server port for internal service communication

	// Database configuration
	DatabaseURL string // PostgreSQL connection string (NeonDB)

	// JWT configuration for authentication
	JWTSecret string // Secret key for validating JWT tokens

	// CORS configuration
	CORSOrigin string // Allowed origin for CORS requests

	// NATS messaging configuration
	NATSUrl string // NATS server URL for event publishing

	// Redis configuration for caching
	RedisURL string // Redis connection URL

	// Payment Gateway: Razorpay (primary for India)
	RazorpayKeyID     string // Razorpay API Key ID
	RazorpayKeySecret string // Razorpay API Key Secret
	RazorpayWebhookSecret string // Razorpay webhook verification secret

	// Payment Gateway: Stripe (international payments)
	StripeSecretKey      string // Stripe Secret API Key
	StripePublishableKey string // Stripe Publishable Key (for client-side)
	StripeWebhookSecret  string // Stripe webhook signing secret

	// UPI Configuration (direct integration)
	UPIVirtualPaymentAddress string // VPA for receiving payments
	UPIMerchantID            string // Merchant identifier for UPI

	// Platform business configuration
	PlatformCommissionPercent float64       // Platform commission percentage (e.g., 15.0 for 15%)
	DefaultCurrency           string        // Default currency code (INR for India)
	PaymentTimeout            time.Duration // Payment session timeout

	// Environment
	Environment string // development, staging, or production
}

// Load reads configuration from environment variables.
// It first attempts to load a .env file, then reads all required and optional
// environment variables with sensible defaults for development.
func Load() (*Config, error) {
	// Load .env file if it exists (useful for local development)
	// This won't fail if the file doesn't exist
	_ = godotenv.Load("../../../.env")

	cfg := &Config{
		// Server defaults
		ServerPort: getEnv("PAYMENT_SERVICE_PORT", "3964"),
		GRPCPort:   getEnv("PAYMENT_GRPC_PORT", "50054"),

		// Database (required)
		DatabaseURL: getEnv("DATABASE_URL", ""),

		// JWT (required for token validation)
		JWTSecret: getEnv("JWT_SECRET", ""),

		// CORS
		CORSOrigin: getEnv("CORS_ORIGIN", "http://localhost:369"),

		// Messaging
		NATSUrl:  getEnv("NATS_URL", "nats://localhost:4222"),
		RedisURL: getEnv("REDIS_URL", "redis://localhost:6379"),

		// Razorpay configuration
		RazorpayKeyID:         getEnv("RAZORPAY_KEY_ID", ""),
		RazorpayKeySecret:     getEnv("RAZORPAY_KEY_SECRET", ""),
		RazorpayWebhookSecret: getEnv("RAZORPAY_WEBHOOK_SECRET", ""),

		// Stripe configuration
		StripeSecretKey:      getEnv("STRIPE_SECRET_KEY", ""),
		StripePublishableKey: getEnv("STRIPE_PUBLISHABLE_KEY", ""),
		StripeWebhookSecret:  getEnv("STRIPE_WEBHOOK_SECRET", ""),

		// UPI configuration
		UPIVirtualPaymentAddress: getEnv("UPI_VPA", ""),
		UPIMerchantID:            getEnv("UPI_MERCHANT_ID", ""),

		// Platform configuration
		PlatformCommissionPercent: getEnvAsFloat("PLATFORM_COMMISSION_PERCENT", 15.0),
		DefaultCurrency:           getEnv("DEFAULT_CURRENCY", "INR"),
		PaymentTimeout:            getEnvAsDuration("PAYMENT_TIMEOUT", 30*time.Minute),

		// Environment
		Environment: getEnv("NODE_ENV", "development"),
	}

	// Validate required fields
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// validate checks that all required configuration values are present.
// Returns an error if any required field is missing.
func (c *Config) validate() error {
	if c.DatabaseURL == "" {
		return fmt.Errorf("DATABASE_URL is required")
	}
	if c.JWTSecret == "" {
		return fmt.Errorf("JWT_SECRET is required")
	}

	// In production, payment gateway credentials are required
	if c.Environment == "production" {
		if c.RazorpayKeyID == "" || c.RazorpayKeySecret == "" {
			return fmt.Errorf("Razorpay credentials are required in production")
		}
		if c.StripeSecretKey == "" {
			return fmt.Errorf("Stripe credentials are required in production")
		}
	}

	return nil
}

// IsDevelopment returns true if running in development mode
func (c *Config) IsDevelopment() bool {
	return c.Environment == "development"
}

// IsProduction returns true if running in production mode
func (c *Config) IsProduction() bool {
	return c.Environment == "production"
}

// HasRazorpay returns true if Razorpay is configured
func (c *Config) HasRazorpay() bool {
	return c.RazorpayKeyID != "" && c.RazorpayKeySecret != ""
}

// HasStripe returns true if Stripe is configured
func (c *Config) HasStripe() bool {
	return c.StripeSecretKey != ""
}

// HasUPI returns true if UPI is configured
func (c *Config) HasUPI() bool {
	return c.UPIVirtualPaymentAddress != "" && c.UPIMerchantID != ""
}

// getEnv retrieves an environment variable with a default fallback
func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

// getEnvAsInt retrieves an environment variable as an integer with a default fallback
func getEnvAsInt(key string, defaultValue int) int {
	valueStr := getEnv(key, "")
	if value, err := strconv.Atoi(valueStr); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsFloat retrieves an environment variable as a float64 with a default fallback
func getEnvAsFloat(key string, defaultValue float64) float64 {
	valueStr := getEnv(key, "")
	if value, err := strconv.ParseFloat(valueStr, 64); err == nil {
		return value
	}
	return defaultValue
}

// getEnvAsDuration retrieves an environment variable as a duration with a default fallback
func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	valueStr := getEnv(key, "")
	if value, err := time.ParseDuration(valueStr); err == nil {
		return value
	}
	return defaultValue
}
