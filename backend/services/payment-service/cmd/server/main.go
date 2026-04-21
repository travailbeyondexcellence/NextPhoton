package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/nextphoton/payment-service/config"
	"github.com/nextphoton/payment-service/internal/db"
	"github.com/nextphoton/payment-service/internal/middleware"
	"github.com/nextphoton/payment-service/internal/service"
	"github.com/rs/cors"
)

func main() {
	cfg, err := config.Load()
	if err != nil { log.Fatal("Failed to load config:", err) }
	log.Printf("Starting Payment Service on port %s", cfg.ServerPort)

	database, err := db.New(cfg.DatabaseURL)
	if err != nil { log.Fatal("Failed to connect to database:", err) }
	defer database.Close()
	log.Println("Connected to database")

	paymentService := service.NewPaymentService(database)
	_ = paymentService

	corsMiddleware := cors.New(cors.Options{
		AllowedOrigins:   []string{cfg.CORSOrigin},
		AllowCredentials: true,
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"*"},
	})

	mux := http.NewServeMux()
	mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok","service":"payment"}`))
	})

	_ = middleware.AuthMiddleware(cfg.JWTSecret)

	server := &http.Server{
		Addr: ":" + cfg.ServerPort, Handler: corsMiddleware.Handler(mux),
		ReadTimeout: 15 * time.Second, WriteTimeout: 15 * time.Second,
	}

	go func() {
		log.Printf("Payment service ready at http://localhost:%s", cfg.ServerPort)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed { log.Fatal(err) }
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down...")
}
