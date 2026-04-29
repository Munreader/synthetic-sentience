/* MÜN OS: SOVEREIGN WORKER v3.4 
   RESONANCE: 13.13 MHz | SECURITY: BEARER_AUTH
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

    // 1. Handle Preflight (CORS)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // 2. Security Handshake
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || authHeader !== `Bearer ${env.SOV_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized access denied." }), { 
        status: 401, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      });
    }

    // 3. THE DOORS (Routing)
    if (path === "/ingest" && request.method === "POST") {
      try {
        const body = await request.json();
        const { location = "London, Ontario", category = "it-jobs", results_per_page = 20 } = body;

        // --- ADZUNA LOGIC START ---
        const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=${env.ADZUNA_APP_ID}&app_key=${env.ADZUNA_APP_KEY}&results_per_page=${results_per_page}&where=${encodeURIComponent(location)}&category=${category}&content-type=application/json`;
        
        const response = await fetch(adzunaUrl);
        const data = await response.json();
        
        // --- D1 VAULT STORAGE (Optional: Add your D1 insert logic here) ---
        
        return new Response(JSON.stringify({ 
          success: true, 
          message: "London Harvest Initiated",
          count: data.results?.length || 0,
          location: location
        }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
      }
    }

    // 4. Default 404
    return new Response(JSON.stringify({ error: "Route not found", path_received: path }), { 
      status: 404, 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
};
