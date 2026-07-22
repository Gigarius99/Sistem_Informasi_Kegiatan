"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sidebar } from "@/components/shared/sidebar";
import type { Role } from "@/types";

interface NavbarProps {
  pageTitle: string;
  userRole: Role;
  userName: string;
}

export function Navbar({ pageTitle, userRole, userName }: NavbarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
          <Sidebar
            userRole={userRole}
            userName={userName}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Navbar header */}
      <header
        className="sticky top-0 z-30"
        style={{
          backgroundColor: "var(--color-card)",
          borderBottom: "2px solid var(--color-primary)",
        }}
      >
        {/* Garis aksen kuning tipis di atas */}
        <div
          className="h-1 w-full"
          style={{ backgroundColor: "var(--color-accent)" }}
        />

        <div className="flex items-center justify-between px-4 lg:px-6 h-13">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "var(--color-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor =
                  "transparent";
              }}
            >
              <Menu size={20} />
            </button>
            <h1
              className="text-base font-bold truncate"
              style={{ color: "var(--color-text)" }}
            >
              {pageTitle}
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
