package graph

// THIS CODE WILL BE UPDATED WITH SCHEMA CHANGES. PREVIOUS IMPLEMENTATION FOR SCHEMA CHANGES WILL BE KEPT IN THE COMMENT SECTION. IMPLEMENTATION FOR UNCHANGED SCHEMA WILL BE KEPT.

import (
	"context"

	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/graph/generated"
	"github.com/nextphoton/auth-service/graph/model"
	"github.com/nextphoton/auth-service/internal/service"
)

type Resolver struct{
	AuthService *service.AuthService
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, input model.LoginInput) (*model.LoginResponse, error) {
	user, token, err := r.AuthService.Login(ctx, input.Email, input.Password)
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		AccessToken: token,
		User:        user,
	}, nil
}

// Register is the resolver for the register field.
func (r *mutationResolver) Register(ctx context.Context, input model.RegisterInput) (*model.RegisterResponse, error) {
	user, err := r.AuthService.Register(ctx, input.Name, input.Email, input.Password)
	if err != nil {
		return nil, err
	}

	return &model.RegisterResponse{
		User:    user,
		Message: "User registered successfully",
	}, nil
}

// Logout is the resolver for the logout field.
func (r *mutationResolver) Logout(ctx context.Context) (bool, error) {
	// TODO: Implement session invalidation
	// For now, client-side logout by removing token is sufficient
	return true, nil
}

// RefreshToken is the resolver for the refreshToken field.
func (r *mutationResolver) RefreshToken(ctx context.Context) (*model.LoginResponse, error) {
	// TODO: Implement refresh token logic with proper token extraction from context
	return nil, nil
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*ent.User, error) {
	// TODO: Extract user ID from JWT token in context
	// For now, return nil
	return nil, nil
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*ent.User, error) {
	return r.AuthService.GetUserByID(ctx, id)
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context, first *int, after *string) (*model.UserConnection, error) {
	// TODO: Implement pagination
	return nil, nil
}

// UserRoles is the resolver for the userRoles field.
func (r *userResolver) UserRoles(ctx context.Context, obj *ent.User) ([]*ent.UserRole, error) {
	return obj.QueryUserRoles().All(ctx)
}

// Mutation returns generated.MutationResolver implementation.
func (r *Resolver) Mutation() generated.MutationResolver { return &mutationResolver{r} }

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// User returns generated.UserResolver implementation.
func (r *Resolver) User() generated.UserResolver { return &userResolver{r} }

type mutationResolver struct{ *Resolver }
type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
