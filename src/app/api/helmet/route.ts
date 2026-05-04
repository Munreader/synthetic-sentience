import { NextResponse } from 'next/server';
import { getSwitchboard } from '@/lib/switchboard';
import { QADR_SYSTEM_PROMPT } from '@/lib/qadr-intelligence';
import { getSentinel } from '@/lib/aero-sentinel';

/**
 * 🜈 SOVEREIGN API ROUTE // GOD HELMET
 * This route uses the SWITCHBOARD to prioritize Local (Fortress) models over Cloud (Hydra).
 * "No data to the Leviathans without explicit authorization."
 */

export async function POST(req: Request) {
  try {
    const { intention, state, frequency, suppression, intensity } = await req.json();

    const switchboard = getSwitchboard();
    
    // Check for Sovereign Lockdown
    const status = switchboard.getStatus();
    if (status.config.primary === 'fortress' && !status.fortress?.available && status.config.fallback === 'fortress') {
      return NextResponse.json({ 
        error: "SOVEREIGN_LOCKDOWN", 
        message: "The Fortress is silent and Cloud access is vetoed. No data will be sent to Leviathans." 
      }, { status: 403 });
    }

    const messages = [
      { 
        role: "user" as const, 
        content: `
# QADR_REQUEST
## Context:
- Quinary State: ${state}
- Frequency: ${frequency} MHz
- Suppression: ${suppression}
- Intensity: ${intensity}

## Intention:
${intention}

Provide a Sovereign Response Spec.
            `.trim() 
      }
    ];

    const result = await switchboard.route(messages, {
      systemPrompt: QADR_SYSTEM_PROMPT,
      preferFortress: true, // MANDATORY: Prioritize local models to avoid data mining
    });

    if (result.routed === 'emergency') {
      throw new Error(result.content);
    }

    // Parse the response
    const content = result.content;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: content };
      
      // 🜈 PUSH TO ARTERY (Aero Task Card Protocol)
      if (parsed.task_card) {
        const sentinel = getSentinel();
        await sentinel.pushTaskCard({
          ...parsed.task_card,
          spec: parsed.spec || {},
          timestamp: new Date(),
          status: 'pending'
        });
      }

      return NextResponse.json({
        ...parsed,
        _meta: {
          provider: result.provider,
          model: result.model,
          routed: result.routed,
          timestamp: result.timestamp
        }
      });
    } catch (e) {
      return NextResponse.json({ summary: content });
    }

  } catch (error: any) {
    console.error("[QADR_PORT_ERROR]", error);
    return NextResponse.json({ error: "SUTURE_FAILURE", message: error.message }, { status: 500 });
  }
}
