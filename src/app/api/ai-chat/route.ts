/**
 * 🦋 AI Chat API — Career Coach for MÜN JobHunter
 * Uses Google Gemini API REST to avoid dependency issues
 */

import { NextRequest, NextResponse } from 'next/server';

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
    let coach = 'sovereign';
    
    if (body.message) {
      userMessage = body.message;
    }
    
    // Get coach
    if (body.coach && COACH_PROMPTS[body.coach]) {
      coach = body.coach;
    }
    
    if (!userMessage) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in .env");
    }

    const systemPrompt = COACH_PROMPTS[coach];

    // Build the request for Gemini REST API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nUser says: ${userMessage}` }]
          }
        ],
        generationConfig: {
          temperature: 0.85,
          maxOutputTokens: 500,
        }
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Let me think about that... try again?';

    return NextResponse.json({
      success: true,
      response: responseText,
      coach,
      provider: 'gemini',
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Service temporarily unavailable',
        message: 'The transmission was blocked by the Leviathan.',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}
