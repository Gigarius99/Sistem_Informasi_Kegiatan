import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExportForm } from "@/components/export/export-form";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = { title: "Export Excel" };

export default async function ExportPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  if (userRole !== "ADMIN_KEGIATAN") redirect("/dashboard");

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1
          className="font-black mb-1"
          style={{ fontSize: "clamp(22px, 4vw, 32px)", color: "var(--color-text)" }}
        >
          Export Data Excel
        </h1>
        <p style={{ fontSize: "17px", color: "var(--color-text-muted)" }}>
          Unduh daftar kegiatan dalam format Microsoft Excel (.xlsx).
        </p>
      </div>
      <ExportForm />
    </div>
  );
}
