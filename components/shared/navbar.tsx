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
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed left-0 top-0 bottom-0 z-50 lg:hidden w-72">
          <Sidebar
            userRole={userRole}
            userName={userName}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Top Navbar */}
      <header className="navbar">
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-xl"
            style={{
              backgroundColor: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
            onClick={() => setSidebarOpen(true)}
            aria-label="Buka menu navigasi"
          >
            <Menu size={22} />
          </button>
          <h1
            className="text-xl font-bold truncate"
            style={{ color: "var(--color-text)" }}
          >
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>
    </>
  );
}
