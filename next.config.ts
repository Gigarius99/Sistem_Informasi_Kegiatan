// next.config.ts — Full Node.js runtime untuk Vercel
import type { NextConfig } from "next";

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

};

export default nextConfig;
