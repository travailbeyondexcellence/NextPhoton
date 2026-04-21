package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nextphoton/user-service/config"
	"github.com/nextphoton/user-service/graph"
	"github.com/nextphoton/user-service/internal/db"
	"github.com/nextphoton/user-service/internal/middleware"
	"github.com/nextphoton/user-service/internal/service"
	"github.com/rs/cors"

	"github.com/99designs/gqlgen/graphql/playground"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	log.Printf("Starting User Service on port %s", cfg.ServerPort)

	database, err := db.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()
	log.Println("Connected to database")

	userService := service.NewUserService(database)

	resolver := &graph.Resolver{
		UserService: userService,
	}

	srv := graph.NewExecutableSchema(resolver)

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	mux := http.NewServeMux()
	mux.Handle("/graphql", middleware.AuthMiddleware(cfg.JWTSecret)(srv))
	mux.Handle("/playground", playground.Handler("User Service", "/graphql"))
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"user"}`))
	})

	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      corsMiddleware.Handler(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("User service ready at http://localhost:%s/graphql", cfg.ServerPort)
		log.Printf("Playground at http://localhost:%s/playground", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	log.Println("Shutting down...")
}
