/**
 * middleware.ts
 * RBAC middleware — Edge Runtime compatible
 * Protects routes berdasarkan role pengguna
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
const PUBLIC_ROUTES = ["/login", "/api/auth"];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } }) => {
  const { pathname } = req.nextUrl;

  // Cek apakah rute publik
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Cek apakah user sudah login
  const session = req.auth;
  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user.role;

  // Cek akses Admin-only routes
  const isAdminRoute = ADMIN_ONLY_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isAdminRoute && userRole !== "ADMIN_APLIKASI" && userRole !== "ADMIN_KEGIATAN") {
    // Redirect ke dashboard jika bukan Admin
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
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
