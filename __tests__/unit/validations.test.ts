/**
 * Unit Tests — lib/validations.ts
 * Menguji Zod schema validasi form kegiatan dan login
 */

import {
  loginSchema,
  createActivitySchema,
  exportSchema,
} from "@/lib/validations";

// ============================================================
// Login Schema Tests
// ============================================================
describe("loginSchema", () => {
  it("accepts valid credentials", () => {
    const result = loginSchema.safeParse({
      username: "admin",
      password: "admin123",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty username", () => {
    const result = loginSchema.safeParse({ username: "", password: "admin123" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Username wajib diisi");
  });

  it("rejects empty password", () => {
    const result = loginSchema.safeParse({ username: "admin", password: "" });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Password wajib diisi");
  });
});

// ============================================================
// Create Activity Schema Tests
// ============================================================
describe("createActivitySchema", () => {
  const validData = {
    title: "Rapat Koordinasi Bulanan",
    activityDate: "2026-07-21",
    location: "Ruang Rapat Utama",
    dresscode: "PDH Khaki",
    invitationTime: "08:00",
  };

  it("accepts valid activity data", () => {
    const result = createActivitySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("accepts optional fields as empty", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      transitLocation: "",
      description: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects title shorter than 5 characters", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      title: "Rapa",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("minimal 5 karakter");
  });

  it("rejects location shorter than 5 characters", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      location: "Hall",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("minimal 5 karakter");
  });

  it("rejects dresscode shorter than 3 characters", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      dresscode: "PD",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("minimal 3 karakter");
  });

  it("rejects empty activity date", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      activityDate: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("wajib diisi");
  });

  it("rejects empty invitation time", () => {
    const result = createActivitySchema.safeParse({
      ...validData,
      invitationTime: "",
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toContain("wajib diisi");
  });
});

// ============================================================
// Export Schema Tests
// ============================================================
describe("exportSchema", () => {
  it("accepts valid date range", () => {
    const result = exportSchema.safeParse({
      startDate: "2026-07-01",
      endDate: "2026-07-31",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty start date", () => {
    const result = exportSchema.safeParse({
      startDate: "",
      endDate: "2026-07-31",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty end date", () => {
    const result = exportSchema.safeParse({
      startDate: "2026-07-01",
      endDate: "",
    });
    expect(result.success).toBe(false);
  });
});
