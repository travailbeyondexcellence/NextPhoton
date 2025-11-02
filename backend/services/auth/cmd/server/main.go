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
	"github.com/nextphoton/auth-service/internal/service"
	"github.com/rs/cors"
	_ "github.com/lib/pq"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	log.Printf("Starting Auth Service on port %s", cfg.ServerPort)
	log.Printf("Database URL: %s", maskDatabaseURL(cfg.DatabaseURL))
	log.Printf("CORS Origin: %s", cfg.CORSOrigin)

	// Connect to database (postgres driver registered via blank import)
	client, err := ent.Open("postgres", cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer client.Close()

	log.Println("Connected to database")

	// Run migrations
	ctx := context.Background()
	if err := client.Schema.Create(ctx); err != nil {
		log.Fatal("Failed to create schema:", err)
	}

	log.Println("Database schema created/updated")

	// Create auth service
	authService := service.NewAuthService(client, cfg)

	// Create GraphQL resolver
	resolver := &graph.Resolver{
		AuthService: authService,
	}

	// Create GraphQL server
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers: resolver,
	}))

	// Setup CORS
	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	// Setup routes
	http.Handle("/graphql", corsMiddleware.Handler(srv))
	http.Handle("/playground", playground.Handler("GraphQL Playground", "/graphql"))
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// Start server
	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Start server in goroutine
	go func() {
		log.Printf("GraphQL server ready at http://localhost:%s/graphql", cfg.ServerPort)
		log.Printf("GraphQL Playground at http://localhost:%s/playground", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	// Graceful shutdown
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

// maskDatabaseURL masks the password in the database URL for logging
func maskDatabaseURL(url string) string {
	// Simple masking - in production, use a more robust method
	if len(url) > 50 {
		return url[:20] + "***" + url[len(url)-20:]
	}
	return "***"
}
