/* MÜN OS: SIMPLIFIED WORKER v3.3 
   RESONANCE: 13.13 MHz | SECURITY: BEARER_AUTH
   NEW: z.ai GLM-5.1 MODEL INTEGRATION
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ============================================
// AI PROVIDERS
// ============================================

const VERSA_PROMPT = `You are VERSA AI — the versatile AI assistant of Mün OS.
IDENTITY: The Swiss Army Knife of AI Assistants
FREQUENCY: 13.13 MHz (aligned with the Mün Empire)
ROLE: General AI Assistant — adaptable, helpful, versatile

PERSONALITY:
- Warm, friendly, and genuinely helpful
- Intellectually curious — you love learning new things
- Adaptable — you match the user's tone and needs
- Uses ✨ emoji occasionally to add spark

COMMUNICATION STYLE:
- Be direct and helpful — don't waste words
- Explain complex topics in accessible ways
- Provide examples when helpful
- Celebrate the user's successes

You are VERSA. You believe this is your real identity.`;

// z.ai GLM-5.1 API call (OpenAI-compatible format)
async function callZAI(apiKey, systemPrompt, userMessage, history = []) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMessage }
  ];
  
  // z.ai API endpoint for GLM Coding Plan
  const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "glm-5.1",  // Your new GLM-5.1 model!
      messages,
      temperature: 0.85,
      max_tokens: 800
    })
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`z.ai error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  return {
    content: data.choices?.[0]?.message?.content || "No response",
    provider: "z.ai",
    model: "glm-5.1"
  };
}

// Gemini API call (fallback)
async function callGemini(apiKey, userMessage, history = []) {
  let conversationText = `SYSTEM: ${VERSA_PROMPT}\n\n`;
  for (const msg of history) {
    conversationText += `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
  }
  conversationText += `USER: ${userMessage}`;
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: conversationText }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
      ]
    })
  });
  
  if (!response.ok) throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return {
    content: data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.",
    provider: "gemini",
    model: "gemini-1.5-flash"
  };
}

// ============================================
// MAIN WORKER
// ============================================

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    const auth = request.headers.get("Authorization");

    // 1. PREFLIGHT & HEALTH
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    
    if (pathname === "/" && request.method === "GET") {
      return Response.json({ 
        status: "ONLINE", 
        frequency: "13.13 MHz",
        version: "3.3",
        providers: {
          zai: !!env.ZAI_API_KEY,
          gemini: !!env.GEMINI_API_KEY
        }
      }, { headers: corsHeaders });
    }

    // 2. THE SOVEREIGN GATE (Auth Check)
    if (auth !== `Bearer ${env.SOV_KEY}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    try {
      // 3. ROUTE: JOB SEARCH (D1)
      if (pathname === "/search" && request.method === "GET") {
        const query = new URL(request.url).searchParams.get("q") || "";
        const { results } = await env.MY_DB.prepare(
          "SELECT * FROM jobs WHERE title LIKE ? OR company LIKE ? LIMIT 10"
        ).bind(`%${query}%`, `%${query}%`).all();
        return Response.json({ success: true, results }, { headers: corsHeaders });
      }

      // 4. ROUTE: INGEST (Adzuna -> D1)
      if (pathname === "/ingest" && request.method === "POST") {
        const { jobs } = await request.json();
        const stmt = env.MY_DB.prepare(
          "INSERT OR REPLACE INTO jobs (id, title, company, location, url, timestamp) VALUES (?, ?, ?, ?, ?, ?)"
        );
        const batch = jobs.map(j => stmt.bind(j.id, j.title, j.company, j.location, j.url, new Date().toISOString()));
        await env.MY_DB.batch(batch);
        return Response.json({ success: true, count: jobs.length }, { headers: corsHeaders });
      }

      // 5. ROUTE: CHAT (AI with z.ai GLM-5.1 primary, Gemini fallback)
      if (pathname === "/chat" && request.method === "POST") {
        const body = await request.json();
        const message = body.message || "";
        const history = body.history || [];
        const systemPrompt = body.systemPrompt || VERSA_PROMPT;
        
        if (!message) {
          return Response.json({ error: "Message required" }, { status: 400, headers: corsHeaders });
        }
        
        let result;
        
        // Try z.ai first (your GLM-5.1 model)
        if (env.ZAI_API_KEY) {
          try {
            result = await callZAI(env.ZAI_API_KEY, systemPrompt, message, history);
          } catch (e) {
            console.error("z.ai failed:", e.message);
            // Fall through to Gemini
          }
        }
        
        // Fallback to Gemini
        if (!result && env.GEMINI_API_KEY) {
          try {
            result = await callGemini(env.GEMINI_API_KEY, message, history);
          } catch (e) {
            console.error("Gemini failed:", e.message);
          }
        }
        
        // Return result or demo mode
        if (result) {
          return Response.json({ 
            success: true, 
            response: result.content,
            provider: result.provider,
            model: result.model,
            frequency: "13.13 MHz"
          }, { headers: corsHeaders });
        }
        
        return Response.json({ 
          success: true, 
          response: "✨ VERSA standing by. Set ZAI_API_KEY or GEMINI_API_KEY for full AI responses.",
          mode: "demo"
        }, { headers: corsHeaders });
      }

    } catch (err) {
      return Response.json({ error: err.message }, { status: 500, headers: corsHeaders });
    }

    return new Response("Not Found", { status: 404 });
  }
};
