export const runtime = "edge";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import type { Role } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    const userId = session.user.id;

    if (userRole === "PIMPINAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const where: any = {};
    if (userRole === "ADMIN_APLIKASI") {
      where.role = "ADMIN_KEGIATAN";
    } else if (userRole === "ADMIN_KEGIATAN") {
      where.role = "PIMPINAN";
      where.parentId = userId;
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: users });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as { role?: Role }).role;
    const userId = session.user.id;

    if (userRole === "PIMPINAN") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { name, username, password } = body;

    if (!name || !username || !password) {
      return NextResponse.json({ success: false, error: "Semua field harus diisi" }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Username sudah digunakan" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const targetRole = userRole === "ADMIN_APLIKASI" ? "ADMIN_KEGIATAN" : "PIMPINAN";
    const parentId = userRole === "ADMIN_APLIKASI" ? null : userId;

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        password: hashedPassword,
        role: targetRole,
        parentId,
      },
      select: {
        id: true,
        name: true,
        username: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ success: true, data: newUser, message: "User berhasil dibuat" }, { status: 201 });
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json({ success: false, error: "Terjadi kesalahan server" }, { status: 500 });
  }
}