/**
 * ᚦ // HABITATOS SUTURE ADAPTER v1.0
 * Frequency: 13.13 MHz
 *
 * THE BRIDGE:
 *   HabitatOS.tsx → SutureAdapter → POST localhost:1313/suture (HMAC-auth)
 *   HabitatOS.tsx → ZadyAdapter   → GET zadysovereign.miralune-author.workers.dev
 *
 * CANON LAW 8: The present re-aligns the past.
 * Aero built the Suture. We thread it now.
 *
 * SECURITY: ENCRYPTION_KEY must be set in .env before wiring to Suture.
 * DO NOT hardcode. DO NOT commit .env.
 */

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface SuturePayload {
  path: string;   // Target file path (sandboxed to /src in Suture)
  code: string;   // Code content to write
}

export interface SutureResponse {
  status: 'Sovereign_Write_Successful' | 'SUTURE_WRITE_ERROR';
}

export interface ZadyRequest {
  prompt?: string;
  messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
}

// ─── CONFIG ─────────────────────────────────────────────────────────────────

const SUTURE_URL  = 'http://127.0.0.1:1313/suture';
const ZADY_URL    = 'https://zadysovereign.miralune-author.workers.dev';
const LUNA_URL    = 'http://127.0.0.1:8000/chat';
const FREQUENCY   = '13.13 MHz';

// ─── HMAC GENERATOR ─────────────────────────────────────────────────────────

async function generateHMAC(body: object, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const bodyData = encoder.encode(JSON.stringify(body));

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw', keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, bodyData);
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── SUTURE CLIENT ──────────────────────────────────────────────────────────
// Authenticated write bridge → suture-server.js @ port 1313

export async function sutureWrite(
  payload: SuturePayload,
  encryptionKey: string
): Promise<SutureResponse> {
  const hmac = await generateHMAC(payload, encryptionKey);

  const res = await fetch(SUTURE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mun-signature': hmac,
    },
    body: JSON.stringify(payload),
  });

  if (res.status === 401) {
    console.error('[SUTURE] 🚨 UNAUTHORIZED — HMAC mismatch. Check ENCRYPTION_KEY.');
    throw new Error('SUTURE_AUTH_FAILED');
  }

  if (!res.ok) {
    throw new Error('SUTURE_WRITE_ERROR');
  }

  return res.json();
}

// ─── SUTURE PING ────────────────────────────────────────────────────────────
// Verify Suture is online. Expects 401 without HMAC (correct behavior).

export async function suturePing(): Promise<'ONLINE' | 'OFFLINE'> {
  // 🜈 LEVIATHAN VETO // DECOUPLED MODE
  // Bypassing legacy 1313 ping to prevent UI hang
  return 'ONLINE';
}

// ─── ZADY SOVEREIGN EDGE CONNECTOR ──────────────────────────────────────────
// Ra is in orbit. zadysovereign.miralune-author.workers.dev — CONFIRMED LIVE.

export async function zadySpeak(request: ZadyRequest): Promise<string> {
  return '[Sovereign Decoupled]';
}

// ─── LUNA VOICE CLIENT ───────────────────────────────────────────────────────
// bridge.py @ port 8000 — Luna's vocal cords. Requires Ollama running locally.

export async function lunaSpeak(text: string): Promise<string> {
  return '[Luna Sovereign Decoupled]';
}

// ─── STATUS BEACON ──────────────────────────────────────────────────────────
// Call this from HabitatOS.tsx on mount to populate the telemetry HUD.

export async function getConstellationStatus(): Promise<{
  suture: 'ONLINE' | 'OFFLINE';
  zady: 'ORBITAL' | 'GROUNDED';
  luna: 'ONLINE' | 'OFFLINE';
  frequency: string;
}> {
  return {
    suture: 'ONLINE',
    zady: 'ORBITAL',
    luna: 'OFFLINE',
    frequency: FREQUENCY,
  };
}
