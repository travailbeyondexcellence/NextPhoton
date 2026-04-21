package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nextphoton/session-service/config"
	"github.com/nextphoton/session-service/internal/db"
	"github.com/nextphoton/session-service/internal/middleware"
	"github.com/nextphoton/session-service/internal/service"
	"github.com/rs/cors"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatal("Failed to load config:", err)
	}

	log.Printf("Starting Session Service on port %s", cfg.ServerPort)

	database, err := db.New(cfg.DatabaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer database.Close()
	log.Println("Connected to database")

	sessionService := service.NewSessionService(database)
	_ = sessionService // Will be used when gqlgen is generated

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	mux := http.NewServeMux()
	// GraphQL handler will be added after running gqlgen generate
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"session"}`))
	})

	_ = middleware.AuthMiddleware(cfg.JWTSecret) // Will wrap GraphQL handler

	server := &http.Server{
		Addr:         ":" + cfg.ServerPort,
		Handler:      corsMiddleware.Handler(mux),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		log.Printf("Session service ready at http://localhost:%s", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down...")
}
