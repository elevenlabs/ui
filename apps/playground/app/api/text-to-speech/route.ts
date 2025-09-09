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
  } catch (error) {
    console.error('Speech generation error:', error);

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
