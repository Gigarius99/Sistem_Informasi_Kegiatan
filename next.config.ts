// next.config.ts — Full Node.js runtime untuk Vercel (backend)
import type { NextConfig } from "next";

// URL frontend Cloudflare Pages (diisi saat production, kosong untuk localhost)
const FRONTEND_URL = process.env.FRONTEND_URL ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Packages yang membutuhkan Node.js runtime penuh (tidak bisa di-bundle Edge)
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

  async headers() {
    const corsHeaders = [
      {
        key: "Access-Control-Allow-Credentials",
        value: "true",
      },
      {
        key: "Access-Control-Allow-Methods",
        value: "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      },
      {
        key: "Access-Control-Allow-Headers",
        value: "Content-Type, Authorization, X-Requested-With",
      },
    ];

    // Hanya tambahkan Allow-Origin jika FRONTEND_URL diset (production split)
    // Jika kosong (localhost monolith), browser tidak perlu CORS
    if (FRONTEND_URL) {
      corsHeaders.unshift({
        key: "Access-Control-Allow-Origin",
        value: FRONTEND_URL,
      });
    }

    return [
      // CORS untuk semua API routes
      {
        source: "/api/:path*",
        headers: corsHeaders,
      },
      // Security headers untuk semua halaman
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },
};

export default nextConfig;
