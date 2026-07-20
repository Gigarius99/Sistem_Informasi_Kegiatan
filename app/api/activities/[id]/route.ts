export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createActivitySchema } from "@/lib/validations";
import type { Role } from "@/types";

// GET /api/activities/:id
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { creator: { select: { id: true, name: true, username: true } } },
    });

    if (!activity) {
      return NextResponse.json({ success: false, error: "Kegiatan tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: activity });
  } catch (error) {
    console.error("GET /api/activities/[id] error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// PUT /api/activities/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    if (userRole !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Kegiatan tidak ditemukan" }, { status: 404 });
    }

    const body = await req.json();
    const result = createActivitySchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      return NextResponse.json(
        { success: false, error: "Validasi gagal", errors },
        { status: 400 }
      );
    }

    const { activityDate, transitLocation, description, customFields, ...rest } = result.data;

    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...rest,
        activityDate: new Date(activityDate),
        transitLocation: transitLocation || null,
        description: description || null,
        customFields: customFields || null,
      },
    });

    // Audit log
    await prisma.activityLog.create({
      data: {
        user: { connect: { id: session.user.id! } },
        activity: { connect: { id } },
        action: "UPDATE_ACTIVITY",
      },
    });

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Kegiatan berhasil diperbarui.",
    });
  } catch (error) {
    console.error("PUT /api/activities/[id] error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// DELETE /api/activities/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    if (userRole !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.activity.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Kegiatan tidak ditemukan" }, { status: 404 });
    }

    // Log before deleting (cascade will remove it)
    await prisma.activityLog.create({
      data: {
        user: { connect: { id: session.user.id! } },
        activity: { connect: { id } },
        action: "DELETE_ACTIVITY",
      },
    });

    await prisma.activity.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Kegiatan berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE /api/activities/[id] error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
