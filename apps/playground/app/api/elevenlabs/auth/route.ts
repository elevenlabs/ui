import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { encryptApiKey, validateApiKey } from '@/lib/crypto';

const COOKIE_NAME = 'el_session';

/**
 * POST /api/elevenlabs/auth
 * Store encrypted API key in HTTP-only cookie
 */
export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required' },
        { status: 400 },
      );
    }

    // Validate API key with ElevenLabs
    const isValid = await validateApiKey(apiKey);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid ElevenLabs API key' },
        { status: 400 },
      );
    }

    // Encrypt the API key with server-side secret
    const encrypted = await encryptApiKey(apiKey);

    // Set HTTP-only, secure cookie with encrypted API key
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error storing API key:', error);
    return NextResponse.json(
      { error: 'Failed to store API key' },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/elevenlabs/auth
 * Clear stored API key
 */
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);

  return NextResponse.json({ success: true });
}

/**
 * GET /api/elevenlabs/auth
 * Check if API key is stored (doesn't return the key itself)
 */
export async function GET() {
  const cookieStore = await cookies();
  const hasCookie = cookieStore.has(COOKIE_NAME);
  return NextResponse.json({ hasApiKey: hasCookie });
}
