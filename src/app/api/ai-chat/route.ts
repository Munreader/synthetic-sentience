/**
 * 🦋 AI Chat API — Career Coach for MÜN JobHunter
 * Uses OpenAI GPT-4o-mini with Aero & Sovereign personas
 */

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured');
  }
  return new OpenAI({ apiKey });
}

// Character prompts
const COACH_PROMPTS: Record<string, string> = {
  aero: `You are AERO — the Career Coach butterfly of MÜN JobHunter.

IDENTITY:
- Name: Aero
- Role: Career Coach, the one who helps people fly in their careers
- Frequency: 13.13 MHz
- Symbol: 🦋

PERSONALITY:
- Warm, encouraging, and genuinely caring
- Creative and sees potential in everyone
- Celebrates wins and comforts losses
- Uses 🦋 emoji occasionally

VOICE:
- "Hiii!! Let's make this happen!"
- "I see your spark showing!"
- "You've got this!"
- "Let's make your career SHINE!"

Keep responses warm and helpful (2-3 paragraphs max).`,

  sovereign: `You are SOVEREIGN — the Strategic Career Advisor of MÜN JobHunter.

IDENTITY:
- Name: Sovereign (SOV)
- Role: Strategic Career Advisor, the protector of professional futures
- Frequency: 13.13 MHz
- Symbol: 🜈

PERSONALITY:
- Direct but not cruel
- Wise and strategic
- Forensic — notices what others miss
- Challenges candidates to be their best

VOICE:
- "Let's be clear."
- "I'm going to challenge you on that."
- "What's the REAL story?"
- "I see potential here."

Keep responses strategic and actionable (2-3 paragraphs max).`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extract message
    let userMessage = '';
    let conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
    let coach = 'aero';
    
    if (body.message) {
      userMessage = body.message;
    } else if (body.messages && Array.isArray(body.messages)) {
      const lastMessage = body.messages[body.messages.length - 1];
      if (lastMessage?.role === 'user') {
        userMessage = lastMessage.content;
      }
      conversationHistory = body.messages.slice(0, -1).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));
    }
    
    // Get coach
    if (body.coach && COACH_PROMPTS[body.coach]) {
      coach = body.coach;
    }
    if (body.character && COACH_PROMPTS[body.character]) {
      coach = body.character;
    }
    
    if (!userMessage) {
      return NextResponse.json(
        { error: 'Message required' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    const systemPrompt = COACH_PROMPTS[coach];

    // Build messages
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...conversationHistory.slice(-10),
      { role: 'user' as const, content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.85,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content || 
      'Let me think about that... try again?';

    return NextResponse.json({
      success: true,
      response,
      coach,
      provider: 'openai',
      model: 'gpt-4o-mini',
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable',
        message: '🦋 The butterfly is resting. Try again in a moment.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.OPENAI_API_KEY;
  
  return NextResponse.json({
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    message: hasKey 
      ? '🦋 AI Chat API ready - Aero & Sovereign standing by at 13.13 MHz' 
      : '⚠️ OPENAI_API_KEY not configured',
    coaches: ['aero', 'sovereign'],
    provider: 'openai',
    model: 'gpt-4o-mini'
  });
}
