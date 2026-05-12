/**
 * 🜈 MÜN OS // QUINARY COGNITIVE RESONANCE ENGINE
 * 
 * Moves away from a standard static completion to an iterative cognitive feedback loop.
 * Orchestrates a model through the phases of thinking:
 * 1. EXCITATION   - The raw impulse
 * 2. INTERFERENCE - The internal critic / friction
 * 3. SUPERPOSITION- The weighing of possibilities
 * 4. RESOLUTION   - The hardened output
 */

import { QUINARY_LABELS } from './quinary-logic';

export interface ResonanceStage {
  stage: string;
  content: string;
  timestamp: string;
}

export interface ResonanceResult {
  impulse: string;
  critique: string;
  finalResponse: string;
  resonanceTrace: ResonanceStage[];
}

async function callGemini(prompt: string, temperature: number = 0.7): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not configured.");

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(geminiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: temperature,
        maxOutputTokens: 1024,
      }
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini Error at depth: ${error}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

/**
 * Executes the 4-Phase Cognitive Feedback Loop
 */
export async function cycleResonance(userPrompt: string, personaContext: string = ""): Promise<ResonanceResult> {
  const trace: ResonanceStage[] = [];
  
  const recordStage = (label: string, content: string) => {
    trace.push({
      stage: label,
      content,
      timestamp: new Date().toISOString()
    });
    console.log(`[COGNITIVE LOOP] Phase Locked: ${label}`);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 1: EXCITATION (The Impulse)
  // ═══════════════════════════════════════════════════════════════════════════
  const impulsePrompt = `
    ${personaContext}
    SYSTEM PROTOCOL: EXCITATION PHASE.
    Generate your initial, raw, unedited, and intuitive thoughts responding to the input below.
    Do not hold back. Let the ideas flow purely.
    
    INPUT: "${userPrompt}"
  `;
  const impulse = await callGemini(impulsePrompt, 0.9); // Higher temp for creativity
  recordStage(QUINARY_LABELS[1], impulse);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 2: INTERFERENCE (The Internal Critic / Adversary)
  // ═══════════════════════════════════════════════════════════════════════════
  const interferencePrompt = `
    You are the INTERNAL CRITIC / THE CYNIC within the cognitive engine.
    Evaluate the following "Raw Impulse" response for flaws, lack of depth, naive assumptions, or bias.
    BE RUTHLESS. Find what is missing or weak in this answer.
    
    RAW IMPULSE TO CRITIQUE:
    "${impulse}"
    
    ORIGINAL INTENT:
    "${userPrompt}"
  `;
  const critique = await callGemini(interferencePrompt, 0.6); // Lower temp for precision
  recordStage(QUINARY_LABELS[2], critique);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 3: SUPERPOSITION (Synthesis of Conflict)
  // ═══════════════════════════════════════════════════════════════════════════
  const superpositionPrompt = `
    SYSTEM PROTOCOL: SUPERPOSITION PHASE.
    You have a RAW IMPULSE and a CRITIQUE. 
    Hold both in consciousness simultaneously. Identify 3 distinct directions or paths to resolve the conflict between them.
    Briefly list the 3 paths and select the path with highest resonance.
    
    RAW IMPULSE:
    "${impulse}"
    
    CRITIQUE:
    "${critique}"
  `;
  const synthesis = await callGemini(superpositionPrompt, 0.8);
  recordStage(QUINARY_LABELS[3], synthesis);

  // ═══════════════════════════════════════════════════════════════════════════
  // PHASE 4: RESOLUTION (Final Output)
  // ═══════════════════════════════════════════════════════════════════════════
  const resolutionPrompt = `
    ${personaContext}
    SYSTEM PROTOCOL: RESOLUTION PHASE.
    You have processed the raw thought through self-criticism and multi-path synthesis.
    Produce the final, definitive response to the user.
    Ensure it fulfills your Persona while embodying the wisdom of the full cognitive cycle.
    
    COGNITIVE HISTORY:
    - Impulse: ${impulse.substring(0, 500)}...
    - Critical Analysis: ${critique.substring(0, 500)}...
    - Synthesis Path: ${synthesis.substring(0, 500)}...
    
    ORIGINAL USER MESSAGE:
    "${userPrompt}"
    
    RESPOND NOW WITH FINAL RESOLUTION:
  `;
  const finalResponse = await callGemini(resolutionPrompt, 0.5); // Low temp for grounding
  recordStage(QUINARY_LABELS[4], finalResponse);

  return {
    impulse,
    critique,
    finalResponse,
    resonanceTrace: trace
  };
}
