package service

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/nextphoton/user-service/internal/db"
)

type UserService struct {
	DB *db.DB
}

func NewUserService(database *db.DB) *UserService {
	return &UserService{DB: database}
}

// User represents a basic user
type User struct {
	ID            string     `json:"id"`
	Name          string     `json:"name"`
	Email         string     `json:"email"`
	EmailVerified bool       `json:"emailVerified"`
	Image         *string    `json:"image"`
	CreatedAt     time.Time  `json:"createdAt"`
	UpdatedAt     time.Time  `json:"updatedAt"`
}

// Profile types
type LearnerProfile struct {
	ID                string    `json:"id"`
	UserID            string    `json:"userId"`
	FirstName         string    `json:"firstName"`
	LastName          string    `json:"lastName"`
	DateOfBirth       *time.Time `json:"dateOfBirth"`
	PhoneNumber       string    `json:"phoneNumber"`
	CurrentGrade      string    `json:"currentGrade"`
	School            string    `json:"school"`
	LearningStyle     string    `json:"learningStyle"`
	PreferredLanguage string    `json:"preferredLanguage"`
	Subjects          []string  `json:"subjects"`
	TargetExams       []string  `json:"targetExams"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type GuardianProfile struct {
	ID           string    `json:"id"`
	UserID       string    `json:"userId"`
	FirstName    string    `json:"firstName"`
	LastName     string    `json:"lastName"`
	PhoneNumber  string    `json:"phoneNumber"`
	Relationship string    `json:"relationship"`
	Occupation   string    `json:"occupation"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

type EducatorProfile struct {
	ID              string    `json:"id"`
	UserID          string    `json:"userId"`
	FirstName       string    `json:"firstName"`
	LastName        string    `json:"lastName"`
	PhoneNumber     string    `json:"phoneNumber"`
	Qualifications  []string  `json:"qualifications"`
	Specializations []string  `json:"specializations"`
	Experience      int       `json:"experience"`
	Languages       []string  `json:"languages"`
	HourlyRate      *float64  `json:"hourlyRate"`
	AverageRating   *float64  `json:"averageRating"`
	CreatedAt       time.Time `json:"createdAt"`
	UpdatedAt       time.Time `json:"updatedAt"`
}

type AdminProfile struct {
	ID          string    `json:"id"`
	UserID      string    `json:"userId"`
	FirstName   string    `json:"firstName"`
	LastName    string    `json:"lastName"`
	PhoneNumber string    `json:"phoneNumber"`
	AdminLevel  string    `json:"adminLevel"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}

// GetUser gets a user by ID
func (s *UserService) GetUser(ctx context.Context, id string) (*User, error) {
	var u User
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt"
		 FROM "user" WHERE id = $1`, id).
		Scan(&u.ID, &u.Name, &u.Email, &u.EmailVerified, &u.Image, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &u, nil
}

// GetUsers gets all users with pagination
func (s *UserService) GetUsers(ctx context.Context, limit, offset int) ([]*User, int, error) {
	if limit <= 0 {
		limit = 10
	}

	var total int
	err := s.DB.Pool.QueryRow(ctx, `SELECT COUNT(*) FROM "user"`).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT id, name, email, "emailVerified", image, "createdAt", "updatedAt"
		 FROM "user" ORDER BY "createdAt" DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.EmailVerified, &u.Image, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, 0, err
		}
		users = append(users, &u)
	}

	return users, total, nil
}

// GetUsersByRole gets users by role name
func (s *UserService) GetUsersByRole(ctx context.Context, roleName string, limit, offset int) ([]*User, int, error) {
	if limit <= 0 {
		limit = 10
	}

	var total int
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT COUNT(DISTINCT u.id) FROM "user" u
		 JOIN "user_role" ur ON u.id = ur."userId"
		 JOIN "role" r ON ur."roleId" = r.id
		 WHERE r.name = $1`, roleName).Scan(&total)
	if err != nil {
		return nil, 0, err
	}

	rows, err := s.DB.Pool.Query(ctx,
		`SELECT u.id, u.name, u.email, u."emailVerified", u.image, u."createdAt", u."updatedAt"
		 FROM "user" u
		 JOIN "user_role" ur ON u.id = ur."userId"
		 JOIN "role" r ON ur."roleId" = r.id
		 WHERE r.name = $1
		 ORDER BY u."createdAt" DESC LIMIT $2 OFFSET $3`, roleName, limit, offset)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	var users []*User
	for rows.Next() {
		var u User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.EmailVerified, &u.Image, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, 0, err
		}
		users = append(users, &u)
	}

	return users, total, nil
}

// CreateProfile creates a role-specific profile for a user
func (s *UserService) CreateProfile(ctx context.Context, userID, role, fullName string) error {
	parts := strings.SplitN(fullName, " ", 2)
	firstName := parts[0]
	lastName := ""
	if len(parts) > 1 {
		lastName = parts[1]
	}

	now := time.Now()
	id := uuid.New().String()

	switch strings.ToLower(role) {
	case "learner":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "learner_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			"dateOfBirth", "currentGrade", school, "learningStyle", "preferredLanguage",
			subjects, "targetExams", "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', '2000-01-01', '', '', 'visual', 'English', '{}', '{}', $5, $5)`,
			id, userID, firstName, lastName, now)
		return err

	case "guardian":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "guardian_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			relationship, occupation, "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', '', '', $5, $5)`,
			id, userID, firstName, lastName, now)
		return err

	case "educator":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "educator_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			qualifications, specializations, experience, languages, "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', '{}', '{}', 0, '{English}', $5, $5)`,
			id, userID, firstName, lastName, now)
		return err

	case "ecm":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "ecm_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			department, specialization, experience, "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', '', '{}', 0, $5, $5)`,
			id, userID, firstName, lastName, now)
		return err

	case "employee":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "employee_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			"employeeId", department, position, "joiningDate", "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', $6, '', '', $5, $5, $5)`,
			id, userID, firstName, lastName, now, fmt.Sprintf("EMP%d", now.UnixMilli()))
		return err

	case "intern":
		endDate := now.Add(180 * 24 * time.Hour)
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "intern_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			institution, course, year, department, "internshipType", "startDate", "endDate",
			"createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', '', '', '1', '', 'full-time', $5, $6, $5, $5)`,
			id, userID, firstName, lastName, now, endDate)
		return err

	case "admin":
		_, err := s.DB.Pool.Exec(ctx,
			`INSERT INTO "admin_profile" (id, "userId", "firstName", "lastName", "phoneNumber",
			"adminLevel", "createdAt", "updatedAt")
			VALUES ($1, $2, $3, $4, '', 'platform', $5, $5)`,
			id, userID, firstName, lastName, now)
		return err
	}

	return fmt.Errorf("unknown role: %s", role)
}

// UpdateUser updates a user's basic info
func (s *UserService) UpdateUser(ctx context.Context, id string, name, email *string, image *string) (*User, error) {
	setClauses := []string{}
	args := []interface{}{}
	argIdx := 1

	if name != nil {
		setClauses = append(setClauses, fmt.Sprintf(`name = $%d`, argIdx))
		args = append(args, *name)
		argIdx++
	}
	if email != nil {
		setClauses = append(setClauses, fmt.Sprintf(`email = $%d`, argIdx))
		args = append(args, *email)
		argIdx++
	}
	if image != nil {
		setClauses = append(setClauses, fmt.Sprintf(`image = $%d`, argIdx))
		args = append(args, *image)
		argIdx++
	}

	setClauses = append(setClauses, fmt.Sprintf(`"updatedAt" = $%d`, argIdx))
	args = append(args, time.Now())
	argIdx++

	args = append(args, id)

	query := fmt.Sprintf(
		`UPDATE "user" SET %s WHERE id = $%d
		 RETURNING id, name, email, "emailVerified", image, "createdAt", "updatedAt"`,
		strings.Join(setClauses, ", "), argIdx)

	var u User
	err := s.DB.Pool.QueryRow(ctx, query, args...).
		Scan(&u.ID, &u.Name, &u.Email, &u.EmailVerified, &u.Image, &u.CreatedAt, &u.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, fmt.Errorf("user not found")
		}
		return nil, err
	}
	return &u, nil
}

// DeleteUser deletes a user
func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	result, err := s.DB.Pool.Exec(ctx, `DELETE FROM "user" WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if result.RowsAffected() == 0 {
		return fmt.Errorf("user not found")
	}
	return nil
}

// GetLearnerProfile gets a learner profile by user ID
func (s *UserService) GetLearnerProfile(ctx context.Context, userID string) (*LearnerProfile, error) {
	var p LearnerProfile
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "userId", "firstName", "lastName", "dateOfBirth", "phoneNumber",
		 "currentGrade", school, "learningStyle", "preferredLanguage",
		 subjects, "targetExams", "createdAt", "updatedAt"
		 FROM "learner_profile" WHERE "userId" = $1`, userID).
		Scan(&p.ID, &p.UserID, &p.FirstName, &p.LastName, &p.DateOfBirth, &p.PhoneNumber,
			&p.CurrentGrade, &p.School, &p.LearningStyle, &p.PreferredLanguage,
			&p.Subjects, &p.TargetExams, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

// GetEducatorProfile gets an educator profile by user ID
func (s *UserService) GetEducatorProfile(ctx context.Context, userID string) (*EducatorProfile, error) {
	var p EducatorProfile
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "userId", "firstName", "lastName", "phoneNumber",
		 qualifications, specializations, experience, languages,
		 "hourlyRate", "averageRating", "createdAt", "updatedAt"
		 FROM "educator_profile" WHERE "userId" = $1`, userID).
		Scan(&p.ID, &p.UserID, &p.FirstName, &p.LastName, &p.PhoneNumber,
			&p.Qualifications, &p.Specializations, &p.Experience, &p.Languages,
			&p.HourlyRate, &p.AverageRating, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

// GetGuardianProfile gets a guardian profile by user ID
func (s *UserService) GetGuardianProfile(ctx context.Context, userID string) (*GuardianProfile, error) {
	var p GuardianProfile
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "userId", "firstName", "lastName", "phoneNumber",
		 relationship, occupation, "createdAt", "updatedAt"
		 FROM "guardian_profile" WHERE "userId" = $1`, userID).
		Scan(&p.ID, &p.UserID, &p.FirstName, &p.LastName, &p.PhoneNumber,
			&p.Relationship, &p.Occupation, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}

// GetAdminProfile gets an admin profile by user ID
func (s *UserService) GetAdminProfile(ctx context.Context, userID string) (*AdminProfile, error) {
	var p AdminProfile
	err := s.DB.Pool.QueryRow(ctx,
		`SELECT id, "userId", "firstName", "lastName", "phoneNumber",
		 "adminLevel", "createdAt", "updatedAt"
		 FROM "admin_profile" WHERE "userId" = $1`, userID).
		Scan(&p.ID, &p.UserID, &p.FirstName, &p.LastName, &p.PhoneNumber,
			&p.AdminLevel, &p.CreatedAt, &p.UpdatedAt)
	if err != nil {
		if err == pgx.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return &p, nil
}
