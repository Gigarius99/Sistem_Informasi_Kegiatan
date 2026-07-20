"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  PlusCircle,
  FileSpreadsheet,
  ClipboardList,
  LogOut,
  X,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

interface SidebarProps {
  userRole: Role;
  userName: string;
  onClose?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: Role[];
}

const navItems: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard size={22} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"],
  },
  {
    href: "/kegiatan",
    label: "Daftar Kegiatan",
    icon: <CalendarDays size={22} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"],
  },
  {
    href: "/kegiatan/tambah",
    label: "Tambah Kegiatan",
    icon: <PlusCircle size={22} />,
    roles: ["ADMIN_KEGIATAN"],
  },
  {
    href: "/riwayat",
    label: "Riwayat Aktivitas",
    icon: <ClipboardList size={22} />,
    roles: ["ADMIN_KEGIATAN"],
  },
  {
    href: "/pengguna",
    label: "Manajemen Pengguna",
    icon: <Users size={22} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN"],
  },
  {
    href: "/export",
    label: "Export Excel",
    icon: <FileSpreadsheet size={22} />,
    roles: ["ADMIN_KEGIATAN"],
  },
];

export function Sidebar({ userRole, userName, onClose }: SidebarProps) {
  const pathname = usePathname();

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <aside
      className="sidebar flex flex-col"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      {/* Close Button (Mobile) */}
      {onClose && (
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={24} />
          </button>
        </div>
      )}

      {/* User Info */}
      <div className="p-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
        <div
          className="rounded-xl p-3 flex items-center gap-3"
          style={{ backgroundColor: "var(--color-surface-2)" }}
        >
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p
              className="font-semibold text-sm truncate"
              style={{ color: "var(--color-text)" }}
            >
              {userName}
            </p>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  userRole === "PIMPINAN"
                    ? "rgba(0,100,210,0.12)"
                    : "rgba(210,0,26,0.12)",
                color:
                  userRole === "PIMPINAN" ? "#1D4ED8" : "var(--color-primary)",
              }}
            >
              {userRole === "ADMIN_APLIKASI" ? "Admin Aplikasi" : userRole === "ADMIN_KEGIATAN" ? "Admin Kegiatan" : "Pimpinan"}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-3 px-3"
          style={{ color: "var(--color-text-muted)" }}
        >
          Menu Utama
        </p>
        {filteredNavItems.map((item) => {
          let isActive = false;
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard";
          } else if (item.href === "/kegiatan") {
            isActive = pathname === "/kegiatan" || (pathname.startsWith("/kegiatan/") && pathname !== "/kegiatan/tambah");
          } else {
            isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn("nav-item", isActive && "active")}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-6 rounded-full"
                  style={{ backgroundColor: "var(--color-primary)" }}
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4" style={{ borderTop: "1px solid var(--color-border)" }}>
        <button
          onClick={handleSignOut}
          className="nav-item w-full text-left"
          style={{ color: "#DC2626" }}
        >
          <LogOut size={22} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
