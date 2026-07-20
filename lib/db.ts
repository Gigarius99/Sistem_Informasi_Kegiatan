/**
 * lib/db.ts
 * Prisma Client singleton
 * Diubah sementara ke konfigurasi SQLite standard untuk testing lokal
 */

import { PrismaClient } from "@prisma/client";

// Singleton pattern untuk mencegah koneksi berlebih di environment development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
