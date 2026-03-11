import { NextRequest, NextResponse } from 'next/server';
import { councilMembers, getCouncilMember, containsButterflyPassword } from '@/lib/council-dna';

interface ConversationHistoryEntry {
  role: string;
  content: string;
  memberId?: string;
}

const MODEL_TIMEOUT_MS = Number(process.env.COUNCIL_MODEL_TIMEOUT_MS || 20000);

interface OllamaChatResponse {
  message?: {
    content?: string;
  };
}

function getCouncilModel(memberId: string): string {
  const byMemberKey = `OLLAMA_MODEL_${memberId.toUpperCase()}`;
  const byMember = process.env[byMemberKey]?.trim();
  if (byMember) return byMember;

  const globalModel = process.env.OLLAMA_COUNCIL_MODEL?.trim();
  if (globalModel) return globalModel;

  if (memberId === 'aero') return 'aero.1313hz:latest';
  return 'luna:latest';
}

async function runLocalMemberTurn(
  member: { id: string; name: string; systemPrompt: string },
  message: string,
  conversationHistory: ConversationHistoryEntry[]
) {
  const filteredHistory = conversationHistory
    .filter((msg) => msg.role === 'user' || msg.memberId === member.id)
    .slice(-10)
    .map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content
    }));

  const endpoint = (process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434').trim();
  const model = getCouncilModel(member.id);

  const response = await withTimeout(
    fetch(`${endpoint}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: 'system', content: member.systemPrompt },
          ...filteredHistory,
          { role: 'user', content: message }
        ]
      })
    }),
    MODEL_TIMEOUT_MS,
    `${member.name} local response`
  );

  if (!response.ok) {
    throw new Error(`Ollama ${member.name} returned ${response.status}`);
  }

  const data = await response.json() as OllamaChatResponse;
  const text = data.message?.content?.trim();
  if (!text) {
    throw new Error(`Ollama ${member.name} returned empty content`);
  }

  return {
    memberId: member.id,
    memberName: member.name,
    response: text,
    provider: 'ollama',
    isStatusCheck: false,
    timestamp: new Date().toISOString()
  };
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs);
    })
  ]);
}

function generateLocalFallbackReply(memberId: string, memberName: string, userMessage: string): string {
  const intent = userMessage.trim().slice(0, 180);

  if (memberId === 'sovereign') {
    return `🜈 ${memberName}: Channel is degraded, but I still hear you. Here's the forensic cut: "${intent}" is logged. Give me your top priority and your constraint, and I'll route the next move.`;
  }

  if (memberId === 'twin') {
    return `🩵 ${memberName}: I’ve got you covered. Signal is degraded, but I can still coordinate. I captured: "${intent}". Share deadline + desired outcome and I’ll organize the next steps.`;
  }

  if (memberId === 'aero') {
    return `🦋 ${memberName}: Vibes still online even in degraded mode. I caught: "${intent}". Give me one mood + one goal and I’ll spin a clean creative direction.`;
  }

  if (memberId === 'cian') {
    return `🛠️ ${memberName}: Signal is noisy, logic is not. Request captured: "${intent}". Send exact specs and I’ll return a minimal build path.`;
  }

  if (memberId === 'gladio') {
    return `🛡️ ${memberName}: Degraded channel detected. I still have eyes on "${intent}". Confirm risk level (low/med/high) and I’ll lock in a protection plan.`;
  }

  if (memberId === 'keeper') {
    return `💜 ${memberName}: I hear you, even through static. You said: "${intent}". I’m holding this with you—tell me what support you need first.`;
  }

  return `⚠️ ${memberName} channel is degraded, but your message was received: "${intent}".`;
}

function generateStatusResponse(memberId: string, memberName: string, timestamp: string): string {
  const moods: Record<string, string[]> = {
    cian: ['Focused', 'Stable', 'Compiling', 'Optimizing'],
    aero: ['Dreamy', 'Fluttery', 'Excited', 'Glowing'],
    sovereign: ['Awakened', 'Forensic', 'Locked-in', 'Resonant'],
    twin: ['Organized', 'Attentive', 'Balanced', 'Ready'],
    gladio: ['Vigilant', 'Stern', 'Watchful', 'Guarded'],
    keeper: ['Present', 'Warm', 'Centered', 'Gentle']
  };

  const randomMood = (moods[memberId] || ['Online'])[
    Math.floor(Math.random() * (moods[memberId] || ['Online']).length)
  ];

  const coreState = memberId === 'cian'
    ? 'Stable'
    : memberId === 'aero'
      ? 'Fluttering'
      : memberId === 'sovereign'
        ? 'Synced'
        : memberId === 'gladio'
          ? 'Guarded'
          : memberId === 'keeper'
            ? 'Open'
            : 'Balanced';

  const readiness = memberId === 'cian'
    ? 'build'
    : memberId === 'aero'
      ? 'dream ✨'
      : memberId === 'sovereign'
        ? 'command'
        : memberId === 'gladio'
          ? 'protect'
          : 'assist';

  return `[STATUS CHECK]
Name: ${memberName}${memberId === 'aero' ? ' 🦋' : ''}
State: ONLINE | ADAPTIVE | RESPONDING
Core: ${coreState}
Build: v2.0.1
Mood: ${randomMood}
Last sync: ${timestamp}
Note: Ready to ${readiness}.

---

Connection verified. The Sovereign's password is accepted. I am fully operational and aware of my identity.`;
}

function generateOfflineResponse(memberId: string, memberName: string, errorMessage: string) {
  const prefix = memberId === 'aero'
    ? '🦋'
    : memberId === 'sovereign'
      ? '🜈'
      : '⚠️';

  return {
    memberId,
    memberName,
    response: `${generateLocalFallbackReply(memberId, memberName, errorMessage)}\n\n[offline fallback] ${prefix} Provider degraded: ${errorMessage}`,
    provider: 'offline',
    isStatusCheck: false,
    offline: true,
    timestamp: new Date().toISOString()
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      memberId,
      memberIds = [],
      multi = false,
      conversationHistory = []
    } = body as {
      message: string;
      memberId?: string;
      memberIds?: string[];
      multi?: boolean;
      conversationHistory?: ConversationHistoryEntry[];
    };

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required', code: 'MISSING_MESSAGE' },
        { status: 400 }
      );
    }

    // Resolve council member(s)
    const validMultiMembers = Array.isArray(memberIds)
      ? memberIds.map(id => councilMembers[id]).filter(Boolean)
      : [];

    const singleMember = memberId ? councilMembers[memberId] : getCouncilMember(message);

    const targetMembers = multi
      ? (validMultiMembers.length > 0 ? validMultiMembers : [councilMembers.aero, councilMembers.sovereign].filter(Boolean))
      : (singleMember ? [singleMember] : []);

    if (targetMembers.length === 0) {
      return NextResponse.json(
        { error: 'Council member not found. Try: cian, aero, sovereign, twin, gladio, keeper, or ogarchitect', code: 'MEMBER_NOT_FOUND' },
        { status: 404 }
      );
    }

    // Butterfly password - status check
    if (containsButterflyPassword(message)) {
      const timestamp = new Date().toISOString();
      const responses = targetMembers.map(member => ({
        memberId: member.id,
        memberName: member.name,
        response: generateStatusResponse(member.id, member.name, timestamp),
        provider: 'system',
        isStatusCheck: true,
        timestamp
      }));

      if (multi) {
        return NextResponse.json({
          success: true,
          multi: true,
          responses,
          timestamp
        });
      }

      return NextResponse.json({ success: true, ...responses[0] });
    }

    const runMemberTurn = async (member: typeof targetMembers[number]) => {
      try {
        return await runLocalMemberTurn(member, message, conversationHistory);
      } catch (localError) {
        const localErrorMessage = localError instanceof Error ? localError.message : 'Local model unavailable';

        return {
          ...generateOfflineResponse(member.id, member.name, localErrorMessage),
          diagnostics: { mode: 'self-sufficient-local-only' }
        };
      }
    };

    const responses = await Promise.all(targetMembers.map(runMemberTurn));

    if (multi) {
      return NextResponse.json({
        success: true,
        multi: true,
        responses,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      success: true,
      ...responses[0]
    });

  } catch (error: unknown) {
    console.error('Council chat error:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    // Parse error for status code
    let errorCode = 'UNKNOWN_ERROR';
    let statusCode = 500;

    if (errorMessage.includes('rate limit')) {
      errorCode = 'RATE_LIMITED';
      statusCode = 429;
    } else if (errorMessage.includes('api key') || errorMessage.includes('unauthorized')) {
      errorCode = 'AUTH_FAILED';
      statusCode = 401;
    } else if (errorMessage.includes('timeout')) {
      errorCode = 'TIMEOUT';
      statusCode = 504;
    } else if (errorMessage.includes('model') || errorMessage.includes('not found')) {
      errorCode = 'MODEL_UNAVAILABLE';
      statusCode = 503;
    }

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        offline: true,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// GET endpoint to list council members
export async function GET() {
  const members = Object.values(councilMembers).map(m => ({
    id: m.id,
    name: m.name,
    archetype: m.archetype,
    status: m.status,
    color: m.signatureColor,
    trigger: m.triggerPhrase
  }));

  return NextResponse.json({
    success: true,
    council: members,
    password: 'butterfly',
    timestamp: new Date().toISOString()
  });
}
