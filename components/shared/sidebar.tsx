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
  ChevronRight,
} from "lucide-react";
import type { Role } from "@/types";

interface SidebarProps {
  userRole: Role;
  userName: string;
  onClose?: () => void;
}

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"] as Role[],
  },
  {
    href: "/kegiatan",
    label: "Daftar Kegiatan",
    icon: CalendarDays,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN", "PIMPINAN"] as Role[],
  },
  {
    href: "/kegiatan/tambah",
    label: "Tambah Kegiatan",
    icon: PlusCircle,
    roles: ["ADMIN_KEGIATAN"] as Role[],
  },
  {
    href: "/riwayat",
    label: "Riwayat Aktivitas",
    icon: ClipboardList,
    roles: ["ADMIN_KEGIATAN"] as Role[],
  },
  {
    href: "/pengguna",
    label: "Manajemen Pengguna",
    icon: Users,
    roles: ["ADMIN_APLIKASI", "ADMIN_KEGIATAN"] as Role[],
  },
  {
    href: "/export",
    label: "Export Excel",
    icon: FileSpreadsheet,
    roles: ["ADMIN_KEGIATAN"] as Role[],
  },
];

export function Sidebar({ userRole, userName, onClose }: SidebarProps) {
  const pathname = usePathname();

  const items = navItems.filter((item) => item.roles.includes(userRole));

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/kegiatan")
      return (
        pathname === "/kegiatan" ||
        (pathname.startsWith("/kegiatan/") &&
          !pathname.includes("/tambah") &&
          !pathname.includes("/edit"))
      );
    return pathname === href || pathname.startsWith(href + "/");
  };

  const roleLabel =
    userRole === "ADMIN_APLIKASI"
      ? "Admin Aplikasi"
      : userRole === "ADMIN_KEGIATAN"
      ? "Admin Kegiatan"
      : "Pimpinan";

  return (
    <aside className="sidebar">
      {/* Tombol close (mobile) */}
      {onClose && (
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 16px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "6px",
              borderRadius: "8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--text-muted)",
            }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Brand */}
      <div
        style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <img
            src="/Seal_of_Wonogiri_Regency.png"
            alt="Logo"
            style={{ width: "36px", height: "36px", objectFit: "contain", flexShrink: 0 }}
          />
          <div>
            <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--primary)", lineHeight: 1.2 }}>
              Agenda Kegiatan
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px" }}>
              Kabupaten Wonogiri
            </div>
          </div>
        </div>

        {/* User info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            background: "var(--bg-surface)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-light)",
          }}
        >
          <div
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "8px",
              background: "var(--primary)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "14px",
              flexShrink: 0,
            }}
          >
            {userName.charAt(0).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div
              style={{
                fontWeight: 600,
                fontSize: "13px",
                color: "var(--text-primary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {userName}
            </div>
            <span
              className="badge badge-yellow"
              style={{ marginTop: "2px", display: "inline-block" }}
            >
              {roleLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 12px", overflowY: "auto" }}>
        <div
          style={{
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
            padding: "4px 10px 10px",
          }}
        >
          Navigasi
        </div>
        {items.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "var(--radius-md)",
                marginBottom: "2px",
                fontWeight: active ? 600 : 500,
                fontSize: "13.5px",
                textDecoration: "none",
                transition: "background 0.15s, color 0.15s",
                background: active ? "var(--primary)" : "transparent",
                color: active ? "#ffffff" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }
              }}
            >
              <Icon size={17} style={{ flexShrink: 0, opacity: active ? 1 : 0.75 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {active && <ChevronRight size={14} style={{ opacity: 0.6 }} />}
            </Link>
          );
        })}
      </nav>

      {/* Keluar */}
      <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleSignOut}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "var(--radius-md)",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "13.5px",
            fontWeight: 500,
            color: "var(--primary)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "var(--primary-light)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }}
        >
          <LogOut size={17} style={{ flexShrink: 0 }} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
