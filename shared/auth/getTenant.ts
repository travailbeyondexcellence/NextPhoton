// shared/auth/getTenant.ts

export function extractSubdomain(host: string): string | null {
    const parts = host.split('.');
    if (parts.length >= 3) return parts[0]; // sub.domain.com → sub
    return null;
}
