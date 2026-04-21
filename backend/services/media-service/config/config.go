// Package config provides configuration management for the media service.
// It loads configuration from environment variables with sensible defaults
// and validates required fields on startup.
package config

import (
	"fmt"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

// Config holds all configuration values for the media service.
// Configuration is loaded from environment variables.
type Config struct {
	// Server configuration
	ServerPort  string        // HTTP server port (default: 3964)
	GRPCPort    string        // gRPC server port (default: 50052)
	Environment string        // Environment: development, staging, production
	LogLevel    string        // Log level: debug, info, warn, error
	MaxBodySize int64         // Maximum request body size in bytes (default: 100MB)
	Timeout     time.Duration // Request timeout duration

	// Database configuration
	DatabaseURL     string // PostgreSQL connection string
	MaxDBConns      int    // Maximum database connections (default: 25)
	MinDBConns      int    // Minimum database connections (default: 5)
	DBConnMaxLife   time.Duration
	DBConnMaxIdle   time.Duration

	// Storage configuration
	StorageProvider string // Primary storage: local, cloudflare_r2, google_drive
	LocalStoragePath string // Path for local file storage

	// Cloudflare R2 configuration
	R2AccountID       string // Cloudflare account ID
	R2AccessKeyID     string // R2 access key ID
	R2SecretAccessKey string // R2 secret access key
	R2BucketName      string // R2 bucket name
	R2Endpoint        string // R2 endpoint URL
	R2PublicURL       string // Public URL for R2 bucket (CDN)

	// Google Drive configuration
	GoogleDriveCredentials string // Path to Google service account JSON
	GoogleDriveFolderID    string // Root folder ID in Google Drive

	// Image processing configuration
	ThumbnailWidth     int    // Thumbnail width in pixels (default: 200)
	ThumbnailHeight    int    // Thumbnail height in pixels (default: 200)
	MaxImageWidth      int    // Maximum image width (default: 4096)
	MaxImageHeight     int    // Maximum image height (default: 4096)
	ImageQuality       int    // JPEG quality 1-100 (default: 85)
	EnableImageResize  bool   // Whether to auto-resize large images

	// Video processing configuration
	EnableVideoProcessing bool   // Whether to process videos
	VideoWebhookURL       string // Webhook URL for video processing notifications
	FFmpegPath            string // Path to ffmpeg binary

	// Security configuration
	JWTSecret           string        // JWT signing secret
	SignedURLExpiration time.Duration // Signed URL expiration (default: 1h)
	AllowedOrigins      []string      // CORS allowed origins
	AllowedFileTypes    []string      // Allowed MIME types for upload
	MaxFileSizeMB       int64         // Maximum file size in MB (default: 500)

	// NATS configuration
	NATSUrl           string // NATS server URL
	NATSClusterID     string // NATS cluster ID
	NATSClientID      string // NATS client ID
	NATSSubjectPrefix string // Subject prefix for events

	// Redis configuration (for caching and progress tracking)
	RedisURL      string // Redis connection URL
	RedisPassword string // Redis password
	RedisDB       int    // Redis database number

	// Rate limiting
	RateLimitRequests int           // Max requests per window
	RateLimitWindow   time.Duration // Rate limit window duration
}

// Load loads configuration from environment variables.
// It first attempts to load a .env file if present, then reads
// all configuration values from the environment.
func Load() (*Config, error) {
	// Load .env file if it exists (useful for local development)
	_ = godotenv.Load("../../../.env")
	_ = godotenv.Load(".env")

	cfg := &Config{
		// Server defaults
		ServerPort:  getEnv("MEDIA_SERVICE_PORT", "3964"),
		GRPCPort:    getEnv("MEDIA_GRPC_PORT", "50052"),
		Environment: getEnv("NODE_ENV", "development"),
		LogLevel:    getEnv("LOG_LEVEL", "info"),
		MaxBodySize: getEnvAsInt64("MAX_BODY_SIZE", 100*1024*1024), // 100MB
		Timeout:     getEnvAsDuration("REQUEST_TIMEOUT", 30*time.Second),

		// Database
		DatabaseURL:   getEnv("DATABASE_URL", ""),
		MaxDBConns:    getEnvAsInt("DB_MAX_CONNS", 25),
		MinDBConns:    getEnvAsInt("DB_MIN_CONNS", 5),
		DBConnMaxLife: getEnvAsDuration("DB_CONN_MAX_LIFE", 1*time.Hour),
		DBConnMaxIdle: getEnvAsDuration("DB_CONN_MAX_IDLE", 30*time.Minute),

		// Storage
		StorageProvider:  getEnv("STORAGE_PROVIDER", "local"),
		LocalStoragePath: getEnv("LOCAL_STORAGE_PATH", "./uploads"),

		// Cloudflare R2
		R2AccountID:       getEnv("R2_ACCOUNT_ID", ""),
		R2AccessKeyID:     getEnv("R2_ACCESS_KEY_ID", ""),
		R2SecretAccessKey: getEnv("R2_SECRET_ACCESS_KEY", ""),
		R2BucketName:      getEnv("R2_BUCKET_NAME", "nextphoton-media"),
		R2Endpoint:        getEnv("R2_ENDPOINT", ""),
		R2PublicURL:       getEnv("R2_PUBLIC_URL", ""),

		// Google Drive
		GoogleDriveCredentials: getEnv("GOOGLE_DRIVE_CREDENTIALS", ""),
		GoogleDriveFolderID:    getEnv("GOOGLE_DRIVE_FOLDER_ID", ""),

		// Image processing
		ThumbnailWidth:    getEnvAsInt("THUMBNAIL_WIDTH", 200),
		ThumbnailHeight:   getEnvAsInt("THUMBNAIL_HEIGHT", 200),
		MaxImageWidth:     getEnvAsInt("MAX_IMAGE_WIDTH", 4096),
		MaxImageHeight:    getEnvAsInt("MAX_IMAGE_HEIGHT", 4096),
		ImageQuality:      getEnvAsInt("IMAGE_QUALITY", 85),
		EnableImageResize: getEnvAsBool("ENABLE_IMAGE_RESIZE", true),

		// Video processing
		EnableVideoProcessing: getEnvAsBool("ENABLE_VIDEO_PROCESSING", false),
		VideoWebhookURL:       getEnv("VIDEO_WEBHOOK_URL", ""),
		FFmpegPath:            getEnv("FFMPEG_PATH", "/usr/bin/ffmpeg"),

		// Security
		JWTSecret:           getEnv("JWT_SECRET", ""),
		SignedURLExpiration: getEnvAsDuration("SIGNED_URL_EXPIRATION", 1*time.Hour),
		AllowedOrigins:      getEnvAsStringSlice("CORS_ORIGINS", []string{"http://localhost:369", "http://localhost:3000"}),
		AllowedFileTypes:    getEnvAsStringSlice("ALLOWED_FILE_TYPES", defaultAllowedFileTypes()),
		MaxFileSizeMB:       getEnvAsInt64("MAX_FILE_SIZE_MB", 500),

		// NATS
		NATSUrl:           getEnv("NATS_URL", "nats://localhost:4222"),
		NATSClusterID:     getEnv("NATS_CLUSTER_ID", "nextphoton"),
		NATSClientID:      getEnv("NATS_CLIENT_ID", "media-service"),
		NATSSubjectPrefix: getEnv("NATS_SUBJECT_PREFIX", "nextphoton"),

		// Redis
		RedisURL:      getEnv("REDIS_URL", "redis://localhost:6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       getEnvAsInt("REDIS_DB", 0),

		// Rate limiting
		RateLimitRequests: getEnvAsInt("RATE_LIMIT_REQUESTS", 100),
		RateLimitWindow:   getEnvAsDuration("RATE_LIMIT_WINDOW", 1*time.Minute),
	}

	// Validate required fields
	if err := cfg.validate(); err != nil {
		return nil, err
	}

	return cfg, nil
}

// validate checks that all required configuration values are present
// and valid. Returns an error describing any missing or invalid values.
func (c *Config) validate() error {
	var missing []string

	if c.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}
	if c.JWTSecret == "" {
		missing = append(missing, "JWT_SECRET")
	}

	// Validate storage provider specific requirements
	switch c.StorageProvider {
	case "cloudflare_r2":
		if c.R2AccountID == "" {
			missing = append(missing, "R2_ACCOUNT_ID")
		}
		if c.R2AccessKeyID == "" {
			missing = append(missing, "R2_ACCESS_KEY_ID")
		}
		if c.R2SecretAccessKey == "" {
			missing = append(missing, "R2_SECRET_ACCESS_KEY")
		}
	case "google_drive":
		if c.GoogleDriveCredentials == "" {
			missing = append(missing, "GOOGLE_DRIVE_CREDENTIALS")
		}
		if c.GoogleDriveFolderID == "" {
			missing = append(missing, "GOOGLE_DRIVE_FOLDER_ID")
		}
	case "local":
		// Local storage doesn't require additional configuration
	default:
		return fmt.Errorf("invalid STORAGE_PROVIDER: %s (must be local, cloudflare_r2, or google_drive)", c.StorageProvider)
	}

	if len(missing) > 0 {
		return fmt.Errorf("missing required environment variables: %s", strings.Join(missing, ", "))
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

// defaultAllowedFileTypes returns the default list of allowed MIME types
func defaultAllowedFileTypes() []string {
	return []string{
		// Images
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		// Videos
		"video/mp4",
		"video/webm",
		"video/quicktime",
		"video/x-msvideo",
		// Documents
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		"application/vnd.ms-excel",
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		"application/vnd.ms-powerpoint",
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
		// Audio
		"audio/mpeg",
		"audio/wav",
		"audio/ogg",
		// Archives
		"application/zip",
		"application/x-rar-compressed",
	}
}

// Helper functions for reading environment variables

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvAsInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvAsBool(key string, defaultValue bool) bool {
	if value := os.Getenv(key); value != "" {
		if boolVal, err := strconv.ParseBool(value); err == nil {
			return boolVal
		}
	}
	return defaultValue
}

func getEnvAsDuration(key string, defaultValue time.Duration) time.Duration {
	if value := os.Getenv(key); value != "" {
		if duration, err := time.ParseDuration(value); err == nil {
			return duration
		}
	}
	return defaultValue
}

func getEnvAsStringSlice(key string, defaultValue []string) []string {
	if value := os.Getenv(key); value != "" {
		return strings.Split(value, ",")
	}
	return defaultValue
}
