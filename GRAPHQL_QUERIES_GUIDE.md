# GraphQL Playground Testing Guide for Next Photon

## Access GraphQL Playground

Open your browser and navigate to:
```
http://localhost:963/graphql
```

This will open the GraphQL Playground interface where you can test all queries and mutations.

---

## Example Queries to Test

### 1. Health Check (Simplest Query - Start Here!)

```graphql
query HealthCheck {
  health
}
```

**Expected Response:**
```json
{
  "data": {
    "health": "GraphQL is working! 🚀"
  }
}
```

---

### 2. Register a New User

```graphql
mutation RegisterUser {
  register(
    email: "john.doe@example.com"
    password: "password123"
    name: "John Doe"
    role: "learner"
  ) {
    access_token
    user {
      id
      email
      name
      roles
      emailVerified
    }
  }
}
```

**Expected Response:**
```json
{
  "data": {
    "register": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "some-uuid",
        "email": "john.doe@example.com",
        "name": "John Doe",
        "roles": ["learner"],
        "emailVerified": false
      }
    }
  }
}
```

**Save the `access_token` - you'll need it for authenticated queries!**

---

### 3. Login

```graphql
mutation LoginUser {
  login(
    email: "john.doe@example.com"
    password: "password123"
  ) {
    access_token
    user {
      id
      email
      name
      roles
      emailVerified
    }
  }
}
```

---

### 4. Get Current User (Requires Authentication)

**First, add your access token in HTTP Headers:**

Click "HTTP HEADERS" at the bottom of the playground and add:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN_HERE"
}
```

Then run:
```graphql
query GetCurrentUser {
  currentUser {
    id
    email
    name
    roles
    emailVerified
  }
}
```

---

### 5. Get My Profile (Requires Authentication)

```graphql
query GetMyProfile {
  me {
    id
    email
    name
    image
    createdAt
    updatedAt
    isActive
    emailVerified
  }
}
```

---

### 6. Create a New User (Requires Authentication)

```graphql
mutation CreateNewUser {
  createUser(
    input: {
      email: "jane.smith@example.com"
      password: "securepass123"
      name: "Jane Smith"
      image: "https://i.pravatar.cc/150?img=5"
    }
  ) {
    id
    email
    name
    image
    createdAt
    isActive
    emailVerified
  }
}
```

---

### 7. Get All Users with Pagination (Requires Authentication)

```graphql
query GetAllUsers {
  users(
    pagination: {
      limit: 10
      offset: 0
      sortBy: "createdAt"
      sortOrder: "desc"
    }
  ) {
    users {
      id
      email
      name
      createdAt
      isActive
      emailVerified
    }
    pagination {
      totalCount
      currentCount
      hasNextPage
      hasPreviousPage
      nextCursor
      previousCursor
    }
  }
}
```

---

### 8. Get User by ID (Public - No Auth Required)

```graphql
query GetUserById {
  user(id: "USER_ID_HERE") {
    id
    email
    name
    image
    createdAt
    updatedAt
    isActive
    emailVerified
  }
}
```

---

### 9. Logout (Requires Authentication)

```graphql
mutation LogoutUser {
  logout {
    message
  }
}
```

---

## Complete Testing Flow (Recommended Order)

### Step 1: Test Basic Connectivity
```graphql
query HealthCheck {
  health
}
```

### Step 2: Register a Test Account
```graphql
mutation RegisterUser {
  register(
    email: "test@nextphoton.com"
    password: "test123456"
    name: "Test User"
    role: "learner"
  ) {
    access_token
    user {
      id
      email
      name
      roles
    }
  }
}
```

### Step 3: Add Authorization Header
Copy the `access_token` from Step 2 and add to HTTP Headers:
```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

### Step 4: Test Authenticated Queries
```graphql
query TestAuthentication {
  me {
    id
    email
    name
    isActive
  }

  currentUser {
    id
    email
    roles
  }
}
```

### Step 5: Test User Listing
```graphql
query ListUsers {
  users(pagination: { limit: 5 }) {
    users {
      id
      email
      name
      createdAt
    }
    pagination {
      totalCount
      hasNextPage
    }
  }
}
```

---

## Advanced Query Examples

### Register Multiple Users with Different Roles

```graphql
# Educator
mutation RegisterEducator {
  register(
    email: "educator@nextphoton.com"
    password: "educator123"
    name: "Sarah Johnson"
    role: "educator"
  ) {
    access_token
    user { id email name roles }
  }
}

# Guardian
mutation RegisterGuardian {
  register(
    email: "guardian@nextphoton.com"
    password: "guardian123"
    name: "Michael Brown"
    role: "guardian"
  ) {
    access_token
    user { id email name roles }
  }
}

# Admin
mutation RegisterAdmin {
  register(
    email: "admin@nextphoton.com"
    password: "admin123"
    name: "Admin User"
    role: "admin"
  ) {
    access_token
    user { id email name roles }
  }
}
```

---

## Using Query Variables

Instead of hardcoding values, use variables for better reusability:

**Query:**
```graphql
mutation RegisterWithVariables($email: String!, $password: String!, $name: String!, $role: String!) {
  register(email: $email, password: $password, name: $name, role: $role) {
    access_token
    user {
      id
      email
      name
      roles
    }
  }
}
```

**Query Variables (bottom left panel):**
```json
{
  "email": "variable.user@nextphoton.com",
  "password": "variable123",
  "name": "Variable Test User",
  "role": "learner"
}
```

---

## Common Error Scenarios

### 401 Unauthorized
```json
{
  "errors": [
    {
      "message": "Unauthorized",
      "extensions": {
        "code": "UNAUTHENTICATED"
      }
    }
  ]
}
```
**Solution:** Add or update your Authorization header with a valid token.

### User Already Exists
```json
{
  "errors": [
    {
      "message": "User with email already exists"
    }
  ]
}
```
**Solution:** Use a different email address.

---

## Taking Screenshots for Documentation

### Screenshot 1: Health Check
1. Open http://localhost:963/graphql
2. Run the health check query
3. Show successful response
4. Take screenshot

### Screenshot 2: User Registration
1. Run register mutation
2. Show response with access_token
3. Take screenshot

### Screenshot 3: Authenticated Query
1. Add Authorization header
2. Run `me` query
3. Show user profile data
4. Take screenshot

### Screenshot 4: User List with Pagination
1. Run users query with pagination
2. Show list of users and pagination info
3. Take screenshot

---

## Tips for GraphQL Playground

1. **Auto-complete:** Press `Ctrl + Space` to see available fields
2. **Documentation:** Click "DOCS" on the right side to explore the schema
3. **Query History:** Click the clock icon to see previous queries
4. **Prettify:** Click the "Prettify" button to format your query
5. **Copy cURL:** Click "COPY CURL" to get the equivalent curl command

---

## Backend Server Information

- **GraphQL Endpoint:** http://localhost:963/graphql
- **Backend Port:** 963
- **Frontend Port:** 369
- **Database:** PostgreSQL (Neon)
- **Authentication:** JWT with 7-day expiration

---

## Next Steps

1. Test all queries in the recommended order
2. Take screenshots of successful responses
3. Save your access tokens for testing
4. Explore the schema using the DOCS panel
5. Try creating complex queries with multiple fields

Happy testing! 🚀
