/**
 * lib/utils.ts
 * Utility functions untuk Sistem Informasi Daftar Kegiatan Kantor
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================
// Date & Time Formatting
// ============================================================

/**
 * Format tanggal ke format Indonesia lengkap
 * Contoh: "Selasa, 14 Juli 2026"
 */
export function formatDateIndonesia(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/**
 * Format waktu undangan
 * Contoh: "08:00 WIB"
 */
export function formatTime(time: string): string {
  return `${time} WIB`;
}

/**
 * Format tanggal untuk input date picker (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Format tanggal untuk nama file Excel
 * Contoh: "2026-07-14"
 */
export function formatDateForFilename(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDateForInput(dateObj);
}

/**
 * Format tanggal pendek untuk display
 * Contoh: "14 Jul 2026"
 */
export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "Asia/Jakarta",
  });
}

/**
 * Cek apakah tanggal adalah hari ini
 */
export function isToday(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Cek apakah tanggal ada dalam minggu ini
 */
export function isThisWeek(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);
  return dateObj >= startOfWeek && dateObj <= endOfWeek;
}

/**
 * Cek apakah tanggal ada dalam bulan ini
 */
export function isThisMonth(date: Date | string): boolean {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return (
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

// ============================================================
// String Helpers
// ============================================================

/**
 * Truncate text dengan ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

// ============================================================
// Action Type Labels
// ============================================================
export const ACTION_LABELS: Record<string, string> = {
  CREATE_ACTIVITY: "Tambah Kegiatan",
  UPDATE_ACTIVITY: "Ubah Kegiatan",
  DELETE_ACTIVITY: "Hapus Kegiatan",
};

export const ROLE_LABELS: Record<string, string> = {
  ADMIN: "Administrator",
  ATASAN: "Pimpinan",
};
