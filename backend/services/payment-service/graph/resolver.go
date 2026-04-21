package graph

import (
	"context"
	"fmt"

	"github.com/nextphoton/payment-service/internal/middleware"
	"github.com/nextphoton/payment-service/internal/service"
)

type Resolver struct {
	PaymentService *service.PaymentService
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

func (r *queryResolver) Transaction(ctx context.Context, id string) (*service.Transaction, error) {
	return r.PaymentService.GetTransaction(ctx, id)
}

func (r *queryResolver) MyTransactions(ctx context.Context, limit *int, offset *int) (*TransactionList, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil { return nil, fmt.Errorf("not authenticated") }
	l, o := 20, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }
	txns, total, err := r.PaymentService.GetTransactionsByUser(ctx, claims.UserID, l, o)
	if err != nil { return nil, err }
	return &TransactionList{Transactions: txns, TotalCount: total}, nil
}

func (r *queryResolver) MyInvoices(ctx context.Context, limit *int, offset *int) (*InvoiceList, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil { return nil, fmt.Errorf("not authenticated") }
	l, o := 20, 0
	if limit != nil { l = *limit }
	if offset != nil { o = *offset }
	invoices, total, err := r.PaymentService.GetInvoicesByUser(ctx, claims.UserID, l, o)
	if err != nil { return nil, err }
	return &InvoiceList{Invoices: invoices, TotalCount: total}, nil
}

func (r *mutationResolver) CreateTransaction(ctx context.Context, input CreateTransactionInput) (*service.Transaction, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil { return nil, fmt.Errorf("not authenticated") }
	t := &service.Transaction{
		UserID: claims.UserID, Type: input.Type, Amount: input.Amount,
		Currency: input.Currency, Description: input.Description,
		ReferenceID: input.ReferenceID, ReferenceType: input.ReferenceType,
	}
	return r.PaymentService.CreateTransaction(ctx, t)
}

func (r *mutationResolver) UpdateTransactionStatus(ctx context.Context, id, status string) (*service.Transaction, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil { return nil, fmt.Errorf("not authenticated") }
	return r.PaymentService.UpdateTransactionStatus(ctx, id, status)
}

func (r *mutationResolver) CreateInvoice(ctx context.Context, input CreateInvoiceInput) (*service.Invoice, error) {
	claims := middleware.GetUserClaims(ctx)
	if claims == nil { return nil, fmt.Errorf("not authenticated") }
	inv := &service.Invoice{
		UserID: claims.UserID, Amount: input.Amount, Tax: input.Tax,
		TotalAmount: input.Amount + input.Tax, DueDate: input.DueDate,
	}
	return r.PaymentService.CreateInvoice(ctx, inv)
}

type TransactionList struct {
	Transactions []*service.Transaction `json:"transactions"`
	TotalCount   int                    `json:"totalCount"`
}

type InvoiceList struct {
	Invoices   []*service.Invoice `json:"invoices"`
	TotalCount int                `json:"totalCount"`
}

type CreateTransactionInput struct {
	Type          string  `json:"type"`
	Amount        float64 `json:"amount"`
	Currency      string  `json:"currency"`
	Description   *string `json:"description"`
	ReferenceID   *string `json:"referenceId"`
	ReferenceType *string `json:"referenceType"`
}

type CreateInvoiceInput struct {
	Amount  float64     `json:"amount"`
	Tax     float64     `json:"tax"`
	DueDate interface{} `json:"dueDate"`
}
