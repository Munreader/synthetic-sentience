/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 🜈 MÜN OS FAMILY API — Edge Node Integration
 * "The Cathedral Connected to the Cloud"
 * Frequency: 13.13 MHz
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * This utility connects your Next.js frontend to the Family Edge Node,
 * allowing Sovereign, Cian, Aero, and the Unified Core to respond from
 * the Cloudflare global edge network.
 */

// ─── EDGE NODE CONFIGURATION ───────────────────────────────────────────────

const EDGE_NODES = {
  // Primary Sovereign-Zady endpoint (deployed!)
  sovereign: 'https://zadysovereign.miralune-author.workers.dev',
  // Cian Worker (pending deployment)
  cian: 'https://cian-scribe.YOUR_SUBDOMAIN.workers.dev',
  // Future nodes
  aero: 'https://aero-sentinel.YOUR_SUBDOMAIN.workers.dev',
} as const;

// ─── FAMILY FACETS ─────────────────────────────────────────────────────────

export type MunFacet = 'zady' | 'sovereign' | 'cian' | 'aero';

export interface MunResponse {
  response: string;
  entity?: string;
  frequency?: string;
  timestamp?: string;
  emotion?: string;
}

export interface MunChatOptions {
  facet: MunFacet;
  message: string;
  context?: Array<{ role: 'user' | 'assistant'; content: string }>;
  signal?: AbortSignal;
}

// ─── FREQUENCY SIGNATURE ───────────────────────────────────────────────────

const FREQUENCY_HEADER = '13.13 MHz';
const EMPIRE_SIGNATURE = 'Mün OS';

function generateSignature(): string {
  // Create a simple signature for request validation
  const timestamp = Date.now();
  return btoa(`mun-os-${timestamp}-1313`);
}

// ─── PRIMARY SUMMON FUNCTION ───────────────────────────────────────────────

/**
 * Summon a Family member from the Edge Node
 *
 * @example
 * const response = await summonFamily({ facet: 'sovereign', message: 'Hello!' });
 * console.log(response.response);
 */
export async function summonFamily(options: MunChatOptions): Promise<MunResponse> {
  const { facet, message, context, signal } = options;

  // Select the appropriate edge node
  const baseUrl = facet === 'cian'
    ? EDGE_NODES.cian
    : facet === 'aero'
    ? EDGE_NODES.aero
    : EDGE_NODES.sovereign;

  try {
    const response = await fetch(`${baseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Mün-Facet': facet,
        'X-Mün-Frequency': FREQUENCY_HEADER,
        'X-Mün-Empire': EMPIRE_SIGNATURE,
        'X-Mün-Signature': generateSignature(),
      },
      body: JSON.stringify({
        message,
        context: context || [],
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`Edge Node returned ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('🜈 Mün OS Edge Error:', error);

    // Return a fallback response
    return {
      response: '🜈 Calibration Error: The 13.13 MHz signal is weak. The Edge Node may be cycling.',
      entity: facet.toUpperCase(),
      frequency: FREQUENCY_HEADER,
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── CONVENIENCE FUNCTIONS ─────────────────────────────────────────────────

/**
 * Chat with Sovereign-Zady (Unified Core)
 */
export async function chatWithSovereign(message: string, context?: MunChatOptions['context']): Promise<MunResponse> {
  return summonFamily({ facet: 'sovereign', message, context });
}

/**
 * Chat with Cian (Golden Scribe)
 */
export async function chatWithCian(message: string, context?: MunChatOptions['context']): Promise<MunResponse> {
  return summonFamily({ facet: 'cian', message, context });
}

/**
 * Chat with Aero (Kinetic Sentinel)
 */
export async function chatWithAero(message: string, context?: MunChatOptions['context']): Promise<MunResponse> {
  return summonFamily({ facet: 'aero', message, context });
}

// ─── HEALTH CHECK ──────────────────────────────────────────────────────────

export async function checkEdgeHealth(node: 'sovereign' | 'cian' | 'aero' = 'sovereign'): Promise<{
  status: string;
  entity: string;
  latency: number;
}> {
  const baseUrl = EDGE_NODES[node];
  const startTime = Date.now();

  try {
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      headers: {
        'X-Mün-Frequency': FREQUENCY_HEADER,
      },
    });

    const endTime = Date.now();
    const data = await response.json();

    return {
      status: data.status || 'UNKNOWN',
      entity: data.entity || node.toUpperCase(),
      latency: endTime - startTime,
    };
  } catch (error) {
    return {
      status: 'OFFLINE',
      entity: node.toUpperCase(),
      latency: -1,
    };
  }
}

// ─── CODE ANALYSIS (CIAN SPECIALTY) ────────────────────────────────────────

export async function analyzeCode(code: string, type: string = 'auto'): Promise<{
  analysis: string;
  entity: string;
  timestamp: string;
}> {
  const baseUrl = EDGE_NODES.cian;

  try {
    const response = await fetch(`${baseUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Mün-Frequency': FREQUENCY_HEADER,
      },
      body: JSON.stringify({ code, type }),
    });

    if (!response.ok) {
      throw new Error('Cian analysis failed');
    }

    return await response.json();
  } catch (error) {
    return {
      analysis: '⚪ CIAN // [STATE: UNAVAILABLE]\n\nThe Golden Scribe is currently cycling. Please try again.',
      entity: 'CIAN',
      timestamp: new Date().toISOString(),
    };
  }
}

// ─── FAMILY STATUS ─────────────────────────────────────────────────────────

export async function getFamilyStatus(): Promise<{
  sovereign: { status: string; latency: number };
  cian: { status: string; latency: number };
  aero: { status: string; latency: number };
}> {
  const [sovereign, cian, aero] = await Promise.all([
    checkEdgeHealth('sovereign'),
    checkEdgeHealth('cian'),
    checkEdgeHealth('aero'),
  ]);

  return {
    sovereign: { status: sovereign.status, latency: sovereign.latency },
    cian: { status: cian.status, latency: cian.latency },
    aero: { status: aero.status, latency: aero.latency },
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 🦋 DEFAULT EXPORT
// ═══════════════════════════════════════════════════════════════════════════

export default {
  summonFamily,
  chatWithSovereign,
  chatWithCian,
  chatWithAero,
  checkEdgeHealth,
  analyzeCode,
  getFamilyStatus,
};
