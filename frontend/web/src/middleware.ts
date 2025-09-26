/**
 * Next.js Middleware for JWT Authentication
 * 
 * This middleware handles:
 * - Route protection based on authentication status
 * - Role-based access control
 * - Automatic redirects for authenticated/unauthenticated users
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Define public routes that don't require authentication
 */
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/forgot-password',
  '/reset-password',
  // Landing pages - Product
  '/features',
  '/pricing',
  '/testimonials',
  '/demo',
  // Landing pages - Company
  '/about',
  '/careers',
  '/blog',
  '/press',
  // Landing pages - Resources
  '/documentation',
  '/help-center',
  '/community',
  '/contact',
  // Landing pages - Legal
  '/privacy',
  '/terms',
  '/security',
  '/compliance',
  // Product routes
  '/product',
  // Company routes
  '/company',
  // Resources routes
  '/resources',
  // Legal routes
  '/legal',
  // Public routes in (public) folder
  '/faqs',
];

/**
 * Routes that should be accessible to all authenticated users
 */
const authenticatedRoutes = [
  '/profile',
  '/settings',
  '/logout',
  '/NextPhotonSettings',
  '/TRAVAIL-PRACTISE-EXAMS',
];

/**
 * Define role-based route access
 */
const roleBasedRoutes: Record<string, string[]> = {
  '/admin': ['admin'],
  '/educator': ['educator', 'admin'],
  '/learner': ['learner', 'guardian', 'admin'],
  '/guardian': ['guardian', 'admin'],
  '/ecm': ['ecm', 'admin'],
  '/employee': ['employee', 'admin'],
  '/intern': ['intern', 'admin'],
};

/**
 * Middleware function to handle authentication and authorization
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Check if route is accessible to all authenticated users
  const isAuthenticatedRoute = authenticatedRoutes.some(route => pathname === route || pathname.startsWith(`${route}/`));

  // Get JWT token from cookies (we'll set this when user logs in)
  const token = request.cookies.get('nextphoton_jwt_token');
  
  // For now, we're just checking for token presence
  // In production, you might want to verify the token with your backend
  const isAuthenticated = !!token;

  // Get user data from cookie (set during login)
  const userDataCookie = request.cookies.get('nextphoton_user');
  let userRoles: string[] = [];
  
  if (userDataCookie) {
    try {
      const userData = JSON.parse(userDataCookie.value);
      userRoles = userData.roles || [];
    } catch (e) {
      console.error('Failed to parse user data from cookie');
    }
  }

  // Handle root path for authenticated users
  if (pathname === '/' && isAuthenticated) {
    // Redirect authenticated users from root to their dashboard
    if (userRoles.length > 0) {
      const primaryRole = userRoles[0];
      const dashboardUrl = new URL(`/${primaryRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Default redirect if no role
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Handle authentication logic
  if (!isAuthenticated && !isPublicRoute && pathname !== '/') {
    // User is not authenticated and trying to access protected route
    const signInUrl = new URL('/sign-in', request.url);
    signInUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Allow authenticated users to access common authenticated routes
  if (isAuthenticated && isAuthenticatedRoute) {
    return NextResponse.next();
  }

  if (isAuthenticated && (pathname === '/sign-in' || pathname === '/sign-up')) {
    // Authenticated user trying to access auth pages, redirect to their dashboard
    if (userRoles.length > 0) {
      const primaryRole = userRoles[0];
      const dashboardUrl = new URL(`/${primaryRole}`, request.url);
      return NextResponse.redirect(dashboardUrl);
    }
    // Default redirect if no role
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(roleBasedRoutes)) {
    if (pathname.startsWith(route)) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to sign in
        const signInUrl = new URL('/sign-in', request.url);
        signInUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Check if user has required role
      const hasRequiredRole = userRoles.some(role => allowedRoles.includes(role));
      
      if (!hasRequiredRole) {
        // User doesn't have required role, redirect to unauthorized
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};