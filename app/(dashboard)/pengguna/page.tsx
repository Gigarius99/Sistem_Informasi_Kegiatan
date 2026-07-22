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
    <div className="animate-fade-in" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{ 
            fontSize: "clamp(24px, 4vw, 32px)", 
            color: "var(--text-primary)",
            fontWeight: 800,
            margin: "0 0 4px 0",
            lineHeight: 1.2
          }}
        >
          Manajemen Pengguna
        </h1>
        <p style={{ fontSize: "16px", color: "var(--text-muted)", margin: 0 }}>
          Kelola akun <strong>{targetRoleName}</strong> yang terhubung dengan akun Anda.
        </p>
      </div>
      
      <UserManagement userRole={userRole} targetRoleName={targetRoleName} />
    </div>
  );
}