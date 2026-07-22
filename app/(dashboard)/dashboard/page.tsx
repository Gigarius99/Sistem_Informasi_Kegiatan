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

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);

  const dayOfWeek = now.getDay();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

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
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <AutoRefresh intervalMs={5000} />
      
      {/* Page Header */}
      <div 
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div>
          <h1
            style={{ 
              fontSize: "clamp(24px, 4vw, 32px)", 
              color: "var(--text-primary)",
              fontWeight: 800,
              margin: "0 0 4px 0",
              lineHeight: 1.2
            }}
          >
            Selamat Datang 👋
          </h1>
          <p style={{ fontSize: "16px", color: "var(--text-muted)", margin: 0 }}>
            Berikut adalah ringkasan kegiatan kantor terkini.
          </p>
        </div>
        
        {userRole === "ADMIN_KEGIATAN" && (
          <Link
            href="/kegiatan/tambah"
            className="btn-primary"
          >
            <PlusCircle size={20} />
            Tambah Kegiatan
          </Link>
        )}
      </div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} />

      {/* Activity List */}
      <div style={{ marginTop: "32px" }}>
        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px"
          }}
        >
          <h2
            style={{ 
              fontSize: "20px", 
              fontWeight: 700,
              color: "var(--text-primary)",
              margin: 0
            }}
          >
            Daftar Kegiatan
          </h2>
          <Link
            href="/kegiatan"
            style={{ 
              fontSize: "14px", 
              fontWeight: 600,
              color: "var(--primary)",
              textDecoration: "none"
            }}
          >
            Lihat Semua →
          </Link>
        </div>
        <div className="card">
          <ActivityList
            activities={activities}
            userRole={userRole}
            showSearch={false}
          />
        </div>
      </div>
    </div>
  );
}
