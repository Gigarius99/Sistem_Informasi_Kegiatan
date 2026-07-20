/**
 * Unit Tests — lib/utils.ts
 * Menguji fungsi formatting tanggal Indonesia dan helper utilities
 */

import {
  formatDateIndonesia,
  formatTime,
  formatDateForInput,
  isToday,
  truncate,
  capitalize,
  ACTION_LABELS,
  ROLE_LABELS,
} from "@/lib/utils";

describe("formatDateIndonesia", () => {
  it("formats a date to Indonesian full format", () => {
    const date = new Date("2026-07-14T00:00:00.000Z");
    const result = formatDateIndonesia(date);
    // Should contain the month name in Indonesian
    expect(result).toContain("Juli");
    expect(result).toContain("2026");
  });

  it("accepts string input", () => {
    const result = formatDateIndonesia("2026-08-17");
    expect(result).toContain("2026");
  });

  it("includes weekday name in Indonesian", () => {
    // 2026-07-21 is a Tuesday (Selasa)
    const result = formatDateIndonesia("2026-07-21T00:00:00.000Z");
    // The weekday should be one of Indonesian day names
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const hasDay = days.some((day) => result.includes(day));
    expect(hasDay).toBe(true);
  });
});

describe("formatTime", () => {
  it("appends WIB to time string", () => {
    expect(formatTime("08:00")).toBe("08:00 WIB");
    expect(formatTime("14:30")).toBe("14:30 WIB");
  });
});

describe("formatDateForInput", () => {
  it("formats date to YYYY-MM-DD", () => {
    const date = new Date(2026, 6, 14); // July 14, 2026
    expect(formatDateForInput(date)).toBe("2026-07-14");
  });

  it("pads single digit month and day", () => {
    const date = new Date(2026, 0, 5); // January 5, 2026
    expect(formatDateForInput(date)).toBe("2026-01-05");
  });
});

describe("isToday", () => {
  it("returns true for today", () => {
    const today = new Date();
    expect(isToday(today)).toBe(true);
  });

  it("returns false for yesterday", () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(isToday(yesterday)).toBe(false);
  });

  it("returns false for tomorrow", () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    expect(isToday(tomorrow)).toBe(false);
  });
});

describe("truncate", () => {
  it("does not truncate short strings", () => {
    expect(truncate("Hello", 10)).toBe("Hello");
  });

  it("truncates long strings with ellipsis", () => {
    expect(truncate("Hello World", 5)).toBe("Hello...");
  });

  it("returns string unchanged at exact length", () => {
    expect(truncate("Hello", 5)).toBe("Hello");
  });
});

describe("capitalize", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(capitalize("HELLO")).toBe("Hello");
    expect(capitalize("world")).toBe("World");
  });
});

describe("ACTION_LABELS", () => {
  it("has correct Indonesian labels", () => {
    expect(ACTION_LABELS["CREATE_ACTIVITY"]).toBe("Tambah Kegiatan");
    expect(ACTION_LABELS["UPDATE_ACTIVITY"]).toBe("Ubah Kegiatan");
    expect(ACTION_LABELS["DELETE_ACTIVITY"]).toBe("Hapus Kegiatan");
  });
});

describe("ROLE_LABELS", () => {
  it("has correct Indonesian role labels", () => {
    expect(ROLE_LABELS["ADMIN"]).toBe("Administrator");
    expect(ROLE_LABELS["ATASAN"]).toBe("Pimpinan");
  });
});
