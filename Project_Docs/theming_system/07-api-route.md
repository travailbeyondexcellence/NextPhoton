# API Route for Theme System

## Overview

The theme API route serves theme configuration data to the client, enabling dynamic theme loading and switching.

## Implementation

### File Location
```
app/api/themes/route.ts
```

### Basic Implementation

```typescript
import { NextResponse } from 'next/server';
import themes from '@/themes.json';

export async function GET() {
  return NextResponse.json(themes);
}
```

## Advanced Implementation

### With Caching Headers

```typescript
import { NextResponse } from 'next/server';
import themes from '@/themes.json';

export async function GET() {
  return NextResponse.json(themes, {
    headers: {
      // Cache for 1 hour
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate',
      'Content-Type': 'application/json',
    },
  });
}
```

### With Theme Validation

```typescript
import { NextResponse } from 'next/server';
import themes from '@/themes.json';

interface ThemeColors {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  // ... other required colors
}

interface Theme {
  name: string;
  description: string;
  order: number;
  colors: ThemeColors;
  progressGradient?: {
    from: string;
    to: string;
  };
  recentEditColor?: string;
  recentEditOpacity?: number;
}

function validateTheme(theme: any): theme is Theme {
  return (
    theme &&
    typeof theme.name === 'string' &&
    typeof theme.description === 'string' &&
    typeof theme.order === 'number' &&
    theme.colors &&
    typeof theme.colors.background === 'string' &&
    typeof theme.colors.foreground === 'string' &&
    typeof theme.colors.primary === 'string'
    // Add more validation as needed
  );
}

export async function GET() {
  try {
    // Validate themes before sending
    const validatedThemes: Record<string, Theme> = {};
    
    for (const [key, theme] of Object.entries(themes.themes || {})) {
      if (validateTheme(theme)) {
        validatedThemes[key] = theme;
      } else {
        console.warn(`Invalid theme configuration: ${key}`);
      }
    }

    return NextResponse.json({
      ...themes,
      themes: validatedThemes
    });
  } catch (error) {
    console.error('Error loading themes:', error);
    return NextResponse.json(
      { error: 'Failed to load themes' },
      { status: 500 }
    );
  }
}
```

### With Dynamic Theme Loading

```typescript
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: Request) {
  try {
    // Parse query params
    const { searchParams } = new URL(request.url);
    const themeKey = searchParams.get('theme');

    // Load themes from file system (for dynamic updates)
    const themesPath = path.join(process.cwd(), 'themes.json');
    const themesData = await fs.readFile(themesPath, 'utf-8');
    const themes = JSON.parse(themesData);

    // Return specific theme if requested
    if (themeKey && themes.themes[themeKey]) {
      return NextResponse.json({
        theme: themes.themes[themeKey],
        colorDefinitions: themes.colorDefinitions
      });
    }

    // Return all themes
    return NextResponse.json(themes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load themes' },
      { status: 500 }
    );
  }
}
```

### With User Preferences

```typescript
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import themes from '@/themes.json';

export async function GET() {
  const cookieStore = cookies();
  const userTheme = cookieStore.get('theme')?.value;

  return NextResponse.json({
    ...themes,
    userTheme: userTheme || 'emerald',
    availableThemes: Object.keys(themes.themes || {})
  });
}

export async function POST(request: Request) {
  try {
    const { theme } = await request.json();
    
    // Validate theme exists
    if (!themes.themes || !themes.themes[theme]) {
      return NextResponse.json(
        { error: 'Invalid theme' },
        { status: 400 }
      );
    }

    // Set cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('theme', theme, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 365 // 1 year
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save theme preference' },
      { status: 500 }
    );
  }
}
```

## API Response Format

### Standard Response

```json
{
  "colorDefinitions": {
    "_comment": "Each theme needs these color values defined",
    "required": ["background", "foreground", "..."]
  },
  "themes": {
    "emerald": {
      "name": "🌿 Emerald",
      "description": "Fresh green theme",
      "order": 1,
      "colors": {
        "background": "#eafff2",
        "foreground": "#09090b",
        "...": "..."
      }
    },
    "...": "..."
  }
}
```

### With Metadata

```json
{
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T12:00:00Z",
  "totalThemes": 12,
  "categories": ["light", "dark", "high-contrast"],
  "colorDefinitions": {...},
  "themes": {...}
}
```

## Error Handling

### Client-Side Error Handling

```typescript
// In the client component
async function loadThemes() {
  try {
    const response = await fetch('/api/themes');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.themes) {
      throw new Error('Invalid theme data structure');
    }
    
    return data;
  } catch (error) {
    console.error('Failed to load themes:', error);
    
    // Return default theme structure
    return {
      themes: {
        emerald: {
          name: 'Default',
          description: 'Default theme',
          colors: {
            background: '#ffffff',
            foreground: '#000000',
            // ... minimal color set
          }
        }
      }
    };
  }
}
```

## Performance Optimization

### Static Generation

```typescript
// For static sites, pre-render the response
export const runtime = 'edge';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  return NextResponse.json(themes, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
    },
  });
}
```

### Response Compression

```typescript
import { NextResponse } from 'next/server';
import themes from '@/themes.json';
import { gzip } from 'zlib';
import { promisify } from 'util';

const compress = promisify(gzip);

export async function GET(request: Request) {
  const acceptEncoding = request.headers.get('accept-encoding') || '';
  
  const jsonString = JSON.stringify(themes);
  
  // Use gzip if client supports it
  if (acceptEncoding.includes('gzip')) {
    const compressed = await compress(jsonString);
    
    return new NextResponse(compressed, {
      headers: {
        'Content-Type': 'application/json',
        'Content-Encoding': 'gzip',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
  
  return NextResponse.json(themes);
}
```

## Middleware Integration

### Theme Validation Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Only apply to theme API
  if (request.nextUrl.pathname === '/api/themes') {
    // Add CORS headers if needed
    const response = NextResponse.next();
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST');
    return response;
  }
}

export const config = {
  matcher: '/api/themes',
};
```

## Testing

### Unit Test

```typescript
import { GET } from '@/app/api/themes/route';
import themes from '@/themes.json';

describe('Theme API', () => {
  it('returns theme data', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(data).toEqual(themes);
    expect(data.themes).toBeDefined();
    expect(Object.keys(data.themes).length).toBeGreaterThan(0);
  });

  it('includes cache headers', async () => {
    const response = await GET();
    
    expect(response.headers.get('Cache-Control')).toContain('max-age');
  });
});
```

### Integration Test

```typescript
describe('Theme API Integration', () => {
  it('loads themes in browser', async () => {
    const response = await fetch('/api/themes');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.themes.emerald).toBeDefined();
    expect(data.themes.emerald.colors.background).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
```

## Security Considerations

### Rate Limiting

```typescript
import { RateLimiter } from '@/lib/rate-limit';

const limiter = new RateLimiter({
  uniqueTokenPerInterval: 500,
  interval: 60000, // 1 minute
});

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    await limiter.check(ip, 10); // 10 requests per minute
    
    return NextResponse.json(themes);
  } catch {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    );
  }
}
```

### Content Security

```typescript
export async function GET() {
  const response = NextResponse.json(themes);
  
  // Set security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  return response;
}
```

## Monitoring

### Logging

```typescript
export async function GET(request: Request) {
  const startTime = Date.now();
  
  try {
    const response = NextResponse.json(themes);
    
    // Log successful requests
    console.log({
      type: 'theme_api_request',
      duration: Date.now() - startTime,
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    });
    
    return response;
  } catch (error) {
    // Log errors
    console.error({
      type: 'theme_api_error',
      error: error.message,
      duration: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });
    
    throw error;
  }
}
```

## Best Practices

1. **Always return valid JSON** - Even in error cases
2. **Use appropriate cache headers** - Reduce server load
3. **Validate theme data** - Ensure required properties exist
4. **Handle errors gracefully** - Provide fallback data
5. **Log API usage** - Monitor performance and errors
6. **Use TypeScript** - Type-safe theme structures
7. **Implement rate limiting** - Prevent abuse
8. **Compress responses** - Reduce bandwidth usage
9. **Version your API** - Support backward compatibility
10. **Document response format** - Clear API documentation