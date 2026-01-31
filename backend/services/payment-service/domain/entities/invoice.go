// Package entities defines the core domain models for the payment service.
package entities

import (
	"time"

	"github.com/shopspring/decimal"
)

// InvoiceStatus represents the lifecycle state of an invoice
type InvoiceStatus string

const (
	// InvoiceStatusDraft indicates the invoice is being prepared and not yet finalized
	InvoiceStatusDraft InvoiceStatus = "draft"

	// InvoiceStatusPending indicates the invoice is awaiting payment
	InvoiceStatusPending InvoiceStatus = "pending"

	// InvoiceStatusPaid indicates the invoice has been fully paid
	InvoiceStatusPaid InvoiceStatus = "paid"

	// InvoiceStatusPartiallyPaid indicates the invoice has been partially paid
	InvoiceStatusPartiallyPaid InvoiceStatus = "partially_paid"

	// InvoiceStatusOverdue indicates the invoice payment is past due date
	InvoiceStatusOverdue InvoiceStatus = "overdue"

	// InvoiceStatusCancelled indicates the invoice was cancelled
	InvoiceStatusCancelled InvoiceStatus = "cancelled"

	// InvoiceStatusRefunded indicates the invoice was refunded after payment
	InvoiceStatusRefunded InvoiceStatus = "refunded"
)

// InvoiceType categorizes the purpose of the invoice
type InvoiceType string

const (
	// InvoiceTypeSession is for a single tutoring session
	InvoiceTypeSession InvoiceType = "session"

	// InvoiceTypePackage is for a bundle of sessions
	InvoiceTypePackage InvoiceType = "package"

	// InvoiceTypeSubscription is for recurring subscription payments
	InvoiceTypeSubscription InvoiceType = "subscription"

	// InvoiceTypeCustom is for custom invoices
	InvoiceTypeCustom InvoiceType = "custom"
)

// InvoiceLineItem represents a single item on an invoice
type InvoiceLineItem struct {
	// ID is the unique identifier for this line item
	ID string `json:"id"`

	// Description of the item or service
	Description string `json:"description"`

	// Quantity of items
	Quantity int `json:"quantity"`

	// UnitPrice is the price per unit
	UnitPrice decimal.Decimal `json:"unitPrice"`

	// TotalPrice is quantity * unitPrice
	TotalPrice decimal.Decimal `json:"totalPrice"`

	// SessionID links to a specific session if applicable
	SessionID string `json:"sessionId,omitempty"`

	// SubjectID links to the subject being taught
	SubjectID string `json:"subjectId,omitempty"`

	// Metadata for additional item-specific data
	Metadata map[string]interface{} `json:"metadata,omitempty"`
}

// Invoice represents a payment request sent to a learner or guardian.
// It tracks all charges, discounts, and payment status for educational services.
type Invoice struct {
	// ID is the unique identifier for this invoice
	ID string `json:"id"`

	// InvoiceNumber is the human-readable invoice number (e.g., "INV-2026-00001")
	InvoiceNumber string `json:"invoiceNumber"`

	// Type categorizes this invoice
	Type InvoiceType `json:"type"`

	// Status indicates the current state of the invoice
	Status InvoiceStatus `json:"status"`

	// CustomerID is the user ID of the person/entity being billed
	CustomerID string `json:"customerId"`

	// CustomerType indicates whether the customer is a learner or guardian
	CustomerType string `json:"customerType"`

	// CustomerName for display purposes
	CustomerName string `json:"customerName"`

	// CustomerEmail for sending invoice notifications
	CustomerEmail string `json:"customerEmail"`

	// EducatorID is the user ID of the educator providing services
	EducatorID string `json:"educatorId"`

	// EducatorName for display purposes
	EducatorName string `json:"educatorName"`

	// Currency is the ISO 4217 currency code
	Currency string `json:"currency"`

	// LineItems contains all billable items
	LineItems []InvoiceLineItem `json:"lineItems"`

	// Subtotal is the sum of all line items before tax/discount
	Subtotal decimal.Decimal `json:"subtotal"`

	// TaxRate is the applicable tax percentage (GST for India)
	TaxRate decimal.Decimal `json:"taxRate"`

	// TaxAmount is the calculated tax
	TaxAmount decimal.Decimal `json:"taxAmount"`

	// DiscountAmount is any discount applied
	DiscountAmount decimal.Decimal `json:"discountAmount"`

	// DiscountCode is the promo code used if any
	DiscountCode string `json:"discountCode,omitempty"`

	// TotalAmount is the final payable amount
	TotalAmount decimal.Decimal `json:"totalAmount"`

	// PaidAmount tracks how much has been paid
	PaidAmount decimal.Decimal `json:"paidAmount"`

	// DueAmount is the remaining amount to be paid
	DueAmount decimal.Decimal `json:"dueAmount"`

	// Notes are additional notes for the invoice
	Notes string `json:"notes,omitempty"`

	// Terms are payment terms and conditions
	Terms string `json:"terms,omitempty"`

	// PaymentLink is a URL for online payment
	PaymentLink string `json:"paymentLink,omitempty"`

	// TransactionIDs lists all transactions associated with this invoice
	TransactionIDs []string `json:"transactionIds,omitempty"`

	// Dates
	IssueDate   time.Time  `json:"issueDate"`
	DueDate     time.Time  `json:"dueDate"`
	PaidDate    *time.Time `json:"paidDate,omitempty"`
	CancelledAt *time.Time `json:"cancelledAt,omitempty"`

	// Metadata for additional invoice-specific data
	Metadata map[string]interface{} `json:"metadata,omitempty"`

	// Timestamps
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`

	// Audit fields
	CreatedBy string `json:"createdBy,omitempty"`
}

// NewInvoice creates a new Invoice with the given parameters
func NewInvoice(
	invoiceType InvoiceType,
	customerID, customerType, customerName, customerEmail string,
	educatorID, educatorName string,
	currency string,
	dueDate time.Time,
) *Invoice {
	now := time.Now()

	return &Invoice{
		Type:         invoiceType,
		Status:       InvoiceStatusDraft,
		CustomerID:   customerID,
		CustomerType: customerType,
		CustomerName: customerName,
		CustomerEmail: customerEmail,
		EducatorID:   educatorID,
		EducatorName: educatorName,
		Currency:     currency,
		LineItems:    make([]InvoiceLineItem, 0),
		Subtotal:     decimal.Zero,
		TaxRate:      decimal.Zero,
		TaxAmount:    decimal.Zero,
		DiscountAmount: decimal.Zero,
		TotalAmount:  decimal.Zero,
		PaidAmount:   decimal.Zero,
		DueAmount:    decimal.Zero,
		IssueDate:    now,
		DueDate:      dueDate,
		Metadata:     make(map[string]interface{}),
		CreatedAt:    now,
		UpdatedAt:    now,
	}
}

// AddLineItem adds a new item to the invoice and recalculates totals
func (i *Invoice) AddLineItem(item InvoiceLineItem) {
	item.TotalPrice = item.UnitPrice.Mul(decimal.NewFromInt(int64(item.Quantity)))
	i.LineItems = append(i.LineItems, item)
	i.recalculateTotals()
}

// RemoveLineItem removes an item from the invoice by ID
func (i *Invoice) RemoveLineItem(itemID string) bool {
	for idx, item := range i.LineItems {
		if item.ID == itemID {
			i.LineItems = append(i.LineItems[:idx], i.LineItems[idx+1:]...)
			i.recalculateTotals()
			return true
		}
	}
	return false
}

// ApplyDiscount applies a discount to the invoice
func (i *Invoice) ApplyDiscount(amount decimal.Decimal, code string) {
	i.DiscountAmount = amount
	i.DiscountCode = code
	i.recalculateTotals()
}

// SetTaxRate sets the tax rate and recalculates totals
func (i *Invoice) SetTaxRate(rate decimal.Decimal) {
	i.TaxRate = rate
	i.recalculateTotals()
}

// recalculateTotals updates all computed fields based on line items
func (i *Invoice) recalculateTotals() {
	// Calculate subtotal
	i.Subtotal = decimal.Zero
	for _, item := range i.LineItems {
		i.Subtotal = i.Subtotal.Add(item.TotalPrice)
	}

	// Apply discount
	afterDiscount := i.Subtotal.Sub(i.DiscountAmount)
	if afterDiscount.LessThan(decimal.Zero) {
		afterDiscount = decimal.Zero
	}

	// Calculate tax
	if i.TaxRate.GreaterThan(decimal.Zero) {
		i.TaxAmount = afterDiscount.Mul(i.TaxRate.Div(decimal.NewFromInt(100))).Round(2)
	} else {
		i.TaxAmount = decimal.Zero
	}

	// Calculate total
	i.TotalAmount = afterDiscount.Add(i.TaxAmount)

	// Update due amount
	i.DueAmount = i.TotalAmount.Sub(i.PaidAmount)
	if i.DueAmount.LessThan(decimal.Zero) {
		i.DueAmount = decimal.Zero
	}

	i.UpdatedAt = time.Now()
}

// Finalize moves the invoice from draft to pending status
func (i *Invoice) Finalize() error {
	if i.Status != InvoiceStatusDraft {
		return ErrInvoiceNotDraft
	}
	if len(i.LineItems) == 0 {
		return ErrInvoiceNoItems
	}

	i.Status = InvoiceStatusPending
	i.UpdatedAt = time.Now()
	return nil
}

// RecordPayment records a payment against this invoice
func (i *Invoice) RecordPayment(amount decimal.Decimal, transactionID string) {
	i.PaidAmount = i.PaidAmount.Add(amount)
	i.TransactionIDs = append(i.TransactionIDs, transactionID)

	// Update status based on payment
	if i.PaidAmount.GreaterThanOrEqual(i.TotalAmount) {
		i.Status = InvoiceStatusPaid
		now := time.Now()
		i.PaidDate = &now
		i.DueAmount = decimal.Zero
	} else {
		i.Status = InvoiceStatusPartiallyPaid
		i.DueAmount = i.TotalAmount.Sub(i.PaidAmount)
	}

	i.UpdatedAt = time.Now()
}

// Cancel cancels the invoice
func (i *Invoice) Cancel() error {
	if i.Status == InvoiceStatusPaid {
		return ErrInvoiceAlreadyPaid
	}

	i.Status = InvoiceStatusCancelled
	now := time.Now()
	i.CancelledAt = &now
	i.UpdatedAt = now
	return nil
}

// MarkAsOverdue marks the invoice as overdue
func (i *Invoice) MarkAsOverdue() {
	if i.Status == InvoiceStatusPending || i.Status == InvoiceStatusPartiallyPaid {
		if time.Now().After(i.DueDate) {
			i.Status = InvoiceStatusOverdue
			i.UpdatedAt = time.Now()
		}
	}
}

// IsPaid returns true if the invoice is fully paid
func (i *Invoice) IsPaid() bool {
	return i.Status == InvoiceStatusPaid
}

// IsPayable returns true if the invoice can still be paid
func (i *Invoice) IsPayable() bool {
	return i.Status == InvoiceStatusPending ||
		i.Status == InvoiceStatusPartiallyPaid ||
		i.Status == InvoiceStatusOverdue
}

// Error definitions for invoice operations
var (
	ErrInvoiceNotDraft    = &InvoiceError{Message: "invoice must be in draft status"}
	ErrInvoiceNoItems     = &InvoiceError{Message: "invoice must have at least one line item"}
	ErrInvoiceAlreadyPaid = &InvoiceError{Message: "cannot cancel a paid invoice"}
)

// InvoiceError represents an invoice-related error
type InvoiceError struct {
	Message string
}

func (e *InvoiceError) Error() string {
	return e.Message
}
