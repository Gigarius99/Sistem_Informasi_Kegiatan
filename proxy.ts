/**
 * middleware.ts
 * Auth middleware — Node.js compatible (untuk Vercel backend)
 *
 * Melindungi:
 * 1. Halaman UI (redirect ke /login jika belum auth) — berlaku saat monolith
 * 2. API routes (return 401 JSON jika belum auth)
 * 3. RBAC: role-based access untuk rute tertentu
 */

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Rute yang hanya bisa diakses Admin
const ADMIN_ONLY_ROUTES = [
  "/kegiatan/tambah",
  "/kegiatan/edit",
  "/riwayat",
  "/export",
  "/api/activities",
  "/api/export",
  "/api/fields",
];

// Rute publik (tidak perlu login)
const PUBLIC_ROUTES = ["/login", "/api/auth", "/api/health"];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } }) => {
  const { pathname } = req.nextUrl;

  // Izinkan semua rute publik
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Cek apakah user sudah login
  const session = req.auth;
  if (!session?.user) {
    // Untuk API routes → return 401 JSON (bukan redirect)
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    // Untuk halaman UI → redirect ke login
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user.role;

  // Cek akses Admin-only routes
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (
    isAdminRoute &&
    userRole !== "ADMIN_APLIKASI" &&
    userRole !== "ADMIN_KEGIATAN"
  ) {
    // Untuk API routes → return 403 JSON
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { success: false, error: "Forbidden" },
        { status: 403 }
      );
    }
    // Untuk halaman UI → redirect ke dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect root ke dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match semua request kecuali:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
