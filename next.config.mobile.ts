import type { NextConfig } from "next";

/**
 * MÜN OS Mobile Build Configuration
 * Use this config for static export to build APK/IPA
 * 
 * Usage: next build --config next.config.mobile.ts
 * 
 * Note: API routes won't work in static export.
 * The app will need to connect to a deployed backend.
 */

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  
  // Disable image optimization for static export
  images: {
    unoptimized: true,
  },
  
  // TypeScript config
  typescript: {
    ignoreBuildErrors: true,
  },
  
  reactStrictMode: false,
  
  // Redirect root to main app
  async redirects() {
    return [];
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
