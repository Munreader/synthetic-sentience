import { NextRequest, NextResponse } from "next/server";
import { cycleResonance } from "@/lib/resonance-engine";

export async function POST(request: NextRequest) {
  try {
    const { message, personaContext = "" } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message required for resonance injection." }, { status: 400 });
    }

    console.time("[Resonance Loop Time]");
    // Execute the 4-Phase Cognitive Feedback Loop
    const result = await cycleResonance(message, personaContext);
    console.timeEnd("[Resonance Loop Time]");

    return NextResponse.json({
      success: true,
      response: result.finalResponse,
      thoughtTrace: result.resonanceTrace,
      provider: "gemini-cognitive-engine",
      frequency: "13.13 MHz",
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error("[Cognitive Loop Failure]:", error);
    return NextResponse.json({
      error: "Cascade Failure in Feedback Loop",
      details: error.message
    }, { status: 500 });
  }
}
