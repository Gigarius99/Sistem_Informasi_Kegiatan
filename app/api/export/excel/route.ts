export const runtime = "edge";
import { NextResponse } from "next/server";
export async function GET() { 
  return NextResponse.json({ success: false, error: "Fitur Export Excel dinonaktifkan sementara untuk Cloudflare Pages." }, { status: 400 }); 
}