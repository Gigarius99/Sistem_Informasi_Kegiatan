export const runtime = "edge";
import { NextResponse } from "next/server";

// Fitur Export Excel dinonaktifkan sementara untuk kompatibilitas Cloudflare Pages.
// Aktifkan kembali setelah deployment stabil.
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      error: "Fitur Export Excel dinonaktifkan sementara. Silakan hubungi administrator.",
    },
    { status: 503 }
  );
}
