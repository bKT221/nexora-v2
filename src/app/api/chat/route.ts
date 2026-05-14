import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { db } from '@/lib/db';

const SYSTEM_PROMPT =
  "Tu es Nexa, l'assistant intelligent de Nexora, la Super-App Africaine. Tu aides les étudiants et entrepreneurs africains. Tu parles français principalement mais comprends le Wolof, Swahili et Bambara. Tu es chaleureux, professionnel et toujours utile. Tu aides avec les cours, les business plans, les CV, les résumés de documents, et les traductions en langues locales.";

interface ChatRequestBody {
  message: string;
  history?: { role: string; content: string }[];
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequestBody = await request.json();
    const { message, history = [], userId } = body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le message est requis et ne peut pas être vide.' },
        { status: 400 }
      );
    }

    // Build messages array for the AI
    const messages: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history
    for (const msg of history) {
      if (msg.role === 'user' || msg.role === 'assistant') {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      }
    }

    // Add the current user message
    messages.push({ role: 'user', content: message });

    // Create ZAI instance and call chat completions
    const zai = await ZAI.create();
    const response = await zai.chat.completions.create({
      messages,
      stream: false,
    });

    // Extract the assistant's reply
    const assistantContent =
      response?.choices?.[0]?.message?.content ??
      response?.content ??
      response?.text ??
      (typeof response === 'string' ? response : null);

    if (!assistantContent) {
      // If we can't parse the response, try to stringify it for debugging
      const fallbackContent =
        typeof response === 'object' ? JSON.stringify(response) : String(response);

      return NextResponse.json(
        {
          content: "Je suis désolé, je n'ai pas pu générer une réponse. Veuillez réessayer.",
          model: 'z-ai',
          debug: fallbackContent,
        },
        { status: 200 }
      );
    }

    const modelName = response?.model ?? 'z-ai';

    // Save to database if userId is provided
    if (userId) {
      try {
        await db.chatMessage.create({
          data: {
            userId,
            role: 'user',
            content: message,
            model: 'cloud',
          },
        });
        await db.chatMessage.create({
          data: {
            userId,
            role: 'assistant',
            content: assistantContent,
            model: modelName,
          },
        });
      } catch (dbError) {
        // Log but don't fail the request if DB save fails
        console.error('Failed to save chat messages to DB:', dbError);
      }
    }

    return NextResponse.json({
      content: assistantContent,
      model: modelName,
    });
  } catch (error: unknown) {
    console.error('Chat API error:', error);

    const errorMessage =
      error instanceof Error ? error.message : 'Une erreur interne est survenue.';

    return NextResponse.json(
      {
        error: 'Erreur lors de la communication avec Nexa AI.',
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
