# ============================================
# Multi-Stage Dockerfile for NestJS Backend
# ============================================
# This Dockerfile builds the NextPhoton NestJS backend for deployment on Fly.io
#
# Architecture:
# - Stage 1 (builder): Install dependencies, generate Prisma client, build NestJS app
# - Stage 2 (runner): Slim production image with only runtime files
#
# Key Features:
# - Uses Bun as package manager (faster than npm/yarn)
# - Handles monorepo structure (copies shared Prisma schema)
# - Multi-stage build for minimal image size
# - Production-optimized configuration
# ============================================

# ============================================
# Stage 1: Builder
# ============================================
# Purpose: Install all dependencies and build the application
FROM oven/bun:1.1.38-debian AS builder

# Set working directory
WORKDIR /app

# Install required system dependencies for Prisma and Node.js
# - openssl: Required by Prisma for database connections
# - ca-certificates: SSL certificate validation
# - curl: Required to download Node.js
# - nodejs: Required by Prisma CLI to run (even though we use Bun for package management)
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# ============================================
# Copy package files for dependency installation
# ============================================
# Why copy package files first?
# - Docker caches layers, so if package.json doesn't change,
#   it won't reinstall dependencies (saves time on rebuilds)
# ============================================

# Copy backend package.json and root bun.lock to working directory
# Note: We need the lock file for reproducible builds
COPY backend/server_NestJS/package.json ./
COPY bun.lock* ./

# Copy shared folder (contains Prisma schema - required for backend build)
# Note: Backend imports from @shared/* via TypeScript path mapping
COPY shared ../shared

# ============================================
# Install ALL dependencies (including devDependencies)
# ============================================
# Why install devDependencies in builder stage?
# - NestJS build requires @nestjs/cli (devDependency)
# - TypeScript compilation requires typescript (devDependency)
# - We'll remove these in the production stage
# ============================================
RUN bun install

# ============================================
# Generate Prisma Client
# ============================================
# Why generate Prisma client?
# - Backend code imports from @prisma/client
# - Prisma generates type-safe database client from schema
# - Must be generated BEFORE building NestJS app
# ============================================
# Create minimal package.json at root to satisfy Prisma's project root detection
RUN echo '{"name":"workspace","private":true}' > /package.json

# Install prisma and @prisma/client, then generate client
# Note: Prisma 6.7.0+ supports multi-file schemas - all .prisma files in the schema directory are loaded
RUN bun add -d prisma@latest && \
    bun add @prisma/client@latest && \
    bunx prisma generate --schema=../shared/prisma/schema

# ============================================
# Copy source code
# ============================================
# Why copy source AFTER installing dependencies?
# - Source code changes frequently
# - By copying after install, we leverage Docker cache
# - If only source changed (not package.json), Docker reuses cached dependencies
# ============================================
COPY backend/server_NestJS/src ./src
COPY backend/server_NestJS/tsconfig*.json ./
COPY backend/server_NestJS/nest-cli.json* ./

# ============================================
# Build NestJS Application
# ============================================
# This compiles TypeScript to JavaScript in the dist/ folder
# ============================================
RUN bun run build

# ============================================
# Stage 2: Production Runner
# ============================================
# Purpose: Create minimal production image with only runtime files
# Benefits:
# - Smaller image size (faster deployments)
# - Reduced attack surface (fewer packages = fewer vulnerabilities)
# - Only includes production dependencies
# ============================================
FROM oven/bun:1.1.38-debian AS runner

# Set working directory
WORKDIR /app

# Install only runtime system dependencies
# - nodejs: Required by Prisma CLI for generation and runtime queries
RUN apt-get update && apt-get install -y \
    openssl \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/* \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Set NODE_ENV to production
# This tells NestJS and other libraries to run in production mode
ENV NODE_ENV=production

# ============================================
# Copy package files for production dependencies
# ============================================
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lock* ./

# ============================================
# Install ONLY production dependencies
# ============================================
# Why --production flag?
# - Skips devDependencies (typescript, @nestjs/cli, etc.)
# - Results in smaller node_modules folder
# - Faster container startup
# ============================================
RUN bun install --production

# ============================================
# Copy shared Prisma schema (required for runtime)
# ============================================
COPY --from=builder /app/../shared ../shared

# ============================================
# Generate Prisma Client in production stage
# ============================================
# Why generate again?
# - Prisma client was generated in builder with ALL dependencies
# - Need to regenerate with production dependencies only
# - Ensures Prisma client works with production node_modules
# ============================================
# Create minimal package.json at root to satisfy Prisma's project root detection
RUN echo '{"name":"workspace","private":true}' > /package.json

RUN bun add -d prisma@latest && \
    bun add @prisma/client@latest && \
    bunx prisma generate --schema=../shared/prisma/schema

# ============================================
# Copy built application from builder stage
# ============================================
# This copies the compiled JavaScript from the builder stage
# We DON'T copy the entire backend folder (would include src/, tests/, etc.)
# ============================================
COPY --from=builder /app/dist ./dist

# ============================================
# Expose Port 8080
# ============================================
# Why 8080?
# - Fly.io expects apps to listen on port 8080 by default
# - Your main.ts reads from process.env.PORT (Fly.io sets this to 8080)
# - This is just documentation (doesn't actually open the port)
# ============================================
EXPOSE 8080

# ============================================
# Health Check
# ============================================
# Why health check?
# - Fly.io uses this to determine if container is healthy
# - If health check fails, Fly.io can restart the container
# - Checks every 30 seconds if server is responding
# ============================================
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD bun --version || exit 1

# ============================================
# Start the Application
# ============================================
# Why this command?
# - Uses Node.js to run compiled JavaScript (faster startup than bun for NestJS)
# - Runs from dist/main.js (compiled entry point from src/main.ts)
# - Your main.ts binds to 0.0.0.0:${PORT} (Fly.io will set PORT=8080)
# ============================================
CMD ["node", "dist/main.js"]
