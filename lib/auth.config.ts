import type { NextAuthConfig } from "next-auth";

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
        (session.user as { username?: string }).username = token.username as string;
        (session.user as { role?: string }).role = token.role as string;
        (session.user as { parentId?: string | null }).parentId = token.parentId as string | null;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
