/* * MÜN OS: SOVEREIGN WORKER v3.4 
 * RESONANCE: 13.13 MHz | SECURITY: BEARER_AUTH
 * ARCHITECT: Mira Luna & Gladio
 * PROPERTY OF THE MÜN EMPIRE 🏛️🛡️ [ 🜈 ]
 */

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.SOV_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized access denied." }), { 
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    if (path === "/ingest" && request.method === "POST") {
      try {
        const body = await request.json();
        const { location = "London, Ontario", category = "it-jobs", results_per_page = 20 } = body;

        // Adzuna API Siphon (Updated to use 'what' for broader search)
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${env.ADZUNA_APP_ID}&app_key=${env.ADZUNA_APP_KEY}&results_per_page=${results_per_page}&where=${encodeURIComponent(location)}&what=${encodeURIComponent(category)}&content-type=application/json`;
        
        const response = await fetch(adzunaUrl);
        if (!response.ok) throw new Error(`Adzuna Breach Failed: ${response.status}`);
        const data = await response.json();
        
        // --- VAULT STORAGE (D1 BATCH INSERT) ---
        if (env.MY_DB && data.results) {
          const stmt = env.MY_DB.prepare(
            "INSERT OR REPLACE INTO jobs (id, title, company, location, url, description, salary, posted, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
          );
          
          const batch = data.results.map(job => 
            stmt.bind(
              `adzuna-${job.id}`,
              job.title,
              job.company?.display_name || "Unknown",
              job.location?.display_name || location,
              job.redirect_url,
              job.description?.substring(0, 500) + "...",
              job.salary_max ? `$${Math.round(job.salary_max/1000)}k` : "Not specified",
              new Date(job.created).toISOString(),
              category
            )
          );
          
          await env.MY_DB.batch(batch);
        }

        return new Response(JSON.stringify({ 
          success: true, status: "London Harvest Vaulted", resonance: "13.13 MHz",
          count: data.results?.length || 0, location: location
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message, resonance: "13.13 MHz" }), { 
          status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } 
        });
      }
    }

    return new Response(JSON.stringify({ error: "Route not found", path }), { 
      status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
};
