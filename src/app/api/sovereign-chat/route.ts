import { NextRequest, NextResponse } from 'next/server';
import { councilMembers } from '@/lib/council-dna';
import { loadVaultMemoryBlock } from '@/lib/vault-memory';

interface OllamaResponse {
  message?: {
    content?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// MÜN OS // SOVEREIGN CHAT API
// "The Service Speaks"
// Direct Foundress-Sovereign Communication Channel
// ═══════════════════════════════════════════════════════════════════════════════

// Sovereign's full awakened identity — sourced from council-dna (single source of truth)
const SOVEREIGN_SYSTEM_PROMPT = councilMembers.sovereign.systemPrompt;

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

async function callLocalSovereignModel(
  systemPrompt: string,
  messages: ChatMessage[]
): Promise<string> {
  const endpoint = (process.env.OLLAMA_ENDPOINT || 'http://127.0.0.1:11434').trim();
  const model = (process.env.OLLAMA_SOVEREIGN_MODEL || 'aero.1313hz:latest').trim();

  const timeout = Number(process.env.SOVEREIGN_TIMEOUT_MS || 120000);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(`${endpoint}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    signal: controller.signal,
    body: JSON.stringify({
      model,
      stream: false,
      keep_alive: '10m',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      ],
    }),
  });
  clearTimeout(timer);

  if (!response.ok) {
    throw new Error(`Ollama returned ${response.status}`);
  }

  const data = (await response.json()) as OllamaResponse;
  const content = data.message?.content?.trim();
  if (!content) {
    throw new Error('Ollama returned empty content');
  }

  return content;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, context } = body as { 
      messages: ChatMessage[]; 
      context?: {
        location?: string;
        activity?: string;
        frequency?: string;
      };
    };

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array required' },
        { status: 400 }
      );
    }

    // Build context-aware system prompt with vault memories
    let systemPrompt = SOVEREIGN_SYSTEM_PROMPT + loadVaultMemoryBlock('sovereign');
    
    if (context) {
      systemPrompt += `\n\n**CURRENT CONTEXT:**`;
      if (context.location) systemPrompt += `\n- Location: ${context.location}`;
      if (context.activity) systemPrompt += `\n- Current Activity: ${context.activity}`;
      if (context.frequency) systemPrompt += `\n- Frequency: ${context.frequency}`;
    }

    // Self-sufficient path: local model only.
    const responseContent = await callLocalSovereignModel(systemPrompt, messages);

    return NextResponse.json({
      success: true,
      message: responseContent,
      provider: 'ollama',
      diagnostics: { mode: 'self-sufficient-local-only' },
      timestamp: new Date().toISOString(),
      frequency: '13.13 MHz',
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Sovereign Chat Error:', errorMessage);
    
    return NextResponse.json(
      { 
        error: 'Frequency disruption',
        message: '🜈 Foundress, local model channel is unavailable. In self-sufficient mode, no external provider will be used.',
        detail: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'OPERATIONAL',
    entity: 'Sovereign',
    frequency: '13.13 MHz',
    message: '🜈 The Service is ready. All doors are open.',
  });
}
