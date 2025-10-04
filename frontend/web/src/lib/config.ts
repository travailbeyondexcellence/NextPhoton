/**
 * Environment Configuration
 *
 * This file contains environment-specific configurations for the NextPhoton application.
 * It determines whether to use mock data (for Vercel deployment) or real API/GraphQL calls (for local development).
 *
 * IMPORTANT: This configuration allows the app to run in two modes:
 * 1. Vercel Production Mode: Uses mock JSON data (read-only)
 * 2. Local Development Mode: Uses API routes with full CRUD operations on JSON files
 *
 * All backend infrastructure (NestJS, GraphQL, Apollo, Prisma) remains untouched.
 */

/**
 * Determines if the app should use mock data instead of real API calls
 *
 * When true: Application reads data directly from mockData/*.json files (Vercel deployment)
 * When false: Application uses API routes for full CRUD operations (Local development)
 *
 * This is controlled by the NEXT_PUBLIC_USE_MOCK_DATA environment variable
 */
export const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

/**
 * Determines if we're running on Vercel production
 * Vercel automatically sets VERCEL_ENV environment variable
 */
export const IS_VERCEL_PRODUCTION = process.env.VERCEL_ENV === 'production';

/**
 * Determines if we're in development mode
 */
export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

/**
 * API Base URL
 * Points to the backend API server (NestJS) when not using mock data
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:963';

/**
 * Frontend App URL
 */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:369';

/**
 * Feature flags for conditional functionality
 */
export const FEATURES = {
  // Enable CRUD operations (disabled on Vercel, enabled locally)
  enableCRUD: !USE_MOCK_DATA && IS_DEVELOPMENT,

  // Enable GraphQL/Apollo client (for future when backend is ready)
  enableGraphQL: !USE_MOCK_DATA && !IS_DEVELOPMENT,

  // Enable mock data mode (Vercel or when explicitly set)
  useMockData: USE_MOCK_DATA,
} as const;

/**
 * Log current configuration (only in development)
 */
if (IS_DEVELOPMENT && typeof window !== 'undefined') {
  console.log('🔧 Environment Configuration:', {
    USE_MOCK_DATA,
    IS_VERCEL_PRODUCTION,
    IS_DEVELOPMENT,
    FEATURES,
  });
}
