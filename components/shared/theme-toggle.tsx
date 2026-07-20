"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-11 h-11 rounded-full" style={{ backgroundColor: "var(--color-surface)" }} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "2px solid var(--color-border)",
        color: "var(--color-text)",
      }}
      title={isDark ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
      aria-label={isDark ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {isDark ? (
        <Sun size={20} style={{ color: "#FFDE00" }} />
      ) : (
        <Moon size={20} style={{ color: "#555555" }} />
      )}
    </button>
  );
}
