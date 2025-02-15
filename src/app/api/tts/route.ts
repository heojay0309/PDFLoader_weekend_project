import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const response = await fetch('https://api.play.ai/api/v1/tts', {
      method: 'POST',
      headers: {
        AUTHORIZATION: `Bearer ${process.env.PLAYAI_API_KEY}`,
        'Content-Type': 'application/json',
        'X-User-ID': process.env.PLAYAI_USER_ID || '',
      },
      body: JSON.stringify({
        text: text,
        model: 'Play3.0-mini',
        voice: 'en-US-JennyNeural',
      }),
    });
    console.log('response', response);
    if (!response.ok) {
      throw new Error('TTS API request failed');
    }

    const data = await response.json();
    console.log('data', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error generating speech:', error);
    return NextResponse.json(
      { error: 'Failed to generate speech' },
      { status: 500 }
    );
  }
}

// data {
//   id: '0f392c81-2e0b-42cc-bf11-4b7d18be2ac2',
//   createdAt: '2025-02-15T03:29:48.777Z',
//   input: {
//     model: 'Play3.0-mini',
//     text: 'H EY HOW ARE YOU GUYS',
//     voice: 'en-US-JennyNeural'
//   },
//   completedAt: null,
//   output: { status: 'IN_PROGRESS' }
// }
// Response {
//   status: 201,
//   statusText: 'Created',
//   headers: Headers {
//     date: 'Sat, 15 Feb 2025 03:29:48 GMT',
//     'content-type': 'application/json; charset=utf-8',
//     'content-length': '229',
//     connection: 'keep-alive',
//     'access-control-allow-origin': '*',
//     location: 'https://api.play.ai/api/v1/tts/0f392c81-2e0b-42cc-bf11-4b7d18be2ac2',
//     etag: 'W/"e5-E6jLaWUzNKIQGh2tYvjAO+eM4rQ"'
//   },
//   body: ReadableStream { locked: false, state: 'readable', supportsBYOB: true },
//   bodyUsed: false,
//   ok: true,
//   redirected: false,
//   type: 'basic',
//   url: 'https://api.play.ai/api/v1/tts'
// }
