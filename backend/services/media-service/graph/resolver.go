package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/media-service/internal/middleware"
	"github.com/nextphoton/media-service/internal/service"
)

type Resolver struct {
	MediaService *service.MediaService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *queryResolver) Media(ctx context.Context, id string) (*service.Media, error) {
	return r.MediaService.GetMedia(ctx, id)
}

func (r *queryResolver) MyMedia(ctx context.Context, limit *int, offset *int) (*MediaList, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	l, o := 20, 0
	if limit != nil {
		l = *limit
	}
	if offset != nil {
		o = *offset
	}
	media, total, err := r.MediaService.GetMediaByUser(ctx, claims.UserID, l, o)
	if err != nil {
		return nil, err
	}
	return &MediaList{Media: media, TotalCount: total}, nil
}

func (r *mutationResolver) UploadMedia(ctx context.Context, input UploadMediaInput) (*service.Media, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	m := &service.Media{
		UploadedBy: claims.UserID, FileName: input.FileName, FileSize: int64(input.FileSize),
		MimeType: input.MimeType, MediaType: input.MediaType, StorageURL: input.StorageURL,
		ThumbnailURL: input.ThumbnailURL, IsPublic: input.IsPublic, Description: input.Description,
	}
	return r.MediaService.UploadMedia(ctx, m)
}

func (r *mutationResolver) DeleteMedia(ctx context.Context, id string) (bool, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return false, fmt.Errorf("not authenticated")
	}
	err := r.MediaService.DeleteMedia(ctx, id, claims.UserID)
	return err == nil, err
}

type MediaList struct {
	Media      []*service.Media `json:"media"`
	TotalCount int              `json:"totalCount"`
}

type UploadMediaInput struct {
	FileName     string  `json:"fileName"`
	FileSize     int     `json:"fileSize"`
	MimeType     string  `json:"mimeType"`
	MediaType    string  `json:"mediaType"`
	StorageURL   string  `json:"storageUrl"`
	ThumbnailURL *string `json:"thumbnailUrl"`
	IsPublic     bool    `json:"isPublic"`
	Description  *string `json:"description"`
}
