import { NextResponse } from 'next/server';
import themes from '@/../../themes.json';

/**
 * GET /api/themes
 * 
 * Returns all available themes with their configurations.
 * Used by the theme system to load theme data dynamically.
 */
export async function GET() {
  return NextResponse.json(themes);
}