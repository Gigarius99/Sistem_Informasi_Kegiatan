import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { RiwayatTable } from "@/components/riwayat/riwayat-table";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = { title: "Riwayat Aktivitas" };
export const revalidate = 0;

export default async function RiwayatPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  if (userRole !== "ADMIN_KEGIATAN") redirect("/dashboard");

  const logs = await prisma.activityLog.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    include: {
      user: { select: { id: true, name: true, username: true, role: true } },
      activity: { select: { id: true, title: true } },
    },
  });

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1
          className="font-black mb-1"
          style={{ fontSize: "clamp(22px, 4vw, 32px)", color: "var(--color-text)" }}
        >
          Riwayat Aktivitas
        </h1>
        <p style={{ fontSize: "17px", color: "var(--color-text-muted)" }}>
          Catatan semua perubahan data kegiatan oleh Admin.
        </p>
      </div>
      <RiwayatTable logs={logs} />
    </div>
  );
}
