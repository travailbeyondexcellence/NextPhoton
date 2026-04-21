package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/nextphoton/auth-service/config"
	"github.com/nextphoton/auth-service/ent"
	"github.com/nextphoton/auth-service/graph"
	"github.com/nextphoton/auth-service/graph/generated"
	"github.com/nextphoton/auth-service/internal/middleware"
	"github.com/nextphoton/auth-service/internal/service"
	"github.com/rs/cors"
	_ "github.com/lib/pq"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	log.Printf("Starting Auth Service on port %s", cfg.ServerPort)

	client, err := ent.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer client.Close()

	log.Println("Connected to database")

	ctx := context.Background()
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatal("Failed to create schema:", err)
	}
	log.Println("Database schema created/updated")

	authService := service.NewAuthService(client, cfg)

	// Seed default roles
	if err := authService.SeedDefaultRoles(ctx); err != nil {
		log.Printf("Warning: failed to seed default roles: %v", err)
	} else {
		log.Println("Default roles seeded")
	}

	resolver := &graph.Resolver{
		AuthService: authService,
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: resolver,
	}))

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	mux := http.NewServeMux()
	mux.Handle("/graphql", middleware.AuthMiddleware(authService)(srv))
	mux.Handle("/playground", playground.Handler("GraphQL Playground", "/graphql"))
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"auth"}`))
	})

	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      corsMiddleware.Handler(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Auth service ready at http://localhost:%s/graphql", cfg.ServerPort)
		log.Printf("Playground at http://localhost:%s/playground", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down server...")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(shutdownCtx); err != nil {
		log.Fatal("Server forced to shutdown:", err)
	}
	log.Println("Server exited")
}
