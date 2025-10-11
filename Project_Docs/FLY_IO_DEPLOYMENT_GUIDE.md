# Fly.io Deployment Guide for NextPhoton Backend

**Last Updated:** October 11, 2025
**Project:** NextPhoton EduCare Management System
**Target:** Deploy NestJS Backend to Fly.io
**Audience:** Developers new to Fly.io, Docker, NestJS, GraphQL

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Understanding the Architecture](#understanding-the-architecture)
4. [Before You Start - Preparation](#before-you-start---preparation)
5. [Phase 1: Install Fly.io CLI](#phase-1-install-flyio-cli)
6. [Phase 2: Create Fly.io Account](#phase-2-create-flyio-account)
7. [Phase 3: Prepare Production Credentials](#phase-3-prepare-production-credentials)
8. [Phase 4: Initialize Fly.io Application](#phase-4-initialize-flyio-application)
9. [Phase 5: Configure Environment Secrets](#phase-5-configure-environment-secrets)
10. [Phase 6: Run Database Migrations](#phase-6-run-database-migrations)
11. [Phase 7: Deploy to Fly.io](#phase-7-deploy-to-flyio)
12. [Phase 8: Verify Deployment](#phase-8-verify-deployment)
13. [Phase 9: Test Your Backend](#phase-9-test-your-backend)
14. [Phase 10: Connect Frontend](#phase-10-connect-frontend)
15. [Troubleshooting](#troubleshooting)
16. [Monitoring and Maintenance](#monitoring-and-maintenance)
17. [Cost Management](#cost-management)
18. [Next Steps](#next-steps)

---

## Overview

### What This Guide Does

This guide walks you through deploying your NestJS backend to Fly.io, a modern platform for running applications globally. By the end, you'll have:

- ✅ Your backend running on Fly.io in Singapore
- ✅ HTTPS endpoint accessible from anywhere
- ✅ Connected to your Neon PostgreSQL database
- ✅ JWT authentication working
- ✅ GraphQL API accessible
- ✅ Frontend connected to backend

### Deployment Architecture

```
Production Stack:

┌─────────────────────────────────────────┐
│  Users (Worldwide)                      │
└────────────────┬────────────────────────┘
                 │ HTTPS
                 ▼
┌─────────────────────────────────────────┐
│  Frontend - Vercel                      │
│  • Next.js 15 App                       │
│  • Static files served globally         │
│  • URL: https://[your-app].vercel.app   │
└────────────────┬────────────────────────┘
                 │ HTTPS API Calls
                 ▼
┌─────────────────────────────────────────┐
│  Backend - Fly.io (Singapore)           │
│  • NestJS API Server                    │
│  • Apollo GraphQL Server                │
│  • JWT Authentication                   │
│  • Port: 8080 (internal)                │
│  • URL: https://[app-name].fly.dev      │
└────────────────┬────────────────────────┘
                 │ PostgreSQL (SSL)
                 ▼
┌─────────────────────────────────────────┐
│  Database - Neon (Singapore)            │
│  • PostgreSQL 15                        │
│  • Serverless, auto-scaling             │
│  • Region: ap-southeast-1               │
└─────────────────────────────────────────┘
```

### Why Fly.io?

1. **Global Edge Network** - Deploy close to users and databases
2. **Docker-Based** - Consistent environments (dev = prod)
3. **Free Tier** - 3 VMs with 256MB RAM each (perfect for starting)
4. **Auto-Scaling** - Handles traffic spikes automatically
5. **Built-in SSL** - HTTPS by default
6. **Developer-Friendly** - Simple CLI, great docs

### Timeline

- **Phase 1-2:** Install CLI & Account Setup - 10 minutes
- **Phase 3:** Prepare Credentials - 15 minutes
- **Phase 4-5:** Initialize & Configure - 15 minutes
- **Phase 6:** Database Migrations - 5 minutes
- **Phase 7:** Deploy - 10 minutes (first deploy), 3-5 min (subsequent)
- **Phase 8-10:** Verify & Test - 15 minutes

**Total Time:** ~1-1.5 hours for first deployment

---

## Prerequisites

### Required

- ✅ **Linux/macOS Terminal** or **Windows WSL**
- ✅ **Curl** installed (for CLI installation)
- ✅ **Git** installed and configured
- ✅ **Neon Database** with PostgreSQL instance
- ✅ **Vercel Account** with deployed frontend (or URL ready)
- ✅ **Email Address** for Fly.io account
- ✅ **Project Files** (Dockerfile, fly.toml, .dockerignore created)

### Verify Prerequisites

Run these commands to verify:

```bash
# Check curl
curl --version

# Check git
git --version

# Check you're in the right directory
pwd
# Should show: /home/teamzenith/ZenCo/NextPhoton

# Check configuration files exist
ls -la backend/server_NestJS/Dockerfile
ls -la backend/server_NestJS/fly.toml
ls -la backend/server_NestJS/.dockerignore
```

If all files exist, you're ready to proceed!

---

## Understanding the Architecture

### NestJS Backend Overview

Your backend is built with:

**Framework:** NestJS
- Enterprise Node.js framework
- Similar to Angular but for backend
- Uses TypeScript decorators (@Module, @Controller, @Injectable)
- Modular architecture (organize code by features)

**Key Features:**
1. **REST API** - Traditional HTTP endpoints
   - `POST /auth/login` - User login
   - `POST /auth/register` - User registration
   - `GET /users` - Get all users
   - `GET /users/:id` - Get specific user

2. **GraphQL API** - Flexible query language
   - Endpoint: `/graphql`
   - Allows clients to request exactly what they need
   - Built-in playground for testing queries

3. **Authentication** - JWT (JSON Web Tokens)
   - Stateless authentication
   - Tokens expire after 7 days (configurable)
   - Validated on every protected route

4. **Database** - Prisma ORM
   - Type-safe database queries
   - Auto-generated TypeScript types
   - Migrations for schema changes

### How Docker Works Here

**Without Docker (Traditional Deployment):**
```
Your Computer          →    Production Server
Node v20              →    Node v18 (different!)
Bun installed         →    No Bun (missing!)
Works ✅              →    Breaks ❌
```

**With Docker:**
```
Your Computer          →    Fly.io
Build container ✅     →    Run same container ✅
Package everything     →    Everything included ✅
Test locally ✅        →    Works identically ✅
```

**What Dockerfile Does:**
1. Starts with base image (Node.js + Bun)
2. Copies your code
3. Installs dependencies
4. Generates Prisma client
5. Builds NestJS app
6. Creates production-ready image

**What .dockerignore Does:**
- Excludes unnecessary files (node_modules, tests, docs)
- Reduces image size from ~2GB to ~150MB
- Excludes sensitive files (.env)
- Speeds up builds by 50-70%

**What fly.toml Does:**
- Tells Fly.io how to run your container
- Sets region (Singapore)
- Allocates resources (256MB RAM)
- Configures health checks
- Sets auto-stop/start for cost savings

---

## Before You Start - Preparation

### Information You'll Need

Gather these before starting deployment:

#### 1. Production Database URL

**What:** PostgreSQL connection string for production
**Format:** `postgresql://user:password@host:port/database?sslmode=require`

**Options:**

**Option A: Use Existing Neon DB (Create Production Branch)**
```bash
# Steps:
1. Login to Neon dashboard: https://console.neon.tech
2. Select your project (NextPhoton)
3. Click "Branches" in sidebar
4. Click "Create Branch"
5. Name: "production" or "main"
6. Copy connection string (with password)
```

**Option B: Create New Neon Database**
```bash
# Steps:
1. Go to: https://console.neon.tech
2. Click "New Project"
3. Name: "nextphoton-production"
4. Region: Asia Pacific (Singapore) - ap-southeast-1
5. Click "Create Project"
6. Copy connection string (with password)
```

**Save this URL securely!** You'll need it in Phase 5.

#### 2. Production JWT Secret

**What:** Cryptographically secure random string for signing JWT tokens
**Why:** Different from development secret for security

**Generate:**
```bash
# Run this command:
openssl rand -base64 32

# Example output:
# xF8kL3mN9pQ2rT5vW7yZ1aC4bD6eH8jK0lM3nO5pR7sT9
```

**Save this secret!** You'll need it in Phase 5.

#### 3. Vercel Frontend URL

**What:** Your production frontend URL
**Format:** `https://[your-app].vercel.app`

**Find Your URL:**
```bash
# Steps:
1. Login to Vercel: https://vercel.com
2. Select your NextPhoton project
3. Go to "Deployments" tab
4. Click on your production deployment
5. Copy the URL (e.g., https://nextphoton.vercel.app)
```

**Save this URL!** You'll need it in Phase 5 and Phase 10.

#### 4. Choose App Name

**What:** Your backend's name on Fly.io
**Format:** Lowercase letters, numbers, hyphens only
**Examples:**
- `nextphoton-backend`
- `nextphoton-api`
- `nextphoton-prod`

**Tips:**
- Must be globally unique across all Fly.io apps
- Choose something descriptive
- Keep it short (easier to type)

**Save your chosen name!** You'll use it in Phase 4.

---

## Phase 1: Install Fly.io CLI

### What is flyctl?

`flyctl` (also called `fly`) is the Fly.io command-line tool. You'll use it to:
- Deploy your application
- Manage secrets (environment variables)
- View logs and metrics
- SSH into your containers

### Installation

**For Linux/macOS/WSL:**

```bash
# Download and install
curl -L https://fly.io/install.sh | sh

# The script will install to: ~/.fly/bin/flyctl
```

**Expected Output:**
```
Installing flyctl...
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100  1234  100  1234    0     0   5678      0 --:--:-- --:--:-- --:--:--  5678

flyctl was installed successfully to ~/.fly/bin/flyctl
Run 'flyctl version' to verify!
```

### Add to PATH

The installer should automatically add flyctl to your PATH. If not:

```bash
# For Bash users (add to ~/.bashrc)
echo 'export PATH="$HOME/.fly/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# For Zsh users (add to ~/.zshrc)
echo 'export PATH="$HOME/.fly/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# For Fish users (add to ~/.config/fish/config.fish)
echo 'set -gx PATH $HOME/.fly/bin $PATH' >> ~/.config/fish/config.fish
```

### Verify Installation

```bash
# Check version
flyctl version

# Expected output:
# flyctl v0.x.xxx linux/amd64 Commit: abc123 BuildDate: 2025-10-01T00:00:00Z
```

**If you see an error:**
- Restart your terminal
- Check if `~/.fly/bin/flyctl` exists
- Make sure PATH is set correctly

---

## Phase 2: Create Fly.io Account

### Sign Up

**Option 1: Via Browser (Recommended)**

```bash
# Open signup page
flyctl auth signup
```

This opens your browser to: https://fly.io/app/sign-up

**Fill in:**
- Email address
- Password
- Accept terms

**Option 2: If You Already Have Account**

```bash
# Login
flyctl auth login
```

This opens your browser for authentication.

### Verify Login

```bash
# Check authentication status
flyctl auth whoami

# Expected output:
# Email: your-email@example.com
# Accounts: personal
```

### Free Tier Information

**What You Get (Free):**
- ✅ Up to 3 shared-cpu-1x VMs
- ✅ 256MB RAM per VM
- ✅ 3GB persistent volume storage
- ✅ 160GB outbound data transfer/month
- ✅ SSL certificates (automatic)

**No Credit Card Required** for free tier (as of October 2025)

**Cost Estimate:**
- Your backend (1 VM, 256MB): **FREE**
- With auto-stop/start: **FREE** (saves even more)
- Exceeding limits: Charges apply (you'll be notified)

---

## Phase 3: Prepare Production Credentials

### Checklist

Before proceeding, ensure you have:

- [ ] Production database URL (from Neon)
- [ ] Production JWT secret (generated with openssl)
- [ ] Vercel frontend URL
- [ ] Chosen Fly.io app name

### Save to Temporary File (Optional)

For convenience, save these values to a temporary file:

```bash
# Create a temporary file (DO NOT COMMIT TO GIT!)
cd /home/teamzenith/ZenCo/NextPhoton
nano deployment-credentials.txt
```

**Contents:**
```
# Deployment Credentials - DELETE AFTER DEPLOYMENT
# DO NOT COMMIT TO GIT!

DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require
JWT_SECRET=[generated-secret]
CORS_ORIGIN=https://[your-app].vercel.app
FRONTEND_URL=https://[your-app].vercel.app
APP_NAME=[chosen-app-name]
```

**Save and close:** Ctrl+X, then Y, then Enter

**Security Note:** Delete this file after deployment!

---

## Phase 4: Initialize Fly.io Application

### Navigate to Backend Directory

```bash
cd /home/teamzenith/ZenCo/NextPhoton/backend/server_NestJS
```

### Launch Application (Without Deploying)

```bash
flyctl launch --no-deploy
```

**What This Does:**
- Detects Dockerfile
- Creates Fly.io application
- Generates/updates fly.toml
- Does NOT deploy yet (we'll do that in Phase 7)

### Interactive Prompts

You'll be asked several questions. Here's how to answer:

#### Prompt 1: App Name
```
? Choose an app name (leave blank to generate one):
```

**Answer:** Enter your chosen app name (e.g., `nextphoton-backend`)

**If taken:** Try variations like `nextphoton-api-prod`, `nextphoton-backend-2024`

#### Prompt 2: Organization
```
? Choose an organization:
```

**Answer:** Select `personal` (use arrow keys, press Enter)

#### Prompt 3: Region
```
? Choose a region for deployment:
```

**Answer:** Select `Singapore, Singapore (sin)` (use arrow keys, press Enter)

**Why Singapore?** Your Neon database is in Singapore (ap-southeast-1), so deploying there minimizes latency.

#### Prompt 4: Setup PostgreSQL
```
? Would you like to set up a PostgreSQL database now? (y/N)
```

**Answer:** `N` (press N, then Enter)

**Why No?** You already have a Neon database. No need for Fly.io's PostgreSQL.

#### Prompt 5: Setup Redis
```
? Would you like to set up an Upstash Redis database now? (y/N)
```

**Answer:** `N` (press N, then Enter)

**Why No?** Your backend doesn't use Redis for caching (can add later if needed).

#### Prompt 6: Deploy Now
```
? Would you like to deploy now? (y/N)
```

**Answer:** `N` (press N, then Enter)

**Why Not Yet?** We need to set environment secrets first (Phase 5).

### Expected Output

```
Created app 'nextphoton-backend' in organization 'personal'
Admin URL: https://fly.io/apps/nextphoton-backend
Hostname: nextphoton-backend.fly.dev
Wrote config file fly.toml

Your app is ready! Deploy with `flyctl deploy`
```

### Verify Configuration

```bash
# Check fly.toml was updated
cat fly.toml | grep "app ="

# Should show:
# app = 'nextphoton-backend'
```

---

## Phase 5: Configure Environment Secrets

### Why Secrets?

Environment variables contain sensitive data:
- Database passwords
- JWT signing keys
- API keys

**Never put these in fly.toml** (it's committed to git!)

Instead, use Fly.io secrets:
- Encrypted at rest
- Only accessible to your app
- Not visible in dashboard or files

### Set All Secrets at Once

**Option 1: Set Individually (Recommended for First Time)**

```bash
# Set database URL
flyctl secrets set DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Set JWT secret
flyctl secrets set JWT_SECRET="[your-generated-secret]"

# Set CORS origin (your Vercel URL)
flyctl secrets set CORS_ORIGIN="https://[your-app].vercel.app"

# Set frontend URL (same as CORS_ORIGIN)
flyctl secrets set FRONTEND_URL="https://[your-app].vercel.app"

# Set Node environment
flyctl secrets set NODE_ENV="production"
```

**Example (with real values):**
```bash
flyctl secrets set DATABASE_URL="postgresql://neondb_owner:abc123@ep-steep-king.aws.neon.tech/nextphoton_prod?sslmode=require"

flyctl secrets set JWT_SECRET="xF8kL3mN9pQ2rT5vW7yZ1aC4bD6eH8jK0lM3nO5pR7sT9"

flyctl secrets set CORS_ORIGIN="https://nextphoton.vercel.app"

flyctl secrets set FRONTEND_URL="https://nextphoton.vercel.app"

flyctl secrets set NODE_ENV="production"
```

**Option 2: Set Multiple at Once**

```bash
flyctl secrets set \
  DATABASE_URL="postgresql://..." \
  JWT_SECRET="..." \
  CORS_ORIGIN="https://..." \
  FRONTEND_URL="https://..." \
  NODE_ENV="production"
```

### Verify Secrets

```bash
# List all secrets (values are hidden)
flyctl secrets list

# Expected output:
# NAME           DIGEST           CREATED AT
# DATABASE_URL   abc123...        1m ago
# JWT_SECRET     def456...        1m ago
# CORS_ORIGIN    ghi789...        1m ago
# FRONTEND_URL   jkl012...        1m ago
# NODE_ENV       mno345...        1m ago
```

**Note:** You can see secret names, but NOT their values (security feature).

### Update or Remove Secrets

```bash
# Update a secret (sets new value)
flyctl secrets set JWT_SECRET="new-secret-value"

# Remove a secret
flyctl secrets unset JWT_SECRET
```

---

## Phase 6: Run Database Migrations

### What Are Migrations?

Migrations are scripts that:
- Create database tables
- Modify table structure
- Add/remove columns
- Set up relationships

Your Prisma schema defines your database structure. Migrations apply that structure to the actual database.

### Why Run Migrations?

Your production database needs:
- User table
- Role table
- Permission table
- All relationships and constraints

Without migrations, your backend will crash (tables don't exist!).

### Check Current Migrations

```bash
# Navigate to project root
cd /home/teamzenith/ZenCo/NextPhoton

# Check if migrations exist
ls -la shared/prisma/migrations/

# You should see folders like:
# 20250101000000_init/
# 20250102000000_add_roles/
```

### Run Migrations on Production Database

**Step 1: Set DATABASE_URL Temporarily**

```bash
# Export production database URL
export DATABASE_URL="postgresql://[user]:[password]@[host]/[database]?sslmode=require"

# Verify it's set
echo $DATABASE_URL
```

**Step 2: Generate Prisma Client**

```bash
# Generate Prisma client for production schema
bun run prisma:generate

# Expected output:
# ✔ Generated Prisma Client (version x.x.x) to ./node_modules/@prisma/client
```

**Step 3: Deploy Migrations**

```bash
# Apply all migrations to production database
bun run prisma:deployprod

# Expected output:
# PostgreSQL database ... - 1 migration
# The following migration(s) have been applied:
#
# migrations/
#   └─ 20250101000000_init/
#        └─ migration.sql
#
# ✔ All migrations have been successfully applied.
```

**Step 4: Verify Migration**

```bash
# Open Prisma Studio to verify tables
bun run prisma:studio

# Opens browser at: http://localhost:5555
# You should see: User, Role, Permission tables
```

**Alternative: Verify with SQL**

```bash
# Use psql to check tables
psql "$DATABASE_URL" -c "\dt"

# Expected output:
# List of relations
#  Schema |     Name      | Type  |     Owner
# --------+---------------+-------+----------------
#  public | User          | table | neondb_owner
#  public | Role          | table | neondb_owner
#  public | Permission    | table | neondb_owner
```

### Troubleshooting Migrations

**Error: "Environment variable not found: DATABASE_URL"**
```bash
# Solution: Export DATABASE_URL again
export DATABASE_URL="postgresql://..."
```

**Error: "Can't reach database server"**
```bash
# Check:
# 1. Database URL is correct
# 2. Database is running (check Neon dashboard)
# 3. Network connection is stable
# 4. Firewall isn't blocking connection
```

**Error: "Migration already applied"**
```bash
# This is OK! It means migrations were already run.
# Prisma tracks which migrations have been applied.
```

---

## Phase 7: Deploy to Fly.io

### Pre-Deployment Checklist

Before deploying, verify:

- [ ] Secrets are set (`flyctl secrets list`)
- [ ] Database migrations completed
- [ ] You're in backend directory (`pwd` shows `.../backend/server_NestJS`)
- [ ] Dockerfile exists (`ls Dockerfile`)
- [ ] fly.toml has correct app name (`cat fly.toml | grep app`)

### Deploy

```bash
# Deploy to Fly.io
flyctl deploy
```

### What Happens During Deploy

**Phase 1: Build Docker Image (2-5 minutes)**
```
==> Building image
--> Building image with Docker
[+] Building 123.4s (25/25) FINISHED
 => [builder 1/8] FROM docker.io/oven/bun:1.1.38-debian
 => [builder 2/8] COPY package.json bun.lockb ./
 => [builder 3/8] COPY backend/server_NestJS/package.json backend/server_NestJS/
 => [builder 4/8] RUN cd backend/server_NestJS && bun install --frozen-lockfile
 => [builder 5/8] RUN bunx prisma generate --schema=shared/prisma/schema
 => [builder 6/8] COPY backend/server_NestJS ./backend/server_NestJS
 => [builder 7/8] RUN cd backend/server_NestJS && bun run build
 => [runner 1/6] COPY --from=builder /app/package.json /app/bun.lockb ./
 => [runner 2/6] RUN cd backend/server_NestJS && bun install --production
 => [runner 3/6] COPY --from=builder /app/shared ./shared
 => [runner 4/6] RUN bunx prisma generate --schema=shared/prisma/schema
 => [runner 5/6] COPY --from=builder /app/backend/server_NestJS/dist ./backend/
--> Building image done
```

**Phase 2: Push Image (30-60 seconds)**
```
==> Pushing image to fly
--> Pushing image done
```

**Phase 3: Deploy to VM (30-60 seconds)**
```
==> Creating release
--> Release created (version 1)
==> Deploying to Singapore (sin)
Monitoring deployment...
  1 desired, 1 placed, 1 healthy, 0 unhealthy [health checks: 1 total, 1 passing]
--> Deployment successful! 🎉
```

### Expected Output (Success)

```
Watch your app at https://fly.io/apps/nextphoton-backend/monitoring

Visit your newly deployed app at https://nextphoton-backend.fly.dev/
```

### Deployment Time

- **First deployment:** 3-5 minutes (builds everything from scratch)
- **Subsequent deployments:** 1-3 minutes (uses cached layers)

### Troubleshooting Deploy

**Error: "Could not find app"**
```bash
# Solution: Make sure you ran flyctl launch first
flyctl launch --no-deploy
```

**Error: "Invalid Docker image"**
```bash
# Check Dockerfile exists
ls -la Dockerfile

# Check Dockerfile syntax
docker build -t test .  # Only if you have Docker installed
```

**Error: "Build failed"**
```bash
# Check build logs for specific error
# Common issues:
# - Missing dependencies in package.json
# - TypeScript compilation errors
# - Prisma schema errors

# Fix errors, then deploy again
flyctl deploy
```

**Error: "Health check failed"**
```bash
# Your app started but health check is failing
# Check logs:
flyctl logs

# Common causes:
# - App crashed on startup
# - Wrong port (should be 8080)
# - Database connection failed (check DATABASE_URL secret)
```

---

## Phase 8: Verify Deployment

### Check Application Status

```bash
# View app status
flyctl status

# Expected output:
# App
#   Name     = nextphoton-backend
#   Owner    = personal
#   Hostname = nextphoton-backend.fly.dev
#   Platform = machines
#
# Machines
# MACHINE ID    STATE   REGION  HEALTH CHECKS   LAST UPDATED
# 12345678      started sin     1 total, 1 passing  1m ago
```

**Key Fields:**
- **STATE:** Should be `started`
- **HEALTH CHECKS:** Should be `1 total, 1 passing`
- **REGION:** Should be `sin` (Singapore)

### View Logs

```bash
# Stream live logs
flyctl logs

# Expected output (healthy app):
# 2025-10-11T10:30:00Z app[12345678] sin [info] 🚀 Server ready at http://0.0.0.0:8080
# 2025-10-11T10:30:00Z app[12345678] sin [info] 🚀 GraphQL Playground: http://0.0.0.0:8080/graphql
```

**Look for:**
- ✅ "Server ready at http://0.0.0.0:8080"
- ✅ "GraphQL Playground: http://0.0.0.0:8080/graphql"
- ❌ No error messages
- ❌ No "Can't reach database" errors

### Test Root Endpoint

```bash
# Test if app responds
curl https://nextphoton-backend.fly.dev/

# Expected output (if you have root route):
# {"message": "NextPhoton Backend API", "status": "ok"}

# Or (if no root route):
# {"statusCode": 404, "message": "Cannot GET /"}
```

**Note:** 404 is OK if you don't have a root route. The important thing is the app responds.

### Check Machine Details

```bash
# View detailed machine info
flyctl machine list

# Expected output:
# ID          NAME    STATE   REGION  IMAGE                           CREATED
# 12345678    xyz     started sin     registry.fly.io/nextphoton...   2m ago
```

### SSH into Container (Optional)

```bash
# SSH into running container
flyctl ssh console

# You're now inside the container!
# Check environment:
echo $NODE_ENV  # Should be: production
echo $PORT      # Should be: 8080

# Check if app is running:
ps aux | grep node

# Exit:
exit
```

---

## Phase 9: Test Your Backend

### Test 1: Health Check

```bash
# Test root endpoint
curl https://nextphoton-backend.fly.dev/

# Should return some response (even 404 is OK)
```

### Test 2: GraphQL Playground

**Open in Browser:**
```
https://nextphoton-backend.fly.dev/graphql
```

**You should see:** GraphQL Playground interface

**Try a query:**
```graphql
query {
  __typename
}
```

**Expected result:**
```json
{
  "data": {
    "__typename": "Query"
  }
}
```

**This confirms:** GraphQL server is running!

### Test 3: Authentication Endpoint

**Test Login (Should fail without credentials):**

```bash
curl -X POST https://nextphoton-backend.fly.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "wrongpassword"}'

# Expected response:
# {"statusCode": 401, "message": "Unauthorized"}
```

**This is GOOD!** It means:
- ✅ Auth endpoint is accessible
- ✅ Validation is working
- ✅ JWT strategy is active

### Test 4: Create Test User (If Seeded)

If you ran seed scripts:

```bash
# Try logging in with seeded user
curl -X POST https://nextphoton-backend.fly.dev/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@nextphoton.com", "password": "admin123"}'

# Expected response (if user exists):
# {
#   "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
#   "user": {
#     "id": "abc123",
#     "email": "admin@nextphoton.com",
#     "name": "Admin User"
#   }
# }
```

**Got a token?** Authentication is working! 🎉

### Test 5: Protected Endpoint

```bash
# Try accessing protected route without token
curl https://nextphoton-backend.fly.dev/users

# Expected response:
# {"statusCode": 401, "message": "Unauthorized"}

# Try with valid token (from Test 4)
curl https://nextphoton-backend.fly.dev/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Expected response:
# [
#   {"id": "1", "email": "admin@nextphoton.com", "name": "Admin User"}
# ]
```

**This confirms:**
- ✅ JWT authentication working
- ✅ Guards protecting routes
- ✅ Database queries working

---

## Phase 10: Connect Frontend

### Update Vercel Environment Variables

**Step 1: Go to Vercel Dashboard**

1. Visit: https://vercel.com
2. Select your NextPhoton project
3. Click "Settings"
4. Click "Environment Variables"

**Step 2: Add Backend URL**

Add these variables:

| Name | Value | Environment |
|------|-------|-------------|
| `NEXT_PUBLIC_API_URL` | `https://nextphoton-backend.fly.dev` | Production |
| `NEXT_PUBLIC_GRAPHQL_URL` | `https://nextphoton-backend.fly.dev/graphql` | Production |

**Step 3: Save**

Click "Save" for each variable.

### Redeploy Frontend

**Option 1: Via Vercel Dashboard**

1. Go to "Deployments" tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"
4. Check "Use existing Build Cache"
5. Click "Redeploy"

**Option 2: Via Git Push**

```bash
# Make a small change (e.g., add comment to README)
cd /home/teamzenith/ZenCo/NextPhoton
echo "\n# Updated backend URL" >> README.md

# Commit and push
git add README.md
git commit -m "Update: Connect to Fly.io backend"
git push origin main
```

Vercel auto-deploys on push to main branch.

### Wait for Deployment

Monitor deployment:
- Vercel dashboard shows progress
- Usually takes 2-3 minutes

### Test End-to-End

**Step 1: Open Frontend**

Visit: `https://nextphoton.vercel.app` (your URL)

**Step 2: Open DevTools**

Press F12 or Right-click → Inspect → Console tab

**Step 3: Try Login**

1. Navigate to login page
2. Enter credentials
3. Click "Login"

**Step 4: Check Network Tab**

In DevTools:
1. Go to Network tab
2. Filter: "auth/login"
3. Click the request
4. Check:
   - **Request URL:** Should be `https://nextphoton-backend.fly.dev/auth/login`
   - **Status:** Should be `200 OK` (if credentials correct)
   - **Response:** Should have `access_token`

**Step 5: Check Console**

No CORS errors! If you see errors like:
```
Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy
```

**Solution:** Check CORS_ORIGIN secret is set correctly:
```bash
flyctl secrets list
# Make sure CORS_ORIGIN = https://nextphoton.vercel.app
```

### Verify JWT Flow

**Test Protected Route:**

1. After logging in, navigate to dashboard
2. Check Network tab
3. Look for requests to `/users` or `/api/...`
4. Click request → Headers
5. Verify `Authorization: Bearer [token]` header is sent

**This confirms:**
- ✅ Frontend stores JWT token
- ✅ Frontend sends token with requests
- ✅ Backend validates token
- ✅ Authentication flow complete!

---

## Troubleshooting

### Common Issues

#### Issue 1: Health Checks Failing

**Symptoms:**
```bash
flyctl status
# Shows: 1 total, 0 passing (health check failing)
```

**Causes & Solutions:**

1. **App not responding on port 8080**
   ```bash
   # Check logs
   flyctl logs

   # Look for: "Server ready at http://0.0.0.0:8080"
   # If missing, check your main.ts PORT configuration
   ```

2. **App crashed on startup**
   ```bash
   # Check logs for errors
   flyctl logs

   # Common errors:
   # - "Cannot find module" → Missing dependency
   # - "Can't reach database" → Check DATABASE_URL secret
   # - "Invalid JWT secret" → Check JWT_SECRET secret
   ```

3. **Health check path doesn't exist**
   ```bash
   # Check fly.toml health check path
   cat fly.toml | grep "path ="

   # Should be: path = "/"
   # If your app doesn't have root route, create one:
   # Or change to: path = "/auth/status" (if you have this endpoint)
   ```

#### Issue 2: Database Connection Errors

**Symptoms:**
```bash
flyctl logs
# Shows: "Can't reach database server at [host]:5432"
```

**Solutions:**

1. **Check DATABASE_URL secret**
   ```bash
   # List secrets (values hidden)
   flyctl secrets list

   # If DATABASE_URL missing, set it:
   flyctl secrets set DATABASE_URL="postgresql://..."
   ```

2. **Verify database is running**
   ```bash
   # Test connection from your machine
   psql "postgresql://[user]:[password]@[host]/[database]?sslmode=require" -c "SELECT 1;"

   # Should return: 1
   ```

3. **Check Neon database status**
   - Go to: https://console.neon.tech
   - Check if database is active
   - Check if IP allowlist is set (should allow all for Fly.io)

#### Issue 3: CORS Errors

**Symptoms:**
```
Access to fetch at 'https://nextphoton-backend.fly.dev/auth/login'
from origin 'https://nextphoton.vercel.app' has been blocked by CORS policy
```

**Solutions:**

1. **Check CORS_ORIGIN secret**
   ```bash
   # Set CORS_ORIGIN to your Vercel URL
   flyctl secrets set CORS_ORIGIN="https://nextphoton.vercel.app"

   # IMPORTANT: Include https://, no trailing slash
   ```

2. **Check main.ts CORS configuration**
   ```typescript
   // Should read from env var:
   app.enableCors({
     origin: process.env.CORS_ORIGIN || 'http://localhost:369',
     credentials: true,
   });
   ```

3. **Restart app after setting secret**
   ```bash
   # Secrets auto-restart, but verify:
   flyctl status

   # If needed, restart manually:
   flyctl machine restart [machine-id]
   ```

#### Issue 4: 502 Bad Gateway

**Symptoms:**
```bash
curl https://nextphoton-backend.fly.dev/
# Returns: 502 Bad Gateway
```

**Causes & Solutions:**

1. **App not started yet**
   ```bash
   # Wait 10-15 seconds for cold start
   # Try again

   # Check status:
   flyctl status
   ```

2. **App crashed**
   ```bash
   # Check logs:
   flyctl logs

   # Look for crash errors
   # Fix code and redeploy:
   flyctl deploy
   ```

3. **VM stopped (auto-stop)**
   ```bash
   # First request wakes VM (takes 2-3 seconds)
   # Try again after a few seconds
   ```

#### Issue 5: Deployment Fails

**Symptoms:**
```
Error: failed to fetch an image or build from source: error building: ...
```

**Solutions:**

1. **Docker build error**
   ```bash
   # Check Dockerfile syntax
   cat Dockerfile

   # Common issues:
   # - Typos in commands
   # - Missing files being copied
   # - Wrong paths
   ```

2. **Out of memory during build**
   ```bash
   # Rare, but if build fails with OOM:
   # - Simplify Dockerfile
   # - Remove unnecessary dependencies
   # - Contact Fly.io support for larger builder
   ```

3. **Network issues**
   ```bash
   # If build hangs or fails downloading:
   # - Check internet connection
   # - Try again (may be temporary)
   flyctl deploy
   ```

---

## Monitoring and Maintenance

### View Logs

```bash
# Live logs (stream)
flyctl logs

# Recent logs only
flyctl logs --no-tail

# Filter logs
flyctl logs | grep ERROR
flyctl logs | grep "Server ready"
```

### View Metrics

```bash
# App metrics
flyctl metrics

# Shows:
# - CPU usage
# - Memory usage
# - Network traffic
# - Response times
```

### View Machine Status

```bash
# Machine details
flyctl machine list

# Machine metrics
flyctl machine status [machine-id]
```

### Scale Up/Down

```bash
# Add more machines (for load balancing)
flyctl scale count 2

# Scale back down
flyctl scale count 1

# Change memory
flyctl scale memory 512  # 512MB instead of 256MB
```

### Update Environment Variable

```bash
# Update a secret
flyctl secrets set JWT_SECRET="new-secret"

# App automatically restarts with new value
```

### Redeploy (After Code Changes)

```bash
# After making code changes:
cd /home/teamzenith/ZenCo/NextPhoton/backend/server_NestJS

# Deploy
flyctl deploy

# Monitor deployment
flyctl logs
```

---

## Cost Management

### Free Tier Usage

**Your current setup uses:**
- 1 VM (shared-cpu-1x)
- 256MB RAM
- Auto-stop/start enabled

**Cost:** FREE ✅ (within free tier)

### Monitor Usage

```bash
# Check resource usage
flyctl status
flyctl metrics

# View billing (if exceeded free tier)
# Visit: https://fly.io/dashboard/personal/billing
```

### Optimization Tips

1. **Use auto-stop/start** (already enabled in fly.toml)
   - Saves resources when idle
   - No charge for stopped VMs

2. **Use 256MB RAM** (already set)
   - Sufficient for low-medium traffic
   - Upgrade only if needed

3. **Single machine** (already set)
   - Run 1 VM for development/staging
   - Scale to 2+ for production traffic

4. **Monitor traffic**
   - Free tier: 160GB outbound/month
   - Typical usage: 10-50GB/month
   - If exceeded: ~$0.02/GB

### When You Might Incur Costs

**Scenarios:**
1. Exceeding 160GB outbound traffic ($0.02/GB)
2. Running more than 3 VMs
3. Using more than 3GB persistent storage
4. Requesting dedicated CPU (vs shared)

**Mitigation:**
- Monitor usage monthly
- Set up billing alerts
- Use auto-stop/start
- Optimize image sizes (we did this!)

---

## Next Steps

### Recommended Actions

#### 1. Set Up Monitoring

**Option A: Fly.io Dashboard**
- Visit: https://fly.io/dashboard
- View metrics, logs, and alerts

**Option B: External Monitoring**
- Sentry: Error tracking
- LogRocket: Session replay
- Uptime Robot: Uptime monitoring

#### 2. Set Up CI/CD

**Automated Deployments on Git Push:**

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend to Fly.io

on:
  push:
    branches: [main]
    paths:
      - 'backend/server_NestJS/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: superfly/flyctl-actions/setup-flyctl@master

      - run: flyctl deploy --remote-only
        working-directory: backend/server_NestJS
        env:
          FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
```

**Get API Token:**
```bash
flyctl auth token
# Copy token to GitHub Secrets as FLY_API_TOKEN
```

#### 3. Add Health Check Endpoint

Create a dedicated health endpoint:

```typescript
// backend/server_NestJS/src/health/health.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
```

Update fly.toml:
```toml
path = "/health"
```

#### 4. Set Up Database Backups

**Neon handles backups automatically**, but you can also:

```bash
# Manual backup (export to SQL)
pg_dump "$DATABASE_URL" > backup-$(date +%Y%m%d).sql

# Restore from backup
psql "$DATABASE_URL" < backup-20251011.sql
```

#### 5. Configure Custom Domain (Optional)

**Instead of:** `nextphoton-backend.fly.dev`
**Use:** `api.yourdomain.com`

```bash
# Add custom domain
flyctl certs add api.yourdomain.com

# Follow instructions to add DNS records
# Fly.io automatically provisions SSL certificate
```

#### 6. Review Security

**Checklist:**
- [ ] JWT_SECRET is strong (32+ random characters)
- [ ] DATABASE_URL is not exposed in logs
- [ ] CORS is set to your frontend URL only
- [ ] No .env files in Docker image
- [ ] Dependencies are up to date

#### 7. Load Testing (Optional)

Test how your backend handles traffic:

```bash
# Install Apache Bench
sudo apt install apache2-utils

# Test with 1000 requests, 100 concurrent
ab -n 1000 -c 100 https://nextphoton-backend.fly.dev/

# Review results:
# - Requests per second
# - Time per request
# - Failed requests
```

---

## Conclusion

Congratulations! Your NestJS backend is now deployed to Fly.io! 🎉

### What You Accomplished

✅ Built a production Docker image
✅ Deployed to Fly.io in Singapore
✅ Connected to Neon PostgreSQL database
✅ Set up JWT authentication
✅ Configured HTTPS and SSL
✅ Connected frontend to backend
✅ Tested end-to-end authentication

### Your Production Stack

```
┌─────────────────────────────────────────┐
│  Users → Vercel → Fly.io → Neon DB     │
│  ✅ All Connected & Working!            │
└─────────────────────────────────────────┘
```

### Resources

**Fly.io:**
- Dashboard: https://fly.io/dashboard
- Docs: https://fly.io/docs
- Status: https://status.fly.io

**Your App:**
- Backend URL: `https://[your-app].fly.dev`
- GraphQL: `https://[your-app].fly.dev/graphql`
- Logs: `flyctl logs`
- Metrics: `flyctl metrics`

**Support:**
- Fly.io Community: https://community.fly.io
- Fly.io Discord: https://fly.io/discord
- NextPhoton Docs: `Project_Docs/BACKEND_ARCHITECTURE_GUIDE.md`

---

**Happy Deploying! 🚀**

*Last Updated: October 11, 2025*
*Version: 1.0*
*For: NextPhoton EduCare Management System*
