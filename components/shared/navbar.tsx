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
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 40,
          }}
          className="lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div 
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 50,
            background: "var(--bg-sidebar)",
            boxShadow: "var(--shadow-lg)"
          }}
          className="lg:hidden"
        >
          <Sidebar
            userRole={userRole}
            userName={userName}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Navbar header */}
      <header className="topbar">
        {/* Garis aksen tipis di atas */}
        <div className="topbar-accent" />

        <div 
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            height: "56px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              className="lg:hidden"
              style={{
                padding: "8px",
                borderRadius: "8px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "background 0.15s"
              }}
              onClick={() => setSidebarOpen(true)}
              aria-label="Buka menu navigasi"
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              <Menu size={20} />
            </button>
            <h1
              style={{ 
                fontSize: "15px", 
                fontWeight: 600, 
                color: "var(--text-primary)",
                margin: 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
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
