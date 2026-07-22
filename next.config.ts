// next.config.ts — Full Node.js runtime untuk Vercel (backend)
import type { NextConfig } from "next";

// Daftar origin yang diizinkan (isi URL Cloudflare Pages setelah deploy)
const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  // Tambahkan URL Cloudflare Pages Anda di sini setelah deploy:
  // "https://jadwalkegiatan.pages.dev",
  process.env.FRONTEND_URL ?? "",
].filter(Boolean);

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
    unoptimized: false,
  },

  // Security headers + CORS
  async headers() {
    return [
      // CORS untuk API routes — mengizinkan request dari frontend Cloudflare
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            // Gunakan env var atau default ke semua untuk dev
            value: process.env.FRONTEND_URL ?? "*",
          },
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
        ],
      },
      // Security headers untuk semua halaman
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },

  // Handle OPTIONS preflight CORS
  async rewrites() {
    return [];
  },
};

export default nextConfig;
