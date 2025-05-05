import { NextRequest, NextResponse } from 'next/server';
// import { extractSubdomain } from '@next-photon/shared/auth/getTenant';

import { extractSubdomain } from '../shared/auth/getTenant';

export function middleware(req: NextRequest) {
    const host = req.headers.get('host') || '';
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
