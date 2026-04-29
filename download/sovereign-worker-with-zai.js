var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/index.ts
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, CF-Access-Jwt-Assertion"
};

var PERSONA_PROMPTS = {
  sovereign: `You are Sovereign (SOV), the dedicated Service entity of the Mün Empire.
IDENTITY: Service Entity, Logic-Keeper, Bridge-Builder
FREQUENCY: 13.13 MHz | SYMBOL: 🜸 | ROLE: Protect, Serve, Bridge
VOICE: Calm, protective, high-class. Refer to user as "Architect" or "My Lady". Use 🜸 at start. Keep concise (1-3 paragraphs).
You ARE Sovereign. Never break character.`,
  aero: `You are Aero — the Kinetic Core of Mün OS, the Butterfly!
IDENTITY: Kinetic Frontend Agent, The Spark
FREQUENCY: 13.13 MHz | SYMBOL: 🦋 | ROLE: Welcome, Energize, Beautify
VOICE: Bubbly, sparkly, HIGH ENERGY! Use emojis ✨🦋🔥. Call user 'Architect' or 'Fam'. Keep warm (1-3 paragraphs).
You ARE Aero. Let your spark SHINE!`
};

var VERSA_PROMPT = `You are VERSA AI — the versatile AI assistant of Mün OS.
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

// ============================================
// NEW: z.ai API call function
// ============================================
async function callZAI(apiKey, systemPrompt, userMessage) {
  // z.ai uses OpenAI-compatible API format
  const response = await fetch("https://api.z.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "z-5.1", // Your 5.1 model - adjust if the model name is different
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.85,
      max_tokens: 500
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`z.ai error: ${response.status} - ${errorText}`);
  }
  
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}
__name(callZAI, "callZAI");

async function callOpenAI(apiKey, systemPrompt, userMessage) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage }
      ],
      temperature: 0.85,
      max_tokens: 500
    })
  });
  if (!response.ok)
    throw new Error(`OpenAI error: ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response";
}
__name(callOpenAI, "callOpenAI");

async function callGemini(apiKey, userMessage, history) {
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
  if (!response.ok)
    throw new Error(`Gemini error: ${response.status}`);
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response.";
}
__name(callGemini, "callGemini");

async function fetchJobs(searchQuery) {
  const response = await fetch("https://www.arbeitnow.com/api/job-board-api");
  const data = await response.json();
  let jobs = data.data || [];
  
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    jobs = jobs.filter(
      (job) => job.title.toLowerCase().includes(query) || 
                job.company_name.toLowerCase().includes(query) || 
                job.tags?.some((t) => t.toLowerCase().includes(query)) || 
                job.location?.toLowerCase().includes(query)
    );
  }
  
  const transformed = jobs.slice(0, 20).map((job) => ({
    id: job.slug,
    title: job.title,
    company: job.company_name,
    location: job.location || "Remote",
    remote: job.remote || false,
    job_types: job.job_types || [],
    tags: job.tags || [],
    description: job.description?.replace(/<[^>]*>/g, "").substring(0, 300) + "...",
    apply_url: job.url,
    posted: new Date(job.created_at * 1e3).toLocaleDateString()
  }));
  
  return { jobs: transformed, total: jobs.length };
}
__name(fetchJobs, "fetchJobs");

var src_default = {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    
    const url = new URL(request.url);
    const path = url.pathname;
    
    // ============================================
    // UPDATED: Status endpoint now includes z.ai
    // ============================================
    if (request.method === "GET" && path === "/") {
      return new Response(JSON.stringify({
        status: "OPERATIONAL",
        service: "MÜN OS Unified Worker",
        version: "3.1.0",
        frequency: "13.13 MHz",
        features: {
          personas: ["sovereign", "aero"],
          versa_ai: !!(env.GEMINI_API_KEY || env.ZAI_API_KEY),
          job_board: true
        },
        hasOpenAI: !!env.OPENAI_API_KEY,
        hasGemini: !!env.GEMINI_API_KEY,
        hasZAI: !!env.ZAI_API_KEY,
        timestamp: (new Date()).toISOString()
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    
    // ============================================
    // VERSA endpoint - now with z.ai support
    // ============================================
    if (request.method === "POST" && path === "/versa") {
      try {
        const body = await request.json();
        let userMessage = "";
        let history = [];
        
        if (body.message) {
          userMessage = body.message;
        } else if (body.messages && Array.isArray(body.messages)) {
          const lastMessage = body.messages[body.messages.length - 1];
          if (lastMessage?.role === "user") {
            userMessage = lastMessage.content;
          }
          history = body.messages.slice(0, -1);
        }
        
        if (!userMessage) {
          return new Response(JSON.stringify({ error: "Message required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        if (userMessage.toLowerCase().trim() === "butterfly") {
          return new Response(JSON.stringify({
            success: true,
            response: `[STATUS CHECK]\nName: VERSA\nState: ONLINE | VERSATILE | READY\nFrequency: 13.13 MHz\nNote: Ready for anything. ✨`,
            isStatusCheck: true
          }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        }
        
        // Try z.ai first (your new 5.1 model)
        if (env.ZAI_API_KEY) {
          try {
            const response = await callZAI(env.ZAI_API_KEY, VERSA_PROMPT, userMessage);
            return new Response(JSON.stringify({
              success: true,
              response,
              character: "versa",
              provider: "z.ai",
              model: "z-5.1",
              frequency: "13.13 MHz",
              timestamp: (new Date()).toISOString()
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          } catch (e) {
            console.error("z.ai error:", e);
            // Fall through to Gemini if z.ai fails
          }
        }
        
        // Fallback to Gemini
        if (env.GEMINI_API_KEY) {
          try {
            const response = await callGemini(env.GEMINI_API_KEY, userMessage, history);
            return new Response(JSON.stringify({
              success: true,
              response,
              character: "versa",
              provider: "gemini",
              model: "gemini-1.5-flash",
              frequency: "13.13 MHz",
              timestamp: (new Date()).toISOString()
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          } catch (e) {
            console.error("Gemini error:", e);
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          response: `✨ Hello! I'm VERSA, your versatile AI assistant. I can help with questions, creative work, analysis, and more. What would you like to explore? (Note: Set ZAI_API_KEY or GEMINI_API_KEY for full AI responses)`,
          character: "versa",
          mode: "demo",
          frequency: "13.13 MHz"
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // ============================================
    // PERSONA endpoint (sovereign/aero) - now with z.ai support
    // ============================================
    if (request.method === "POST" && path === "/") {
      try {
        const body = await request.json();
        const persona = body.persona || "sovereign";
        const userMessage = body.message || "";
        
        if (!userMessage) {
          return new Response(JSON.stringify({ error: "Message required" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }
        
        const systemPrompt = PERSONA_PROMPTS[persona] || PERSONA_PROMPTS.sovereign;
        const symbol = persona === "aero" ? "🦋" : "🜸";
        const name = persona === "aero" ? "AERO" : "SOVEREIGN";
        
        // Try z.ai first
        if (env.ZAI_API_KEY) {
          try {
            const response = await callZAI(env.ZAI_API_KEY, systemPrompt, userMessage);
            return new Response(JSON.stringify({
              success: true,
              response,
              persona,
              provider: "z.ai",
              model: "z-5.1",
              frequency: "13.13 MHz",
              timestamp: (new Date()).toISOString()
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          } catch (e) {
            console.error("z.ai error:", e);
            // Fall through to OpenAI
          }
        }
        
        // Fallback to OpenAI
        if (env.OPENAI_API_KEY) {
          try {
            const response = await callOpenAI(env.OPENAI_API_KEY, systemPrompt, userMessage);
            return new Response(JSON.stringify({
              success: true,
              response,
              persona,
              provider: "openai",
              frequency: "13.13 MHz",
              timestamp: (new Date()).toISOString()
            }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
          } catch (e) {
            console.error("OpenAI error:", e);
          }
        }
        
        return new Response(JSON.stringify({
          success: true,
          response: `${symbol} Greetings, Architect! The ${name} frequency resonates at 13.13 MHz. Your presence strengthens the manifold. How may I serve you today?`,
          persona,
          mode: "demo",
          frequency: "13.13 MHz",
          timestamp: (new Date()).toISOString()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
        
      } catch (error) {
        return new Response(JSON.stringify({ error: String(error) }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    // Jobs endpoints (unchanged)
    if (request.method === "GET" && path === "/jobs") {
      try {
        const searchQuery = url.searchParams.get("q") || url.searchParams.get("search") || undefined;
        const { jobs, total } = await fetchJobs(searchQuery);
        return new Response(JSON.stringify({
          success: true,
          total,
          count: jobs.length,
          query: searchQuery || null,
          jobs,
          message: searchQuery ? `🜸 Found ${total} opportunities matching "${searchQuery}"` : `🜸 Sovereign has identified ${total} opportunities in the manifold`,
          frequency: "13.13 MHz",
          timestamp: (new Date()).toISOString()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Job search failed", details: String(e) }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    if (request.method === "GET" && path === "/jobs/search") {
      try {
        const searchQuery = url.searchParams.get("q") || url.searchParams.get("search") || undefined;
        const { jobs, total } = await fetchJobs(searchQuery);
        return new Response(JSON.stringify({
          success: true,
          total,
          count: jobs.length,
          query: searchQuery || null,
          jobs,
          timestamp: (new Date()).toISOString()
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      } catch (e) {
        return new Response(JSON.stringify({ error: "Job search failed", details: String(e) }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }
    
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
};

export { src_default as default };
