// Export Excel API — Node.js runtime (tidak kompatibel Edge)
// Dijalankan sebagai Vercel Serverless Function (Node.js)
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateActivityExcel, generateExcelFilename } from "@/lib/export";
import type { Role } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    if (userRole !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = req.nextUrl;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    if (!startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Tanggal awal dan akhir wajib diisi" },
        { status: 400 }
      );
    }

    if (startDate > endDate) {
      return NextResponse.json(
        { success: false, error: "Tanggal akhir harus setelah tanggal awal" },
        { status: 400 }
      );
    }

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const activities = await prisma.activity.findMany({
      where: {
        activityDate: { gte: start, lte: end },
        createdBy: session.user.id
      },
      orderBy: { activityDate: "asc" },
      include: {
        creator: { select: { id: true, name: true, username: true } },
      },
    });

    const arrayBuffer = await generateActivityExcel(activities, startDate, endDate);
    const filename = generateExcelFilename(startDate, endDate);

    return new NextResponse(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": arrayBuffer.byteLength.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET /api/export/excel error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghasilkan file Excel" },
      { status: 500 }
    );
  }
}
