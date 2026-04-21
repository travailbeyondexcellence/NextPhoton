# NextPhoton Testing Strategy

## Document Version
- **Version**: 1.0.0
- **Last Updated**: January 2026
- **Status**: Canonical Reference

---

## 1. Testing Philosophy

NextPhoton follows a comprehensive testing strategy across all platforms to ensure reliability, maintainability, and confidence in deployments.

### 1.1 Testing Principles

| Principle | Application |
|-----------|-------------|
| **Test Pyramid** | More unit tests, fewer E2E tests |
| **Shift Left** | Test early in development cycle |
| **Automation First** | Automate all repeatable tests |
| **Fast Feedback** | Quick test execution in CI |
| **Isolation** | Tests should be independent |
| **Determinism** | No flaky tests allowed |

### 1.2 Test Coverage Targets

| Layer | Coverage Target |
|-------|-----------------|
| **Unit Tests** | 80%+ |
| **Integration Tests** | 60%+ |
| **E2E Tests** | Critical paths only |

---

## 2. Testing Stack by Platform

### 2.1 Platform Summary

| Platform | Unit Testing | Integration Testing | E2E Testing |
|----------|-------------|-------------------|-------------|
| **Next.js (Web)** | Vitest + Testing Library | Vitest + MSW | Playwright |
| **Desktop (Tauri)** | cargo test + rstest + Vitest | testcontainers | Playwright + WebDriver |
| **Android** | JUnit 5 + MockK + Turbine | Robolectric | Espresso + Kaspresso |
| **iOS/iPadOS** | XCTest + Quick/Nimble | OHHTTPStubs | XCUITest |
| **Go Backend** | testing + testify | testcontainers-go | ginkgo + gomega |

---

## 3. Go Backend Testing

### 3.1 Testing Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **testing (stdlib)** | - | Unit testing |
| **testify** | 1.9.x | Assertions & mocking |
| **gomock** | 1.6.x | Mock generation |
| **testcontainers-go** | 0.29.x | Integration testing |
| **ginkgo** | 2.x | BDD testing |
| **gomega** | 1.x | Matchers |
| **go-sqlmock** | 1.5.x | SQL mocking |
| **httptest (stdlib)** | - | HTTP testing |

### 3.2 Test Structure

```
backend/services/auth-service/
├── internal/
│   ├── service/
│   │   ├── auth_service.go
│   │   └── auth_service_test.go      # Unit tests
│   └── repository/
│       ├── user_repository.go
│       └── user_repository_test.go
├── integration/
│   ├── auth_integration_test.go      # Integration tests
│   └── testcontainers_setup.go
└── e2e/
    └── auth_e2e_test.go              # E2E tests
```

### 3.3 Unit Test Example

```go
// internal/service/auth_service_test.go
package service

import (
    "context"
    "testing"

    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "github.com/nextphoton/auth-service/internal/repository"
)

type MockUserRepository struct {
    mock.Mock
}

func (m *MockUserRepository) FindByEmail(ctx context.Context, email string) (*User, error) {
    args := m.Called(ctx, email)
    return args.Get(0).(*User), args.Error(1)
}

func TestAuthService_Login_Success(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewAuthService(mockRepo, testConfig)

    mockRepo.On("FindByEmail", mock.Anything, "test@example.com").
        Return(&User{ID: "1", Email: "test@example.com", PasswordHash: hashedPassword}, nil)

    // Act
    user, token, err := service.Login(context.Background(), "test@example.com", "password123")

    // Assert
    assert.NoError(t, err)
    assert.NotNil(t, user)
    assert.NotEmpty(t, token)
    mockRepo.AssertExpectations(t)
}

func TestAuthService_Login_InvalidPassword(t *testing.T) {
    // Arrange
    mockRepo := new(MockUserRepository)
    service := NewAuthService(mockRepo, testConfig)

    mockRepo.On("FindByEmail", mock.Anything, "test@example.com").
        Return(&User{ID: "1", Email: "test@example.com", PasswordHash: hashedPassword}, nil)

    // Act
    user, token, err := service.Login(context.Background(), "test@example.com", "wrongpassword")

    // Assert
    assert.Error(t, err)
    assert.Nil(t, user)
    assert.Empty(t, token)
}
```

### 3.4 Integration Test with Testcontainers

```go
// integration/auth_integration_test.go
package integration

import (
    "context"
    "testing"

    "github.com/stretchr/testify/suite"
    "github.com/testcontainers/testcontainers-go"
    "github.com/testcontainers/testcontainers-go/modules/postgres"
)

type AuthIntegrationSuite struct {
    suite.Suite
    pgContainer *postgres.PostgresContainer
    db          *sql.DB
}

func (s *AuthIntegrationSuite) SetupSuite() {
    ctx := context.Background()

    pgContainer, err := postgres.RunContainer(ctx,
        testcontainers.WithImage("postgres:16-alpine"),
        postgres.WithDatabase("testdb"),
        postgres.WithUsername("test"),
        postgres.WithPassword("test"),
    )
    s.Require().NoError(err)
    s.pgContainer = pgContainer

    connStr, err := pgContainer.ConnectionString(ctx)
    s.Require().NoError(err)

    s.db, err = sql.Open("postgres", connStr)
    s.Require().NoError(err)
}

func (s *AuthIntegrationSuite) TearDownSuite() {
    s.db.Close()
    s.pgContainer.Terminate(context.Background())
}

func (s *AuthIntegrationSuite) TestRegisterAndLogin() {
    ctx := context.Background()
    service := NewAuthService(NewUserRepository(s.db), testConfig)

    // Register
    user, err := service.Register(ctx, "John", "john@test.com", "password123")
    s.NoError(err)
    s.Equal("john@test.com", user.Email)

    // Login
    loggedUser, token, err := service.Login(ctx, "john@test.com", "password123")
    s.NoError(err)
    s.Equal(user.ID, loggedUser.ID)
    s.NotEmpty(token)
}

func TestAuthIntegration(t *testing.T) {
    suite.Run(t, new(AuthIntegrationSuite))
}
```

---

## 4. Next.js Web Testing

### 4.1 Testing Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Vitest** | 2.x | Unit & integration testing |
| **Testing Library** | 16.x | Component testing |
| **MSW** | 2.x | API mocking |
| **Playwright** | 1.43.x | E2E testing |
| **@faker-js/faker** | 8.x | Test data generation |

### 4.2 Test Structure

```
frontend/web/
├── src/
│   ├── components/
│   │   ├── SessionCard/
│   │   │   ├── SessionCard.tsx
│   │   │   └── SessionCard.test.tsx
│   │   └── ...
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   └── useAuth.test.ts
│   └── ...
├── tests/
│   ├── integration/
│   │   └── auth.integration.test.tsx
│   └── e2e/
│       ├── auth.spec.ts
│       └── sessions.spec.ts
├── vitest.config.ts
└── playwright.config.ts
```

### 4.3 Component Test Example

```typescript
// src/components/SessionCard/SessionCard.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SessionCard } from './SessionCard'

describe('SessionCard', () => {
  const mockSession = {
    id: '1',
    title: 'Math Session',
    educator: { name: 'John Doe' },
    scheduledStart: new Date('2026-02-01T10:00:00'),
    status: 'scheduled'
  }

  it('renders session information correctly', () => {
    render(<SessionCard session={mockSession} />)

    expect(screen.getByText('Math Session')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText(/Feb 1/)).toBeInTheDocument()
  })

  it('calls onJoin when join button is clicked', async () => {
    const onJoin = vi.fn()
    render(<SessionCard session={mockSession} onJoin={onJoin} />)

    await userEvent.click(screen.getByRole('button', { name: /join/i }))

    expect(onJoin).toHaveBeenCalledWith('1')
  })

  it('shows cancelled badge for cancelled sessions', () => {
    const cancelledSession = { ...mockSession, status: 'cancelled' }
    render(<SessionCard session={cancelledSession} />)

    expect(screen.getByText('Cancelled')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /join/i })).not.toBeInTheDocument()
  })
})
```

### 4.4 MSW Mock Setup

```typescript
// tests/mocks/handlers.ts
import { graphql, HttpResponse } from 'msw'

export const handlers = [
  graphql.query('GetSessions', () => {
    return HttpResponse.json({
      data: {
        sessions: [
          {
            id: '1',
            title: 'Math Session',
            scheduledStart: '2026-02-01T10:00:00Z',
            status: 'scheduled'
          }
        ]
      }
    })
  }),

  graphql.mutation('Login', ({ variables }) => {
    if (variables.email === 'test@example.com' && variables.password === 'password') {
      return HttpResponse.json({
        data: {
          login: {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-jwt-token'
          }
        }
      })
    }
    return HttpResponse.json({
      errors: [{ message: 'Invalid credentials' }]
    })
  })
]
```

### 4.5 Playwright E2E Test

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByText('Welcome back')).toBeVisible()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.fill('[name="email"]', 'wrong@example.com')
    await page.fill('[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    await expect(page.getByText('Invalid email or password')).toBeVisible()
    await expect(page).toHaveURL('/login')
  })

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page).toHaveURL('/login?redirect=/dashboard')
  })
})
```

---

## 5. Android Testing

### 5.1 Testing Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **JUnit 5** | 5.10.x | Unit testing framework |
| **MockK** | 1.13.x | Kotlin mocking |
| **Turbine** | 1.1.x | Flow testing |
| **Robolectric** | 4.11.x | Android unit tests |
| **Espresso** | 3.5.x | UI testing |
| **Compose Test** | 1.6.x | Compose testing |
| **Kaspresso** | 1.5.x | E2E testing |

### 5.2 ViewModel Test Example

```kotlin
// test/presentation/viewmodels/HomeViewModelTest.kt
class HomeViewModelTest {
    @get:Rule
    val mainDispatcherRule = MainDispatcherRule()

    private lateinit var getSessionsUseCase: GetSessionsUseCase
    private lateinit var getAssignmentsUseCase: GetAssignmentsUseCase
    private lateinit var viewModel: HomeViewModel

    @BeforeEach
    fun setup() {
        getSessionsUseCase = mockk()
        getAssignmentsUseCase = mockk()
    }

    @Test
    fun `loadDashboard should update state with sessions and assignments`() = runTest {
        // Arrange
        val sessions = listOf(Session(id = "1", title = "Math"))
        val assignments = listOf(Assignment(id = "1", title = "Homework", isCompleted = false))

        coEvery { getSessionsUseCase() } returns flowOf(sessions)
        coEvery { getAssignmentsUseCase() } returns flowOf(assignments)

        viewModel = HomeViewModel(getSessionsUseCase, getAssignmentsUseCase)

        // Act & Assert
        viewModel.state.test {
            val initialState = awaitItem()
            assertTrue(initialState.isLoading)

            val loadedState = awaitItem()
            assertFalse(loadedState.isLoading)
            assertEquals(1, loadedState.upcomingSessions.size)
            assertEquals(1, loadedState.pendingAssignments.size)
        }
    }

    @Test
    fun `loadDashboard should set error on failure`() = runTest {
        // Arrange
        coEvery { getSessionsUseCase() } returns flow { throw Exception("Network error") }
        coEvery { getAssignmentsUseCase() } returns flowOf(emptyList())

        viewModel = HomeViewModel(getSessionsUseCase, getAssignmentsUseCase)

        // Act & Assert
        viewModel.state.test {
            skipItems(1) // Skip loading state
            val errorState = awaitItem()
            assertEquals("Network error", errorState.error)
        }
    }
}
```

### 5.3 Compose UI Test

```kotlin
// androidTest/presentation/screens/LoginScreenTest.kt
@HiltAndroidTest
class LoginScreenTest {
    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)

    @get:Rule(order = 1)
    val composeTestRule = createAndroidComposeRule<MainActivity>()

    @Before
    fun setup() {
        hiltRule.inject()
    }

    @Test
    fun loginScreen_displaysAllElements() {
        composeTestRule.setContent {
            LoginScreen(onLoginSuccess = {})
        }

        composeTestRule.onNodeWithText("Email").assertIsDisplayed()
        composeTestRule.onNodeWithText("Password").assertIsDisplayed()
        composeTestRule.onNodeWithText("Login").assertIsDisplayed()
    }

    @Test
    fun loginScreen_showsErrorForEmptyFields() {
        composeTestRule.setContent {
            LoginScreen(onLoginSuccess = {})
        }

        composeTestRule.onNodeWithText("Login").performClick()

        composeTestRule.onNodeWithText("Email is required").assertIsDisplayed()
    }
}
```

---

## 6. iOS Testing

### 6.1 Testing Technologies

| Technology | Version | Purpose |
|-----------|---------|---------|
| **XCTest** | - | Unit testing |
| **Quick** | 7.x | BDD testing |
| **Nimble** | 13.x | Matchers |
| **ViewInspector** | 0.9.x | SwiftUI testing |
| **OHHTTPStubs** | 9.x | Network mocking |
| **XCUITest** | - | UI testing |
| **SnapshotTesting** | 1.15.x | Snapshot tests |

### 6.2 ViewModel Test Example

```swift
// NextPhotonTests/Presentation/HomeViewModelTests.swift
import XCTest
import Combine
@testable import NextPhoton

final class HomeViewModelTests: XCTestCase {
    var cancellables: Set<AnyCancellable>!
    var mockGetSessionsUseCase: MockGetSessionsUseCase!
    var mockGetAssignmentsUseCase: MockGetAssignmentsUseCase!
    var viewModel: HomeViewModel!

    override func setUp() {
        super.setUp()
        cancellables = []
        mockGetSessionsUseCase = MockGetSessionsUseCase()
        mockGetAssignmentsUseCase = MockGetAssignmentsUseCase()
    }

    @MainActor
    func testLoadDashboard_Success() async {
        // Arrange
        let sessions = [Session(id: "1", title: "Math")]
        let assignments = [Assignment(id: "1", title: "Homework", isCompleted: false)]

        mockGetSessionsUseCase.result = .success(sessions)
        mockGetAssignmentsUseCase.result = .success(assignments)

        viewModel = HomeViewModel(
            getSessionsUseCase: mockGetSessionsUseCase,
            getAssignmentsUseCase: mockGetAssignmentsUseCase
        )

        // Act
        let expectation = XCTestExpectation(description: "Dashboard loaded")

        viewModel.$state
            .dropFirst()
            .sink { state in
                if !state.isLoading {
                    expectation.fulfill()
                }
            }
            .store(in: &cancellables)

        await fulfillment(of: [expectation], timeout: 1.0)

        // Assert
        XCTAssertFalse(viewModel.state.isLoading)
        XCTAssertEqual(viewModel.state.upcomingSessions.count, 1)
        XCTAssertEqual(viewModel.state.pendingAssignments.count, 1)
    }
}
```

### 6.3 SwiftUI View Test with ViewInspector

```swift
// NextPhotonTests/Presentation/LoginViewTests.swift
import XCTest
import ViewInspector
@testable import NextPhoton

extension LoginView: Inspectable {}

final class LoginViewTests: XCTestCase {
    func testLoginView_DisplaysAllElements() throws {
        let view = LoginView(viewModel: LoginViewModel())

        XCTAssertNoThrow(try view.inspect().find(text: "Email"))
        XCTAssertNoThrow(try view.inspect().find(text: "Password"))
        XCTAssertNoThrow(try view.inspect().find(button: "Login"))
    }

    func testLoginView_ShowsErrorMessage() throws {
        let viewModel = LoginViewModel()
        viewModel.state.error = "Invalid credentials"

        let view = LoginView(viewModel: viewModel)

        XCTAssertNoThrow(try view.inspect().find(text: "Invalid credentials"))
    }
}
```

---

## 7. CI/CD Integration

### 7.1 GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  go-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: test
        ports:
          - 5432:5432
      nats:
        image: nats:latest
        ports:
          - 4222:4222
      redis:
        image: redis:7
        ports:
          - 6379:6379
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-go@v5
        with:
          go-version: '1.22'
      - name: Run tests
        run: |
          cd backend/services
          go test -v -race -coverprofile=coverage.out ./...
      - name: Upload coverage
        uses: codecov/codecov-action@v4
        with:
          files: ./coverage.out

  web-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v1
      - name: Install dependencies
        run: cd frontend/web && bun install
      - name: Run unit tests
        run: cd frontend/web && bun test
      - name: Run E2E tests
        run: cd frontend/web && bun run test:e2e

  android-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'
      - name: Run unit tests
        run: cd frontend/mobile/android && ./gradlew testDebugUnitTest
      - name: Run instrumented tests
        uses: reactivecircus/android-emulator-runner@v2
        with:
          api-level: 34
          script: cd frontend/mobile/android && ./gradlew connectedDebugAndroidTest

  ios-tests:
    runs-on: macos-14
    steps:
      - uses: actions/checkout@v4
      - name: Select Xcode
        run: sudo xcode-select -s /Applications/Xcode_15.2.app
      - name: Run tests
        run: |
          cd frontend/mobile/ios
          xcodebuild test \
            -scheme NextPhoton \
            -destination 'platform=iOS Simulator,name=iPhone 15,OS=17.2'
```

---

## 8. Test Data Management

### 8.1 Factories & Fixtures

| Platform | Tool | Purpose |
|----------|------|---------|
| **Go** | Custom factories | Test data generation |
| **Web** | @faker-js/faker | Fake data |
| **Android** | Custom factories | Test data |
| **iOS** | Custom factories | Test data |

### 8.2 Database Seeding

```go
// backend/testutils/fixtures.go
func SeedTestData(db *sql.DB) error {
    users := []User{
        {ID: "user-1", Email: "learner@test.com", Name: "Test Learner"},
        {ID: "user-2", Email: "educator@test.com", Name: "Test Educator"},
    }

    for _, user := range users {
        if err := insertUser(db, user); err != nil {
            return err
        }
    }

    return nil
}
```

---

## 9. Performance Testing

### 9.1 Load Testing Tools

| Tool | Purpose |
|------|---------|
| **k6** | HTTP load testing |
| **Grafana k6** | Cloud load testing |
| **pprof** | Go profiling |

### 9.2 k6 Load Test Example

```javascript
// tests/load/auth-load.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '30s', target: 50 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01']
  }
}

export default function () {
  const res = http.post('http://api.nextphoton.com/graphql', JSON.stringify({
    query: `mutation { login(email: "test@test.com", password: "test") { token } }`
  }), {
    headers: { 'Content-Type': 'application/json' }
  })

  check(res, {
    'status is 200': (r) => r.status === 200,
    'has token': (r) => JSON.parse(r.body).data?.login?.token
  })

  sleep(1)
}
```

---

This comprehensive testing strategy ensures quality across all NextPhoton platforms through automated testing at every level of the application stack.
