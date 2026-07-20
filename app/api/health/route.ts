import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "Sistem Informasi Daftar Kegiatan Kantor",
    version: "1.0.0",
  });
}
