// Package entities defines the core domain entities for the media service.
// These entities represent the fundamental business objects and contain
// business logic that is independent of any infrastructure concerns.
package entities

import (
	"fmt"
	"path/filepath"
	"strings"
	"time"

	"github.com/google/uuid"
)

// MediaType represents the category of media file
type MediaType string

const (
	MediaTypeImage    MediaType = "image"
	MediaTypeVideo    MediaType = "video"
	MediaTypeDocument MediaType = "document"
	MediaTypeAudio    MediaType = "audio"
	MediaTypeOther    MediaType = "other"
)

// MediaCategory represents the business category of the media
// These categories align with NextPhoton EduCare platform requirements
type MediaCategory string

const (
	// Educator-related media
	CategoryEducatorQualification MediaCategory = "educator_qualification" // Certificates, degrees
	CategoryEducatorDemoVideo     MediaCategory = "educator_demo_video"    // Demo teaching videos
	CategoryEducatorPortfolio     MediaCategory = "educator_portfolio"     // Portfolio materials

	// Learner-related media
	CategoryAssignmentSubmission MediaCategory = "assignment_submission" // Homework, projects
	CategoryLearnerProgress      MediaCategory = "learner_progress"      // Progress reports, achievements

	// Profile media
	CategoryProfilePicture MediaCategory = "profile_picture" // User profile photos
	CategoryProfileCover   MediaCategory = "profile_cover"   // Profile cover images

	// Session-related media
	CategorySessionRecording   MediaCategory = "session_recording"   // Recorded learning sessions
	CategorySessionMaterial    MediaCategory = "session_material"    // Session handouts, slides
	CategorySessionWhiteboard  MediaCategory = "session_whiteboard"  // Whiteboard captures
	CategorySessionScreenshare MediaCategory = "session_screenshare" // Screen recordings

	// Learning resources
	CategoryLearningResource MediaCategory = "learning_resource" // Educational materials
	CategoryCurriculumAsset  MediaCategory = "curriculum_asset"  // Curriculum-related files

	// Communication
	CategoryMessageAttachment MediaCategory = "message_attachment" // Chat/message attachments

	// Administrative
	CategoryAdminDocument MediaCategory = "admin_document" // Administrative files
	CategoryOther         MediaCategory = "other"          // Uncategorized files
)

// MediaStatus represents the current state of the media file
type MediaStatus string

const (
	StatusPending    MediaStatus = "pending"    // Upload initiated but not complete
	StatusUploading  MediaStatus = "uploading"  // Currently being uploaded
	StatusProcessing MediaStatus = "processing" // Being processed (resize, transcode, etc.)
	StatusReady      MediaStatus = "ready"      // Ready for use
	StatusFailed     MediaStatus = "failed"     // Upload or processing failed
	StatusDeleted    MediaStatus = "deleted"    // Soft deleted
	StatusArchived   MediaStatus = "archived"   // Archived for long-term storage
)

// StorageProvider identifies where the file is stored
type StorageProvider string

const (
	StorageLocal        StorageProvider = "local"
	StorageCloudflareR2 StorageProvider = "cloudflare_r2"
	StorageGoogleDrive  StorageProvider = "google_drive"
)

// Media represents a media file in the system.
// This is the primary aggregate root for the media bounded context.
type Media struct {
	// Identity
	ID        uuid.UUID `json:"id"`
	PublicID  string    `json:"publicId"`  // URL-safe identifier for external use
	OwnerID   uuid.UUID `json:"ownerId"`   // User who owns this media
	OwnerType string    `json:"ownerType"` // Type of owner: user, organization, system

	// File metadata
	Filename     string    `json:"filename"`     // Original filename
	MimeType     string    `json:"mimeType"`     // MIME type (e.g., image/jpeg)
	Size         int64     `json:"size"`         // File size in bytes
	MediaType    MediaType `json:"mediaType"`    // Derived type (image, video, etc.)
	Extension    string    `json:"extension"`    // File extension without dot
	Checksum     string    `json:"checksum"`     // SHA-256 hash of file content
	ChecksumAlgo string    `json:"checksumAlgo"` // Hash algorithm used (sha256)

	// Classification
	Category    MediaCategory `json:"category"`    // Business category
	Tags        []string      `json:"tags"`        // User-defined tags
	Description string        `json:"description"` // Optional description

	// Storage
	StorageProvider StorageProvider `json:"storageProvider"` // Where file is stored
	StorageKey      string          `json:"storageKey"`      // Key/path in storage
	StorageBucket   string          `json:"storageBucket"`   // Bucket/container name
	StorageRegion   string          `json:"storageRegion"`   // Storage region

	// URLs
	URL          string `json:"url"`          // Direct access URL
	ThumbnailURL string `json:"thumbnailUrl"` // Thumbnail URL (if applicable)
	CDNUrl       string `json:"cdnUrl"`       // CDN URL for fast access

	// Image-specific metadata (nil for non-images)
	ImageMetadata *ImageMetadata `json:"imageMetadata,omitempty"`

	// Video-specific metadata (nil for non-videos)
	VideoMetadata *VideoMetadata `json:"videoMetadata,omitempty"`

	// Audio-specific metadata (nil for non-audio)
	AudioMetadata *AudioMetadata `json:"audioMetadata,omitempty"`

	// Access control
	IsPublic   bool       `json:"isPublic"`   // Whether publicly accessible
	AccessList []uuid.UUID `json:"accessList"` // Users with explicit access
	ExpiresAt  *time.Time  `json:"expiresAt"`  // When access expires (nil = never)

	// Status and tracking
	Status      MediaStatus `json:"status"`
	ErrorReason string      `json:"errorReason,omitempty"` // Reason if status is failed

	// Audit fields
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	DeletedAt   *time.Time `json:"deletedAt,omitempty"`
	CreatedBy   uuid.UUID  `json:"createdBy"`
	LastAccessedAt *time.Time `json:"lastAccessedAt,omitempty"`
	AccessCount    int64      `json:"accessCount"`

	// Relationships
	ParentID      *uuid.UUID `json:"parentId,omitempty"`      // Parent media (e.g., original for thumbnail)
	ThumbnailID   *uuid.UUID `json:"thumbnailId,omitempty"`   // Associated thumbnail
	TranscodeID   *uuid.UUID `json:"transcodeId,omitempty"`   // Transcoded version
	VersionNumber int        `json:"versionNumber"`            // Version for versioned files
}

// ImageMetadata contains image-specific metadata
type ImageMetadata struct {
	Width         int     `json:"width"`
	Height        int     `json:"height"`
	ColorSpace    string  `json:"colorSpace,omitempty"`    // RGB, CMYK, etc.
	BitDepth      int     `json:"bitDepth,omitempty"`
	HasAlpha      bool    `json:"hasAlpha"`
	IsAnimated    bool    `json:"isAnimated"`              // For GIFs
	FrameCount    int     `json:"frameCount,omitempty"`    // For animated images
	Orientation   int     `json:"orientation,omitempty"`   // EXIF orientation
	CameraMake    string  `json:"cameraMake,omitempty"`
	CameraModel   string  `json:"cameraModel,omitempty"`
	DateTaken     *time.Time `json:"dateTaken,omitempty"`
	GPSLatitude   *float64 `json:"gpsLatitude,omitempty"`
	GPSLongitude  *float64 `json:"gpsLongitude,omitempty"`
}

// VideoMetadata contains video-specific metadata
type VideoMetadata struct {
	Width          int           `json:"width"`
	Height         int           `json:"height"`
	Duration       time.Duration `json:"duration"`       // Video duration
	DurationSec    float64       `json:"durationSec"`    // Duration in seconds
	Bitrate        int64         `json:"bitrate"`        // Video bitrate in bps
	FrameRate      float64       `json:"frameRate"`      // Frames per second
	Codec          string        `json:"codec"`          // Video codec (h264, vp9, etc.)
	AudioCodec     string        `json:"audioCodec"`     // Audio codec
	AudioChannels  int           `json:"audioChannels"`  // Number of audio channels
	AudioSampleRate int          `json:"audioSampleRate"` // Audio sample rate in Hz
	HasAudio       bool          `json:"hasAudio"`
	ThumbnailTime  float64       `json:"thumbnailTime"`  // Time point for thumbnail
}

// AudioMetadata contains audio-specific metadata
type AudioMetadata struct {
	Duration    time.Duration `json:"duration"`
	DurationSec float64       `json:"durationSec"`
	Bitrate     int64         `json:"bitrate"`
	SampleRate  int           `json:"sampleRate"`
	Channels    int           `json:"channels"`
	Codec       string        `json:"codec"`
	Title       string        `json:"title,omitempty"`
	Artist      string        `json:"artist,omitempty"`
	Album       string        `json:"album,omitempty"`
}

// NewMedia creates a new Media entity with default values.
// It generates a new UUID and sets created/updated timestamps.
func NewMedia(filename string, mimeType string, size int64, ownerID uuid.UUID, category MediaCategory) *Media {
	now := time.Now().UTC()
	id := uuid.New()

	return &Media{
		ID:            id,
		PublicID:      generatePublicID(id),
		OwnerID:       ownerID,
		OwnerType:     "user",
		Filename:      sanitizeFilename(filename),
		MimeType:      mimeType,
		Size:          size,
		MediaType:     DetermineMediaType(mimeType),
		Extension:     getExtension(filename),
		ChecksumAlgo:  "sha256",
		Category:      category,
		Tags:          []string{},
		Status:        StatusPending,
		IsPublic:      false,
		AccessList:    []uuid.UUID{},
		CreatedAt:     now,
		UpdatedAt:     now,
		CreatedBy:     ownerID,
		VersionNumber: 1,
	}
}

// generatePublicID creates a URL-safe public identifier
func generatePublicID(id uuid.UUID) string {
	// Use first 8 characters of UUID + timestamp suffix for uniqueness
	timestamp := time.Now().Unix()
	return fmt.Sprintf("%s_%d", strings.ReplaceAll(id.String()[:8], "-", ""), timestamp%10000)
}

// sanitizeFilename removes potentially dangerous characters from filename
func sanitizeFilename(filename string) string {
	// Get base name only (no path)
	filename = filepath.Base(filename)

	// Replace problematic characters
	replacer := strings.NewReplacer(
		"..", "_",
		"/", "_",
		"\\", "_",
		"\x00", "",
	)
	return replacer.Replace(filename)
}

// getExtension extracts the file extension without the dot
func getExtension(filename string) string {
	ext := filepath.Ext(filename)
	if ext != "" {
		return strings.ToLower(ext[1:]) // Remove the dot
	}
	return ""
}

// DetermineMediaType determines the MediaType from a MIME type string
func DetermineMediaType(mimeType string) MediaType {
	mimeType = strings.ToLower(mimeType)

	if strings.HasPrefix(mimeType, "image/") {
		return MediaTypeImage
	}
	if strings.HasPrefix(mimeType, "video/") {
		return MediaTypeVideo
	}
	if strings.HasPrefix(mimeType, "audio/") {
		return MediaTypeAudio
	}

	// Document types
	docTypes := []string{
		"application/pdf",
		"application/msword",
		"application/vnd.openxmlformats-officedocument",
		"application/vnd.ms-",
		"text/plain",
		"text/csv",
	}
	for _, docType := range docTypes {
		if strings.HasPrefix(mimeType, docType) {
			return MediaTypeDocument
		}
	}

	return MediaTypeOther
}

// SetReady marks the media as ready for use
func (m *Media) SetReady(url, thumbnailURL string) {
	m.Status = StatusReady
	m.URL = url
	m.ThumbnailURL = thumbnailURL
	m.UpdatedAt = time.Now().UTC()
}

// SetFailed marks the media as failed with a reason
func (m *Media) SetFailed(reason string) {
	m.Status = StatusFailed
	m.ErrorReason = reason
	m.UpdatedAt = time.Now().UTC()
}

// SetProcessing marks the media as being processed
func (m *Media) SetProcessing() {
	m.Status = StatusProcessing
	m.UpdatedAt = time.Now().UTC()
}

// SetUploading marks the media as currently uploading
func (m *Media) SetUploading() {
	m.Status = StatusUploading
	m.UpdatedAt = time.Now().UTC()
}

// SoftDelete marks the media as deleted without removing it
func (m *Media) SoftDelete() {
	now := time.Now().UTC()
	m.Status = StatusDeleted
	m.DeletedAt = &now
	m.UpdatedAt = now
}

// Archive marks the media as archived
func (m *Media) Archive() {
	m.Status = StatusArchived
	m.UpdatedAt = time.Now().UTC()
}

// RecordAccess updates access tracking
func (m *Media) RecordAccess() {
	now := time.Now().UTC()
	m.LastAccessedAt = &now
	m.AccessCount++
}

// IsImage returns true if this media is an image
func (m *Media) IsImage() bool {
	return m.MediaType == MediaTypeImage
}

// IsVideo returns true if this media is a video
func (m *Media) IsVideo() bool {
	return m.MediaType == MediaTypeVideo
}

// IsAudio returns true if this media is audio
func (m *Media) IsAudio() bool {
	return m.MediaType == MediaTypeAudio
}

// IsDocument returns true if this media is a document
func (m *Media) IsDocument() bool {
	return m.MediaType == MediaTypeDocument
}

// NeedsThumbnail returns true if this media type should have a thumbnail
func (m *Media) NeedsThumbnail() bool {
	return m.MediaType == MediaTypeImage || m.MediaType == MediaTypeVideo
}

// CanHaveAccess checks if a user has access to this media
func (m *Media) CanHaveAccess(userID uuid.UUID) bool {
	// Public media is accessible to everyone
	if m.IsPublic {
		return true
	}

	// Owner always has access
	if m.OwnerID == userID {
		return true
	}

	// Check access list
	for _, allowedID := range m.AccessList {
		if allowedID == userID {
			return true
		}
	}

	return false
}

// GrantAccess adds a user to the access list
func (m *Media) GrantAccess(userID uuid.UUID) {
	// Check if already has access
	for _, id := range m.AccessList {
		if id == userID {
			return
		}
	}
	m.AccessList = append(m.AccessList, userID)
	m.UpdatedAt = time.Now().UTC()
}

// RevokeAccess removes a user from the access list
func (m *Media) RevokeAccess(userID uuid.UUID) {
	newList := make([]uuid.UUID, 0, len(m.AccessList))
	for _, id := range m.AccessList {
		if id != userID {
			newList = append(newList, id)
		}
	}
	m.AccessList = newList
	m.UpdatedAt = time.Now().UTC()
}

// SetPublic makes the media publicly accessible
func (m *Media) SetPublic(isPublic bool) {
	m.IsPublic = isPublic
	m.UpdatedAt = time.Now().UTC()
}

// SetExpiration sets an expiration time for the media
func (m *Media) SetExpiration(expiresAt *time.Time) {
	m.ExpiresAt = expiresAt
	m.UpdatedAt = time.Now().UTC()
}

// IsExpired checks if the media access has expired
func (m *Media) IsExpired() bool {
	if m.ExpiresAt == nil {
		return false
	}
	return time.Now().UTC().After(*m.ExpiresAt)
}

// SetStorage updates storage information after upload
func (m *Media) SetStorage(provider StorageProvider, bucket, key, region string) {
	m.StorageProvider = provider
	m.StorageBucket = bucket
	m.StorageKey = key
	m.StorageRegion = region
	m.UpdatedAt = time.Now().UTC()
}

// SetChecksum sets the file checksum after verification
func (m *Media) SetChecksum(checksum string) {
	m.Checksum = checksum
	m.UpdatedAt = time.Now().UTC()
}

// AddTag adds a tag to the media
func (m *Media) AddTag(tag string) {
	tag = strings.ToLower(strings.TrimSpace(tag))
	if tag == "" {
		return
	}

	// Check for duplicate
	for _, t := range m.Tags {
		if t == tag {
			return
		}
	}

	m.Tags = append(m.Tags, tag)
	m.UpdatedAt = time.Now().UTC()
}

// RemoveTag removes a tag from the media
func (m *Media) RemoveTag(tag string) {
	tag = strings.ToLower(strings.TrimSpace(tag))
	newTags := make([]string, 0, len(m.Tags))
	for _, t := range m.Tags {
		if t != tag {
			newTags = append(newTags, t)
		}
	}
	m.Tags = newTags
	m.UpdatedAt = time.Now().UTC()
}

// HumanReadableSize returns the file size in human-readable format
func (m *Media) HumanReadableSize() string {
	const unit = 1024
	if m.Size < unit {
		return fmt.Sprintf("%d B", m.Size)
	}
	div, exp := int64(unit), 0
	for n := m.Size / unit; n >= unit; n /= unit {
		div *= unit
		exp++
	}
	return fmt.Sprintf("%.1f %cB", float64(m.Size)/float64(div), "KMGTPE"[exp])
}

// StoragePath generates a storage path based on category and ID
func (m *Media) StoragePath() string {
	// Format: category/year/month/day/id/filename
	now := m.CreatedAt
	return fmt.Sprintf("%s/%d/%02d/%02d/%s/%s",
		string(m.Category),
		now.Year(),
		now.Month(),
		now.Day(),
		m.ID.String(),
		m.Filename,
	)
}

// ThumbnailStoragePath generates the storage path for thumbnails
func (m *Media) ThumbnailStoragePath() string {
	now := m.CreatedAt
	ext := "jpg" // Thumbnails are always JPEG
	return fmt.Sprintf("%s/%d/%02d/%02d/%s/thumb_%s.%s",
		string(m.Category),
		now.Year(),
		now.Month(),
		now.Day(),
		m.ID.String(),
		m.PublicID,
		ext,
	)
}

// Validate performs validation on the media entity
func (m *Media) Validate() error {
	if m.ID == uuid.Nil {
		return fmt.Errorf("media ID is required")
	}
	if m.OwnerID == uuid.Nil {
		return fmt.Errorf("owner ID is required")
	}
	if m.Filename == "" {
		return fmt.Errorf("filename is required")
	}
	if m.MimeType == "" {
		return fmt.Errorf("MIME type is required")
	}
	if m.Size <= 0 {
		return fmt.Errorf("size must be greater than 0")
	}
	if m.Category == "" {
		return fmt.Errorf("category is required")
	}
	return nil
}
