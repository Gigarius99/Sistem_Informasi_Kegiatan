import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ActivityList } from "@/components/kegiatan/activity-list";
import { AutoRefresh } from "@/components/shared/auto-refresh";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = { title: "Daftar Kegiatan" };
export const dynamic = 'force-dynamic';

export default async function KegiatanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  const userId = session.user.id;
  const parentId = (session.user as { parentId?: string }).parentId || null;

  const where: any = {};
  if (userRole === "PIMPINAN") {
    if (!parentId) {
      return <div className="p-8 text-center text-gray-500">Belum ada data kegiatan</div>;
    }
    where.createdBy = parentId;
  } else if (userRole === "ADMIN_KEGIATAN") {
    where.createdBy = userId;
  }

  const activities = await prisma.activity.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      creator: { select: { id: true, name: true, username: true } },
    },
  });

  return (
    <div className="fade-in">
      <AutoRefresh intervalMs={5000} />
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1
            className="font-black mb-1"
            style={{ fontSize: "clamp(22px, 4vw, 32px)", color: "var(--color-text)" }}
          >
            Daftar Kegiatan
          </h1>
          <p style={{ fontSize: "17px", color: "var(--color-text-muted)" }}>
            {activities.length} kegiatan tercatat
          </p>
        </div>
        {userRole === "ADMIN_KEGIATAN" && (
          <Link href="/kegiatan/tambah" className="btn-primary" id="btn-tambah">
            <PlusCircle size={22} />
            Tambah Kegiatan
          </Link>
        )}
      </div>
      <ActivityList activities={activities} userRole={userRole} showSearch={true} />
    </div>
  );
}
