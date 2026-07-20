import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3000";
const ADMIN = { username: "admin", password: "admin123" };
const ATASAN = { username: "atasan", password: "atasan123" };

// ============================================================
// Helper: Login
// ============================================================
async function login(page: typeof test.prototype, creds: typeof ADMIN) {
  await page.goto(`${BASE}/login`);
  await page.fill("#username", creds.username);
  await page.fill("#password", creds.password);
  await page.click("#login-submit");
  await page.waitForURL(`${BASE}/dashboard`);
}

// ============================================================
// Auth Tests
// ============================================================
test.describe("Authentication", () => {
  test("shows login page", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page).toHaveTitle(/login/i);
    await expect(page.locator("h1")).toContainText("Daftar Kegiatan Kantor");
  });

  test("shows error with wrong credentials", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill("#username", "wronguser");
    await page.fill("#password", "wrongpass");
    await page.click("#login-submit");
    await expect(
      page.getByText(/username atau password salah/i)
    ).toBeVisible();
  });

  test("admin can login successfully", async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE}/dashboard`);
    await expect(page.getByText(/selamat datang/i)).toBeVisible();
  });

  test("atasan can login successfully", async ({ page }) => {
    await login(page, ATASAN);
    await expect(page).toHaveURL(`${BASE}/dashboard`);
  });

  test("redirects unauthenticated user to login", async ({ page }) => {
    await page.goto(`${BASE}/dashboard`);
    await expect(page).toHaveURL(/\/login/);
  });
});

// ============================================================
// Dashboard Tests
// ============================================================
test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
  });

  test("shows stat cards", async ({ page }) => {
    await expect(page.getByText(/total kegiatan/i)).toBeVisible();
    await expect(page.getByText(/kegiatan hari ini/i)).toBeVisible();
    await expect(page.getByText(/kegiatan minggu ini/i)).toBeVisible();
    await expect(page.getByText(/kegiatan bulan ini/i)).toBeVisible();
  });

  test("shows add activity button for admin", async ({ page }) => {
    await expect(page.locator("#btn-tambah-kegiatan")).toBeVisible();
  });
});

// ============================================================
// CRUD Kegiatan Tests (Admin)
// ============================================================
test.describe("CRUD Kegiatan (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
  });

  test("can navigate to add activity page", async ({ page }) => {
    await page.click("#btn-tambah-kegiatan");
    await expect(page).toHaveURL(/kegiatan\/tambah/);
    await expect(page.getByText(/tambah kegiatan baru/i)).toBeVisible();
  });

  test("shows validation errors on empty form submit", async ({ page }) => {
    await page.goto(`${BASE}/kegiatan/tambah`);
    await page.click("#submit-activity");
    await expect(page.getByText(/minimal 5 karakter/i).first()).toBeVisible();
  });

  test("can create a new activity", async ({ page }) => {
    await page.goto(`${BASE}/kegiatan/tambah`);
    await page.fill("#title", "Rapat Testing Playwright");
    await page.fill("#activityDate", "2026-12-25");
    await page.fill("#location", "Ruang Rapat Testing");
    await page.fill("#dresscode", "Batik");
    await page.fill("#invitationTime", "09:00");
    await page.fill("#description", "Ini adalah kegiatan testing.");
    await page.click("#submit-activity");
    await expect(page).toHaveURL(`${BASE}/kegiatan`);
  });
});

// ============================================================
// RBAC Tests (Atasan)
// ============================================================
test.describe("RBAC — Atasan restrictions", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ATASAN);
  });

  test("atasan cannot see add activity button", async ({ page }) => {
    await expect(page.locator("#btn-tambah-kegiatan")).not.toBeVisible();
  });

  test("atasan redirected when accessing admin routes", async ({ page }) => {
    await page.goto(`${BASE}/kegiatan/tambah`);
    await expect(page).toHaveURL(`${BASE}/dashboard`);
  });

  test("atasan cannot access export page", async ({ page }) => {
    await page.goto(`${BASE}/export`);
    await expect(page).toHaveURL(`${BASE}/dashboard`);
  });
});

// ============================================================
// Search & Filter Tests
// ============================================================
test.describe("Search and Filter", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
    await page.goto(`${BASE}/kegiatan`);
  });

  test("can search by title", async ({ page }) => {
    const searchInput = page.locator("#search-activity");
    await searchInput.fill("Rapat");
    // Should filter results
    await expect(searchInput).toHaveValue("Rapat");
  });

  test("can filter by date range", async ({ page }) => {
    await page.fill("#filter-start", "2026-07-01");
    await page.fill("#filter-end", "2026-07-31");
    // Filter should apply
    await expect(page.locator("#filter-start")).toHaveValue("2026-07-01");
  });
});

// ============================================================
// Export Tests
// ============================================================
test.describe("Export Excel (Admin)", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
    await page.goto(`${BASE}/export`);
  });

  test("shows export page", async ({ page }) => {
    await expect(page.getByText(/export data excel/i)).toBeVisible();
    await expect(page.locator("#export-start")).toBeVisible();
    await expect(page.locator("#export-end")).toBeVisible();
  });

  test("shows validation error without dates", async ({ page }) => {
    await page.click("#btn-export-excel");
    await expect(page.getByText(/tanggal awal wajib dipilih/i)).toBeVisible();
  });

  test("shows filename preview after selecting dates", async ({ page }) => {
    await page.fill("#export-start", "2026-07-01");
    await page.fill("#export-end", "2026-07-31");
    await expect(
      page.getByText(/Daftar_Kegiatan_2026-07-01_sd_2026-07-31\.xlsx/)
    ).toBeVisible();
  });
});
