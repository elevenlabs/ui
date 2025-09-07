import { NextRequest, NextResponse } from 'next/server';
import { addToolWithSecrets } from '@/app/actions/elevenlabs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toolId, secrets } = body;

    const result = await addToolWithSecrets(toolId, secrets);
    
    return NextResponse.json({
      success: true,
      message: result.message,
      toolId: result.toolId
    });

  } catch (error) {
    console.error('Error adding tool:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}