// next.config.ts — Next.js 16 compatible
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Packages yang membutuhkan Node.js runtime (tidak bisa di-bundle)
  serverExternalPackages: [
    "exceljs",
    "bcryptjs",
    "ws",
    "@prisma/client",
    "@prisma/adapter-neon",
    "@neondatabase/serverless",
  ],

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
