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
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar userRole={userRole} userName={userName} />
      </div>
      
      {/* Main Content Area */}
      <div className="main-area">
        <Navbar pageTitle="Sistem Informasi Agenda Kegiatan" userRole={userRole} userName={userName} />
        <main style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {children}
        </main>
      </div>
    </div>
  );
}
