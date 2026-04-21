package main

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	chiCors "github.com/go-chi/cors"
	"github.com/nextphoton/api-gateway/config"
	"go.uber.org/zap"
)

func main() {
	cfg := config.Load()

	logger, _ := zap.NewProduction()
	if cfg.Logging.Level == "debug" {
		logger, _ = zap.NewDevelopment()
	}
	defer logger.Sync()

	r := chi.NewRouter()

	// Middleware
	r.Use(chiCors.Handler(chiCors.Options{
		AllowedOrigins:   cfg.CORS.AllowedOrigins,
		AllowedMethods:   cfg.CORS.AllowedMethods,
		AllowedHeaders:   cfg.CORS.AllowedHeaders,
		AllowCredentials: cfg.CORS.AllowCredentials,
		MaxAge:           cfg.CORS.MaxAge,
	}))

	r.Use(requestLogger(logger))
	r.Use(recoverer(logger))

	// Health check
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.Write([]byte(`{"status":"ok","service":"api-gateway"}`))
	})

	// Service proxies
	authURL := getServiceURL(cfg, "auth")
	userURL := getServiceURL(cfg, "user")
	sessionURL := getServiceURL(cfg, "session")
	notificationURL := getServiceURL(cfg, "notification")
	paymentURL := getServiceURL(cfg, "payment")
	mediaURL := getServiceURL(cfg, "media")
	analyticsURL := getServiceURL(cfg, "analytics")

	// Auth service routes
	r.Route("/auth", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(authURL, "/graphql"))
		r.Handle("/playground", reverseProxy(authURL, "/playground"))
		r.Get("/health", proxyHealth(authURL))
	})

	// User service routes
	r.Route("/users", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(userURL, "/graphql"))
		r.Handle("/playground", reverseProxy(userURL, "/playground"))
		r.Get("/health", proxyHealth(userURL))
	})

	// Session service routes
	r.Route("/sessions", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(sessionURL, "/graphql"))
		r.Handle("/playground", reverseProxy(sessionURL, "/playground"))
		r.Get("/health", proxyHealth(sessionURL))
	})

	// Notification service routes
	r.Route("/notifications", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(notificationURL, "/graphql"))
		r.Handle("/playground", reverseProxy(notificationURL, "/playground"))
		r.Get("/health", proxyHealth(notificationURL))
	})

	// Payment service routes
	r.Route("/payments", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(paymentURL, "/graphql"))
		r.Handle("/playground", reverseProxy(paymentURL, "/playground"))
		r.Get("/health", proxyHealth(paymentURL))
	})

	// Media service routes
	r.Route("/media", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(mediaURL, "/graphql"))
		r.Handle("/playground", reverseProxy(mediaURL, "/playground"))
		r.Get("/health", proxyHealth(mediaURL))
	})

	// Analytics service routes
	r.Route("/analytics", func(r chi.Router) {
		r.Handle("/graphql", reverseProxy(analyticsURL, "/graphql"))
		r.Handle("/playground", reverseProxy(analyticsURL, "/playground"))
		r.Get("/health", proxyHealth(analyticsURL))
	})

	// Unified GraphQL endpoint - proxies to auth service by default
	r.Handle("/graphql", reverseProxy(authURL, "/graphql"))
	r.Handle("/playground", reverseProxy(authURL, "/playground"))

	addr := fmt.Sprintf(":%d", cfg.Server.Port)

	server := &http.Server{
		Addr:         addr,
		Handler:      r,
		ReadTimeout:  cfg.Server.ReadTimeout,
		WriteTimeout: cfg.Server.WriteTimeout,
		IdleTimeout:  cfg.Server.IdleTimeout,
	}

	go func() {
		logger.Info("API Gateway starting", zap.String("addr", addr))
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Fatal("Server failed", zap.Error(err))
		}
	}()

	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("Shutting down API Gateway...")
	ctx, cancel := context.WithTimeout(context.Background(), cfg.Server.ShutdownTimeout)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		logger.Fatal("Server forced shutdown", zap.Error(err))
	}
	logger.Info("API Gateway stopped")
}

func getServiceURL(cfg *config.Config, service string) string {
	switch service {
	case "auth":
		if cfg.Services.AuthServiceURL != "" {
			return cfg.Services.AuthServiceURL
		}
		return "http://localhost:3963"
	case "user":
		if cfg.Services.UserServiceURL != "" {
			return cfg.Services.UserServiceURL
		}
		return "http://localhost:3964"
	case "session":
		if cfg.Services.SessionServiceURL != "" {
			return cfg.Services.SessionServiceURL
		}
		return "http://localhost:3965"
	case "notification":
		if cfg.Services.NotificationServiceURL != "" {
			return cfg.Services.NotificationServiceURL
		}
		return "http://localhost:3966"
	case "payment":
		if cfg.Services.PaymentServiceURL != "" {
			return cfg.Services.PaymentServiceURL
		}
		return "http://localhost:3967"
	case "media":
		if cfg.Services.MediaServiceURL != "" {
			return cfg.Services.MediaServiceURL
		}
		return "http://localhost:3968"
	case "analytics":
		if cfg.Services.AnalyticsServiceURL != "" {
			return cfg.Services.AnalyticsServiceURL
		}
		return "http://localhost:3969"
	}
	return ""
}

func reverseProxy(target, path string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		targetURL, err := url.Parse(target)
		if err != nil {
			http.Error(w, "Bad gateway", http.StatusBadGateway)
			return
		}

		proxy := httputil.NewSingleHostReverseProxy(targetURL)
		r.URL.Path = path
		r.URL.Host = targetURL.Host
		r.URL.Scheme = targetURL.Scheme
		r.Host = targetURL.Host

		proxy.ServeHTTP(w, r)
	})
}

func proxyHealth(target string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		resp, err := http.Get(target + "/health")
		if err != nil {
			w.WriteHeader(http.StatusServiceUnavailable)
			w.Write([]byte(`{"status":"unavailable"}`))
			return
		}
		defer resp.Body.Close()

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(resp.StatusCode)
		io.Copy(w, resp.Body)
	}
}

func requestLogger(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			start := time.Now()
			next.ServeHTTP(w, r)
			logger.Info("request",
				zap.String("method", r.Method),
				zap.String("path", r.URL.Path),
				zap.Duration("duration", time.Since(start)),
			)
		})
	}
}

func recoverer(logger *zap.Logger) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			defer func() {
				if rvr := recover(); rvr != nil {
					logger.Error("panic recovered", zap.Any("panic", rvr))
					http.Error(w, "Internal Server Error", http.StatusInternalServerError)
				}
			}()
			next.ServeHTTP(w, r)
		})
	}
}
