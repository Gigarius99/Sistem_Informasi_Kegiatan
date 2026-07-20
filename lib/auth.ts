// auth.ts — Updated for Next.js 16 / NextAuth v5
// Menggunakan bcryptjs yang kompatibel dengan Edge Runtime

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import type { Role } from "@/types";
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const username = credentials.username as string;
        const password = credentials.password as string;

        try {
          const user = await prisma.user.findUnique({
            where: { username },
            select: {
              id: true,
              name: true,
              username: true,
              password: true,
              role: true,
              parentId: true,
            },
          });

          if (!user) return null;

          const isValidPassword = await bcrypt.compare(password, user.password);
          if (!isValidPassword) return null;

          return {
            id: user.id,
            name: user.name,
            username: user.username,
            role: user.role as Role,
            parentId: user.parentId,
          };
        } catch (error) {
          console.error("[Auth] authorize error:", error);
          return null;
        }
      },
    }),
  ],
});

// Type augmentation for next-auth v5
declare module "next-auth" {
  interface User {
    id?: string;
    username?: string;
    role?: Role;
    parentId?: string | null;
  }
  interface Session {
    user: {
      id: string;
      name: string;
      username: string;
      role: Role;
      parentId?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  // JWT in NextAuth v5 is part of the main module
  interface JWT {
    id?: string;
    username?: string;
    role?: Role;
    parentId?: string | null;
  }
}
