/**
 * lib/api.ts
 * Utilitas terpusat untuk semua fetch ke API.
 * Secara otomatis menggunakan NEXT_PUBLIC_API_URL sebagai base URL,
 * sehingga komponen tidak perlu diubah satu per satu saat pindah ke arsitektur split.
 *
 * Di localhost: NEXT_PUBLIC_API_URL = "" (kosong) → relative URL (default)
 * Di Cloudflare Pages: NEXT_PUBLIC_API_URL = "https://xxx.vercel.app"
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/**
 * Wrapper fetch yang otomatis:
 * 1. Menambahkan base URL API
 * 2. Menyertakan credentials (cookie) untuk cross-domain auth
 * 3. Meneruskan semua options fetch biasa
 */
export async function apiFetch(
  path: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE}${path}`;
  return fetch(url, {
    ...options,
    credentials: "include", // Wajib untuk cross-domain cookie auth
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

/**
 * Helper GET
 */
export async function apiGet<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: "GET" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request gagal" }));
    throw new Error(err.error ?? "Request gagal");
  }
  return res.json();
}

/**
 * Helper POST
 */
export async function apiPost<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Helper PUT
 */
export async function apiPut<T = unknown>(
  path: string,
  body: unknown
): Promise<T> {
  const res = await apiFetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
  });
  return res.json();
}

/**
 * Helper DELETE
 */
export async function apiDelete<T = unknown>(path: string): Promise<T> {
  const res = await apiFetch(path, { method: "DELETE" });
  return res.json();
}
