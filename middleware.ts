import { NextRequest, NextResponse } from "next/server";

// Public mode is the safe default. Only private deployments should set SITE_MODE=family.
const siteMode = (
  process.env.SITE_MODE ||
  process.env.NEXT_PUBLIC_SITE_MODE ||
  (process.env.NODE_ENV === "development" ? "family" : "public")
).toLowerCase();
const isFamilyMode = siteMode === "family";

const PRIVATE_API_PREFIXES = [
  "/api/family",
  "/api/foundress",
  "/api/sovereign-memory",
  "/api/sovereign-chat",
  "/api/luna",
  "/api/chat-history",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isFamilyMode && PRIVATE_API_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.json(
      { error: "Not Found" },
      { status: 404 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
