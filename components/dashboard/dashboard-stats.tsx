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
    color: "text-[var(--color-primary)]",
    bgColor: "bg-[var(--color-primary-light)]",
    description: "Semua kegiatan tercatat",
  },
  {
    key: "today" as const,
    label: "Hari Ini",
    icon: CalendarCheck,
    color: "text-emerald-600 dark:text-emerald-400",
    bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
    description: "Jadwal hari ini",
  },
  {
    key: "thisWeek" as const,
    label: "Minggu Ini",
    icon: CalendarClock,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-900/20",
    description: "7 hari ke depan",
  },
  {
    key: "thisMonth" as const,
    label: "Bulan Ini",
    icon: Calendar,
    color: "text-violet-600 dark:text-violet-400",
    bgColor: "bg-violet-50 dark:bg-violet-900/20",
    description: "Sepanjang bulan ini",
  },
];

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        const value = stats[card.key];
        return (
          <div
            key={card.key}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg ${card.bgColor} flex items-center justify-center`}
              >
                <Icon size={20} className={card.color} />
              </div>
              <span
                className={`text-2xl font-bold ${card.color}`}
              >
                {value}
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {card.label}
            </p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
              {card.description}
            </p>
          </div>
        );
      })}
    </div>
  );
}
