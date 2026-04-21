package graph

import (
	"context"
	"encoding/base64"
	"fmt"
	"strconv"

	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/graph/generated"
	"github.com/nextphoton/auth-service/graph/model"
	"github.com/nextphoton/auth-service/internal/middleware"
	"github.com/nextphoton/auth-service/internal/service"
)

type Resolver struct {
	AuthService *service.AuthService
}

// Login is the resolver for the login field.
func (r *mutationResolver) Login(ctx context.Context, input model.LoginInput) (*model.LoginResponse, error) {
	u, token, _, err := r.AuthService.Login(ctx, input.Email, input.Password)
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		AccessToken: token,
		User:        u,
	}, nil
}

// Register is the resolver for the register field.
func (r *mutationResolver) Register(ctx context.Context, input model.RegisterInput) (*model.RegisterResponse, error) {
	roleName := ""
	if input.Role != nil {
		roleName = *input.Role
	}

	u, token, err := r.AuthService.Register(ctx, input.Name, input.Email, input.Password, roleName)
	if err != nil {
		return nil, err
	}

	return &model.RegisterResponse{
		User:        u,
		AccessToken: &token,
		Message:     "User registered successfully",
	}, nil
}

// Logout is the resolver for the logout field.
func (r *mutationResolver) Logout(ctx context.Context) (bool, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return false, fmt.Errorf("not authenticated")
	}

	err := r.AuthService.Logout(ctx, claims.UserID)
	if err != nil {
		return false, err
	}

	return true, nil
}

// RefreshToken is the resolver for the refreshToken field.
func (r *mutationResolver) RefreshToken(ctx context.Context) (*model.LoginResponse, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}

	u, token, _, err := r.AuthService.RefreshToken(ctx, claims.UserID)
	if err != nil {
		return nil, err
	}

	return &model.LoginResponse{
		AccessToken: token,
		User:        u,
	}, nil
}

// Me is the resolver for the me field.
func (r *queryResolver) Me(ctx context.Context) (*ent.User, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil {
		return nil, fmt.Errorf("not authenticated")
	}

	return r.AuthService.GetUserByID(ctx, claims.UserID)
}

// User is the resolver for the user field.
func (r *queryResolver) User(ctx context.Context, id string) (*ent.User, error) {
	return r.AuthService.GetUserByID(ctx, id)
}

// Users is the resolver for the users field.
func (r *queryResolver) Users(ctx context.Context, first *int, after *string) (*model.UserConnection, error) {
	limit := 10
	if first != nil {
		limit = *first
	}

	offset := 0
	if after != nil {
		decoded, err := base64.StdEncoding.DecodeString(*after)
		if err == nil {
			offset, _ = strconv.Atoi(string(decoded))
		}
	}

	users, total, err := r.AuthService.GetAllUsers(ctx, limit+1, offset)
	if err != nil {
		return nil, err
	}

	hasNextPage := len(users) > limit
	if hasNextPage {
		users = users[:limit]
	}

	edges := make([]*model.UserEdge, len(users))
	for i, u := range users {
		cursor := base64.StdEncoding.EncodeToString([]byte(strconv.Itoa(offset + i + 1)))
		edges[i] = &model.UserEdge{
			Node:   u,
			Cursor: cursor,
		}
	}

	var startCursor, endCursor *string
	if len(edges) > 0 {
		startCursor = &edges[0].Cursor
		endCursor = &edges[len(edges)-1].Cursor
	}

	return &model.UserConnection{
		Edges: edges,
		PageInfo: &model.PageInfo{
			HasNextPage:     hasNextPage,
			HasPreviousPage: offset > 0,
			StartCursor:     startCursor,
			EndCursor:       endCursor,
		},
		TotalCount: total,
	}, nil
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
