/**
 * Authentication Service for Frontend
 * 
 * This service handles all authentication-related operations
 * by communicating with the NestJS backend JWT authentication endpoints.
 * 
 * Features:
 * - User registration
 * - Login/Logout
 * - Token management
 * - Profile fetching
 * - Token refresh
 */

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'learner' | 'guardian' | 'educator' | 'ecm' | 'employee' | 'intern' | 'admin';
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
    emailVerified: boolean;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
  emailVerified: boolean;
}

class AuthService {
  private baseUrl: string;
  private tokenKey = 'nextphoton_jwt_token';
  private userKey = 'nextphoton_user';

  constructor() {
    // Use environment variable or default to localhost
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:963';
  }

  /**
   * Store authentication data in localStorage and cookies
   */
  private storeAuthData(data: AuthResponse): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, data.access_token);
      localStorage.setItem(this.userKey, JSON.stringify(data.user));
      
      // Also set cookies for middleware
      document.cookie = `nextphoton_jwt_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      document.cookie = `nextphoton_user=${JSON.stringify(data.user)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
    }
  }

  /**
   * Clear authentication data from localStorage and cookies
   */
  private clearAuthData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
      
      // Clear cookies as well
      document.cookie = 'nextphoton_jwt_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'nextphoton_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  /**
   * Get stored user data
   */
  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem(this.userKey);
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch (e) {
          console.error('Failed to parse user data:', e);
          return null;
        }
      }
    }
    return null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }

      const authData = await response.json();
      this.storeAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      const authData = await response.json();
      this.storeAuthData(authData);
      return authData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      const token = this.getToken();
      if (token) {
        await fetch(`${this.baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local data even if server request fails
      this.clearAuthData();
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to fetch profile');
      }

      const user = await response.json();
      // Update stored user data
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.userKey, JSON.stringify(user));
      }
      return user;
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  /**
   * Refresh JWT token
   */
  async refreshToken(): Promise<string> {
    const token = this.getToken();
    if (!token) {
      throw new Error('Not authenticated');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          this.clearAuthData();
          throw new Error('Session expired. Please login again.');
        }
        throw new Error('Failed to refresh token');
      }

      const authData = await response.json();
      this.storeAuthData(authData);
      return authData.access_token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  /**
   * Create authorization header for API requests
   */
  getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /**
   * Check if user has specific role
   */
  hasRole(role: string): boolean {
    const user = this.getUser();
    return user ? user.roles.includes(role) : false;
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }
}

// Export singleton instance
export const authService = new AuthService();

// Export types
export type { LoginCredentials, RegisterData, AuthResponse, User };