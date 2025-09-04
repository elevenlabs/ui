import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decryptApiKey } from '@/lib/crypto';

const COOKIE_NAME = 'el_session';
const ELEVENLABS_BASE_URL = 'https://api.elevenlabs.io';

/**
 * Proxy all ElevenLabs API requests
 * GET/POST/PUT/DELETE /api/elevenlabs/[...path]
 */
async function handleRequest(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Get encrypted API key from cookie
    const cookieStore = await cookies();
    const encryptedKey = cookieStore.get(COOKIE_NAME)?.value;
    
    if (!encryptedKey) {
      return NextResponse.json(
        { error: 'No API key configured. Please set your API key first.' },
        { status: 401 }
      );
    }
    
    // Decrypt the API key using server-side secret
    let apiKey: string;
    try {
      apiKey = await decryptApiKey(encryptedKey);
    } catch (error) {
      console.error('Failed to decrypt API key:', error);
      return NextResponse.json(
        { error: 'Failed to decrypt API key. Please reconfigure your API key.' },
        { status: 500 }
      );
    }
    
    // Build the ElevenLabs API URL
    const path = params.path.join('/');
    const url = `${ELEVENLABS_BASE_URL}/${path}`;
    
    // Forward the request to ElevenLabs
    const headers = new Headers();
    headers.set('xi-api-key', apiKey);
    headers.set('Content-Type', request.headers.get('Content-Type') || 'application/json');
    
    const elevenlabsResponse = await fetch(url, {
      method: request.method,
      headers: headers,
      body: request.body,
    });
    
    // Forward the response
    const responseData = await elevenlabsResponse.text();
    
    return new NextResponse(responseData, {
      status: elevenlabsResponse.status,
      statusText: elevenlabsResponse.statusText,
      headers: {
        'Content-Type': elevenlabsResponse.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function POST(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function PUT(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}

export async function DELETE(request: NextRequest, context: { params: { path: string[] } }) {
  return handleRequest(request, context);
}