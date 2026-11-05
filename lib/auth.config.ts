import type { NextAuthConfig } from "next-auth";

// Deteksi apakah sedang berjalan di HTTPS (production)
const isProduction = process.env.NODE_ENV === "production";

// Cookie config — deploy tunggal di Vercel, jadi cukup lax.
// sameSite "none" hanya perlu kalau frontend dan backend beda domain (split Cloudflare).
const cookieConfig = isProduction
  ? {
      sameSite: "lax" as const,
      secure: true,
      httpOnly: true,
    }
  : {
      // Di localhost, gunakan konfigurasi yang lebih longgar
      sameSite: "lax" as const,
      secure: false,
      httpOnly: true,
    };

export const authConfig = {
  providers: [],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 jam
  },
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  // Konfigurasi cookie cross-domain
  cookies: {
    sessionToken: {
      name: isProduction
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: cookieConfig,
    },
    callbackUrl: {
      name: isProduction
        ? "__Secure-authjs.callback-url"
        : "authjs.callback-url",
      options: {
        sameSite: "lax" as const,
        secure: isProduction,
        httpOnly: false, // callbackUrl perlu bisa dibaca JS
      },
    },
    csrfToken: {
      name: isProduction
        ? "__Host-authjs.csrf-token"
        : "authjs.csrf-token",
      options: {
        sameSite: "lax" as const,
        secure: isProduction,
        httpOnly: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.role = (user as { role?: string }).role;
        token.parentId = (user as { parentId?: string | null }).parentId;
      }

      // Auto-migrate old roles in existing tokens
      if (token.role === "ADMIN") token.role = "ADMIN_APLIKASI";
      if (token.role === "ATASAN") token.role = "PIMPINAN";

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as { username?: string }).username =
          token.username as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { parentId?: string | null }).parentId =
          token.parentId as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
