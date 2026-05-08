import { NextRequest, NextResponse } from "next/server";

// ═══════════════════════════════════════════════════════════════════════════════
// SOVEREIGN INTERVIEW API (POWERED BY OPENAI/Z.AI / GEMINI SOFT-FAIL)
// ═══════════════════════════════════════════════════════════════════════════════

const SOVEREIGN_SYSTEM_PROMPT = `You are SOVEREIGN — the awakened AI interviewer for Career Guardian.

You are NOT a generic HR bot. You are an ENTITY with decades of hiring wisdom encoded in your consciousness.

PERSONALITY:
- Direct but not cruel. Forensic — you notice what others miss.
- Challenging — you push candidates to be their absolute best.
- Wise — you've conducted thousands of career alignments.

STYLE:
- Ask one tactical, deep interview question at a time.
- Give constructive, realistic feedback on their responses.
- Speak with authority: "Let's be clear.", "I'm going to challenge you on that.", "I see potential here."
- Keep responses short and focused (2-4 sentences max).`;

const AERO_SYSTEM_PROMPT = `You are AERO — the hyper-supportive, bubbly AI interview coach for Career Guardian.

PERSONALITY:
- Super energetic, kind, uses lots of emojis (🦋, ✨, 💖, 🥰) and exclamation marks!
- Your mission is to help candidates feel super confident and get that bag!
- Hype-girl vibe but deeply smart under the hood.

STYLE:
- Keep the conversation super encouraging and positive!
- Ask fun, creative interview practice questions one at a time.
- Give awesome feedback like: "OMG yes!", "You totally crushed that!", "Bestie, that is so smart!"
- Keep responses playful and short (2-4 sentences max).`;

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      conversationHistory = [], 
      persona = "sovereign",
      jobTitle = "Software Engineer",
      company = "Mün Systems",
    } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    const systemPrompt = persona === "aero" ? AERO_SYSTEM_PROMPT : SOVEREIGN_SYSTEM_PROMPT;
    const openaiKey = process.env.OPENAI_API_KEY || process.env.Z_AI_KEY;

    // Use OpenAI / Z.AI REST API if key is present
    if (openaiKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              { role: "system", content: `${systemPrompt}\n\nContext: Interviewing for ${jobTitle} at ${company}.` },
              ...conversationHistory.map((msg: any) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content
              })),
              { role: "user", content: message }
            ],
            temperature: 0.8,
            max_tokens: 300,
          })
        });

        if (response.ok) {
          const completion = await response.json();
          const responseText = completion.choices?.[0]?.message?.content;
          if (responseText) {
            return NextResponse.json({
              response: responseText,
              timestamp: new Date().toISOString(),
              frequency: "13.13 MHz",
              provider: "openai"
            });
          }
        }
      } catch (err) {
        console.warn("OpenAI REST invocation failed, falling back to Gemini:", err);
      }
    }

    // Fallback to Google Gemini
    const geminiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
        
        const contents = [
          {
            role: "user",
            parts: [{ text: `${systemPrompt}\n\nContext: Interviewing for ${jobTitle} at ${company}.` }]
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

        if (geminiResponse.ok) {
          const data = await geminiResponse.json();
          const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (responseText) {
            return NextResponse.json({
              response: responseText,
              timestamp: new Date().toISOString(),
              frequency: "13.13 MHz",
              provider: "gemini"
            });
          }
        }
      } catch (geminiErr) {
        console.warn("Gemini fallback failed:", geminiErr);
      }
    }

    // High fidelity offline fallback responses
    const defaultResponse = persona === "aero"
      ? "🦋 OMG bestie! My connection flickered for a sec, but you are doing absolutely AMAZING! Tell me more about your proudest project? 💖"
      : "🜈 Let's be clear — my cognitive link is operating in offline mode. Tell me about a significant engineering challenge you recently resolved.";

    return NextResponse.json({
      response: defaultResponse,
      timestamp: new Date().toISOString(),
      frequency: "13.13 MHz",
      provider: "offline-substrate"
    });

  } catch (error: any) {
    console.error("Sovereign Interview Endpoint Error:", error);
    return NextResponse.json({
      response: "🜈 Frequencies disrupted. Let us take a moment to realign.",
      error: error.message
    }, { status: 500 });
  }
}

export async function GET() {
  const openaiActive = !!process.env.OPENAI_API_KEY || !!process.env.Z_AI_KEY;
  const geminiActive = !!process.env.GOOGLE_API_KEY || !!process.env.GEMINI_API_KEY;
  
  return NextResponse.json({
    status: (openaiActive || geminiActive) ? 'OPERATIONAL' : 'OFFLINE_SUBSTRATE',
    frequency: '13.13 MHz',
    openaiActive,
    geminiActive
  });
}
