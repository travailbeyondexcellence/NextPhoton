package service

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/nextphoton/payment-service/internal/db"
)

type PaymentService struct {
	DB *db.DB
}

func NewPaymentService(database *db.DB) *PaymentService {
	return &PaymentService{DB: database}
}

type Transaction struct {
	ID              string    `json:"id"`
	UserID          string    `json:"userId"`
	Type            string    `json:"type"`
	Amount          float64   `json:"amount"`
	Currency        string    `json:"currency"`
	Status          string    `json:"status"`
	Description     *string   `json:"description"`
	ReferenceID     *string   `json:"referenceId"`
	ReferenceType   *string   `json:"referenceType"`
	PaymentGateway  *string   `json:"paymentGateway"`
	GatewayTxnID    *string   `json:"gatewayTxnId"`
	PlatformFee     float64   `json:"platformFee"`
	EducatorEarning float64   `json:"educatorEarning"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type Invoice struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	InvoiceNo   string    `json:"invoiceNo"`
	Amount      float64   `json:"amount"`
	Tax         float64   `json:"tax"`
	TotalAmount float64   `json:"totalAmount"`
	Status      string    `json:"status"`
	DueDate     time.Time `json:"dueDate"`
	PaidAt      *time.Time `json:"paidAt"`
	CreatedAt   time.Time `json:"createdAt"`
}

func (s *PaymentService) CreateTransaction(ctx context.Context, t *Transaction) (*Transaction, error) {
	t.ID = uuid.New().String()
	t.Status = "pending"
	t.CreatedAt = time.Now()
	t.UpdatedAt = time.Now()

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO transaction (id, "userId", type, amount, currency, status, description,
		"referenceId", "referenceType", "paymentGateway", "gatewayTxnId",
		"platformFee", "educatorEarning", "createdAt", "updatedAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`,
		t.ID, t.UserID, t.Type, t.Amount, t.Currency, t.Status, t.Description,
		t.ReferenceID, t.ReferenceType, t.PaymentGateway, t.GatewayTxnID,
		t.PlatformFee, t.EducatorEarning, t.CreatedAt, t.UpdatedAt)
	if err != nil { return nil, fmt.Errorf("failed to create transaction: %w", err) }
	return t, nil
}

func (s *PaymentService) GetTransaction(ctx context.Context, id string) (*Transaction, error) {
	var t Transaction
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "userId", type, amount, currency, status, description,
		"referenceId", "referenceType", "paymentGateway", "gatewayTxnId",
		"platformFee", "educatorEarning", "createdAt", "updatedAt"
		FROM transaction WHERE id = $1`, id).
		Scan(&t.ID, &t.UserID, &t.Type, &t.Amount, &t.Currency, &t.Status, &t.Description,
			&t.ReferenceID, &t.ReferenceType, &t.PaymentGateway, &t.GatewayTxnID,
			&t.PlatformFee, &t.EducatorEarning, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows { return nil, fmt.Errorf("transaction not found") }
		return nil, err
	}
	return &t, nil
}

func (s *PaymentService) GetTransactionsByUser(ctx context.Context, userID string, limit, offset int) ([]*Transaction, int, error) {
	if limit <= 0 { limit = 20 }
	var total int
	err := s.DB.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM transaction WHERE "userId" = $1`, userID).Scan(&total)
	if err != nil { return nil, 0, err }

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "userId", type, amount, currency, status, description,
		"referenceId", "referenceType", "paymentGateway", "gatewayTxnId",
		"platformFee", "educatorEarning", "createdAt", "updatedAt"
		FROM transaction WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil { return nil, 0, err }
	defer rows.Close()

	var transactions []*Transaction
	for rows.Next() {
		var t Transaction
		if err := rows.Scan(&t.ID, &t.UserID, &t.Type, &t.Amount, &t.Currency, &t.Status, &t.Description,
			&t.ReferenceID, &t.ReferenceType, &t.PaymentGateway, &t.GatewayTxnID,
			&t.PlatformFee, &t.EducatorEarning, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, 0, err
		}
		transactions = append(transactions, &t)
	}
	return transactions, total, nil
}

func (s *PaymentService) UpdateTransactionStatus(ctx context.Context, id, status string) (*Transaction, error) {
	_, err := s.DB.Pool.Exec(ctx,
		`UPDATE transaction SET status = $1, "updatedAt" = $2 WHERE id = $3`,
		status, time.Now(), id)
	if err != nil { return nil, err }
	return s.GetTransaction(ctx, id)
}

func (s *PaymentService) CreateInvoice(ctx context.Context, inv *Invoice) (*Invoice, error) {
	inv.ID = uuid.New().String()
	inv.Status = "pending"
	inv.CreatedAt = time.Now()
	inv.InvoiceNo = fmt.Sprintf("INV-%d", time.Now().UnixMilli())

	_, err := s.DB.Pool.Exec(ctx,
		`INSERT INTO invoice (id, "userId", "invoiceNo", amount, tax, "totalAmount", status, "dueDate", "createdAt")
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
		inv.ID, inv.UserID, inv.InvoiceNo, inv.Amount, inv.Tax, inv.TotalAmount, inv.Status, inv.DueDate, inv.CreatedAt)
	if err != nil { return nil, fmt.Errorf("failed to create invoice: %w", err) }
	return inv, nil
}

func (s *PaymentService) GetInvoicesByUser(ctx context.Context, userID string, limit, offset int) ([]*Invoice, int, error) {
	if limit <= 0 { limit = 20 }
	var total int
	err := s.DB.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM invoice WHERE "userId" = $1`, userID).Scan(&total)
	if err != nil { return nil, 0, err }

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, "userId", "invoiceNo", amount, tax, "totalAmount", status, "dueDate", "paidAt", "createdAt"
		FROM invoice WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset)
	if err != nil { return nil, 0, err }
	defer rows.Close()

	var invoices []*Invoice
	for rows.Next() {
		var inv Invoice
		if err := rows.Scan(&inv.ID, &inv.UserID, &inv.InvoiceNo, &inv.Amount, &inv.Tax, &inv.TotalAmount,
			&inv.Status, &inv.DueDate, &inv.PaidAt, &inv.CreatedAt); err != nil {
			return nil, 0, err
		}
		invoices = append(invoices, &inv)
	}
	return invoices, total, nil
}
