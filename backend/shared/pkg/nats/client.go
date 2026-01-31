// Package nats provides a comprehensive NATS messaging client for the NextPhoton EduCare platform.
// It includes connection management with automatic reconnection, JetStream support for persistence,
// and integration with OpenTelemetry for distributed tracing.
package nats

import (
	"context"
	"encoding/json"
	"fmt"
	"sync"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

// ClientConfig holds configuration options for the NATS client.
type ClientConfig struct {
	// URL is the NATS server URL (e.g., "nats://localhost:4222")
	URL string

	// Name is an optional client name for connection identification
	Name string

	// ReconnectWait is the duration to wait between reconnection attempts
	ReconnectWait time.Duration

	// MaxReconnects is the maximum number of reconnection attempts (-1 for unlimited)
	MaxReconnects int

	// ConnectTimeout is the timeout for initial connection
	ConnectTimeout time.Duration

	// EnableJetStream enables JetStream for persistent messaging
	EnableJetStream bool

	// Logger is the structured logger for client operations
	Logger *zap.Logger

	// TLSConfig contains TLS configuration (optional)
	TLSCertFile string
	TLSKeyFile  string
	TLSCAFile   string

	// Authentication options
	Username string
	Password string
	Token    string
	NKeyFile string
	CredFile string
}

// DefaultConfig returns a ClientConfig with sensible defaults for development.
func DefaultConfig() ClientConfig {
	return ClientConfig{
		URL:             "nats://localhost:4222",
		Name:            "nextphoton-client",
		ReconnectWait:   2 * time.Second,
		MaxReconnects:   60, // 2 minutes of reconnection attempts
		ConnectTimeout:  10 * time.Second,
		EnableJetStream: true,
	}
}

// Client wraps the NATS connection and provides high-level messaging operations.
type Client struct {
	config     ClientConfig
	conn       *nats.Conn
	js         jetstream.JetStream
	logger     *zap.Logger
	tracer     trace.Tracer
	mu         sync.RWMutex
	isClosing  bool
	streams    map[string]jetstream.Stream
	consumers  map[string]jetstream.Consumer
}

// NewClient creates a new NATS client with the given configuration.
// It establishes a connection to the NATS server and optionally initializes JetStream.
func NewClient(ctx context.Context, config ClientConfig) (*Client, error) {
	// Set up logger
	logger := config.Logger
	if logger == nil {
		var err error
		logger, err = zap.NewProduction()
		if err != nil {
			return nil, fmt.Errorf("failed to create logger: %w", err)
		}
	}

	client := &Client{
		config:    config,
		logger:    logger,
		tracer:    otel.Tracer("github.com/nextphoton/shared/pkg/nats"),
		streams:   make(map[string]jetstream.Stream),
		consumers: make(map[string]jetstream.Consumer),
	}

	// Build connection options
	opts := client.buildConnectionOptions()

	// Establish connection
	logger.Info("Connecting to NATS server",
		zap.String("url", config.URL),
		zap.String("name", config.Name),
	)

	conn, err := nats.Connect(config.URL, opts...)
	if err != nil {
		return nil, fmt.Errorf("failed to connect to NATS: %w", err)
	}

	client.conn = conn
	logger.Info("Successfully connected to NATS server",
		zap.String("connected_url", conn.ConnectedUrl()),
		zap.String("server_id", conn.ConnectedServerId()),
	)

	// Initialize JetStream if enabled
	if config.EnableJetStream {
		js, err := jetstream.New(conn)
		if err != nil {
			conn.Close()
			return nil, fmt.Errorf("failed to initialize JetStream: %w", err)
		}
		client.js = js
		logger.Info("JetStream initialized successfully")
	}

	return client, nil
}

// buildConnectionOptions creates NATS connection options from the client configuration.
func (c *Client) buildConnectionOptions() []nats.Option {
	opts := []nats.Option{
		nats.Name(c.config.Name),
		nats.ReconnectWait(c.config.ReconnectWait),
		nats.MaxReconnects(c.config.MaxReconnects),
		nats.Timeout(c.config.ConnectTimeout),
		nats.ReconnectBufSize(8 * 1024 * 1024), // 8MB reconnect buffer
		nats.PingInterval(20 * time.Second),
		nats.MaxPingsOutstanding(5),

		// Reconnect handlers for observability
		nats.DisconnectErrHandler(func(nc *nats.Conn, err error) {
			if err != nil {
				c.logger.Warn("Disconnected from NATS",
					zap.Error(err),
					zap.String("last_url", nc.LastError().Error()),
				)
			}
		}),

		nats.ReconnectHandler(func(nc *nats.Conn) {
			c.logger.Info("Reconnected to NATS",
				zap.String("url", nc.ConnectedUrl()),
				zap.Int("reconnect_count", int(nc.Stats().Reconnects)),
			)
		}),

		nats.ClosedHandler(func(nc *nats.Conn) {
			c.logger.Info("NATS connection closed")
		}),

		nats.ErrorHandler(func(nc *nats.Conn, sub *nats.Subscription, err error) {
			c.logger.Error("NATS error",
				zap.Error(err),
				zap.String("subject", sub.Subject),
			)
		}),
	}

	// Add authentication options
	if c.config.Token != "" {
		opts = append(opts, nats.Token(c.config.Token))
	} else if c.config.Username != "" && c.config.Password != "" {
		opts = append(opts, nats.UserInfo(c.config.Username, c.config.Password))
	} else if c.config.CredFile != "" {
		opts = append(opts, nats.UserCredentials(c.config.CredFile))
	} else if c.config.NKeyFile != "" {
		opt, err := nats.NkeyOptionFromSeed(c.config.NKeyFile)
		if err == nil {
			opts = append(opts, opt)
		}
	}

	return opts
}

// Conn returns the underlying NATS connection.
// Use this for low-level operations not covered by the Client API.
func (c *Client) Conn() *nats.Conn {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.conn
}

// JetStream returns the JetStream context for persistent messaging.
// Returns nil if JetStream is not enabled.
func (c *Client) JetStream() jetstream.JetStream {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.js
}

// IsConnected returns true if the client is currently connected to NATS.
func (c *Client) IsConnected() bool {
	c.mu.RLock()
	defer c.mu.RUnlock()
	return c.conn != nil && c.conn.IsConnected()
}

// Stats returns connection statistics.
func (c *Client) Stats() nats.Statistics {
	c.mu.RLock()
	defer c.mu.RUnlock()
	if c.conn != nil {
		return c.conn.Stats()
	}
	return nats.Statistics{}
}

// CreateStream creates or updates a JetStream stream with the given configuration.
// Streams provide message persistence and replay capabilities.
func (c *Client) CreateStream(ctx context.Context, cfg jetstream.StreamConfig) (jetstream.Stream, error) {
	ctx, span := c.tracer.Start(ctx, "nats.CreateStream",
		trace.WithAttributes(attribute.String("stream.name", cfg.Name)),
	)
	defer span.End()

	c.mu.Lock()
	defer c.mu.Unlock()

	if c.js == nil {
		return nil, fmt.Errorf("JetStream is not enabled")
	}

	stream, err := c.js.CreateOrUpdateStream(ctx, cfg)
	if err != nil {
		span.RecordError(err)
		return nil, fmt.Errorf("failed to create stream %s: %w", cfg.Name, err)
	}

	c.streams[cfg.Name] = stream
	c.logger.Info("Stream created/updated",
		zap.String("name", cfg.Name),
		zap.Strings("subjects", cfg.Subjects),
	)

	return stream, nil
}

// GetStream retrieves a stream by name.
func (c *Client) GetStream(ctx context.Context, name string) (jetstream.Stream, error) {
	c.mu.RLock()
	if stream, ok := c.streams[name]; ok {
		c.mu.RUnlock()
		return stream, nil
	}
	c.mu.RUnlock()

	c.mu.Lock()
	defer c.mu.Unlock()

	if c.js == nil {
		return nil, fmt.Errorf("JetStream is not enabled")
	}

	stream, err := c.js.Stream(ctx, name)
	if err != nil {
		return nil, fmt.Errorf("failed to get stream %s: %w", name, err)
	}

	c.streams[name] = stream
	return stream, nil
}

// CreateConsumer creates a durable consumer for a stream.
// Consumers allow multiple services to process messages from the same stream.
func (c *Client) CreateConsumer(ctx context.Context, streamName string, cfg jetstream.ConsumerConfig) (jetstream.Consumer, error) {
	ctx, span := c.tracer.Start(ctx, "nats.CreateConsumer",
		trace.WithAttributes(
			attribute.String("stream.name", streamName),
			attribute.String("consumer.name", cfg.Name),
		),
	)
	defer span.End()

	stream, err := c.GetStream(ctx, streamName)
	if err != nil {
		span.RecordError(err)
		return nil, err
	}

	consumer, err := stream.CreateOrUpdateConsumer(ctx, cfg)
	if err != nil {
		span.RecordError(err)
		return nil, fmt.Errorf("failed to create consumer %s: %w", cfg.Name, err)
	}

	c.mu.Lock()
	c.consumers[cfg.Name] = consumer
	c.mu.Unlock()

	c.logger.Info("Consumer created/updated",
		zap.String("stream", streamName),
		zap.String("consumer", cfg.Name),
	)

	return consumer, nil
}

// Drain gracefully drains the connection, allowing in-flight messages to complete.
func (c *Client) Drain() error {
	c.mu.Lock()
	c.isClosing = true
	c.mu.Unlock()

	c.logger.Info("Draining NATS connection")
	return c.conn.Drain()
}

// Close closes the NATS connection immediately.
func (c *Client) Close() {
	c.mu.Lock()
	c.isClosing = true
	c.mu.Unlock()

	c.logger.Info("Closing NATS connection")
	c.conn.Close()
}

// HealthCheck performs a health check on the NATS connection.
// It returns an error if the connection is not healthy.
func (c *Client) HealthCheck(ctx context.Context) error {
	_, span := c.tracer.Start(ctx, "nats.HealthCheck")
	defer span.End()

	if !c.IsConnected() {
		return fmt.Errorf("NATS connection is not active")
	}

	// Perform RTT check
	start := time.Now()
	err := c.conn.FlushTimeout(5 * time.Second)
	rtt := time.Since(start)

	if err != nil {
		span.RecordError(err)
		return fmt.Errorf("NATS health check failed: %w", err)
	}

	span.SetAttributes(attribute.Int64("rtt_ms", rtt.Milliseconds()))
	return nil
}

// EventEnvelope wraps events with metadata for tracing and routing.
type EventEnvelope struct {
	// ID is a unique identifier for this event
	ID string `json:"id"`

	// Type is the event type (e.g., "user.created")
	Type string `json:"type"`

	// Source identifies the service that produced the event
	Source string `json:"source"`

	// Time is when the event was created
	Time time.Time `json:"time"`

	// TraceID for distributed tracing
	TraceID string `json:"trace_id,omitempty"`

	// SpanID for distributed tracing
	SpanID string `json:"span_id,omitempty"`

	// Data contains the actual event payload
	Data json.RawMessage `json:"data"`

	// Metadata contains optional key-value pairs
	Metadata map[string]string `json:"metadata,omitempty"`
}

// NewEventEnvelope creates a new event envelope with the given type and data.
func NewEventEnvelope(eventType, source string, data interface{}) (*EventEnvelope, error) {
	dataBytes, err := json.Marshal(data)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal event data: %w", err)
	}

	return &EventEnvelope{
		ID:       generateEventID(),
		Type:     eventType,
		Source:   source,
		Time:     time.Now().UTC(),
		Data:     dataBytes,
		Metadata: make(map[string]string),
	}, nil
}

// WithTracing adds trace context to the event envelope.
func (e *EventEnvelope) WithTracing(ctx context.Context) *EventEnvelope {
	span := trace.SpanFromContext(ctx)
	if span.SpanContext().IsValid() {
		e.TraceID = span.SpanContext().TraceID().String()
		e.SpanID = span.SpanContext().SpanID().String()
	}
	return e
}

// Decode unmarshals the event data into the provided target.
func (e *EventEnvelope) Decode(target interface{}) error {
	return json.Unmarshal(e.Data, target)
}

// Encode marshals the envelope to JSON bytes.
func (e *EventEnvelope) Encode() ([]byte, error) {
	return json.Marshal(e)
}

// generateEventID generates a unique event ID using UUID v4.
func generateEventID() string {
	return fmt.Sprintf("evt_%d_%s", time.Now().UnixNano(), randomString(8))
}

// randomString generates a random alphanumeric string of the specified length.
func randomString(n int) string {
	const letters = "abcdefghijklmnopqrstuvwxyz0123456789"
	b := make([]byte, n)
	for i := range b {
		b[i] = letters[time.Now().UnixNano()%int64(len(letters))]
		time.Sleep(time.Nanosecond)
	}
	return string(b)
}

// SubjectBuilder helps construct NATS subjects following the NextPhoton naming convention.
type SubjectBuilder struct {
	prefix  string
	domain  string
	action  string
	version string
}

// NewSubjectBuilder creates a new subject builder with the NextPhoton prefix.
func NewSubjectBuilder() *SubjectBuilder {
	return &SubjectBuilder{
		prefix:  "nextphoton",
		version: "v1",
	}
}

// Domain sets the domain component (e.g., "user", "session", "payment").
func (sb *SubjectBuilder) Domain(domain string) *SubjectBuilder {
	sb.domain = domain
	return sb
}

// Action sets the action component (e.g., "created", "updated", "deleted").
func (sb *SubjectBuilder) Action(action string) *SubjectBuilder {
	sb.action = action
	return sb
}

// Version sets the version component (defaults to "v1").
func (sb *SubjectBuilder) Version(version string) *SubjectBuilder {
	sb.version = version
	return sb
}

// Build constructs the full subject string.
func (sb *SubjectBuilder) Build() string {
	return fmt.Sprintf("%s.%s.%s.%s", sb.prefix, sb.domain, sb.action, sb.version)
}

// BuildWildcard constructs a wildcard subject for subscribing to all actions in a domain.
func (sb *SubjectBuilder) BuildWildcard() string {
	if sb.domain == "" {
		return fmt.Sprintf("%s.>", sb.prefix)
	}
	return fmt.Sprintf("%s.%s.>", sb.prefix, sb.domain)
}
