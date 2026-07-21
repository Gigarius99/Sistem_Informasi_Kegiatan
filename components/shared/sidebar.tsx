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
    icon: <LayoutDashboard size={20} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"],
  },
  {
    href: "/kegiatan",
    label: "Daftar Kegiatan",
    icon: <CalendarDays size={20} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"],
  },
  {
    href: "/kegiatan/tambah",
    label: "Tambah Kegiatan",
    icon: <PlusCircle size={20} />,
    roles: ["ADMIN_KEGIATAN"],
  },
  {
    href: "/riwayat",
    label: "Riwayat Aktivitas",
    icon: <ClipboardList size={20} />,
    roles: ["ADMIN_KEGIATAN"],
  },
  {
    href: "/pengguna",
    label: "Manajemen Pengguna",
    icon: <Users size={20} />,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN"],
  },
  {
    href: "/export",
    label: "Export Excel",
    icon: <FileSpreadsheet size={20} />,
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

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/kegiatan")
      return pathname === "/kegiatan" || (pathname.startsWith("/kegiatan/") && pathname !== "/kegiatan/tambah");
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className="w-64 bg-surface border-r border-[var(--color-border)] min-h-screen flex flex-col flex-shrink-0">
      {onClose && (
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
          >
            <X size={20} />
          </button>
        </div>
      )}

      <div className="p-4 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-sm text-[var(--color-text)] truncate">
              {userName}
            </p>
            <span
              className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-md inline-block mt-0.5",
                userRole === "PIMPINAN"
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                  : "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
              )}
            >
              {userRole === "ADMIN_APLIKASI"
                ? "Admin Aplikasi"
                : userRole === "ADMIN_KEGIATAN"
                ? "Admin Kegiatan"
                : "Pimpinan"}
            </span>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] px-3 pb-2 pt-1">
          Menu
        </p>
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
              )}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[var(--color-border)]">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
