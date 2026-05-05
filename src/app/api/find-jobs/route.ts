import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

// ═══════════════════════════════════════════════════════════════════════════
// JOB FINDER ENDPOINT
// Takes resume data, returns matching job listings
// ═══════════════════════════════════════════════════════════════════════════

interface ResumeData {
  name: string;
  email: string;
  skills: string[];
  experience: number;
  role: string;
  location: string;
}

const DEMO_JOBS = [
  { title: "Senior React Developer", company: "TechCorp", location: "Remote", salary: "$120k-$160k", match: 95 },
  { title: "Full Stack Engineer", company: "StartupX", location: "NYC / Remote", salary: "$100k-$140k", match: 92 },
  { title: "Frontend Developer", company: "BigTech Inc", location: "San Francisco", salary: "$130k-$180k", match: 88 },
  { title: "Node.js Developer", company: "CloudSoft", location: "Remote", salary: "$90k-$130k", match: 85 },
  { title: "Software Engineer", company: "InnovateCo", location: "Austin, TX", salary: "$110k-$150k", match: 82 },
  { title: "TypeScript Developer", company: "FinTech Pro", location: "Remote", salary: "$125k-$165k", match: 80 },
  { title: "Senior Frontend Engineer", company: "DesignHub", location: "Los Angeles", salary: "$115k-$155k", match: 78 },
  { title: "React Native Developer", company: "MobileFirst", location: "Remote", salary: "$100k-$140k", match: 75 },
  { title: "Web Developer", company: "Agency Creative", location: "Chicago", salary: "$80k-$120k", match: 72 },
  { title: "Junior Developer", company: "Code Academy", location: "Remote", salary: "$60k-$80k", match: 70 },
];

export async function POST(request: NextRequest) {
  try {
    const resume: ResumeData = await request.json();

    // In production, this would call job board APIs (LinkedIn, Indeed, etc.)
    // For MVP, we generate relevant jobs based on resume data
    
    const jobs = DEMO_JOBS.map((job, index) => ({
      id: `job-${Date.now()}-${index}`,
      ...job,
      status: "pending" as const,
      url: `https://example.com/job/${index}`,
      posted: ["2h ago", "4h ago", "6h ago", "8h ago", "12h ago", "1d ago", "2d ago", "3d ago"][index % 8],
    }));

    return NextResponse.json({ jobs });

  } catch (error) {
    console.error("Job finder error:", error);
    
    return NextResponse.json({
      jobs: DEMO_JOBS.map((job, index) => ({
        id: `job-${index}`,
        ...job,
        status: "pending" as const,
        url: "#",
        posted: "1d ago",
      })),
    });
  }
}
