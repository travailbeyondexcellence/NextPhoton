import { NextRequest, NextResponse } from 'next/server';
// import { extractSubdomain } from '@next-photon/shared/auth/getTenant';

// Mock deployment: Provide mock extractSubdomain function
// import { extractSubdomain } from '../shared/auth/getTenant';
const extractSubdomain = (host: string): string | null => {
    // Mock implementation - extract subdomain from host
    const parts = host.split('.');
    if (parts.length > 2) {
        return parts[0];
    }
    return 'default';
};

export function middleware(req: NextRequest) {
    const headers = req.headers;
    const host = headers.get('host') || '';
    const tenantSlug = extractSubdomain(host);

    if (!tenantSlug) {
        return NextResponse.redirect(new URL('/error', req.url));
    }

    const res = NextResponse.next();
    res.headers.set('x-tenant', tenantSlug);
    return res;
}

export const config = {
    matcher: ['/((?!api|_next/static|favicon.ico).*)'],
};


// Use a subdomain(tenant1.localhost or similar) while testing

// Add seed tenant data before you start querying DB(in getTenantSession() or Clerk logic)

// 🧪 When you’re ready for multi - tenancy later:
// Uncomment or restore the middleware.

// Ensure tenants are seeded.

// Use subdomain routing(e.g., tenant1.localhost: 3000).