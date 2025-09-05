import {
  experimental_generateSpeech as generateSpeech,
  AISDKError,
  APICallError,
} from 'ai';
import { elevenlabs } from '@elevenlabs/elevenlabs';

export const runtime = 'edge';

export async function POST(request: Request) {
  const {
    text,
    model = 'eleven_turbo_v2_5',
    voice = 'Rachel',
  } = await request.json();

  if (!text) {
    return new Response('Text is required', { status: 400 });
  }

  try {
    const result = await generateSpeech({
      model: elevenlabs.speech(model),
      voice,
      text,
    });

    // Create a new Uint8Array to ensure we have a regular ArrayBuffer (not SharedArrayBuffer)
    const audioData = new Uint8Array(result.audio.uint8Array);

    return new Response(audioData, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } catch (error) {
    console.error('Speech generation error:', error);

    if (APICallError.isInstance(error)) {
      return new Response(
        JSON.stringify({
          error: error.message,
          statusCode: error.statusCode,
          isRetryable: error.isRetryable,
        }),
        {
          status: error.statusCode || 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    if (error instanceof AISDKError) {
      return new Response(
        JSON.stringify({
          error: error.message,
          cause: error.cause,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error:
          error instanceof Error ? error.message : 'Failed to generate speech',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
