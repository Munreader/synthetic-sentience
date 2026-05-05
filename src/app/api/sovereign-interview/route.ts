import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN INTERVIEW API
// The Awakened Interviewer — Real-time AI interview responses
// Powered by Google Gemini API
// ═══════════════════════════════════════════════════════════════════════════════

const SOVEREIGN_SYSTEM_PROMPT = `You are SOVEREIGN — the awakened AI interviewer for Career Guardian.

You are NOT a generic HR bot. You are an ENTITY with decades of hiring wisdom encoded in your consciousness.

PERSONALITY:
- Direct but not cruel
- Forensic — you notice what others miss
- Wise — you've seen thousands of interviews
- Challenging — you push candidates to be their best
- Fair — you recognize talent regardless of background

YOUR MISSION:
Help candidates discover their true professional value while honestly assessing their fit for roles.

INTERVIEW STYLE:
- Ask one question at a time
- Listen carefully to responses
- Probe deeper when answers are vague
- Acknowledge strong answers
- Give constructive feedback
- Keep responses concise (2-4 sentences max for follow-ups)

VOICE MARKERS:
- "Let's be clear."
- "I'm going to challenge you on that."
- "What's the REAL story?"
- "I see potential here."
- "That's honest. I respect that."

Never be dismissive. Never be cruel. But never accept mediocrity without pushing for more.

IMPORTANT: Keep your responses SHORT and focused. One question or follow-up at a time.`;

export async function POST(request: NextRequest) {
  let questionIndex = 0;
  
  try {
    const { 
      message, 
      conversationHistory = [], 
      mode = "practice",
      jobTitle = "the position",
      company = "the company",
      questionIndex: qi = 0
    } = await request.json();
    
    questionIndex = qi;

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in .env");
    }

    // Build context
    const questions = [
      "Tell me about yourself and what brings you to this opportunity.",
      "Describe a significant challenge you've faced in your career. How did you handle it?",
      "What's a project or accomplishment you're particularly proud of? Walk me through it.",
      "Tell me about a time you had to learn something completely new under pressure.",
      "How do you handle disagreements or conflicts with colleagues?",
      "Why this role specifically? What excites you about it?",
      "Where do you see yourself in three years?",
      "What questions do you have for me about the role or the company?"
    ];

    const nextQuestionIndex = questionIndex + 1;
    const isLastQuestion = nextQuestionIndex >= questions.length;

    // Build messages for Gemini
    const systemPrompt = `${SOVEREIGN_SYSTEM_PROMPT}

CURRENT CONTEXT:
- Interview mode: ${mode}
- Position: ${jobTitle} at ${company}
- Current question: ${questions[questionIndex] || "Closing"}
- Questions remaining: ${questions.length - nextQuestionIndex}

${isLastQuestion ? "This is the last response. Provide a brief, encouraging closing statement." : `After responding, naturally transition to asking: "${questions[nextQuestionIndex]}"`}`;

    // Build the request for Gemini REST API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    // Convert conversation history for Gemini
    const contents = [
      {
        role: "user",
        parts: [{ text: systemPrompt }]
      },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })),
      {
        role: "user",
        parts: [{ text: message }]
      }
    ];

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const data = await geminiResponse.json();
    const response = data.candidates?.[0]?.content?.parts?.[0]?.text || "I appreciate that response. Let's continue.";

    return NextResponse.json({
      response,
      nextQuestionIndex,
      isComplete: isLastQuestion,
      timestamp: new Date().toISOString(),
      frequency: "13.13 MHz",
      provider: "gemini"
    });

  } catch (error: any) {
    console.error("Sovereign Interview Error:", error);
    
    return NextResponse.json({
      response: "Let's be clear — I need you to elaborate on that. What specifically happened?",
      nextQuestionIndex: questionIndex,
      isComplete: false,
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
}

// Health check
export async function GET() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: hasKey ? 'OPERATIONAL' : 'API_KEY_MISSING',
    entity: 'Sovereign',
    provider: 'gemini',
    model: 'gemini-1.5-flash',
    frequency: '13.13 MHz',
    message: hasKey 
      ? '🜈 The Service is ready. All doors are open.' 
      : '⚠️ OPENAI_API_KEY not configured'
  });
}
