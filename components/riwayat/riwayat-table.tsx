"use client";

import { ACTION_LABELS, ROLE_LABELS } from "@/lib/utils";
import { ClipboardList } from "lucide-react";

interface LogEntry {
  id: string;
  action: string;
  createdAt: Date;
  user: { id: string; name: string; username: string; role: string } | null;
  activity: { id: string; title: string } | null;
}

interface RiwayatTableProps {
  logs: LogEntry[];
}

const ACTION_COLORS: Record<string, { bg: string; text: string }> = {
  CREATE_ACTIVITY: { bg: "rgba(5,150,105,0.12)", text: "#059669" },
  UPDATE_ACTIVITY: { bg: "rgba(217,119,6,0.12)", text: "#D97706" },
  DELETE_ACTIVITY: { bg: "rgba(220,38,38,0.12)", text: "#DC2626" },
};

export function RiwayatTable({ logs }: RiwayatTableProps) {
  if (logs.length === 0) {
    return (
      <div className="empty-state">
        <ClipboardList size={80} />
        <p className="font-bold mt-4" style={{ fontSize: "20px", color: "var(--color-text)" }}>
          Belum Ada Riwayat
        </p>
        <p style={{ fontSize: "16px", color: "var(--color-text-muted)" }}>
          Riwayat akan muncul saat Admin melakukan perubahan data.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md"
      style={{
        backgroundColor: "var(--color-card)",
        border: "1px solid var(--color-card-border)",
      }}
    >
      {/* Mobile — Card View */}
      <div className="block md:hidden">
        {logs.map((log) => {
          const colors = ACTION_COLORS[log.action] ?? { bg: "#F3F4F6", text: "#6B7280" };
          return (
            <div
              key={log.id}
              className="p-5"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span
                  className="text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  {ACTION_LABELS[log.action] ?? log.action}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {new Date(log.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="font-semibold mb-1" style={{ color: "var(--color-text)", fontSize: "15px" }}>
                {log.activity?.title ?? "(Kegiatan dihapus)"}
              </p>
              <p style={{ color: "var(--color-text-muted)", fontSize: "14px" }}>
                Oleh: {log.user?.name ?? "-"}{" "}
                <span className="font-medium">
                  ({ROLE_LABELS[log.user?.role ?? ""] ?? log.user?.role})
                </span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Desktop — Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: "var(--color-surface)" }}>
              {["Waktu", "Aksi", "Kegiatan", "Dilakukan Oleh", "Role"].map((h) => (
                <th
                  key={h}
                  className="text-left px-5 py-4 font-bold uppercase tracking-wider"
                  style={{ fontSize: "13px", color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border)" }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => {
              const colors = ACTION_COLORS[log.action] ?? { bg: "#F3F4F6", text: "#6B7280" };
              return (
                <tr
                  key={log.id}
                  style={{
                    backgroundColor: idx % 2 === 0 ? "var(--color-card)" : "var(--color-surface)",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <td className="px-5 py-4" style={{ fontSize: "14px", color: "var(--color-text-muted)", whiteSpace: "nowrap" }}>
                    {new Date(log.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                    <br />
                    <span style={{ fontSize: "13px" }}>
                      {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                        hour: "2-digit", minute: "2-digit",
                      })} WIB
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-sm font-bold px-3 py-1.5 rounded-full"
                      style={{ backgroundColor: colors.bg, color: colors.text, whiteSpace: "nowrap" }}
                    >
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4" style={{ fontSize: "15px", color: "var(--color-text)", maxWidth: "280px" }}>
                    {log.activity?.title ?? (
                      <span style={{ color: "var(--color-text-muted)", fontStyle: "italic" }}>
                        (Kegiatan dihapus)
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 font-semibold" style={{ fontSize: "15px", color: "var(--color-text)" }}>
                    {log.user?.name ?? "-"}
                  </td>
                  <td className="px-5 py-4" style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
                    {ROLE_LABELS[log.user?.role ?? ""] ?? "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3"
        style={{ borderTop: "1px solid var(--color-border)", backgroundColor: "var(--color-surface)" }}
      >
        <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
          Menampilkan {logs.length} riwayat terbaru
        </p>
      </div>
    </div>
  );
}
