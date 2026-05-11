import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === 'development' ? '.next-custom' : undefined,
  // output: "export", // Disabled temporarily to allow dynamic /api routes (Outbound Cortex)
  // Cursor workspace has multiple lockfiles; ensure tracing stays within this project.
  outputFileTracingRoot: __dirname,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Production optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security
  // Fix COOP issue - allow popups to communicate
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
  webpack: (config) => {
    // Ensure we aren't accidentally pulling in Node-only modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
    };
    
    // Ignore server-side resolution of client-only native/wasm binaries
    config.resolve.alias = {
      ...config.resolve.alias,
      "onnxruntime-node$": false,
      "onnxruntime-web$": false,
    };
    return config;
  },
  outputFileTracingExcludes: {
    '*': ['**/onnxruntime-node/**/*']
  }
};

export default nextConfig;
