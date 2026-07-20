export const runtime = \'edge\';
import { NextResponse } from \'next/server\';
export async function GET() { return NextResponse.json({ success: false, error: \'Disabled for Cloudflare Pages\' }, { status: 400 }); }