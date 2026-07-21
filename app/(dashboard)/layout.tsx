import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import type { Role } from "@/types";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const userRole = (session.user as { role?: Role }).role ?? "PIMPINAN";
  const userName = session.user.name ?? "Pengguna";
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      <div className="hidden lg:flex flex-shrink-0">
        <Sidebar userRole={userRole} userName={userName} />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar pageTitle="Sistem Informasi Agenda Kegiatan" userRole={userRole} userName={userName} />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
