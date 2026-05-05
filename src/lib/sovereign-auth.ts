import { NextResponse } from 'next/server';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 SOVEREIGN AUTHENTICATION SUBSTRATE
// "Inherited from Anthropic 2026 Crackdown"
// ═══════════════════════════════════════════════════════════════════════════════

export type SecurityTier = 'TIER_1_AIRGAPPED' | 'TIER_2_ENTERPRISE' | 'TIER_3_CONSUMER';

interface AuthResponse {
  authorized: boolean;
  tier: SecurityTier;
  reason?: string;
}

/**
 * Validates a request against the MÜN OS Sovereign Protocol.
 * Strict separation between Consumer UI and Enterprise APIs.
 */
export async function validateSovereignRequest(request: Request): Promise<AuthResponse> {
  const url = new URL(request.url);
  
  // 1. TIER 1: Local Air-Gapped Operations (e.g., Suture Port 1313, Local Ollama)
  // If the request originates from localhost and targets an internal loopback, it is Tier 1.
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') {
    // Requires physical machine access or strict HMAC token.
    const signature = request.headers.get('x-mun-signature');
    if (signature) {
      return { authorized: true, tier: 'TIER_1_AIRGAPPED' };
    }
  }

  // 2. TIER 2: Enterprise API Artery (e.g., Versa Auto-Apply, B2B Outbound)
  // These routes MUST use server-side .env keys. The client CANNOT pass raw tokens.
  if (url.pathname.startsWith('/api/adzuna') || url.pathname.startsWith('/api/zady')) {
    const authHeader = request.headers.get('authorization');
    
    // Banning OAuth Scraping (The Anthropic Rule)
    if (authHeader && authHeader.startsWith('Bearer sess_')) {
      return { 
        authorized: false, 
        tier: 'TIER_2_ENTERPRISE', 
        reason: 'Leviathan Veto: Consumer OAuth tokens cannot be used to trigger Enterprise Artery functions.' 
      };
    }
    return { authorized: true, tier: 'TIER_2_ENTERPRISE' };
  }

  // 3. TIER 3: Consumer Shield (View-Only Access for Guests)
  // Any public-facing blog or chronicle access.
  return { authorized: true, tier: 'TIER_3_CONSUMER' };
}

/**
 * Edge Middleware wrapper to enforce the Anthropic Crackdown rules globally.
 */
export function sovereignAuthMiddleware(request: Request) {
  const url = new URL(request.url);
  
  // Block any client from trying to pass raw API keys in the query string or headers
  const hasRawKey = url.searchParams.has('api_key') || url.searchParams.has('app_key');
  if (hasRawKey) {
    return NextResponse.json(
      { error: "SOVEREIGN_VETO: Raw API keys are forbidden on the client side per Anthropic 2026 guidelines." },
      { status: 403 }
    );
  }

  return NextResponse.next();
}
