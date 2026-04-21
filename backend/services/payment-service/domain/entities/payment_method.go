// Package entities defines the core domain models for the payment service.
package entities

import (
	"time"
)

// PaymentMethodType identifies the type of payment method
type PaymentMethodType string

const (
	// PaymentMethodTypeCard represents a debit or credit card
	PaymentMethodTypeCard PaymentMethodType = "card"

	// PaymentMethodTypeUPI represents a UPI virtual payment address
	PaymentMethodTypeUPI PaymentMethodType = "upi"

	// PaymentMethodTypeNetBanking represents net banking
	PaymentMethodTypeNetBanking PaymentMethodType = "netbanking"

	// PaymentMethodTypeWallet represents a digital wallet (Paytm, PhonePe, etc.)
	PaymentMethodTypeWallet PaymentMethodType = "wallet"

	// PaymentMethodTypeBankAccount represents a bank account for payouts
	PaymentMethodTypeBankAccount PaymentMethodType = "bank_account"
)

// CardBrand identifies the card network
type CardBrand string

const (
	CardBrandVisa       CardBrand = "visa"
	CardBrandMastercard CardBrand = "mastercard"
	CardBrandAmex       CardBrand = "amex"
	CardBrandRuPay      CardBrand = "rupay"
	CardBrandDiners     CardBrand = "diners"
	CardBrandDiscover   CardBrand = "discover"
	CardBrandUnknown    CardBrand = "unknown"
)

// CardDetails stores card-specific information (tokenized/masked)
type CardDetails struct {
	// Brand is the card network (Visa, Mastercard, etc.)
	Brand CardBrand `json:"brand"`

	// Last4 is the last 4 digits of the card number
	Last4 string `json:"last4"`

	// ExpiryMonth is the card expiry month (1-12)
	ExpiryMonth int `json:"expiryMonth"`

	// ExpiryYear is the card expiry year (4 digits)
	ExpiryYear int `json:"expiryYear"`

	// CardholderName is the name on the card
	CardholderName string `json:"cardholderName,omitempty"`

	// Funding indicates if it's credit, debit, or prepaid
	Funding string `json:"funding,omitempty"`

	// IssuerBank is the issuing bank name if available
	IssuerBank string `json:"issuerBank,omitempty"`

	// Country is the card's country of issuance
	Country string `json:"country,omitempty"`
}

// UPIDetails stores UPI-specific information
type UPIDetails struct {
	// VPA is the virtual payment address (e.g., "user@bank")
	VPA string `json:"vpa"`

	// Handle is the UPI app handle (e.g., "@ybl", "@paytm")
	Handle string `json:"handle,omitempty"`

	// Verified indicates if the VPA has been verified
	Verified bool `json:"verified"`
}

// NetBankingDetails stores net banking information
type NetBankingDetails struct {
	// BankCode is the bank's code
	BankCode string `json:"bankCode"`

	// BankName is the human-readable bank name
	BankName string `json:"bankName"`
}

// WalletDetails stores digital wallet information
type WalletDetails struct {
	// Provider is the wallet provider (paytm, phonepe, etc.)
	Provider string `json:"provider"`

	// Phone is the registered phone number (masked)
	Phone string `json:"phone,omitempty"`

	// Email is the registered email (masked)
	Email string `json:"email,omitempty"`
}

// BankAccountDetails stores bank account information for payouts
type BankAccountDetails struct {
	// AccountNumber is the masked account number (last 4 digits)
	AccountNumberLast4 string `json:"accountNumberLast4"`

	// IFSCCode is the IFSC code for Indian banks
	IFSCCode string `json:"ifscCode"`

	// BankName is the bank name
	BankName string `json:"bankName"`

	// BranchName is the branch name
	BranchName string `json:"branchName,omitempty"`

	// AccountHolderName is the name on the account
	AccountHolderName string `json:"accountHolderName"`

	// AccountType is savings, current, etc.
	AccountType string `json:"accountType"`
}

// PaymentMethod represents a saved payment method for a user.
// Payment methods are securely stored with only tokenized/masked data.
// Actual sensitive data is stored with the payment gateway.
type PaymentMethod struct {
	// ID is the unique identifier for this payment method
	ID string `json:"id"`

	// UserID is the user who owns this payment method
	UserID string `json:"userId"`

	// Type identifies the type of payment method
	Type PaymentMethodType `json:"type"`

	// Gateway is the payment gateway that stores this method
	Gateway PaymentGateway `json:"gateway"`

	// GatewayCustomerID is the customer ID in the payment gateway
	GatewayCustomerID string `json:"gatewayCustomerId,omitempty"`

	// GatewayPaymentMethodID is the payment method ID in the gateway
	GatewayPaymentMethodID string `json:"gatewayPaymentMethodId,omitempty"`

	// Card contains card-specific details (if type is card)
	Card *CardDetails `json:"card,omitempty"`

	// UPI contains UPI-specific details (if type is UPI)
	UPI *UPIDetails `json:"upi,omitempty"`

	// NetBanking contains net banking details (if type is netbanking)
	NetBanking *NetBankingDetails `json:"netBanking,omitempty"`

	// Wallet contains wallet details (if type is wallet)
	Wallet *WalletDetails `json:"wallet,omitempty"`

	// BankAccount contains bank account details (if type is bank_account)
	BankAccount *BankAccountDetails `json:"bankAccount,omitempty"`

	// DisplayName is a user-friendly name for the payment method
	DisplayName string `json:"displayName"`

	// IsDefault indicates if this is the default payment method
	IsDefault bool `json:"isDefault"`

	// IsActive indicates if this payment method is currently usable
	IsActive bool `json:"isActive"`

	// BillingAddress stores the billing address if collected
	BillingAddress *Address `json:"billingAddress,omitempty"`

	// Metadata for additional data
	Metadata map[string]interface{} `json:"metadata,omitempty"`

	// Timestamps
	CreatedAt time.Time  `json:"createdAt"`
	UpdatedAt time.Time  `json:"updatedAt"`
	LastUsedAt *time.Time `json:"lastUsedAt,omitempty"`
}

// Address represents a billing or shipping address
type Address struct {
	Line1      string `json:"line1"`
	Line2      string `json:"line2,omitempty"`
	City       string `json:"city"`
	State      string `json:"state"`
	PostalCode string `json:"postalCode"`
	Country    string `json:"country"`
}

// NewCardPaymentMethod creates a new card payment method
func NewCardPaymentMethod(
	userID string,
	gateway PaymentGateway,
	gatewayCustomerID, gatewayPaymentMethodID string,
	card CardDetails,
) *PaymentMethod {
	now := time.Now()

	displayName := string(card.Brand) + " •••• " + card.Last4

	return &PaymentMethod{
		UserID:                 userID,
		Type:                   PaymentMethodTypeCard,
		Gateway:                gateway,
		GatewayCustomerID:      gatewayCustomerID,
		GatewayPaymentMethodID: gatewayPaymentMethodID,
		Card:                   &card,
		DisplayName:            displayName,
		IsDefault:              false,
		IsActive:               true,
		Metadata:               make(map[string]interface{}),
		CreatedAt:              now,
		UpdatedAt:              now,
	}
}

// NewUPIPaymentMethod creates a new UPI payment method
func NewUPIPaymentMethod(userID string, vpa string, verified bool) *PaymentMethod {
	now := time.Now()

	return &PaymentMethod{
		UserID:      userID,
		Type:        PaymentMethodTypeUPI,
		Gateway:     PaymentGatewayUPI,
		UPI: &UPIDetails{
			VPA:      vpa,
			Verified: verified,
		},
		DisplayName: vpa,
		IsDefault:   false,
		IsActive:    true,
		Metadata:    make(map[string]interface{}),
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// NewBankAccountPaymentMethod creates a new bank account payment method for payouts
func NewBankAccountPaymentMethod(
	userID string,
	gateway PaymentGateway,
	bankAccount BankAccountDetails,
) *PaymentMethod {
	now := time.Now()

	displayName := bankAccount.BankName + " •••• " + bankAccount.AccountNumberLast4

	return &PaymentMethod{
		UserID:      userID,
		Type:        PaymentMethodTypeBankAccount,
		Gateway:     gateway,
		BankAccount: &bankAccount,
		DisplayName: displayName,
		IsDefault:   false,
		IsActive:    true,
		Metadata:    make(map[string]interface{}),
		CreatedAt:   now,
		UpdatedAt:   now,
	}
}

// SetAsDefault marks this payment method as the default
func (pm *PaymentMethod) SetAsDefault() {
	pm.IsDefault = true
	pm.UpdatedAt = time.Now()
}

// Deactivate marks the payment method as inactive
func (pm *PaymentMethod) Deactivate() {
	pm.IsActive = false
	pm.UpdatedAt = time.Now()
}

// RecordUsage updates the last used timestamp
func (pm *PaymentMethod) RecordUsage() {
	now := time.Now()
	pm.LastUsedAt = &now
	pm.UpdatedAt = now
}

// IsExpired checks if a card payment method is expired
func (pm *PaymentMethod) IsExpired() bool {
	if pm.Type != PaymentMethodTypeCard || pm.Card == nil {
		return false
	}

	now := time.Now()
	expiryDate := time.Date(
		pm.Card.ExpiryYear,
		time.Month(pm.Card.ExpiryMonth),
		1, 0, 0, 0, 0, time.UTC,
	).AddDate(0, 1, -1) // Last day of expiry month

	return now.After(expiryDate)
}

// CanBeUsed checks if the payment method can be used for payments
func (pm *PaymentMethod) CanBeUsed() bool {
	if !pm.IsActive {
		return false
	}
	if pm.IsExpired() {
		return false
	}
	return true
}

// GetDisplayDescription returns a user-friendly description
func (pm *PaymentMethod) GetDisplayDescription() string {
	switch pm.Type {
	case PaymentMethodTypeCard:
		if pm.Card != nil {
			return string(pm.Card.Brand) + " ending in " + pm.Card.Last4
		}
	case PaymentMethodTypeUPI:
		if pm.UPI != nil {
			return "UPI: " + pm.UPI.VPA
		}
	case PaymentMethodTypeNetBanking:
		if pm.NetBanking != nil {
			return pm.NetBanking.BankName + " Net Banking"
		}
	case PaymentMethodTypeWallet:
		if pm.Wallet != nil {
			return pm.Wallet.Provider + " Wallet"
		}
	case PaymentMethodTypeBankAccount:
		if pm.BankAccount != nil {
			return pm.BankAccount.BankName + " Account ending in " + pm.BankAccount.AccountNumberLast4
		}
	}
	return pm.DisplayName
}

// EducatorRateProposal represents an educator's proposed rate for their services.
// This requires approval before the educator can be paid at this rate.
type EducatorRateProposal struct {
	// ID is the unique identifier
	ID string `json:"id"`

	// EducatorID is the educator proposing the rate
	EducatorID string `json:"educatorId"`

	// SubjectID is the subject this rate applies to (optional)
	SubjectID string `json:"subjectId,omitempty"`

	// CurrentRate is the educator's current approved rate
	CurrentRate decimal.Decimal `json:"currentRate"`

	// ProposedRate is the new rate being proposed
	ProposedRate decimal.Decimal `json:"proposedRate"`

	// Currency is the currency for the rates
	Currency string `json:"currency"`

	// RateType indicates if it's hourly, per-session, etc.
	RateType string `json:"rateType"`

	// Justification is the educator's reason for the rate change
	Justification string `json:"justification,omitempty"`

	// Status of the proposal
	Status RateProposalStatus `json:"status"`

	// ReviewerID is the admin who reviewed the proposal
	ReviewerID string `json:"reviewerId,omitempty"`

	// ReviewNotes are notes from the reviewer
	ReviewNotes string `json:"reviewNotes,omitempty"`

	// EffectiveFrom is when the new rate takes effect if approved
	EffectiveFrom *time.Time `json:"effectiveFrom,omitempty"`

	// Timestamps
	CreatedAt  time.Time  `json:"createdAt"`
	UpdatedAt  time.Time  `json:"updatedAt"`
	ReviewedAt *time.Time `json:"reviewedAt,omitempty"`
}

// RateProposalStatus represents the status of a rate proposal
type RateProposalStatus string

const (
	RateProposalStatusPending  RateProposalStatus = "pending"
	RateProposalStatusApproved RateProposalStatus = "approved"
	RateProposalStatusRejected RateProposalStatus = "rejected"
)

// NewEducatorRateProposal creates a new rate proposal
func NewEducatorRateProposal(
	educatorID string,
	currentRate, proposedRate decimal.Decimal,
	currency, rateType, justification string,
) *EducatorRateProposal {
	now := time.Now()

	return &EducatorRateProposal{
		EducatorID:    educatorID,
		CurrentRate:   currentRate,
		ProposedRate:  proposedRate,
		Currency:      currency,
		RateType:      rateType,
		Justification: justification,
		Status:        RateProposalStatusPending,
		CreatedAt:     now,
		UpdatedAt:     now,
	}
}

// Approve approves the rate proposal
func (p *EducatorRateProposal) Approve(reviewerID, notes string, effectiveFrom time.Time) {
	now := time.Now()
	p.Status = RateProposalStatusApproved
	p.ReviewerID = reviewerID
	p.ReviewNotes = notes
	p.EffectiveFrom = &effectiveFrom
	p.ReviewedAt = &now
	p.UpdatedAt = now
}

// Reject rejects the rate proposal
func (p *EducatorRateProposal) Reject(reviewerID, notes string) {
	now := time.Now()
	p.Status = RateProposalStatusRejected
	p.ReviewerID = reviewerID
	p.ReviewNotes = notes
	p.ReviewedAt = &now
	p.UpdatedAt = now
}
