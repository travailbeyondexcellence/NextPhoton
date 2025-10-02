import { NextRequest, NextResponse } from 'next/server';
import glassThemes from '@/../../glass-themes.json';
import modernThemes from '@/../../modern-themes.json';

/**
 * GET /api/themes
 * 
 * Returns all available themes with their configurations.
 * Used by the theme system to load theme data dynamically.
 * 
 * Query Parameters:
 * - type: 'modern' | 'glass' (defaults to 'glass' for backward compatibility)
 */
export async function GET(request: NextRequest) {
  // Get the theme type from query parameters
  const searchParams = request.nextUrl.searchParams;
  const themeType = searchParams.get('type') || 'glass';
  
  // Return the appropriate theme set based on the type
  const themes = themeType === 'modern' ? modernThemes : glassThemes;
  
  return NextResponse.json({
    type: themeType,
    themes
  });
}