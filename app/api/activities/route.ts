import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createActivitySchema } from "@/lib/validations";
import type { Role } from "@/types";

// GET /api/activities — list all activities
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const search = searchParams.get("search") ?? "";
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
    const limit = Math.min(100, parseInt(searchParams.get("limit") ?? "50"));

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { dresscode: { contains: search, mode: "insensitive" } },
      ];
    }

    if (startDate || endDate) {
      where.activityDate = {};
      if (startDate) {
        (where.activityDate as Record<string, Date>).gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        (where.activityDate as Record<string, Date>).lte = end;
      }
    }

    const userRole = (session.user as { role?: Role }).role;
    const userId = session.user.id;
    const parentId = (session.user as { parentId?: string }).parentId;

    if (userRole === "PIMPINAN") {
      if (!parentId) {
        return NextResponse.json({ success: true, data: [], total: 0, page, limit, totalPages: 0 });
      }
      where.createdBy = parentId;
    } else if (userRole === "ADMIN_KEGIATAN") {
      where.createdBy = userId;
    }

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          creator: { select: { id: true, name: true, username: true } },
        },
      }),
      prisma.activity.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: activities,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/activities error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}

// POST /api/activities — create new activity (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    if (userRole !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
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

    const activity = await prisma.activity.create({
      data: {
        ...rest,
        activityDate: new Date(activityDate),
        transitLocation: transitLocation || null,
        description: description || null,
        customFields: customFields || null,
        creator: { connect: { id: session.user.id! } },
      },
    });

    // Audit log
    await prisma.activityLog.create({
      data: {
        user: { connect: { id: session.user.id! } },
        activity: { connect: { id: activity.id } },
        action: "CREATE_ACTIVITY",
      },
    });

    return NextResponse.json(
      { success: true, data: activity, message: "Kegiatan berhasil disimpan." },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/activities error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
