// Package nats provides publisher functionality for the NextPhoton messaging system.
// The publisher supports both core NATS and JetStream publishing with retry logic,
// dead letter queue handling, and OpenTelemetry tracing integration.
package nats

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
	"github.com/nats-io/nats.go/jetstream"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/codes"
	"go.opentelemetry.io/otel/trace"
	"go.uber.org/zap"
)

// PublisherConfig holds configuration for the NATS publisher.
type PublisherConfig struct {
	// ServiceName identifies this publisher in traces and logs
	ServiceName string

	// RetryAttempts is the number of retry attempts for failed publishes
	RetryAttempts int

	// RetryDelay is the initial delay between retry attempts
	RetryDelay time.Duration

	// RetryMaxDelay is the maximum delay between retry attempts (for exponential backoff)
	RetryMaxDelay time.Duration

	// EnableDeadLetterQueue enables DLQ for failed messages after all retries
	EnableDeadLetterQueue bool

	// DeadLetterSubject is the subject for dead letter messages
	DeadLetterSubject string

	// DefaultTimeout for publish operations
	DefaultTimeout time.Duration
}

// DefaultPublisherConfig returns sensible defaults for the publisher.
func DefaultPublisherConfig(serviceName string) PublisherConfig {
	return PublisherConfig{
		ServiceName:           serviceName,
		RetryAttempts:         3,
		RetryDelay:            100 * time.Millisecond,
		RetryMaxDelay:         5 * time.Second,
		EnableDeadLetterQueue: true,
		DeadLetterSubject:     "nextphoton.dlq",
		DefaultTimeout:        10 * time.Second,
	}
}

// Publisher handles message publishing to NATS with retry and tracing support.
type Publisher struct {
	client *Client
	config PublisherConfig
	logger *zap.Logger
	tracer trace.Tracer
}

// NewPublisher creates a new NATS publisher with the given client and configuration.
func NewPublisher(client *Client, config PublisherConfig) *Publisher {
	return &Publisher{
		client: client,
		config: config,
		logger: client.logger.With(zap.String("component", "publisher")),
		tracer: otel.Tracer("github.com/nextphoton/shared/pkg/nats/publisher"),
	}
}

// PublishOptions configures individual publish operations.
type PublishOptions struct {
	// Headers are custom headers to attach to the message
	Headers map[string]string

	// Timeout overrides the default publish timeout
	Timeout time.Duration

	// ExpectedStream for JetStream publish (validates message reaches specific stream)
	ExpectedStream string

	// MsgID for JetStream deduplication
	MsgID string

	// SkipRetry disables retry logic for this publish
	SkipRetry bool
}

// Publish sends a message to the specified NATS subject.
// The data is automatically serialized to JSON.
func (p *Publisher) Publish(ctx context.Context, subject string, data interface{}, opts ...PublishOptions) error {
	ctx, span := p.tracer.Start(ctx, "nats.Publish",
		trace.WithAttributes(
			attribute.String("messaging.system", "nats"),
			attribute.String("messaging.destination", subject),
			attribute.String("messaging.operation", "publish"),
		),
	)
	defer span.End()

	// Merge options
	opt := PublishOptions{Timeout: p.config.DefaultTimeout}
	if len(opts) > 0 {
		opt = mergePublishOptions(opt, opts[0])
	}

	// Create event envelope
	envelope, err := NewEventEnvelope(subject, p.config.ServiceName, data)
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "failed to create event envelope")
		return fmt.Errorf("failed to create event envelope: %w", err)
	}
	envelope.WithTracing(ctx)

	// Serialize envelope
	payload, err := envelope.Encode()
	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "failed to encode message")
		return fmt.Errorf("failed to encode message: %w", err)
	}

	span.SetAttributes(
		attribute.String("messaging.message_id", envelope.ID),
		attribute.Int("messaging.message_payload_size_bytes", len(payload)),
	)

	// Build message with headers
	msg := &nats.Msg{
		Subject: subject,
		Data:    payload,
		Header:  nats.Header{},
	}

	// Add trace headers for propagation
	msg.Header.Set("X-Trace-ID", envelope.TraceID)
	msg.Header.Set("X-Span-ID", envelope.SpanID)
	msg.Header.Set("X-Event-ID", envelope.ID)
	msg.Header.Set("X-Event-Type", envelope.Type)
	msg.Header.Set("X-Source", p.config.ServiceName)
	msg.Header.Set("X-Timestamp", envelope.Time.Format(time.RFC3339Nano))

	// Add custom headers
	for k, v := range opt.Headers {
		msg.Header.Set(k, v)
	}

	// Publish with retry logic
	var publishErr error
	attempts := 1
	if !opt.SkipRetry {
		attempts = p.config.RetryAttempts
	}

	for attempt := 1; attempt <= attempts; attempt++ {
		publishErr = p.doPublish(ctx, msg, opt)
		if publishErr == nil {
			p.logger.Debug("Message published successfully",
				zap.String("subject", subject),
				zap.String("event_id", envelope.ID),
				zap.Int("attempt", attempt),
			)
			span.SetStatus(codes.Ok, "message published")
			return nil
		}

		// Log retry
		p.logger.Warn("Publish attempt failed",
			zap.String("subject", subject),
			zap.String("event_id", envelope.ID),
			zap.Int("attempt", attempt),
			zap.Int("max_attempts", attempts),
			zap.Error(publishErr),
		)

		// Calculate backoff delay (exponential)
		if attempt < attempts {
			delay := p.calculateBackoff(attempt)
			span.AddEvent("publish_retry", trace.WithAttributes(
				attribute.Int("attempt", attempt),
				attribute.Int64("delay_ms", delay.Milliseconds()),
			))

			select {
			case <-ctx.Done():
				return ctx.Err()
			case <-time.After(delay):
			}
		}
	}

	// All retries failed - send to dead letter queue if enabled
	if p.config.EnableDeadLetterQueue {
		if dlqErr := p.sendToDeadLetterQueue(ctx, msg, publishErr); dlqErr != nil {
			p.logger.Error("Failed to send message to dead letter queue",
				zap.Error(dlqErr),
				zap.String("original_subject", subject),
			)
		}
	}

	span.RecordError(publishErr)
	span.SetStatus(codes.Error, "publish failed after retries")
	return fmt.Errorf("publish failed after %d attempts: %w", attempts, publishErr)
}

// doPublish performs the actual publish operation.
func (p *Publisher) doPublish(ctx context.Context, msg *nats.Msg, opt PublishOptions) error {
	conn := p.client.Conn()
	if conn == nil || !conn.IsConnected() {
		return fmt.Errorf("NATS connection is not available")
	}

	return conn.PublishMsg(msg)
}

// PublishAsync publishes a message asynchronously without waiting for confirmation.
// Useful for fire-and-forget scenarios where message delivery is not critical.
func (p *Publisher) PublishAsync(ctx context.Context, subject string, data interface{}) {
	go func() {
		if err := p.Publish(ctx, subject, data); err != nil {
			p.logger.Error("Async publish failed",
				zap.String("subject", subject),
				zap.Error(err),
			)
		}
	}()
}

// PublishJetStream publishes a message to JetStream with persistence guarantees.
// Returns a publish acknowledgment with stream sequence number.
func (p *Publisher) PublishJetStream(ctx context.Context, subject string, data interface{}, opts ...PublishOptions) (*jetstream.PubAck, error) {
	ctx, span := p.tracer.Start(ctx, "nats.PublishJetStream",
		trace.WithAttributes(
			attribute.String("messaging.system", "nats-jetstream"),
			attribute.String("messaging.destination", subject),
			attribute.String("messaging.operation", "publish"),
		),
	)
	defer span.End()

	js := p.client.JetStream()
	if js == nil {
		return nil, fmt.Errorf("JetStream is not enabled")
	}

	// Merge options
	opt := PublishOptions{Timeout: p.config.DefaultTimeout}
	if len(opts) > 0 {
		opt = mergePublishOptions(opt, opts[0])
	}

	// Create event envelope
	envelope, err := NewEventEnvelope(subject, p.config.ServiceName, data)
	if err != nil {
		span.RecordError(err)
		return nil, fmt.Errorf("failed to create event envelope: %w", err)
	}
	envelope.WithTracing(ctx)

	// Serialize envelope
	payload, err := envelope.Encode()
	if err != nil {
		span.RecordError(err)
		return nil, fmt.Errorf("failed to encode message: %w", err)
	}

	span.SetAttributes(
		attribute.String("messaging.message_id", envelope.ID),
		attribute.Int("messaging.message_payload_size_bytes", len(payload)),
	)

	// Build JetStream publish options
	var jsOpts []jetstream.PublishOpt
	if opt.MsgID != "" {
		jsOpts = append(jsOpts, jetstream.WithMsgID(opt.MsgID))
	}
	if opt.ExpectedStream != "" {
		jsOpts = append(jsOpts, jetstream.WithExpectStream(opt.ExpectedStream))
	}

	// Publish with retry
	var ack *jetstream.PubAck
	var publishErr error
	attempts := p.config.RetryAttempts
	if opt.SkipRetry {
		attempts = 1
	}

	for attempt := 1; attempt <= attempts; attempt++ {
		ack, publishErr = js.Publish(ctx, subject, payload, jsOpts...)
		if publishErr == nil {
			p.logger.Debug("JetStream message published",
				zap.String("subject", subject),
				zap.String("event_id", envelope.ID),
				zap.String("stream", ack.Stream),
				zap.Uint64("sequence", ack.Sequence),
			)
			span.SetAttributes(
				attribute.String("messaging.jetstream.stream", ack.Stream),
				attribute.Int64("messaging.jetstream.sequence", int64(ack.Sequence)),
			)
			span.SetStatus(codes.Ok, "message published to JetStream")
			return ack, nil
		}

		// Retry with backoff
		if attempt < attempts {
			delay := p.calculateBackoff(attempt)
			select {
			case <-ctx.Done():
				return nil, ctx.Err()
			case <-time.After(delay):
			}
		}
	}

	span.RecordError(publishErr)
	span.SetStatus(codes.Error, "JetStream publish failed")
	return nil, fmt.Errorf("JetStream publish failed: %w", publishErr)
}

// Request performs a synchronous request-reply operation.
// This is useful for RPC-style communication between services.
func (p *Publisher) Request(ctx context.Context, subject string, data interface{}, response interface{}, opts ...PublishOptions) error {
	ctx, span := p.tracer.Start(ctx, "nats.Request",
		trace.WithAttributes(
			attribute.String("messaging.system", "nats"),
			attribute.String("messaging.destination", subject),
			attribute.String("messaging.operation", "request"),
		),
	)
	defer span.End()

	opt := PublishOptions{Timeout: p.config.DefaultTimeout}
	if len(opts) > 0 {
		opt = mergePublishOptions(opt, opts[0])
	}

	// Create request envelope
	envelope, err := NewEventEnvelope(subject, p.config.ServiceName, data)
	if err != nil {
		span.RecordError(err)
		return fmt.Errorf("failed to create request envelope: %w", err)
	}
	envelope.WithTracing(ctx)

	payload, err := envelope.Encode()
	if err != nil {
		span.RecordError(err)
		return fmt.Errorf("failed to encode request: %w", err)
	}

	conn := p.client.Conn()
	if conn == nil || !conn.IsConnected() {
		return fmt.Errorf("NATS connection is not available")
	}

	// Perform request with timeout
	start := time.Now()
	msg, err := conn.RequestWithContext(ctx, subject, payload)
	duration := time.Since(start)

	span.SetAttributes(attribute.Int64("messaging.request.duration_ms", duration.Milliseconds()))

	if err != nil {
		span.RecordError(err)
		span.SetStatus(codes.Error, "request failed")
		return fmt.Errorf("request failed: %w", err)
	}

	// Parse response envelope
	var respEnvelope EventEnvelope
	if err := json.Unmarshal(msg.Data, &respEnvelope); err != nil {
		// Try direct unmarshal if not an envelope
		if err := json.Unmarshal(msg.Data, response); err != nil {
			span.RecordError(err)
			return fmt.Errorf("failed to decode response: %w", err)
		}
		return nil
	}

	// Decode the actual response data
	if err := respEnvelope.Decode(response); err != nil {
		span.RecordError(err)
		return fmt.Errorf("failed to decode response data: %w", err)
	}

	span.SetStatus(codes.Ok, "request completed")
	return nil
}

// sendToDeadLetterQueue sends a failed message to the dead letter queue.
func (p *Publisher) sendToDeadLetterQueue(ctx context.Context, originalMsg *nats.Msg, originalErr error) error {
	dlqMessage := DeadLetterMessage{
		OriginalSubject: originalMsg.Subject,
		OriginalData:    originalMsg.Data,
		Error:           originalErr.Error(),
		Timestamp:       time.Now().UTC(),
		Source:          p.config.ServiceName,
		RetryCount:      p.config.RetryAttempts,
	}

	payload, err := json.Marshal(dlqMessage)
	if err != nil {
		return fmt.Errorf("failed to marshal DLQ message: %w", err)
	}

	conn := p.client.Conn()
	if conn == nil {
		return fmt.Errorf("connection not available")
	}

	err = conn.Publish(p.config.DeadLetterSubject, payload)
	if err != nil {
		return fmt.Errorf("failed to publish to DLQ: %w", err)
	}

	p.logger.Info("Message sent to dead letter queue",
		zap.String("original_subject", originalMsg.Subject),
		zap.String("dlq_subject", p.config.DeadLetterSubject),
		zap.Error(originalErr),
	)

	return nil
}

// calculateBackoff returns the backoff delay for the given attempt number.
// Uses exponential backoff with jitter.
func (p *Publisher) calculateBackoff(attempt int) time.Duration {
	delay := p.config.RetryDelay * time.Duration(1<<uint(attempt-1))
	if delay > p.config.RetryMaxDelay {
		delay = p.config.RetryMaxDelay
	}
	// Add jitter (0-25% of delay)
	jitter := time.Duration(time.Now().UnixNano()%int64(delay/4))
	return delay + jitter
}

// DeadLetterMessage represents a message in the dead letter queue.
type DeadLetterMessage struct {
	// OriginalSubject is the subject the message was intended for
	OriginalSubject string `json:"original_subject"`

	// OriginalData contains the original message payload
	OriginalData []byte `json:"original_data"`

	// Error describes why the message failed
	Error string `json:"error"`

	// Timestamp when the message was sent to DLQ
	Timestamp time.Time `json:"timestamp"`

	// Source service that produced the message
	Source string `json:"source"`

	// RetryCount is how many times delivery was attempted
	RetryCount int `json:"retry_count"`
}

// mergePublishOptions merges two PublishOptions, with the second taking precedence.
func mergePublishOptions(base, override PublishOptions) PublishOptions {
	result := base

	if override.Timeout > 0 {
		result.Timeout = override.Timeout
	}
	if override.ExpectedStream != "" {
		result.ExpectedStream = override.ExpectedStream
	}
	if override.MsgID != "" {
		result.MsgID = override.MsgID
	}
	if override.SkipRetry {
		result.SkipRetry = override.SkipRetry
	}
	if override.Headers != nil {
		if result.Headers == nil {
			result.Headers = make(map[string]string)
		}
		for k, v := range override.Headers {
			result.Headers[k] = v
		}
	}

	return result
}

// PublishBatch publishes multiple messages to different subjects efficiently.
func (p *Publisher) PublishBatch(ctx context.Context, messages []BatchMessage) error {
	ctx, span := p.tracer.Start(ctx, "nats.PublishBatch",
		trace.WithAttributes(
			attribute.Int("messaging.batch_size", len(messages)),
		),
	)
	defer span.End()

	var errs []error
	for i, msg := range messages {
		if err := p.Publish(ctx, msg.Subject, msg.Data, msg.Options); err != nil {
			errs = append(errs, fmt.Errorf("message %d (%s): %w", i, msg.Subject, err))
		}
	}

	if len(errs) > 0 {
		span.SetStatus(codes.Error, fmt.Sprintf("%d messages failed", len(errs)))
		return fmt.Errorf("batch publish had %d failures: %v", len(errs), errs)
	}

	span.SetStatus(codes.Ok, "batch published successfully")
	return nil
}

// BatchMessage represents a message in a batch publish operation.
type BatchMessage struct {
	Subject string
	Data    interface{}
	Options PublishOptions
}
