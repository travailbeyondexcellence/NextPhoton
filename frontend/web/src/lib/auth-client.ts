/**
 * Authentication Client for NestJS JWT Backend
 * 
 * This client handles authentication with the NestJS backend
 * using JWT tokens for session management.
 * 
 * Features:
 * - User registration and login
 * - JWT token management
 * - Session persistence
 * - Automatic token refresh
 * - Profile fetching
 */

import { z } from 'zod';

// Define the backend API URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:963';

// Token storage keys
const TOKEN_KEY = 'nextphoton_access_token';
const USER_KEY = 'nextphoton_user';

/**
 * User type definition matching NestJS backend
 */
export interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  emailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Authentication response from NestJS backend
 */
export interface AuthResponse {
  access_token: string;
  user: User;
  message?: string;
}

/**
 * Session type for client-side state
 */
export interface Session {
  user: User | null;
  token: string | null;
}

/**
 * Registration data interface
 */
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'learner' | 'guardian' | 'educator' | 'ecm' | 'employee' | 'intern' | 'admin';
}

/**
 * Login credentials interface
 */
export interface LoginData {
  email: string;
  password: string;
}

/**
 * Authentication Client Class
 * Handles all authentication operations with NestJS backend
 */
class AuthClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_URL}/auth`;
  }

  /**
   * Store authentication data in both localStorage and cookies
   * Cookies are needed for Next.js middleware to check authentication
   */
  private storeAuthData(token: string, user: User): void {
    if (typeof window !== 'undefined') {
      // Store in localStorage for client-side access
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));

      // Store in cookies for middleware access
      // Using 7-day expiry for cookies
      const maxAge = 60 * 60 * 24 * 7; // 7 days in seconds

      // Set JWT token cookie
      document.cookie = `nextphoton_jwt_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;

      // Set user data cookie (with roles for middleware role-based routing)
      const userData = {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles
      };
      document.cookie = `nextphoton_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
  }

  /**
   * Clear authentication data from both localStorage and cookies
   */
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      // Clear localStorage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      // Clear cookies by setting them to expire immediately
      document.cookie = 'nextphoton_jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
      document.cookie = 'nextphoton_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax';
    }
  }

  /**
   * Get stored authentication token from localStorage or cookies
   */
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) return token;

      // Fallback to cookies
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'nextphoton_jwt_token') {
          return value;
        }
      }
    }
    return null;
  }

  /**
   * Get stored user data from localStorage or cookies
   */
  private getStoredUser(): User | null {
    if (typeof window !== 'undefined') {
      // Try localStorage first
      const userData = localStorage.getItem(USER_KEY);
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error('Failed to parse user data from localStorage');
        }
      }

      // Fallback to cookies
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'nextphoton_user') {
          try {
            return JSON.parse(decodeURIComponent(value));
          } catch (e) {
            console.error('Failed to parse user data from cookie');
          }
        }
      }
    }
    return null;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<{ data?: AuthResponse; error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const authData: AuthResponse = await response.json();
      
      // Store auth data
      this.storeAuthData(authData.access_token, authData.user);
      
      return { data: authData };
    } catch (error) {
      console.error('Registration error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Login user with email and password
   */
  async login(data: LoginData): Promise<{ data?: AuthResponse; error?: Error }> {
    try {
      const response = await fetch(`${this.baseUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const authData: AuthResponse = await response.json();
      
      // Store auth data
      this.storeAuthData(authData.access_token, authData.user);
      
      return { data: authData };
    } catch (error) {
      console.error('Login error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      
      if (token) {
        await fetch(`${this.baseUrl}/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear auth data regardless of API response
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile from backend
   */
  async getProfile(): Promise<{ data?: User; error?: Error }> {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const user: User = await response.json();
      
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
      }
      
      return { data: user };
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Refresh the authentication token
   */
  async refreshToken(): Promise<{ data?: AuthResponse; error?: Error }> {
    try {
      const token = this.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${this.baseUrl}/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const authData: AuthResponse = await response.json();
      
      // Update stored auth data
      this.storeAuthData(authData.access_token, authData.user);
      
      return { data: authData };
    } catch (error) {
      console.error('Token refresh error:', error);
      return { error: error as Error };
    }
  }

  /**
   * Get current session (from localStorage)
   */
  getSession(): Session {
    return {
      user: this.getStoredUser(),
      token: this.getToken(),
    };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  /**
   * Sign in wrapper to match the interface expected by components
   */
  signIn = {
    email: async (data: LoginData) => {
      return this.login(data);
    }
  };

  /**
   * Sign up wrapper to match the interface expected by components
   */
  signUp = {
    email: async (data: RegisterData) => {
      return this.register(data);
    }
  };

  /**
   * Sign out wrapper
   */
  signOut = async () => {
    await this.logout();
  };
}

/**
 * Create a singleton instance of the auth client
 */
export const authClient = new AuthClient();

/**
 * Helper hooks and functions for components
 */

/**
 * Get current user synchronously
 */
export function getCurrentUser(): User | null {
  const session = authClient.getSession();
  return session.user;
}

/**
 * Check if user is authenticated synchronously
 */
export function isAuthenticated(): boolean {
  return authClient.isAuthenticated();
}

/**
 * Get authentication headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const session = authClient.getSession();
  
  if (session.token) {
    return {
      'Authorization': `Bearer ${session.token}`,
      'Content-Type': 'application/json',
    };
  }
  
  return {
    'Content-Type': 'application/json',
  };
}