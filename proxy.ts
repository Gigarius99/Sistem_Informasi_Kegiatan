/**
 * proxy.ts — Auth proxy untuk Next.js 16+ (menggantikan middleware.ts)
 */

import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Rute publik (tidak perlu login)
const PUBLIC_ROUTES = ["/login", "/api/auth"];

// Rute khusus Admin
const ADMIN_ONLY_ROUTES = [
  "/kegiatan/tambah",
  "/riwayat",
  "/export",
  "/pengguna",
];

export default auth((req: NextRequest & { auth?: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;

  // Izinkan rute publik
  if (PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.next();
  }

  const session = req.auth;

  // Belum login
  if (!session?.user) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const url = new URL("/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = session.user.role;

  // Cek akses admin-only
  if (
    ADMIN_ONLY_ROUTES.some((r) => pathname.startsWith(r)) &&
    role !== "ADMIN_APLIKASI" &&
    role !== "ADMIN_KEGIATAN"
  ) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Redirect root → dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
