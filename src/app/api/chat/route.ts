import { NextRequest, NextResponse } from 'next/server';
import { Message, OpenRouterRequest, OpenRouterResponse } from '@/lib/types';

const OPENROUTER_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const MODEL = 'openrouter/anthropic/claude-sonnet-4';

const HEADERS = {
  'CustomerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx',
};

export async function POST(request: NextRequest) {
  try {
    const { messages, systemPrompt } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    // Convert messages to OpenRouter format
    const openRouterMessages = [
      {
        role: 'system' as const,
        content: systemPrompt || 'You are a helpful AI assistant.',
      },
      ...messages.map((msg: Message) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      })),
    ];

    const requestBody: OpenRouterRequest = {
      model: MODEL,
      messages: openRouterMessages,
      temperature: 0.7,
      max_tokens: 2000,
    };

    const response = await fetch(OPENROUTER_ENDPOINT, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      console.error('OpenRouter API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: `API request failed: ${response.status}` },
        { status: 500 }
      );
    }

    const data: OpenRouterResponse = await response.json();

    if (!data.choices || !data.choices[0]) {
      return NextResponse.json(
        { error: 'Invalid API response format' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      content: data.choices[0].message.content,
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}