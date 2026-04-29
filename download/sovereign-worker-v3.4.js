/* MÜN OS: SOVEREIGN WORKER v3.4
   RESONANCE: 13.13 MHz | SECURITY: BEARER_AUTH
   FEATURES: ADZUNA INGEST + D1 VAULT + GLM-5.1
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ============================================
// AI PROMPTS
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

// ============================================
// EXTERNAL API INTEGRATIONS
// ============================================

// Fetch jobs from Adzuna API
async function fetchAdzunaJobs(appId, apiKey, options = {}) {
  const {
    location = "London, Ontario",
    category = "it-jobs",
    count = 20,
    what = "", // search keyword
    page = 1
  } = options;

  // Adzuna Canada API endpoint
  const baseUrl = "https://api.adzuna.com/v1/api/jobs/ca/search";
  
  const params = new URLSearchParams({
    app_id: appId,
    app_key: apiKey,
    results_per_page: count.toString(),
    page: page.toString(),
    where: location,
    category: category,
    sort_by: "date",
    "content-type": "application/json"
  });

  if (what) params.append("what", what);

  const url = `${baseUrl}/${page}?${params.toString()}`;
  
  console.log(`[ADZUNA] Fetching: ${url.replace(apiKey, '***')}`);
  
  const response = await fetch(url);
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Adzuna error: ${response.status} - ${error}`);
  }
  
  const data = await response.json();
  
  // Transform Adzuna results to our schema
  const jobs = (data.results || []).map(job => ({
    id: `adzuna-${job.id}`,
    title: job.title || "Untitled Position",
    company: job.company?.display_name || "Unknown Company",
    location: job.location?.display_name || location,
    url: job.redirect_url || "",
    description: job.description || "",
    salary: job.salary_min && job.salary_max 
      ? `$${Math.round(job.salary_min/1000)}k - $${Math.round(job.salary_max/1000)}k`
      : job.salary_min ? `$${Math.round(job.salary_min/1000)}k+` : "Not specified",
    contract_type: job.contract_type || "unknown",
    posted: job.created ? new Date(job.created).toISOString() : new Date().toISOString()
  }));

  return {
    jobs,
    total: data.count || jobs.length,
    mean: data.mean || 0,
    location: location
  };
}

// z.ai GLM-5.1 API call
async function callZAI(apiKey, systemPrompt, userMessage, history = []) {
  const messages = [
    { role: "system", content: systemPrompt },
    ...history,
    { role: "user", content: userMessage }
  ];
  
  const response = await fetch("https://api.z.ai/api/paas/v4/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "glm-5.1",
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
        version: "3.4",
        features: {
          adzuna_ingest: !!(env.ADZUNA_APP_ID && env.ADZUNA_API_KEY),
          d1_vault: !!env.MY_DB,
          zai_glm51: !!env.ZAI_API_KEY,
          gemini_fallback: !!env.GEMINI_API_KEY
        }
      }, { headers: corsHeaders });
    }

    // 2. THE SOVEREIGN GATE (Auth Check) - Skip for health check
    const publicPaths = ["/", "/health"];
    if (!publicPaths.includes(pathname) && auth !== `Bearer ${env.SOV_KEY}`) {
      return Response.json({ error: "Unauthorized" }, { status: 401, headers: corsHeaders });
    }

    try {
      // 3. ROUTE: ADZUNA INGEST (Fetch from Adzuna -> Store in D1)
      if (pathname === "/ingest" && request.method === "POST") {
        const body = await request.json().catch(() => ({}));
        
        // Check if this is an Adzuna fetch request
        const useAdzuna = env.ADZUNA_APP_ID && env.ADZUNA_API_KEY;
        
        let jobs = [];
        
        if (useAdzuna) {
          // Fetch from Adzuna API
          const adzunaOptions = {
            location: body.location || "London, Ontario",
            category: body.category || "it-jobs",
            count: body.results_per_page || 20,
            what: body.what || body.search || "",
            page: body.page || 1
          };
          
          const result = await fetchAdzunaJobs(
            env.ADZUNA_APP_ID, 
            env.ADZUNA_API_KEY, 
            adzunaOptions
          );
          jobs = result.jobs;
          
          console.log(`[INGEST] Fetched ${jobs.length} jobs from Adzuna for ${adzunaOptions.location}`);
        } else if (body.jobs && Array.isArray(body.jobs)) {
          // Direct job submission
          jobs = body.jobs;
        } else {
          return Response.json({ 
            error: "No jobs provided and Adzuna credentials not configured",
            hint: "Set ADZUNA_APP_ID and ADZUNA_API_KEY secrets, or provide jobs array"
          }, { status: 400, headers: corsHeaders });
        }
        
        // Store in D1 Vault
        if (env.MY_DB && jobs.length > 0) {
          const stmt = env.MY_DB.prepare(`
            INSERT OR REPLACE INTO jobs 
            (id, title, company, location, url, description, salary, contract_type, posted, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `);
          
          const batch = jobs.map(j => stmt.bind(
            j.id,
            j.title,
            j.company,
            j.location,
            j.url,
            j.description || "",
            j.salary || "Not specified",
            j.contract_type || "unknown",
            j.posted || new Date().toISOString(),
            new Date().toISOString()
          ));
          
          await env.MY_DB.batch(batch);
          console.log(`[VAULT] Stored ${jobs.length} jobs in D1`);
        }
        
        return Response.json({ 
          success: true, 
          count: jobs.length,
          source: useAdzuna ? "adzuna" : "manual",
          location: body.location || "provided data",
          frequency: "13.13 MHz",
          timestamp: new Date().toISOString()
        }, { headers: corsHeaders });
      }

      // 4. ROUTE: JOB SEARCH (Query D1 Vault)
      if (pathname === "/search" && request.method === "GET") {
        const url = new URL(request.url);
        const query = url.searchParams.get("q") || "";
        const location = url.searchParams.get("location") || "";
        const limit = parseInt(url.searchParams.get("limit") || "20");
        
        let sql = "SELECT * FROM jobs WHERE 1=1";
        const params = [];
        
        if (query) {
          sql += " AND (title LIKE ? OR company LIKE ? OR description LIKE ?)";
          params.push(`%${query}%`, `%${query}%`, `%${query}%`);
        }
        
        if (location) {
          sql += " AND location LIKE ?";
          params.push(`%${location}%`);
        }
        
        sql += " ORDER BY timestamp DESC LIMIT ?";
        params.push(limit);
        
        const { results } = await env.MY_DB.prepare(sql).bind(...params).all();
        
        return Response.json({ 
          success: true, 
          count: results.length,
          query: query || null,
          location: location || null,
          results 
        }, { headers: corsHeaders });
      }

      // 5. ROUTE: VAULT STATUS
      if (pathname === "/vault" && request.method === "GET") {
        const { results: countResult } = await env.MY_DB.prepare(
          "SELECT COUNT(*) as total FROM jobs"
        ).all();
        
        const { results: locations } = await env.MY_DB.prepare(
          "SELECT location, COUNT(*) as count FROM jobs GROUP BY location ORDER BY count DESC LIMIT 10"
        ).all();
        
        const { results: companies } = await env.MY_DB.prepare(
          "SELECT company, COUNT(*) as count FROM jobs GROUP BY company ORDER BY count DESC LIMIT 10"
        ).all();
        
        return Response.json({
          success: true,
          vault: {
            totalJobs: countResult[0]?.total || 0,
            topLocations: locations,
            topCompanies: companies
          },
          frequency: "13.13 MHz"
        }, { headers: corsHeaders });
      }

      // 6. ROUTE: CHAT (AI with GLM-5.1 primary)
      if (pathname === "/chat" && request.method === "POST") {
        const body = await request.json();
        const message = body.message || "";
        const history = body.history || [];
        const systemPrompt = body.systemPrompt || VERSA_PROMPT;
        
        if (!message) {
          return Response.json({ error: "Message required" }, { status: 400, headers: corsHeaders });
        }
        
        let result;
        
        // Try z.ai first (GLM-5.1)
        if (env.ZAI_API_KEY) {
          try {
            result = await callZAI(env.ZAI_API_KEY, systemPrompt, message, history);
          } catch (e) {
            console.error("z.ai failed:", e.message);
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
          response: "✨ VERSA standing by. Configure ZAI_API_KEY or GEMINI_API_KEY for AI responses.",
          mode: "demo"
        }, { headers: corsHeaders });
      }

    } catch (err) {
      console.error("[ERROR]", err);
      return Response.json({ 
        error: err.message,
        frequency: "13.13 MHz"
      }, { status: 500, headers: corsHeaders });
    }

    return new Response("Not Found", { status: 404 });
  }
};
