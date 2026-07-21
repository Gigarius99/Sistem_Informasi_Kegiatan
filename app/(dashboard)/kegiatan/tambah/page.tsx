import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ActivityForm } from "@/components/kegiatan/activity-form";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = { title: "Tambah Kegiatan" };

export default async function TambahKegiatanPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  if (userRole !== "ADMIN_KEGIATAN") redirect("/dashboard");

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <ActivityForm mode="create" />
    </div>
  );
}
