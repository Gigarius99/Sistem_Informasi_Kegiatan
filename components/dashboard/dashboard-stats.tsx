import { CalendarDays, CalendarCheck, CalendarClock, Calendar } from "lucide-react";
import type { DashboardStats as StatsType } from "@/types";

interface DashboardStatsProps {
  stats: StatsType;
}

const statCards = [
  {
    key: "total" as const,
    label: "Total Kegiatan",
    icon: CalendarDays,
    color: "var(--primary)",
    bgColor: "var(--primary-light)",
    description: "Semua kegiatan tercatat",
  },
  {
    key: "today" as const,
    label: "Hari Ini",
    icon: CalendarCheck,
    color: "#059669",
    bgColor: "#d1fae5",
    description: "Jadwal hari ini",
  },
  {
    key: "thisWeek" as const,
    label: "Minggu Ini",
    icon: CalendarClock,
    color: "#d97706",
    bgColor: "#fef3c7",
    description: "7 hari ke depan",
  },
  {
    key: "thisMonth" as const,
    label: "Bulan Ini",
    icon: Calendar,
    color: "#7c3aed",
    bgColor: "#ede9fe",
    description: "Sepanjang bulan ini",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div 
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "16px",
      }}
    >
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <div key={card.key} className="card" style={{ padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: card.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <span
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: card.color,
                }}
              >
                {value}
              </span>
            </div>
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px 0" }}>
              {card.label}
            </p>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
