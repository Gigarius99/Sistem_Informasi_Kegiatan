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
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {sidebarOpen && (
        <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
          <Sidebar
            userRole={userRole}
            userName={userName}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      <header className="sticky top-0 z-30 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="flex items-center justify-between px-4 lg:px-6 h-14">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
            >
              <Menu size={20} />
            </button>
            <h1 className="text-base font-semibold text-[var(--color-text)] truncate">
              {pageTitle}
            </h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
