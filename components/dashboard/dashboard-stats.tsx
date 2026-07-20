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
    color: "#D2001A",
    bgColor: "rgba(210,0,26,0.1)",
    description: "Semua kegiatan tercatat",
  },
  {
    key: "today" as const,
    label: "Kegiatan Hari Ini",
    icon: CalendarCheck,
    color: "#059669",
    bgColor: "rgba(5,150,105,0.1)",
    description: "Jadwal hari ini",
  },
  {
    key: "thisWeek" as const,
    label: "Kegiatan Minggu Ini",
    icon: CalendarClock,
    color: "#D97706",
    bgColor: "rgba(217,119,6,0.1)",
    description: "Dalam 7 hari ke depan",
  },
  {
    key: "thisMonth" as const,
    label: "Kegiatan Bulan Ini",
    icon: Calendar,
    color: "#7C3AED",
    bgColor: "rgba(124,58,237,0.1)",
    description: "Sepanjang bulan ini",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];

        return (
          <div key={card.key} className="stat-card fade-in">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: card.bgColor }}
              >
                <Icon size={26} style={{ color: card.color }} />
              </div>
              <span
                className="font-black"
                style={{
                  fontSize: "clamp(28px, 5vw, 40px)",
                  color: card.color,
                  lineHeight: 1,
                }}
              >
                {value}
              </span>
            </div>
            <p
              className="font-bold mb-1"
              style={{ fontSize: "17px", color: "var(--color-text)" }}
            >
              {card.label}
            </p>
            <p style={{ fontSize: "14px", color: "var(--color-text-muted)" }}>
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
