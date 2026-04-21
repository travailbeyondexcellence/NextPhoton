package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/user-service/internal/middleware"
	"github.com/nextphoton/user-service/internal/service"
)

type Resolver struct {
	UserService *service.UserService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *Resolver) Query() QueryResolver   { return &queryResolver{r} }
func (r *Resolver) Mutation() MutationResolver { return &mutationResolver{r} }

// QueryResolver interface
type QueryResolver interface {
	User(ctx context.Context, id string) (*service.User, error)
	Users(ctx context.Context, limit *int, offset *int) (*UserList, error)
	UsersByRole(ctx context.Context, role string, limit *int, offset *int) (*UserList, error)
	LearnerProfile(ctx context.Context, userID string) (*service.LearnerProfile, error)
	EducatorProfile(ctx context.Context, userID string) (*service.EducatorProfile, error)
	GuardianProfile(ctx context.Context, userID string) (*service.GuardianProfile, error)
	AdminProfile(ctx context.Context, userID string) (*service.AdminProfile, error)
}

// MutationResolver interface
type MutationResolver interface {
	UpdateUser(ctx context.Context, id string, input UpdateUserInput) (*service.User, error)
	DeleteUser(ctx context.Context, id string) (bool, error)
	CreateProfile(ctx context.Context, input CreateProfileInput) (bool, error)
}

// Input/Output types
type UserList struct {
	Users      []*service.User `json:"users"`
	TotalCount int             `json:"totalCount"`
}

type UpdateUserInput struct {
	Name  *string `json:"name"`
	Email *string `json:"email"`
	Image *string `json:"image"`
}

type CreateProfileInput struct {
	UserID   string `json:"userId"`
	Role     string `json:"role"`
	FullName string `json:"fullName"`
}

// Query implementations
func (r *queryResolver) User(ctx context.Context, id string) (*service.User, error) {
	return r.UserService.GetUser(ctx, id)
}

func (r *queryResolver) Users(ctx context.Context, limit *int, offset *int) (*UserList, error) {
	l, o := 10, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }

	users, total, err := r.UserService.GetUsers(ctx, l, o)
	if err != nil {
		return nil, err
	}
	return &UserList{Users: users, TotalCount: total}, nil
}

func (r *queryResolver) UsersByRole(ctx context.Context, role string, limit *int, offset *int) (*UserList, error) {
	l, o := 10, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }

	users, total, err := r.UserService.GetUsersByRole(ctx, role, l, o)
	if err != nil {
		return nil, err
	}
	return &UserList{Users: users, TotalCount: total}, nil
}

func (r *queryResolver) LearnerProfile(ctx context.Context, userID string) (*service.LearnerProfile, error) {
	return r.UserService.GetLearnerProfile(ctx, userID)
}

func (r *queryResolver) EducatorProfile(ctx context.Context, userID string) (*service.EducatorProfile, error) {
	return r.UserService.GetEducatorProfile(ctx, userID)
}

func (r *queryResolver) GuardianProfile(ctx context.Context, userID string) (*service.GuardianProfile, error) {
	return r.UserService.GetGuardianProfile(ctx, userID)
}

func (r *queryResolver) AdminProfile(ctx context.Context, userID string) (*service.AdminProfile, error) {
	return r.UserService.GetAdminProfile(ctx, userID)
}

// Mutation implementations
func (r *mutationResolver) UpdateUser(ctx context.Context, id string, input UpdateUserInput) (*service.User, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}
	return r.UserService.UpdateUser(ctx, id, input.Name, input.Email, input.Image)
}

func (r *mutationResolver) DeleteUser(ctx context.Context, id string) (bool, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return false, fmt.Errorf("not authenticated")
	}
	err := r.UserService.DeleteUser(ctx, id)
	return err == nil, err
}

func (r *mutationResolver) CreateProfile(ctx context.Context, input CreateProfileInput) (bool, error) {
	err := r.UserService.CreateProfile(ctx, input.UserID, input.Role, input.FullName)
	return err == nil, err
}
