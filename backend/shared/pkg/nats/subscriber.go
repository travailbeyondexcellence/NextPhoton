// Package nats provides subscriber functionality for the NextPhoton messaging system.
// The subscriber supports both core NATS and JetStream subscriptions with consumer groups,
// automatic message acknowledgment, and OpenTelemetry tracing integration.
package nats

import (
	"context"
	"encoding/json"
	"fmt"
	"runtime/debug"
	"sync"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

// SubscriberConfig holds configuration for the NATS subscriber.
type SubscriberConfig struct {
	// ServiceName identifies this subscriber in traces and logs
	ServiceName string

	// ConsumerGroup is the queue group name for load balancing
	ConsumerGroup string

	// MaxConcurrent is the maximum number of concurrent message handlers
	MaxConcurrent int

	// AckWait is the duration to wait for message acknowledgment
	AckWait time.Duration

	// MaxDeliver is the maximum number of delivery attempts before giving up
	MaxDeliver int

	// RedeliverDelay is the delay before redelivering a message
	RedeliverDelay time.Duration

	// EnableAutoAck automatically acknowledges messages after successful processing
	EnableAutoAck bool
}

// DefaultSubscriberConfig returns sensible defaults for the subscriber.
func DefaultSubscriberConfig(serviceName string) SubscriberConfig {
	return SubscriberConfig{
		ServiceName:    serviceName,
		ConsumerGroup:  serviceName + "-group",
		MaxConcurrent:  10,
		AckWait:        30 * time.Second,
		MaxDeliver:     5,
		RedeliverDelay: 5 * time.Second,
		EnableAutoAck:  true,
	}
}

// Subscriber handles message subscriptions from NATS with consumer group support.
type Subscriber struct {
	client        *Client
	config        SubscriberConfig
	logger        *zap.Logger
	tracer        trace.Tracer
	subscriptions []*nats.Subscription
	jsConsumers   []jetstream.ConsumeContext
	handlers      map[string]MessageHandler
	mu            sync.RWMutex
	wg            sync.WaitGroup
	ctx           context.Context
	cancel        context.CancelFunc
}

// MessageHandler is the function signature for handling incoming messages.
type MessageHandler func(ctx context.Context, msg *Message) error

// Message represents a received NATS message with parsed envelope.
type Message struct {
	// Subject is the NATS subject the message was received on
	Subject string

	// Envelope contains the parsed event envelope with metadata
	Envelope *EventEnvelope

	// RawData contains the raw message bytes
	RawData []byte

	// Headers contains message headers
	Headers map[string]string

	// ReplyTo is the reply subject for request-reply patterns
	ReplyTo string

	// Ack acknowledges successful message processing
	Ack func() error

	// Nak negatively acknowledges the message for redelivery
	Nak func() error

	// NakWithDelay negatively acknowledges with a custom redelivery delay
	NakWithDelay func(delay time.Duration) error

	// Term terminates message processing (no more redeliveries)
	Term func() error

	// InProgress signals that processing is ongoing (extends ack wait)
	InProgress func() error

	// Metadata from JetStream
	Metadata *MessageMetadata
}

// MessageMetadata contains JetStream message metadata.
type MessageMetadata struct {
	Sequence   uint64
	Stream     string
	Consumer   string
	NumPending uint64
	Timestamp  time.Time
}

// NewSubscriber creates a new NATS subscriber with the given client and configuration.
func NewSubscriber(client *Client, config SubscriberConfig) *Subscriber {
	ctx, cancel := context.WithCancel(context.Background())

	return &Subscriber{
		client:   client,
		config:   config,
		logger:   client.logger.With(zap.String("component", "subscriber")),
		tracer:   otel.Tracer("github.com/nextphoton/shared/pkg/nats/subscriber"),
		handlers: make(map[string]MessageHandler),
		ctx:      ctx,
		cancel:   cancel,
	}
}

// Subscribe creates a subscription to the specified subject with a handler.
// Messages are automatically distributed among subscribers in the same consumer group.
func (s *Subscriber) Subscribe(subject string, handler MessageHandler) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	conn := s.client.Conn()
	if conn == nil || !conn.IsConnected() {
		return fmt.Errorf("NATS connection is not available")
	}

	// Create queue subscription for load balancing within consumer group
	sub, err := conn.QueueSubscribe(subject, s.config.ConsumerGroup, func(msg *nats.Msg) {
		s.handleMessage(msg, handler)
	})
	if err != nil {
		return fmt.Errorf("failed to subscribe to %s: %w", subject, err)
	}

	s.subscriptions = append(s.subscriptions, sub)
	s.handlers[subject] = handler

	s.logger.Info("Subscribed to subject",
		zap.String("subject", subject),
		zap.String("consumer_group", s.config.ConsumerGroup),
	)

	return nil
}

// SubscribePattern subscribes to subjects matching a pattern (e.g., "nextphoton.user.>").
func (s *Subscriber) SubscribePattern(pattern string, handler MessageHandler) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	conn := s.client.Conn()
	if conn == nil || !conn.IsConnected() {
		return fmt.Errorf("NATS connection is not available")
	}

	sub, err := conn.QueueSubscribe(pattern, s.config.ConsumerGroup, func(msg *nats.Msg) {
		s.handleMessage(msg, handler)
	})
	if err != nil {
		return fmt.Errorf("failed to subscribe to pattern %s: %w", pattern, err)
	}

	s.subscriptions = append(s.subscriptions, sub)
	s.handlers[pattern] = handler

	s.logger.Info("Subscribed to pattern",
		zap.String("pattern", pattern),
		zap.String("consumer_group", s.config.ConsumerGroup),
	)

	return nil
}

// SubscribeJetStream creates a JetStream consumer subscription with persistence.
func (s *Subscriber) SubscribeJetStream(streamName, subject string, handler MessageHandler) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	ctx := s.ctx

	// Create durable consumer configuration
	consumerCfg := jetstream.ConsumerConfig{
		Name:          fmt.Sprintf("%s-%s", s.config.ConsumerGroup, sanitizeConsumerName(subject)),
		Durable:       fmt.Sprintf("%s-%s", s.config.ConsumerGroup, sanitizeConsumerName(subject)),
		FilterSubject: subject,
		AckPolicy:     jetstream.AckExplicitPolicy,
		AckWait:       s.config.AckWait,
		MaxDeliver:    s.config.MaxDeliver,
		DeliverPolicy: jetstream.DeliverAllPolicy,
		ReplayPolicy:  jetstream.ReplayInstantPolicy,
	}

	consumer, err := s.client.CreateConsumer(ctx, streamName, consumerCfg)
	if err != nil {
		return fmt.Errorf("failed to create consumer: %w", err)
	}

	// Start consuming messages
	consumeCtx, err := consumer.Consume(func(msg jetstream.Msg) {
		s.handleJetStreamMessage(msg, handler)
	}, jetstream.ConsumeErrHandler(func(consumeCtx jetstream.ConsumeContext, err error) {
		s.logger.Error("JetStream consume error",
			zap.String("stream", streamName),
			zap.String("subject", subject),
			zap.Error(err),
		)
	}))
	if err != nil {
		return fmt.Errorf("failed to start consuming: %w", err)
	}

	s.jsConsumers = append(s.jsConsumers, consumeCtx)
	s.handlers[subject] = handler

	s.logger.Info("JetStream subscription created",
		zap.String("stream", streamName),
		zap.String("subject", subject),
		zap.String("consumer", consumerCfg.Name),
	)

	return nil
}

// handleMessage processes an incoming core NATS message.
func (s *Subscriber) handleMessage(msg *nats.Msg, handler MessageHandler) {
	s.wg.Add(1)
	defer s.wg.Done()

	// Create context with timeout
	ctx, cancel := context.WithTimeout(s.ctx, s.config.AckWait)
	defer cancel()

	// Start trace span
	ctx, span := s.tracer.Start(ctx, "nats.HandleMessage",
		trace.WithAttributes(
			attribute.String("messaging.system", "nats"),
			attribute.String("messaging.destination", msg.Subject),
			attribute.String("messaging.operation", "receive"),
		),
	)
	defer span.End()

	// Parse message
	parsedMsg := s.parseMessage(msg)
	if parsedMsg.Envelope != nil {
		span.SetAttributes(
			attribute.String("messaging.message_id", parsedMsg.Envelope.ID),
			attribute.String("messaging.source", parsedMsg.Envelope.Source),
		)
	}

	// Handle panic recovery
	defer func() {
		if r := recover(); r != nil {
			s.logger.Error("Panic in message handler",
				zap.String("subject", msg.Subject),
				zap.Any("panic", r),
				zap.String("stack", string(debug.Stack())),
			)
			span.RecordError(fmt.Errorf("panic: %v", r))
			span.SetStatus(codes.Error, "handler panic")
		}
	}()

	// Execute handler
	if err := handler(ctx, parsedMsg); err != nil {
		s.logger.Error("Message handler error",
			zap.String("subject", msg.Subject),
			zap.Error(err),
		)
		span.RecordError(err)
		span.SetStatus(codes.Error, "handler error")
		return
	}

	span.SetStatus(codes.Ok, "message processed")
}

// handleJetStreamMessage processes an incoming JetStream message.
func (s *Subscriber) handleJetStreamMessage(msg jetstream.Msg, handler MessageHandler) {
	s.wg.Add(1)
	defer s.wg.Done()

	// Create context with timeout
	ctx, cancel := context.WithTimeout(s.ctx, s.config.AckWait)
	defer cancel()

	// Start trace span
	ctx, span := s.tracer.Start(ctx, "nats.HandleJetStreamMessage",
		trace.WithAttributes(
			attribute.String("messaging.system", "nats-jetstream"),
			attribute.String("messaging.destination", msg.Subject()),
			attribute.String("messaging.operation", "receive"),
		),
	)
	defer span.End()

	// Parse message
	parsedMsg := s.parseJetStreamMessage(msg)
	if parsedMsg.Envelope != nil {
		span.SetAttributes(
			attribute.String("messaging.message_id", parsedMsg.Envelope.ID),
			attribute.String("messaging.source", parsedMsg.Envelope.Source),
		)
	}
	if parsedMsg.Metadata != nil {
		span.SetAttributes(
			attribute.String("messaging.jetstream.stream", parsedMsg.Metadata.Stream),
			attribute.Int64("messaging.jetstream.sequence", int64(parsedMsg.Metadata.Sequence)),
		)
	}

	// Handle panic recovery
	defer func() {
		if r := recover(); r != nil {
			s.logger.Error("Panic in JetStream message handler",
				zap.String("subject", msg.Subject()),
				zap.Any("panic", r),
				zap.String("stack", string(debug.Stack())),
			)
			span.RecordError(fmt.Errorf("panic: %v", r))
			span.SetStatus(codes.Error, "handler panic")
			// Nak the message for redelivery
			_ = msg.Nak()
		}
	}()

	// Execute handler
	if err := handler(ctx, parsedMsg); err != nil {
		s.logger.Error("JetStream message handler error",
			zap.String("subject", msg.Subject()),
			zap.Error(err),
		)
		span.RecordError(err)
		span.SetStatus(codes.Error, "handler error")

		// Nak for redelivery on error
		if nakErr := msg.Nak(); nakErr != nil {
			s.logger.Error("Failed to nak message", zap.Error(nakErr))
		}
		return
	}

	// Auto-ack on success if enabled
	if s.config.EnableAutoAck {
		if ackErr := msg.Ack(); ackErr != nil {
			s.logger.Error("Failed to ack message", zap.Error(ackErr))
			span.RecordError(ackErr)
		}
	}

	span.SetStatus(codes.Ok, "message processed")
}

// parseMessage converts a raw NATS message into our Message type.
func (s *Subscriber) parseMessage(msg *nats.Msg) *Message {
	parsed := &Message{
		Subject: msg.Subject,
		RawData: msg.Data,
		ReplyTo: msg.Reply,
		Headers: make(map[string]string),
		// Core NATS doesn't have ack/nak, but we provide no-op functions
		Ack:        func() error { return nil },
		Nak:        func() error { return nil },
		NakWithDelay: func(delay time.Duration) error { return nil },
		Term:       func() error { return nil },
		InProgress: func() error { return nil },
	}

	// Parse headers
	for key := range msg.Header {
		parsed.Headers[key] = msg.Header.Get(key)
	}

	// Try to parse as event envelope
	var envelope EventEnvelope
	if err := json.Unmarshal(msg.Data, &envelope); err == nil && envelope.ID != "" {
		parsed.Envelope = &envelope
	}

	return parsed
}

// parseJetStreamMessage converts a JetStream message into our Message type.
func (s *Subscriber) parseJetStreamMessage(msg jetstream.Msg) *Message {
	parsed := &Message{
		Subject: msg.Subject(),
		RawData: msg.Data(),
		Headers: make(map[string]string),
		Ack:     msg.Ack,
		Nak:     msg.Nak,
		NakWithDelay: func(delay time.Duration) error {
			return msg.NakWithDelay(delay)
		},
		Term:       msg.Term,
		InProgress: msg.InProgress,
	}

	// Parse headers
	for key := range msg.Headers() {
		parsed.Headers[key] = msg.Headers().Get(key)
	}

	// Try to parse as event envelope
	var envelope EventEnvelope
	if err := json.Unmarshal(msg.Data(), &envelope); err == nil && envelope.ID != "" {
		parsed.Envelope = &envelope
	}

	// Get JetStream metadata
	if meta, err := msg.Metadata(); err == nil {
		parsed.Metadata = &MessageMetadata{
			Sequence:   meta.Sequence.Stream,
			Stream:     meta.Stream,
			Consumer:   meta.Consumer,
			NumPending: meta.NumPending,
			Timestamp:  meta.Timestamp,
		}
	}

	return parsed
}

// Reply sends a response for request-reply patterns.
func (s *Subscriber) Reply(ctx context.Context, msg *Message, data interface{}) error {
	if msg.ReplyTo == "" {
		return fmt.Errorf("message has no reply subject")
	}

	conn := s.client.Conn()
	if conn == nil {
		return fmt.Errorf("connection not available")
	}

	envelope, err := NewEventEnvelope(msg.Subject+".reply", s.config.ServiceName, data)
	if err != nil {
		return fmt.Errorf("failed to create reply envelope: %w", err)
	}
	envelope.WithTracing(ctx)

	payload, err := envelope.Encode()
	if err != nil {
		return fmt.Errorf("failed to encode reply: %w", err)
	}

	return conn.Publish(msg.ReplyTo, payload)
}

// Unsubscribe removes all subscriptions and stops processing.
func (s *Subscriber) Unsubscribe() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Stop JetStream consumers
	for _, consumeCtx := range s.jsConsumers {
		consumeCtx.Stop()
	}
	s.jsConsumers = nil

	// Unsubscribe from core NATS subscriptions
	var errs []error
	for _, sub := range s.subscriptions {
		if err := sub.Unsubscribe(); err != nil {
			errs = append(errs, err)
		}
	}
	s.subscriptions = nil

	if len(errs) > 0 {
		return fmt.Errorf("errors during unsubscribe: %v", errs)
	}

	s.logger.Info("All subscriptions removed")
	return nil
}

// Drain gracefully drains all subscriptions, allowing in-flight messages to complete.
func (s *Subscriber) Drain() error {
	s.mu.Lock()
	defer s.mu.Unlock()

	// Stop accepting new messages
	s.cancel()

	// Drain core NATS subscriptions
	var errs []error
	for _, sub := range s.subscriptions {
		if err := sub.Drain(); err != nil {
			errs = append(errs, err)
		}
	}

	// Stop JetStream consumers
	for _, consumeCtx := range s.jsConsumers {
		consumeCtx.Drain()
	}

	// Wait for in-flight handlers to complete
	done := make(chan struct{})
	go func() {
		s.wg.Wait()
		close(done)
	}()

	// Wait with timeout
	select {
	case <-done:
		s.logger.Info("All handlers completed")
	case <-time.After(30 * time.Second):
		s.logger.Warn("Timeout waiting for handlers to complete")
	}

	if len(errs) > 0 {
		return fmt.Errorf("errors during drain: %v", errs)
	}

	return nil
}

// Close immediately closes all subscriptions.
func (s *Subscriber) Close() {
	s.cancel()
	_ = s.Unsubscribe()
}

// sanitizeConsumerName removes or replaces invalid characters for consumer names.
func sanitizeConsumerName(s string) string {
	result := make([]byte, 0, len(s))
	for i := 0; i < len(s); i++ {
		c := s[i]
		if (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9') || c == '-' || c == '_' {
			result = append(result, c)
		} else if c == '.' || c == '>' || c == '*' {
			result = append(result, '-')
		}
	}
	return string(result)
}

// HandlerFunc is an adapter to allow ordinary functions to be used as MessageHandlers.
type HandlerFunc func(ctx context.Context, msg *Message) error

// Handle implements the MessageHandler interface.
func (f HandlerFunc) Handle(ctx context.Context, msg *Message) error {
	return f(ctx, msg)
}

// MiddlewareFunc is a function that wraps a MessageHandler with additional behavior.
type MiddlewareFunc func(next MessageHandler) MessageHandler

// ChainMiddleware creates a single handler from a chain of middleware.
func ChainMiddleware(handler MessageHandler, middlewares ...MiddlewareFunc) MessageHandler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		handler = middlewares[i](handler)
	}
	return handler
}

// LoggingMiddleware adds structured logging to message handlers.
func LoggingMiddleware(logger *zap.Logger) MiddlewareFunc {
	return func(next MessageHandler) MessageHandler {
		return func(ctx context.Context, msg *Message) error {
			start := time.Now()

			logger.Debug("Processing message",
				zap.String("subject", msg.Subject),
				zap.String("event_id", getEventID(msg)),
			)

			err := next(ctx, msg)

			duration := time.Since(start)
			if err != nil {
				logger.Error("Message processing failed",
					zap.String("subject", msg.Subject),
					zap.String("event_id", getEventID(msg)),
					zap.Duration("duration", duration),
					zap.Error(err),
				)
			} else {
				logger.Debug("Message processed successfully",
					zap.String("subject", msg.Subject),
					zap.String("event_id", getEventID(msg)),
					zap.Duration("duration", duration),
				)
			}

			return err
		}
	}
}

// RecoveryMiddleware adds panic recovery to message handlers.
func RecoveryMiddleware(logger *zap.Logger) MiddlewareFunc {
	return func(next MessageHandler) MessageHandler {
		return func(ctx context.Context, msg *Message) (err error) {
			defer func() {
				if r := recover(); r != nil {
					logger.Error("Panic recovered in message handler",
						zap.String("subject", msg.Subject),
						zap.Any("panic", r),
						zap.String("stack", string(debug.Stack())),
					)
					err = fmt.Errorf("panic: %v", r)
				}
			}()
			return next(ctx, msg)
		}
	}
}

// getEventID extracts the event ID from a message.
func getEventID(msg *Message) string {
	if msg.Envelope != nil {
		return msg.Envelope.ID
	}
	return msg.Headers["X-Event-ID"]
}
