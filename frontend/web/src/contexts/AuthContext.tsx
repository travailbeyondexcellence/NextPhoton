/**
 * Authentication Context Provider
 * 
 * Provides authentication state and methods to all components
 * through React Context API. This replaces Better-auth.
 * 
 * Features:
 * - Global auth state management
 * - Auto token refresh
 * - Protected route handling
 * - Role-based access control
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { authService, type User, type LoginCredentials, type RegisterData } from '@/lib/auth-service';
import { useLoading } from '@/contexts/LoadingContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasRole: (role: string) => boolean;
  hasAnyRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Authentication Provider Component
 * 
 * Wrap your app with this provider to enable authentication
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { withLoading } = useLoading();

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if user is authenticated
        if (authService.isAuthenticated()) {
          // Try to get user from localStorage first
          const storedUser = authService.getUser();
          if (storedUser) {
            setUser(storedUser);
          }
          
          // Then fetch fresh profile from server
          try {
            const profile = await authService.getProfile();
            setUser(profile);
          } catch (error) {
            console.error('Failed to fetch profile:', error);
            // If profile fetch fails, clear auth data
            await authService.logout();
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Set up token refresh interval
   */
  useEffect(() => {
    if (!user) return;

    // Refresh token every 6 hours (token expires in 7 days but refresh early)
    const refreshInterval = setInterval(async () => {
      try {
        await authService.refreshToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        // If refresh fails, logout user
        await logout();
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(refreshInterval);
  }, [user]);

  /**
   * Login function
   */
  const login = useCallback(async (credentials: LoginCredentials) => {
    return withLoading(async () => {
      try {
        const response = await authService.login(credentials);
        setUser(response.user);

        // Redirect based on role
        const primaryRole = response.user.roles[0];
        const roleRedirectMap: Record<string, string> = {
          admin: '/admin',
          educator: '/educator',
          learner: '/learner',
          guardian: '/guardian',
          ecm: '/ecm',
          employee: '/employee',
          intern: '/intern',
        };

        const redirectPath = roleRedirectMap[primaryRole] || '/dashboard';
        router.push(redirectPath);
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      }
    }, 'auth-login', 'Signing in...');
  }, [router, withLoading]);

  /**
   * Register function
   */
  const register = useCallback(async (data: RegisterData) => {
    return withLoading(async () => {
      try {
        const response = await authService.register(data);
        setUser(response.user);

        // Redirect to role-specific dashboard after registration
        const roleRedirectMap: Record<string, string> = {
          admin: '/admin',
          educator: '/educator',
          learner: '/learner',
          guardian: '/guardian',
          ecm: '/ecm',
          employee: '/employee',
          intern: '/intern',
        };

        const redirectPath = roleRedirectMap[data.role] || '/dashboard';
        router.push(redirectPath);
      } catch (error) {
        console.error('Registration failed:', error);
        throw error;
      }
    }, 'auth-register', 'Creating your account...');
  }, [router, withLoading]);

  /**
   * Logout function
   */
  const logout = useCallback(async () => {
    return withLoading(async () => {
      try {
        await authService.logout();
        setUser(null);
        router.push('/sign-in');
      } catch (error) {
        console.error('Logout failed:', error);
        // Even if logout fails, clear local state
        setUser(null);
        router.push('/sign-in');
      }
    }, 'auth-logout', 'Signing out...');
  }, [router, withLoading]);

  /**
   * Refresh user profile
   */
  const refreshUser = useCallback(async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  }, []);

  /**
   * Check if user has specific role
   */
  const hasRole = useCallback((role: string): boolean => {
    return user ? user.roles.includes(role) : false;
  }, [user]);

  /**
   * Check if user has any of the specified roles
   */
  const hasAnyRole = useCallback((roles: string[]): boolean => {
    if (!user) return false;
    return roles.some(role => user.roles.includes(role));
  }, [user]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to use authentication context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Higher-order component to protect routes
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthProtectedComponent(props: P) {
    const { user, isLoading, hasAnyRole } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!user) {
          // Not authenticated, redirect to login
          router.push('/sign-in');
        } else if (allowedRoles && !hasAnyRole(allowedRoles)) {
          // Authenticated but not authorized for this route
          router.push('/unauthorized');
        }
      }
    }, [user, isLoading, hasAnyRole, router]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen relative">
          {/* Theme-aware background gradient */}
          <div className="fixed inset-0 -z-10 theme-gradient" />
          
          {/* Loading indicator */}
          <div className="flex flex-col items-center gap-4">
            {/* Spinning loader */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            
            {/* Loading text */}
            <div className="text-foreground/80 font-medium animate-pulse">
              Loading...
            </div>
          </div>
        </div>
      );
    }

    if (!user) {
      return null; // Will redirect
    }

    if (allowedRoles && !hasAnyRole(allowedRoles)) {
      return null; // Will redirect
    }

    return <Component {...props} />;
  };
}