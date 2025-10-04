/**
 * Mock Data Provider
 *
 * This module provides a unified interface for fetching data in the NextPhoton application.
 * It automatically switches between two modes based on environment configuration:
 *
 * 1. VERCEL MODE (NEXT_PUBLIC_USE_MOCK_DATA=true):
 *    - Reads data directly from mockData/*.json files
 *    - Read-only operations (no CRUD)
 *    - Used for Vercel deployment
 *
 * 2. LOCAL DEV MODE (NEXT_PUBLIC_USE_MOCK_DATA=false):
 *    - Calls API routes (/api/announcements, /api/dailyStudyPlans, etc.)
 *    - Full CRUD operations supported
 *    - Mutates JSON files via API routes
 *
 * IMPORTANT: All backend code (NestJS, GraphQL, Apollo, Prisma) remains untouched.
 * This is purely a frontend data-fetching strategy for development and demo purposes.
 */

import { USE_MOCK_DATA } from './config';

// Import mock data files for Vercel deployment (read-only mode)
import announcementsData from '../mockData/announcements.json';
import dailyStudyPlansData from '../mockData/dailyStudyPlans.json';
import examinationsData from '../mockData/examinations.json';
import educatorsData from '../mockData/educators.json';
import learnersData from '../mockData/learners.json';
import guardiansData from '../mockData/guardians.json';
import usersData from '../mockData/users.json';

/**
 * Generic API response type
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

/**
 * Fetch announcements
 * - Vercel: Returns imported JSON directly
 * - Local: Calls /api/announcements
 */
export async function getAnnouncements(): Promise<ApiResponse<any[]>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: Read directly from imported JSON
    return {
      success: true,
      data: announcementsData,
      count: announcementsData.length,
    };
  }

  // Local dev mode: Call API route for CRUD support
  try {
    const response = await fetch('/api/announcements');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch announcements',
    };
  }
}

/**
 * Create a new announcement
 * - Vercel: Returns error (read-only mode)
 * - Local: Calls /api/announcements POST
 */
export async function createAnnouncement(announcement: any): Promise<ApiResponse<any>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: CRUD operations not supported
    return {
      success: false,
      data: null,
      error: 'Create operation is not available in production mode',
    };
  }

  // Local dev mode: Call API route
  try {
    const response = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating announcement:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to create announcement',
    };
  }
}

/**
 * Update an existing announcement
 * - Vercel: Returns error (read-only mode)
 * - Local: Calls /api/announcements PUT
 */
export async function updateAnnouncement(announcement: any): Promise<ApiResponse<any>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: CRUD operations not supported
    return {
      success: false,
      data: null,
      error: 'Update operation is not available in production mode',
    };
  }

  // Local dev mode: Call API route
  try {
    const response = await fetch('/api/announcements', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(announcement),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating announcement:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to update announcement',
    };
  }
}

/**
 * Delete an announcement
 * - Vercel: Returns error (read-only mode)
 * - Local: Calls /api/announcements DELETE
 */
export async function deleteAnnouncement(id: string): Promise<ApiResponse<any>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: CRUD operations not supported
    return {
      success: false,
      data: null,
      error: 'Delete operation is not available in production mode',
    };
  }

  // Local dev mode: Call API route
  try {
    const response = await fetch(`/api/announcements?id=${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error.message : 'Failed to delete announcement',
    };
  }
}

/**
 * Fetch daily study plans
 * - Vercel: Returns imported JSON directly
 * - Local: Calls /api/dailyStudyPlans
 */
export async function getDailyStudyPlans(): Promise<ApiResponse<any[]>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: Read directly from imported JSON
    return {
      success: true,
      data: dailyStudyPlansData,
      count: dailyStudyPlansData.length,
    };
  }

  // Local dev mode: Call API route
  try {
    const response = await fetch('/api/dailyStudyPlans');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching daily study plans:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch daily study plans',
    };
  }
}

/**
 * Fetch examinations
 * - Vercel: Returns imported JSON directly
 * - Local: Calls /api/examinations
 */
export async function getExaminations(): Promise<ApiResponse<any[]>> {
  if (USE_MOCK_DATA) {
    // Vercel mode: Read directly from imported JSON
    return {
      success: true,
      data: examinationsData,
      count: examinationsData.length,
    };
  }

  // Local dev mode: Call API route
  try {
    const response = await fetch('/api/examinations');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching examinations:', error);
    return {
      success: false,
      data: [],
      error: error instanceof Error ? error.message : 'Failed to fetch examinations',
    };
  }
}

/**
 * Fetch educators
 * - Vercel: Returns imported JSON directly
 * - Local: Returns imported JSON (no API route yet, uses GraphQL in real app)
 */
export async function getEducators(): Promise<ApiResponse<any[]>> {
  // Always return mock data for now (GraphQL queries will be used later)
  return {
    success: true,
    data: educatorsData,
    count: educatorsData.length,
  };
}

/**
 * Fetch learners
 * - Vercel: Returns imported JSON directly
 * - Local: Returns imported JSON (no API route yet, uses GraphQL in real app)
 */
export async function getLearners(): Promise<ApiResponse<any[]>> {
  // Always return mock data for now (GraphQL queries will be used later)
  return {
    success: true,
    data: learnersData,
    count: learnersData.length,
  };
}

/**
 * Fetch guardians
 * - Vercel: Returns imported JSON directly
 * - Local: Returns imported JSON (no API route yet, uses GraphQL in real app)
 */
export async function getGuardians(): Promise<ApiResponse<any[]>> {
  // Always return mock data for now (GraphQL queries will be used later)
  return {
    success: true,
    data: guardiansData,
    count: guardiansData.length,
  };
}

/**
 * Fetch users
 * - Vercel: Returns imported JSON directly
 * - Local: Returns imported JSON (no API route yet, uses GraphQL in real app)
 */
export async function getUsers(): Promise<ApiResponse<any[]>> {
  // Always return mock data for now (Auth service will be used later)
  return {
    success: true,
    data: usersData,
    count: usersData.length,
  };
}

/**
 * Generic helper to check if CRUD operations are available
 */
export function isCRUDAvailable(): boolean {
  return !USE_MOCK_DATA;
}

/**
 * Get current data mode (for debugging/UI display)
 */
export function getDataMode(): 'mock' | 'api' {
  return USE_MOCK_DATA ? 'mock' : 'api';
}
