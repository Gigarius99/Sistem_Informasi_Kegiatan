import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { ActivityList } from "@/components/kegiatan/activity-list";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = 'force-dynamic';

async function getDashboardStats(userRole: string, userId: string, parentId: string | null) {
  const now = new Date();

  // Waktu hari ini (WIB = UTC+7)
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  // Minggu ini (Senin - Minggu)
  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  // Bulan ini
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  const baseWhere: any = {};
  if (userRole === "PIMPINAN") {
    if (!parentId) return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    baseWhere.createdBy = parentId;
  } else if (userRole === "ADMIN_KEGIATAN") {
    baseWhere.createdBy = userId;
  }

  const [total, today, thisWeek, thisMonth] = await Promise.all([
    prisma.activity.count({ where: baseWhere }),
    prisma.activity.count({
      where: { ...baseWhere, activityDate: { gte: todayStart, lte: todayEnd } },
    }),
    prisma.activity.count({
      where: { ...baseWhere, activityDate: { gte: startOfWeek, lte: endOfWeek } },
    }),
    prisma.activity.count({
      where: { ...baseWhere, activityDate: { gte: startOfMonth, lte: endOfMonth } },
    }),
  ]);

  return { total, today, thisWeek, thisMonth };
}

async function getRecentActivities(userRole: string, userId: string, parentId: string | null) {
  const where: any = {};
  if (userRole === "PIMPINAN") {
    if (!parentId) return [];
    where.createdBy = parentId;
  } else if (userRole === "ADMIN_KEGIATAN") {
    where.createdBy = userId;
  }

  const now = new Date();
  return prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, name: true, username: true } },
    },
    take: 20,
  });
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  const userId = session.user.id;
  const parentId = (session.user as { parentId?: string }).parentId || null;

  const [stats, activities] = await Promise.all([
    getDashboardStats(userRole, userId, parentId),
    getRecentActivities(userRole, userId, parentId),
  ]);

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <AutoRefresh intervalMs={5000} />
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="font-black leading-tight mb-1"
            style={{ fontSize: "clamp(24px, 4vw, 36px)", color: "var(--color-text)" }}
          >
            Selamat Datang 👋
          </h1>
          <p style={{ fontSize: "18px", color: "var(--color-text-muted)" }}>
            Berikut adalah ringkasan kegiatan kantor terkini.
          </p>
        </div>
        {userRole === "ADMIN_KEGIATAN" && (
          <Link
            href="/kegiatan/tambah"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            id="btn-tambah-kegiatan"
          >
            <PlusCircle size={22} />
            Tambah Kegiatan
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Activity List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <h2
            className="font-bold"
            style={{ fontSize: "24px", color: "var(--color-text)" }}
          >
            Daftar Kegiatan
          </h2>
          <Link
            href="/kegiatan"
            className="text-sm font-semibold"
            style={{ color: "var(--color-primary)" }}
          >
            Lihat Semua →
          </Link>
        </div>
        <ActivityList
          activities={activities}
          userRole={userRole}
          showSearch={false}
        />
      </div>
    </div>
  );
}
