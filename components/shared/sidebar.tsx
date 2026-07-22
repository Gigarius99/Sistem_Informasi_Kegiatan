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
      return (
        pathname === "/kegiatan" ||
        (pathname.startsWith("/kegiatan/") &&
          pathname !== "/kegiatan/tambah" &&
          !pathname.includes("/edit"))
      );
    return pathname === href || pathname.startsWith(href + "/");
  };

  const roleBadgeLabel =
    userRole === "ADMIN_APLIKASI"
      ? "Admin Aplikasi"
      : userRole === "ADMIN_KEGIATAN"
      ? "Admin Kegiatan"
      : "Pimpinan";

  return (
    <aside
      className="w-64 min-h-screen flex flex-col flex-shrink-0"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
      }}
    >
      {/* Tombol tutup (mobile) */}
      {onClose && (
        <div className="flex justify-end p-4 lg:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{ color: "var(--color-text-muted)" }}
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header: Logo + Info User */}
      <div
        className="p-4"
        style={{ borderBottom: "1px solid var(--color-border)" }}
      >
        {/* Logo + Nama Instansi */}
        <div className="flex items-center gap-2 px-2 mb-4">
          <img
            src="/Seal_of_Wonogiri_Regency.png"
            alt="Logo Wonogiri"
            className="w-8 h-8 flex-shrink-0"
          />
          <div>
            <p
              className="font-bold text-xs leading-tight"
              style={{ color: "var(--color-primary)" }}
            >
              Agenda Kegiatan
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Kab. Wonogiri
            </p>
          </div>
        </div>

        {/* Info User */}
        <div
          className="flex items-center gap-3 px-2 py-2 rounded-lg"
          style={{ backgroundColor: "var(--color-card)" }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="font-semibold text-sm truncate"
              style={{ color: "var(--color-text)" }}
            >
              {userName}
            </p>
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded inline-block mt-0.5"
              style={{
                backgroundColor: "var(--color-accent-light)",
                color: "#8a6800",
              }}
            >
              {roleBadgeLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wider px-3 pb-2 pt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          Menu
        </p>
        {filteredNavItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={
                active
                  ? {
                      backgroundColor: "var(--color-primary)",
                      color: "#ffffff",
                    }
                  : {
                      color: "var(--color-text-muted)",
                    }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "var(--color-card)";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--color-text)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    "var(--color-text-muted)";
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
              {active && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-80"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Tombol Keluar */}
      <div
        className="p-3"
        style={{ borderTop: "1px solid var(--color-border)" }}
      >
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors"
          style={{ color: "var(--color-primary)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "var(--color-primary-light)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor =
              "transparent";
          }}
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
