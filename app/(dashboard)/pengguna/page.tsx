import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UserManagement } from "@/components/pengguna/user-management";
import type { Metadata } from "next";
import type { Role } from "@/types";

export const metadata: Metadata = { title: "Manajemen Pengguna" };

export default async function PenggunaPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  
  if (userRole === "PIMPINAN") {
    redirect("/dashboard");
  }

  const targetRoleName = userRole === "ADMIN_APLIKASI" ? "Admin Kegiatan" : "Pimpinan";

  return (
    <div className="animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-8">
        <h1
          className="font-black mb-1"
          style={{ fontSize: "clamp(22px, 4vw, 32px)", color: "var(--color-text)" }}
        >
          Manajemen Pengguna
        </h1>
        <p style={{ fontSize: "17px", color: "var(--color-text-muted)" }}>
          Kelola akun <strong>{targetRoleName}</strong> yang terhubung dengan akun Anda.
        </p>
      </div>
      
      <UserManagement userRole={userRole} targetRoleName={targetRoleName} />
    </div>
  );
}