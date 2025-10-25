# Quick Start: Testing Next Photon GraphQL API

## Your API is Working! ✅

Your GraphQL server is running successfully on **http://localhost:963/graphql**

---

## Step 1: Open GraphQL Playground

Open your browser and go to:
```
http://localhost:963/graphql
```

You'll see the GraphQL Playground interface - a powerful tool for testing GraphQL APIs.

---

## Step 2: Test These Queries (In Order)

### Query 1: Health Check (No Auth Required)

Copy and paste this into the left panel:

```graphql
query HealthCheck {
  health
}
```

Click the **Play** button (▶) or press `Ctrl+Enter`

**Expected Result:**
```json
{
  "data": {
    "health": "GraphQL is working! 🚀"
  }
}
```

📸 **Take Screenshot #1** - This shows your API is working!

---

### Query 2: Register a New User (No Auth Required)

```graphql
mutation RegisterUser {
  register(
    email: "john.doe@nextphoton.com"
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

**Expected Result:**
```json
{
  "data": {
    "register": {
      "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "1761403583105_vx54bwazw",
        "email": "john.doe@nextphoton.com",
        "name": "John Doe",
        "roles": ["learner"],
        "emailVerified": false
      }
    }
  }
}
```

**IMPORTANT:** Copy the `access_token` value - you'll need it for the next steps!

📸 **Take Screenshot #2** - This shows user registration working!

---

### Query 3: Add Authorization Header

1. Look at the bottom-left of the playground
2. Click on **"HTTP HEADERS"**
3. Paste this (replace YOUR_TOKEN with the token from Step 2):

```json
{
  "Authorization": "Bearer YOUR_TOKEN_HERE"
}
```

Example:
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxNzYxNDAzNTgzMTA1X3Z4NTRid2F6dyIsImVtYWlsIjoiZGVtb0BuZXh0cGhvdG9uLmNvbSIsInJvbGVzIjpbImxlYXJuZXIiXSwiaWF0IjoxNzYxNDAzNTg1LCJleHAiOjE3NjIwMDgzODV9.aXI0oGCWUz34jkFJ-yEAtuLQY_hzIsOGuJrpHJs8-7w"
}
```

---

### Query 4: Get Your Profile (Requires Auth)

Now with the authorization header set, run:

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

**Expected Result:**
```json
{
  "data": {
    "me": {
      "id": "1761403583105_vx54bwazw",
      "email": "john.doe@nextphoton.com",
      "name": "John Doe",
      "image": null,
      "createdAt": "2025-10-25T14:46:23.105Z",
      "updatedAt": "2025-10-25T14:46:23.105Z",
      "isActive": true,
      "emailVerified": false
    }
  }
}
```

📸 **Take Screenshot #3** - This shows authenticated queries working!

---

### Query 5: Get Current User (Requires Auth)

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

📸 **Take Screenshot #4** - Another authenticated query!

---

### Query 6: List All Users (Requires Auth)

```graphql
query ListUsers {
  users(pagination: { limit: 10, offset: 0 }) {
    users {
      id
      email
      name
      createdAt
      isActive
    }
    pagination {
      totalCount
      currentCount
      hasNextPage
      hasPreviousPage
    }
  }
}
```

📸 **Take Screenshot #5** - Shows pagination working!

---

### Query 7: Login (Alternative to Register)

If you already have an account, you can login:

```graphql
mutation LoginUser {
  login(
    email: "john.doe@nextphoton.com"
    password: "password123"
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

---

## Using Variables (Professional Way)

Instead of hardcoding values, use the **Query Variables** panel:

**Query:**
```graphql
mutation RegisterWithVariables($email: String!, $password: String!, $name: String!, $role: String!) {
  register(
    email: $email
    password: $password
    name: $name
    role: $role
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

**Variables (bottom left, in "QUERY VARIABLES" panel):**
```json
{
  "email": "jane.smith@nextphoton.com",
  "password": "secure123",
  "name": "Jane Smith",
  "role": "educator"
}
```

📸 **Take Screenshot #6** - Professional query with variables!

---

## Available User Roles

When registering, you can use these roles:
- `"learner"` - Student account
- `"educator"` - Teacher account
- `"guardian"` - Parent/Guardian account
- `"admin"` - Administrator account
- `"employee"` - Staff account
- `"intern"` - Intern account

---

## Common Test Scenarios

### Scenario 1: Create Multiple Test Users

```graphql
# Run these one by one

# Educator
mutation {
  register(
    email: "teacher@nextphoton.com"
    password: "teacher123"
    name: "Sarah Johnson"
    role: "educator"
  ) {
    user { id email name roles }
  }
}

# Guardian
mutation {
  register(
    email: "parent@nextphoton.com"
    password: "parent123"
    name: "Michael Brown"
    role: "guardian"
  ) {
    user { id email name roles }
  }
}

# Admin
mutation {
  register(
    email: "admin@nextphoton.com"
    password: "admin123"
    name: "Admin User"
    role: "admin"
  ) {
    user { id email name roles }
  }
}
```

### Scenario 2: Test Full Authentication Flow

```graphql
# 1. Register
mutation Register {
  register(email: "test@nextphoton.com", password: "test123", name: "Test", role: "learner") {
    access_token
    user { id email name }
  }
}

# 2. Login (copy token to headers)
mutation Login {
  login(email: "test@nextphoton.com", password: "test123") {
    access_token
    user { id email name }
  }
}

# 3. Get Profile (with auth header)
query Profile {
  me { id email name isActive }
}

# 4. Logout (with auth header)
mutation Logout {
  logout { message }
}
```

---

## Exploring the Schema

1. Click **"DOCS"** on the right side of the playground
2. You'll see all available queries and mutations
3. Click on any query/mutation to see its parameters and return types
4. This is auto-generated from your GraphQL schema!

---

## Tips for Great Screenshots

### Screenshot Layout:

**Left Side:** Your query
**Right Side:** The response
**Bottom Left:** HTTP Headers (if using auth)
**Top:** The URL bar showing `localhost:963/graphql`

### Recommended Screenshots:

1. ✅ Health check showing API is online
2. ✅ User registration with successful response
3. ✅ Login returning access token
4. ✅ Authenticated query (me/currentUser)
5. ✅ User list with pagination
6. ✅ Query using variables
7. ✅ Documentation explorer (DOCS panel)
8. ✅ Schema explorer showing all types

---

## Troubleshooting

### Error: "Unauthorized" or "Authentication required"
**Solution:** Make sure you've added the Authorization header with your token:
```json
{
  "Authorization": "Bearer YOUR_ACCESS_TOKEN"
}
```

### Error: "User with email already exists"
**Solution:** Use a different email address or login with existing credentials

### Error: "Cannot connect to server"
**Solution:** Make sure your backend is running:
```bash
cd /home/teamzenith/ZenCo/NextPhoton
bun run dev
```

---

## Your API Details

- **GraphQL Endpoint:** http://localhost:963/graphql
- **Backend Port:** 963
- **Frontend:** http://localhost:369
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT tokens (7-day expiration)

---

## Next Steps

1. ✅ Test all queries above
2. ✅ Take 6-8 screenshots showing different features
3. ✅ Explore the DOCS panel to see all available operations
4. ✅ Try creating different user types (learner, educator, guardian, admin)
5. ✅ Test pagination with different limit/offset values

Your GraphQL API is fully functional! 🎉
