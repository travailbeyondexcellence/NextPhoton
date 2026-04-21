// Package entities defines the core domain entities for the media service.
package entities

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

// UploadStatus represents the current state of an upload
type UploadStatus string

const (
	UploadStatusInitiated  UploadStatus = "initiated"   // Upload session created
	UploadStatusInProgress UploadStatus = "in_progress" // Chunks being received
	UploadStatusCompleting UploadStatus = "completing"  // Finalizing multipart upload
	UploadStatusCompleted  UploadStatus = "completed"   // Upload finished successfully
	UploadStatusFailed     UploadStatus = "failed"      // Upload failed
	UploadStatusCancelled  UploadStatus = "cancelled"   // Upload cancelled by user
	UploadStatusExpired    UploadStatus = "expired"     // Upload session expired
)

// UploadSession represents a multipart upload session.
// This entity tracks the progress of chunked file uploads.
type UploadSession struct {
	// Identity
	ID       uuid.UUID `json:"id"`
	UploadID string    `json:"uploadId"` // External upload ID (e.g., S3 multipart upload ID)
	MediaID  uuid.UUID `json:"mediaId"`  // Associated Media entity ID
	UserID   uuid.UUID `json:"userId"`   // User performing the upload

	// File information
	Filename   string `json:"filename"`
	MimeType   string `json:"mimeType"`
	TotalSize  int64  `json:"totalSize"`  // Expected total file size
	TotalParts int    `json:"totalParts"` // Total number of parts/chunks

	// Progress tracking
	Status         UploadStatus `json:"status"`
	UploadedBytes  int64        `json:"uploadedBytes"`  // Total bytes uploaded so far
	UploadedParts  int          `json:"uploadedParts"`  // Number of parts completed
	CurrentPartNum int          `json:"currentPartNum"` // Current part being uploaded
	Progress       float64      `json:"progress"`       // Progress percentage (0-100)

	// Part information
	PartSize       int64        `json:"partSize"`       // Size of each part (except last)
	CompletedParts []UploadPart `json:"completedParts"` // List of completed parts

	// Storage
	StorageProvider StorageProvider `json:"storageProvider"`
	StorageBucket   string          `json:"storageBucket"`
	StorageKey      string          `json:"storageKey"`

	// Timing
	StartedAt   time.Time  `json:"startedAt"`
	LastChunkAt *time.Time `json:"lastChunkAt,omitempty"` // Last chunk received
	CompletedAt *time.Time `json:"completedAt,omitempty"`
	ExpiresAt   time.Time  `json:"expiresAt"` // Session expiration

	// Error tracking
	ErrorReason   string `json:"errorReason,omitempty"`
	RetryCount    int    `json:"retryCount"`
	MaxRetries    int    `json:"maxRetries"`
	LastError     string `json:"lastError,omitempty"`
	LastErrorTime *time.Time `json:"lastErrorTime,omitempty"`

	// Metadata
	Category    MediaCategory     `json:"category"`
	UserAgent   string            `json:"userAgent,omitempty"`
	IPAddress   string            `json:"ipAddress,omitempty"`
	CustomMeta  map[string]string `json:"customMeta,omitempty"`
}

// UploadPart represents a single part/chunk of a multipart upload
type UploadPart struct {
	PartNumber int       `json:"partNumber"`
	Size       int64     `json:"size"`
	ETag       string    `json:"etag"`      // S3/R2 ETag for verification
	Checksum   string    `json:"checksum"`  // SHA-256 of part
	UploadedAt time.Time `json:"uploadedAt"`
}

// UploadProgress represents real-time upload progress information
type UploadProgress struct {
	SessionID      uuid.UUID    `json:"sessionId"`
	Status         UploadStatus `json:"status"`
	UploadedBytes  int64        `json:"uploadedBytes"`
	TotalBytes     int64        `json:"totalBytes"`
	UploadedParts  int          `json:"uploadedParts"`
	TotalParts     int          `json:"totalParts"`
	Progress       float64      `json:"progress"`       // 0-100
	BytesPerSecond int64        `json:"bytesPerSecond"` // Upload speed
	EstimatedTime  int64        `json:"estimatedTime"`  // Seconds remaining
	CurrentChunk   int          `json:"currentChunk"`
	ErrorMessage   string       `json:"errorMessage,omitempty"`
}

// NewUploadSession creates a new upload session
func NewUploadSession(
	userID uuid.UUID,
	filename string,
	mimeType string,
	totalSize int64,
	category MediaCategory,
	provider StorageProvider,
) *UploadSession {
	now := time.Now().UTC()
	sessionID := uuid.New()
	mediaID := uuid.New()

	// Calculate part size and count
	// Use 5MB parts for files > 100MB, otherwise use single part
	const minPartSize = int64(5 * 1024 * 1024) // 5MB minimum for multipart
	partSize := totalSize
	totalParts := 1

	if totalSize > minPartSize {
		partSize = minPartSize
		totalParts = int((totalSize + partSize - 1) / partSize) // Ceiling division
	}

	return &UploadSession{
		ID:              sessionID,
		UploadID:        "", // Set after multipart upload initiation
		MediaID:         mediaID,
		UserID:          userID,
		Filename:        sanitizeFilename(filename),
		MimeType:        mimeType,
		TotalSize:       totalSize,
		TotalParts:      totalParts,
		Status:          UploadStatusInitiated,
		UploadedBytes:   0,
		UploadedParts:   0,
		CurrentPartNum:  1,
		Progress:        0,
		PartSize:        partSize,
		CompletedParts:  make([]UploadPart, 0),
		StorageProvider: provider,
		StartedAt:       now,
		ExpiresAt:       now.Add(24 * time.Hour), // 24 hour expiry
		MaxRetries:      3,
		Category:        category,
		CustomMeta:      make(map[string]string),
	}
}

// SetUploadID sets the external upload ID (e.g., S3 multipart upload ID)
func (u *UploadSession) SetUploadID(uploadID string) {
	u.UploadID = uploadID
}

// SetStorageInfo sets the storage destination information
func (u *UploadSession) SetStorageInfo(bucket, key string) {
	u.StorageBucket = bucket
	u.StorageKey = key
}

// StartUpload marks the upload as in progress
func (u *UploadSession) StartUpload() {
	u.Status = UploadStatusInProgress
}

// RecordPartCompletion records completion of a part
func (u *UploadSession) RecordPartCompletion(part UploadPart) error {
	// Validate part number
	if part.PartNumber < 1 || part.PartNumber > u.TotalParts {
		return fmt.Errorf("invalid part number %d (expected 1-%d)", part.PartNumber, u.TotalParts)
	}

	// Check if part already uploaded
	for _, p := range u.CompletedParts {
		if p.PartNumber == part.PartNumber {
			return fmt.Errorf("part %d already uploaded", part.PartNumber)
		}
	}

	// Record the part
	now := time.Now().UTC()
	part.UploadedAt = now
	u.CompletedParts = append(u.CompletedParts, part)
	u.UploadedParts++
	u.UploadedBytes += part.Size
	u.LastChunkAt = &now

	// Update progress
	u.updateProgress()

	// Update current part number
	if part.PartNumber == u.CurrentPartNum && u.CurrentPartNum < u.TotalParts {
		u.CurrentPartNum++
	}

	return nil
}

// updateProgress calculates the current upload progress
func (u *UploadSession) updateProgress() {
	if u.TotalSize > 0 {
		u.Progress = float64(u.UploadedBytes) / float64(u.TotalSize) * 100
	}
}

// IsComplete checks if all parts have been uploaded
func (u *UploadSession) IsComplete() bool {
	return u.UploadedParts >= u.TotalParts
}

// MarkCompleting marks the upload as in the finalizing phase
func (u *UploadSession) MarkCompleting() {
	u.Status = UploadStatusCompleting
}

// Complete marks the upload as successfully completed
func (u *UploadSession) Complete() {
	now := time.Now().UTC()
	u.Status = UploadStatusCompleted
	u.CompletedAt = &now
	u.Progress = 100
}

// Fail marks the upload as failed
func (u *UploadSession) Fail(reason string) {
	now := time.Now().UTC()
	u.Status = UploadStatusFailed
	u.ErrorReason = reason
	u.LastError = reason
	u.LastErrorTime = &now
}

// Cancel marks the upload as cancelled
func (u *UploadSession) Cancel() {
	u.Status = UploadStatusCancelled
}

// Expire marks the upload as expired
func (u *UploadSession) Expire() {
	u.Status = UploadStatusExpired
}

// IsExpired checks if the upload session has expired
func (u *UploadSession) IsExpired() bool {
	return time.Now().UTC().After(u.ExpiresAt)
}

// CanRetry checks if the upload can be retried
func (u *UploadSession) CanRetry() bool {
	return u.RetryCount < u.MaxRetries
}

// IncrementRetry increments the retry counter
func (u *UploadSession) IncrementRetry() {
	u.RetryCount++
}

// GetMissingParts returns the part numbers that haven't been uploaded
func (u *UploadSession) GetMissingParts() []int {
	uploaded := make(map[int]bool)
	for _, part := range u.CompletedParts {
		uploaded[part.PartNumber] = true
	}

	missing := make([]int, 0)
	for i := 1; i <= u.TotalParts; i++ {
		if !uploaded[i] {
			missing = append(missing, i)
		}
	}
	return missing
}

// GetProgress returns the current upload progress
func (u *UploadSession) GetProgress() UploadProgress {
	var bytesPerSecond int64
	var estimatedTime int64

	if u.LastChunkAt != nil && u.UploadedBytes > 0 {
		elapsed := u.LastChunkAt.Sub(u.StartedAt).Seconds()
		if elapsed > 0 {
			bytesPerSecond = int64(float64(u.UploadedBytes) / elapsed)
			remaining := u.TotalSize - u.UploadedBytes
			if bytesPerSecond > 0 {
				estimatedTime = remaining / bytesPerSecond
			}
		}
	}

	progress := UploadProgress{
		SessionID:      u.ID,
		Status:         u.Status,
		UploadedBytes:  u.UploadedBytes,
		TotalBytes:     u.TotalSize,
		UploadedParts:  u.UploadedParts,
		TotalParts:     u.TotalParts,
		Progress:       u.Progress,
		BytesPerSecond: bytesPerSecond,
		EstimatedTime:  estimatedTime,
		CurrentChunk:   u.CurrentPartNum,
	}

	if u.Status == UploadStatusFailed {
		progress.ErrorMessage = u.ErrorReason
	}

	return progress
}

// ExtendExpiry extends the session expiry time
func (u *UploadSession) ExtendExpiry(duration time.Duration) {
	u.ExpiresAt = time.Now().UTC().Add(duration)
}

// SetMetadata sets custom metadata for the upload
func (u *UploadSession) SetMetadata(key, value string) {
	if u.CustomMeta == nil {
		u.CustomMeta = make(map[string]string)
	}
	u.CustomMeta[key] = value
}

// GetPartRange returns the byte range for a specific part number
func (u *UploadSession) GetPartRange(partNum int) (start, end int64, err error) {
	if partNum < 1 || partNum > u.TotalParts {
		return 0, 0, fmt.Errorf("invalid part number %d (expected 1-%d)", partNum, u.TotalParts)
	}

	start = int64(partNum-1) * u.PartSize
	end = start + u.PartSize - 1

	// Last part may be smaller
	if end >= u.TotalSize {
		end = u.TotalSize - 1
	}

	return start, end, nil
}

// GetExpectedPartSize returns the expected size for a specific part
func (u *UploadSession) GetExpectedPartSize(partNum int) (int64, error) {
	if partNum < 1 || partNum > u.TotalParts {
		return 0, fmt.Errorf("invalid part number %d (expected 1-%d)", partNum, u.TotalParts)
	}

	// Last part may be smaller
	if partNum == u.TotalParts {
		remainder := u.TotalSize % u.PartSize
		if remainder > 0 {
			return remainder, nil
		}
	}

	return u.PartSize, nil
}

// Validate performs validation on the upload session
func (u *UploadSession) Validate() error {
	if u.ID == uuid.Nil {
		return fmt.Errorf("session ID is required")
	}
	if u.UserID == uuid.Nil {
		return fmt.Errorf("user ID is required")
	}
	if u.Filename == "" {
		return fmt.Errorf("filename is required")
	}
	if u.TotalSize <= 0 {
		return fmt.Errorf("total size must be greater than 0")
	}
	if u.TotalParts <= 0 {
		return fmt.Errorf("total parts must be greater than 0")
	}
	return nil
}

// PresignedPartURL represents a presigned URL for uploading a part
type PresignedPartURL struct {
	PartNumber int       `json:"partNumber"`
	URL        string    `json:"url"`
	ExpiresAt  time.Time `json:"expiresAt"`
	Headers    map[string]string `json:"headers,omitempty"` // Required headers for upload
}

// InitiateUploadResult contains the result of initiating an upload
type InitiateUploadResult struct {
	SessionID       uuid.UUID          `json:"sessionId"`
	MediaID         uuid.UUID          `json:"mediaId"`
	UploadID        string             `json:"uploadId"`        // S3/R2 multipart upload ID
	PartSize        int64              `json:"partSize"`
	TotalParts      int                `json:"totalParts"`
	PresignedURLs   []PresignedPartURL `json:"presignedUrls,omitempty"`   // URLs for direct upload
	DirectUploadURL string             `json:"directUploadUrl,omitempty"` // Single URL for small files
	ExpiresAt       time.Time          `json:"expiresAt"`
}

// CompleteUploadResult contains the result of completing an upload
type CompleteUploadResult struct {
	MediaID      uuid.UUID `json:"mediaId"`
	URL          string    `json:"url"`
	ThumbnailURL string    `json:"thumbnailUrl,omitempty"`
	Size         int64     `json:"size"`
	Checksum     string    `json:"checksum"`
	Duration     int64     `json:"duration"` // Upload duration in milliseconds
}
