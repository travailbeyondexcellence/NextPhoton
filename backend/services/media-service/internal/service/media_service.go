package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/nextphoton/media-service/internal/db"
)

type MediaService struct {
	DB *db.DB
}

func NewMediaService(database *db.DB) *MediaService {
	return &MediaService{DB: database}
}

type Media struct {
	ID           string    `json:"id"`
	UploadedBy   string    `json:"uploadedBy"`
	FileName     string    `json:"fileName"`
	FileSize     int64     `json:"fileSize"`
	MimeType     string    `json:"mimeType"`
	MediaType    string    `json:"mediaType"`
	StorageURL   string    `json:"storageUrl"`
	ThumbnailURL *string   `json:"thumbnailUrl"`
	IsPublic     bool      `json:"isPublic"`
	Description  *string   `json:"description"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

func (s *MediaService) UploadMedia(ctx context.Context, m *Media) (*Media, error) {
	m.ID = uuid.New().String()
	m.CreatedAt = time.Now()
	m.UpdatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO media (id, "uploadedBy", "fileName", "fileSize", "mimeType", "mediaType",
		"storageUrl", "thumbnailUrl", "isPublic", description, "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
		m.ID, m.UploadedBy, m.FileName, m.FileSize, m.MimeType, m.MediaType,
		m.StorageURL, m.ThumbnailURL, m.IsPublic, m.Description, m.CreatedAt, m.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to upload media: %w", err)
	}
	return m, nil
}

func (s *MediaService) GetMedia(ctx context.Context, id string) (*Media, error) {
	var m Media
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "uploadedBy", "fileName", "fileSize", "mimeType", "mediaType",
		"storageUrl", "thumbnailUrl", "isPublic", description, "createdAt", "updatedAt"
		FROM media WHERE id = $1`, id).
		Scan(&m.ID, &m.UploadedBy, &m.FileName, &m.FileSize, &m.MimeType, &m.MediaType,
			&m.StorageURL, &m.ThumbnailURL, &m.IsPublic, &m.Description, &m.CreatedAt, &m.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("media not found")
		}
		return nil, err
	}
	return &m, nil
}

func (s *MediaService) GetMediaByUser(ctx context.Context, userID string, limit, offset int) ([]*Media, int, error) {
	if limit <= 0 {
		limit = 20
	}
	var total int
	err := s.DB.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM media WHERE "uploadedBy" = $1`, userID).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "uploadedBy", "fileName", "fileSize", "mimeType", "mediaType",
		"storageUrl", "thumbnailUrl", "isPublic", description, "createdAt", "updatedAt"
		FROM media WHERE "uploadedBy" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var media []*Media
	for rows.Next() {
		var m Media
		if err := rows.Scan(&m.ID, &m.UploadedBy, &m.FileName, &m.FileSize, &m.MimeType, &m.MediaType,
			&m.StorageURL, &m.ThumbnailURL, &m.IsPublic, &m.Description, &m.CreatedAt, &m.UpdatedAt); err != nil {
			return nil, 0, err
		}
		media = append(media, &m)
	}
	return media, total, nil
}

func (s *MediaService) DeleteMedia(ctx context.Context, id, userID string) error {
	result, err := s.DB.Pool.Exec(ctx, `DELETE FROM media WHERE id = $1 AND "uploadedBy" = $2`, id, userID)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("media not found")
	}
	return nil
}
