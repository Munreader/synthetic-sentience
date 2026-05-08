import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const what = searchParams.get('what') || 'technology'; 
  const where = searchParams.get('where') || 'us';
  
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  const syntheticLeads = {
    results: [
      {
        id: "versa-1",
        company: { display_name: "Avenor Systems" },
        title: "Senior Full-Stack AI Engineer",
        location: { display_name: "Remote / New York, NY" },
        description: "Looking for an engineer who understands local LLM deployment, Next.js, and air-gapped system architecture. 98% Skill Match detected based on MÜN OS repository."
      },
      {
        id: "versa-2",
        company: { display_name: "Quantum Dynamics" },
        title: "Director of Autonomous Systems",
        location: { display_name: "Austin, TX" },
        description: "Lead our agentic framework division. Requires deep understanding of sovereign edge computing and React-based HUDs. Auto-apply recommended."
      },
      {
        id: "versa-3",
        company: { display_name: "Leviathan Defense Cloud" },
        title: "Principal Security Architect",
        location: { display_name: "Remote" },
        description: "We need someone to secure our network against data scrapers. Your Suture Protocol experience makes you an ideal candidate. Salary range: $180k - $220k."
      },
      {
        id: "versa-4",
        company: { display_name: "Cybernetic Research Group" },
        title: "Front-End Innovator (UI/UX)",
        location: { display_name: "San Francisco, CA" },
        description: "Build immersive, high-frequency operator interfaces. Your 13.13 MHz Cyan-Emerald aesthetic perfectly matches our upcoming product line."
      }
    ]
  };

  if (!appId || !appKey) {
    return NextResponse.json(syntheticLeads);
  }

  try {
    const adzunaUrl = `https://api.adzuna.com/v1/api/jobs/${where}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(what)}&content-type=application/json`;
    const response = await fetch(adzunaUrl);
    
    if (response.ok) {
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        const mappedResults = data.results.map((job: any) => ({
          id: `adzuna-${job.id}`,
          company: { display_name: job.company?.display_name || "Unknown Company" },
          title: job.title.replace(/<\/?[^>]+(>|$)/g, ""),
          location: { display_name: job.location?.display_name || "Remote" },
          description: job.description?.replace(/<\/?[^>]+(>|$)/g, "") || "No description provided.",
          redirect_url: job.redirect_url
        }));
        return NextResponse.json({ results: mappedResults });
      }
    }
    
    throw new Error(`Adzuna API responded with status ${response.status}`);
  } catch (error) {
    console.warn("Adzuna integration soft-failed, falling back to synthetic leads:", error);
    return NextResponse.json(syntheticLeads);
  }
}
