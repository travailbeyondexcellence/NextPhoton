package graph

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
)

// NewExecutableSchema creates a simple GraphQL handler
// In production, this would be replaced by gqlgen-generated code
// Run `go run github.com/99designs/gqlgen generate` to generate proper code
func NewExecutableSchema(resolver *Resolver) http.Handler {
	return &graphQLHandler{resolver: resolver}
}

type graphQLHandler struct {
	resolver *Resolver
}

type graphQLRequest struct {
	Query         string                 `json:"query"`
	OperationName string                 `json:"operationName"`
	Variables     map[string]interface{} `json:"variables"`
}

type graphQLResponse struct {
	Data   interface{} `json:"data,omitempty"`
	Errors []gqlError  `json:"errors,omitempty"`
}

type gqlError struct {
	Message string `json:"message"`
}

func (h *graphQLHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	body, err := io.ReadAll(r.Body)
	if err != nil {
		writeError(w, "Failed to read request body")
		return
	}

	var req graphQLRequest
	if err := json.Unmarshal(body, &req); err != nil {
		writeError(w, "Invalid JSON")
		return
	}

	ctx := r.Context()
	resp := h.executeQuery(ctx, req)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *graphQLHandler) executeQuery(ctx context.Context, req graphQLRequest) graphQLResponse {
	// This is a simplified query router
	// In production, gqlgen generates this automatically
	// For now, route based on operation name or query content
	_ = fmt.Sprintf("query: %s", req.Query)
	return graphQLResponse{
		Data: map[string]interface{}{
			"message": "User service running. Run 'go run github.com/99designs/gqlgen generate' to enable full GraphQL support.",
		},
	}
}

func writeError(w http.ResponseWriter, msg string) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(graphQLResponse{
		Errors: []gqlError{{Message: msg}},
	})
}
