/**
 * proxy.ts — RBAC Proxy (Next.js 16, NextAuth v5)
 * Protects routes berdasarkan role pengguna di Edge Runtime
 */

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextAuthRequest } from "next-auth";

// Rute yang hanya bisa diakses Admin
const ADMIN_ONLY_PATHS = [
  "/kegiatan/tambah",
  "/riwayat",
  "/export",
];

// Rute API mutating — Admin only
const ADMIN_API_METHODS = ["POST", "PUT", "DELETE"];
const ADMIN_API_PATHS = ["/api/activities", "/api/export"];

// Rute publik (tidak perlu login)
const PUBLIC_PATHS = ["/login", "/api/auth", "/api/health"];

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl;
  const method = req.method;

  // Cek apakah rute publik
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Cek apakah user sudah login
  const session = req.auth;
  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = (session.user as { role?: string }).role;

  // Cek akses Admin-only page routes
  const isAdminPage = ADMIN_ONLY_PATHS.some((path) => pathname.startsWith(path));
  if (isAdminPage && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Cek akses Admin-only API routes (mutating methods)
  const isAdminApi = ADMIN_API_PATHS.some((path) => pathname.startsWith(path));
  if (isAdminApi && ADMIN_API_METHODS.includes(method) && userRole !== "ADMIN") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  // Redirect root ke dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
