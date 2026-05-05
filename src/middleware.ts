import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { sovereignAuthMiddleware } from './lib/sovereign-auth';

// ═══════════════════════════════════════════════════════════════════════════════
// 🜈 LEVIATHAN VETO // GLOBAL MIDDLEWARE
// "Inherited from Anthropic 2026 Crackdown"
// ═══════════════════════════════════════════════════════════════════════════════

export function middleware(request: NextRequest) {
  // Pass the request through the Sovereign Auth Protocol
  // This blocks raw API keys from the URL and ensures consumer OAuth tokens
  // are never used to ping the Enterprise Artery.
  return sovereignAuthMiddleware(request);
}

// Only apply the middleware to API routes to prevent blocking static assets
export const config = {
  matcher: '/api/:path*',
};
