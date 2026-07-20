/**
 * lib/validations.ts
 * Zod v4 validation schemas — compatible with Zod 4.x API
 */

import { z } from "zod";

// ============================================================
// Auth Validations
// ============================================================
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username wajib diisi")
    .max(50, "Username terlalu panjang"),
  password: z
    .string()
    .min(1, "Password wajib diisi")
    .max(100, "Password terlalu panjang"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================================
// Activity Validations
// ============================================================
export const createActivitySchema = z.object({
  title: z
    .string()
    .min(1, "Judul kegiatan wajib diisi")
    .max(200, "Judul terlalu panjang")
    .optional()
    .transform((val) => val ?? "Tanpa Judul"),
  activityDate: z
    .string()
    .min(1, "Tanggal kegiatan wajib diisi")
    .optional()
    .transform((val) => val ?? new Date().toISOString()),
  location: z
    .string()
    .min(1, "Lokasi kegiatan wajib diisi")
    .max(300, "Lokasi terlalu panjang")
    .optional()
    .transform((val) => val ?? "-"),
  transitLocation: z
    .string()
    .max(300, "Lokasi transit terlalu panjang")
    .optional()
    .transform((val) => val ?? ""),
  dresscode: z
    .string()
    .min(1, "Dresscode wajib diisi")
    .max(100, "Dresscode terlalu panjang")
    .optional()
    .transform((val) => val ?? "-"),
  invitationTime: z
    .string()
    .min(1, "Jam undangan wajib diisi")
    .optional()
    .transform((val) => val ?? "-"),
  description: z
    .string()
    .max(1000, "Keterangan terlalu panjang")
    .optional()
    .transform((val) => val ?? ""),
  customFields: z.string().optional(),
});

export type CreateActivityInput = z.infer<typeof createActivitySchema>;

export const updateActivitySchema = createActivitySchema.extend({
  id: z.string().min(1, "ID kegiatan wajib diisi"),
});

export type UpdateActivityInput = z.infer<typeof updateActivitySchema>;

// ============================================================
// Export Validations
// ============================================================
export const exportSchema = z.object({
  startDate: z.string().min(1, "Tanggal awal wajib diisi"),
  endDate: z.string().min(1, "Tanggal akhir wajib diisi"),
});

export type ExportInput = z.infer<typeof exportSchema>;

// ============================================================
// Filter Validations
// ============================================================
export const activityFilterSchema = z.object({
  search: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export type ActivityFilter = z.infer<typeof activityFilterSchema>;
