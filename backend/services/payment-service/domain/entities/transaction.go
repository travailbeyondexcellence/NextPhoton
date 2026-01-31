// Package entities defines the core domain models for the payment service.
// These entities represent the business concepts and rules for payment processing,
// independent of any infrastructure or framework concerns.
package entities

import (
	"time"

	"github.com/shopspring/decimal"
)

// TransactionStatus represents the lifecycle state of a payment transaction.
// A transaction progresses through various states from initiation to completion.
type TransactionStatus string

const (
	// TransactionStatusPending indicates the transaction has been created but not yet processed
	TransactionStatusPending TransactionStatus = "pending"

	// TransactionStatusProcessing indicates the transaction is being processed by the payment gateway
	TransactionStatusProcessing TransactionStatus = "processing"

	// TransactionStatusCompleted indicates the transaction was successfully completed
	TransactionStatusCompleted TransactionStatus = "completed"

	// TransactionStatusFailed indicates the transaction failed during processing
	TransactionStatusFailed TransactionStatus = "failed"

	// TransactionStatusCancelled indicates the transaction was cancelled by the user or system
	TransactionStatusCancelled TransactionStatus = "cancelled"

	// TransactionStatusRefunded indicates the transaction was fully refunded
	TransactionStatusRefunded TransactionStatus = "refunded"

	// TransactionStatusPartiallyRefunded indicates the transaction was partially refunded
	TransactionStatusPartiallyRefunded TransactionStatus = "partially_refunded"
)

// TransactionType categorizes the type of financial transaction
type TransactionType string

const (
	// TransactionTypePayment represents a payment from learner/guardian to platform
	TransactionTypePayment TransactionType = "payment"

	// TransactionTypeRefund represents a refund from platform to learner/guardian
	TransactionTypeRefund TransactionType = "refund"

	// TransactionTypePayout represents a payout from platform to educator
	TransactionTypePayout TransactionType = "payout"

	// TransactionTypeCommission represents platform commission deduction
	TransactionTypeCommission TransactionType = "commission"
)

// PaymentGateway identifies which payment gateway processed the transaction
type PaymentGateway string

const (
	PaymentGatewayRazorpay PaymentGateway = "razorpay"
	PaymentGatewayStripe   PaymentGateway = "stripe"
	PaymentGatewayUPI      PaymentGateway = "upi"
	PaymentGatewayWallet   PaymentGateway = "wallet" // Internal wallet/credit
)

// Transaction represents a financial transaction in the NextPhoton platform.
// It captures all details about payments between learners/guardians, educators, and the platform.
type Transaction struct {
	// ID is the unique identifier for this transaction (UUID format)
	ID string `json:"id"`

	// ExternalID is the transaction ID from the payment gateway
	ExternalID string `json:"externalId,omitempty"`

	// Type categorizes this transaction (payment, refund, payout, commission)
	Type TransactionType `json:"type"`

	// Status indicates the current state of the transaction
	Status TransactionStatus `json:"status"`

	// Gateway identifies which payment provider processed this transaction
	Gateway PaymentGateway `json:"gateway"`

	// Amount is the transaction amount in the smallest currency unit (paise for INR)
	Amount decimal.Decimal `json:"amount"`

	// Currency is the ISO 4217 currency code (e.g., "INR", "USD")
	Currency string `json:"currency"`

	// PlatformFee is the platform's commission on this transaction
	PlatformFee decimal.Decimal `json:"platformFee"`

	// NetAmount is the amount after deducting platform fee (for payouts)
	NetAmount decimal.Decimal `json:"netAmount"`

	// PayerID is the user ID of the person making the payment
	PayerID string `json:"payerId"`

	// PayerType indicates the type of payer (learner, guardian)
	PayerType string `json:"payerType"`

	// PayeeID is the user ID receiving the payment (educator for sessions)
	PayeeID string `json:"payeeId,omitempty"`

	// PayeeType indicates the type of payee (educator, platform)
	PayeeType string `json:"payeeType,omitempty"`

	// InvoiceID links this transaction to an invoice
	InvoiceID string `json:"invoiceId,omitempty"`

	// SessionID links this transaction to a learning session
	SessionID string `json:"sessionId,omitempty"`

	// PaymentMethodID references the saved payment method used
	PaymentMethodID string `json:"paymentMethodId,omitempty"`

	// Description provides human-readable context for the transaction
	Description string `json:"description,omitempty"`

	// Metadata stores additional gateway-specific or custom data
	Metadata map[string]interface{} `json:"metadata,omitempty"`

	// RefundedAmount tracks the total amount refunded (for partial refunds)
	RefundedAmount decimal.Decimal `json:"refundedAmount"`

	// ParentTransactionID links to the original transaction (for refunds)
	ParentTransactionID string `json:"parentTransactionId,omitempty"`

	// FailureReason stores the error message if the transaction failed
	FailureReason string `json:"failureReason,omitempty"`

	// FailureCode stores the error code from the payment gateway
	FailureCode string `json:"failureCode,omitempty"`

	// Timestamps
	CreatedAt   time.Time  `json:"createdAt"`
	UpdatedAt   time.Time  `json:"updatedAt"`
	CompletedAt *time.Time `json:"completedAt,omitempty"`

	// Audit fields
	CreatedBy string `json:"createdBy,omitempty"`
}

// NewTransaction creates a new Transaction with the given parameters.
// It sets up default values and calculates the platform fee and net amount.
func NewTransaction(
	transactionType TransactionType,
	gateway PaymentGateway,
	amount decimal.Decimal,
	currency string,
	payerID string,
	payerType string,
	platformCommissionPercent float64,
) *Transaction {
	now := time.Now()

	// Calculate platform fee
	commissionRate := decimal.NewFromFloat(platformCommissionPercent / 100)
	platformFee := amount.Mul(commissionRate).Round(2)
	netAmount := amount.Sub(platformFee)

	return &Transaction{
		Type:        transactionType,
		Status:      TransactionStatusPending,
		Gateway:     gateway,
		Amount:      amount,
		Currency:    currency,
		PlatformFee: platformFee,
		NetAmount:   netAmount,
		PayerID:     payerID,
		PayerType:   payerType,
		Metadata:    make(map[string]interface{}),
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// MarkAsProcessing updates the transaction status to processing
func (t *Transaction) MarkAsProcessing() {
	t.Status = TransactionStatusProcessing
	t.UpdatedAt = time.Now()
}

// MarkAsCompleted updates the transaction status to completed
func (t *Transaction) MarkAsCompleted(externalID string) {
	t.Status = TransactionStatusCompleted
	t.ExternalID = externalID
	now := time.Now()
	t.CompletedAt = &now
	t.UpdatedAt = now
}

// MarkAsFailed updates the transaction status to failed with reason
func (t *Transaction) MarkAsFailed(reason, code string) {
	t.Status = TransactionStatusFailed
	t.FailureReason = reason
	t.FailureCode = code
	t.UpdatedAt = time.Now()
}

// MarkAsCancelled updates the transaction status to cancelled
func (t *Transaction) MarkAsCancelled() {
	t.Status = TransactionStatusCancelled
	t.UpdatedAt = time.Now()
}

// CanBeRefunded checks if this transaction is eligible for refund
func (t *Transaction) CanBeRefunded() bool {
	if t.Status != TransactionStatusCompleted && t.Status != TransactionStatusPartiallyRefunded {
		return false
	}
	if t.Type != TransactionTypePayment {
		return false
	}
	// Check if there's remaining amount to refund
	remainingAmount := t.Amount.Sub(t.RefundedAmount)
	return remainingAmount.GreaterThan(decimal.Zero)
}

// GetRefundableAmount returns the maximum amount that can still be refunded
func (t *Transaction) GetRefundableAmount() decimal.Decimal {
	if !t.CanBeRefunded() {
		return decimal.Zero
	}
	return t.Amount.Sub(t.RefundedAmount)
}

// ApplyRefund updates the transaction after a refund is processed
func (t *Transaction) ApplyRefund(refundAmount decimal.Decimal) {
	t.RefundedAmount = t.RefundedAmount.Add(refundAmount)
	if t.RefundedAmount.GreaterThanOrEqual(t.Amount) {
		t.Status = TransactionStatusRefunded
	} else {
		t.Status = TransactionStatusPartiallyRefunded
	}
	t.UpdatedAt = time.Now()
}

// IsSuccessful returns true if the transaction completed successfully
func (t *Transaction) IsSuccessful() bool {
	return t.Status == TransactionStatusCompleted ||
		t.Status == TransactionStatusPartiallyRefunded
}

// IsPending returns true if the transaction is still pending or processing
func (t *Transaction) IsPending() bool {
	return t.Status == TransactionStatusPending ||
		t.Status == TransactionStatusProcessing
}

// IsFinalState returns true if the transaction is in a final state
func (t *Transaction) IsFinalState() bool {
	return t.Status == TransactionStatusCompleted ||
		t.Status == TransactionStatusFailed ||
		t.Status == TransactionStatusCancelled ||
		t.Status == TransactionStatusRefunded
}
