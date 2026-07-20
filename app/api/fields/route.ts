export const runtime = "edge";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

// GET /api/fields
export async function GET() {
  try {
    const fields = await prisma.fieldConfig.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json({ success: true, data: fields });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Gagal mengambil field." }, { status: 500 });
  }
}

// POST /api/fields -> Update order, Add new field, Edit label, or Delete
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (session?.user?.role !== "ADMIN_APLIKASI" && session?.user?.role !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { action, fields, fieldData } = await req.json();

    // action: "REORDER" | "ADD" | "EDIT" | "DELETE"

    if (action === "REORDER") {
      if (!Array.isArray(fields)) return NextResponse.json({ success: false }, { status: 400 });
      // Bulk update orders
      const updates = fields.map((f: { id: string }, index: number) => 
        prisma.fieldConfig.update({
          where: { id: f.id },
          data: { order: index + 1 },
        })
      );
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true });
    }

    if (action === "ADD") {
      const { label, inputType } = fieldData;
      const count = await prisma.fieldConfig.count();
      const newField = await prisma.fieldConfig.create({
        data: {
          name: `custom_${Date.now()}`,
          label,
          type: "custom",
          inputType,
          order: count + 1,
        },
      });
      return NextResponse.json({ success: true, data: newField });
    }

    if (action === "EDIT") {
      const { id, label, inputType } = fieldData;
      const updated = await prisma.fieldConfig.update({
        where: { id },
        data: { label, inputType },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    if (action === "DELETE") {
      const { id } = fieldData;
      await prisma.fieldConfig.delete({
        where: { id },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API Fields Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
