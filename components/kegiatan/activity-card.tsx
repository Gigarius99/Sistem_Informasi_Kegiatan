"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Clock,
  Shirt,
  FileText,
  MapPinned,
  Pencil,
  Trash2,
  Calendar,
} from "lucide-react";
import { formatDateIndonesia, formatTime } from "@/lib/utils";
import { DeleteConfirmDialog } from "@/components/kegiatan/delete-confirm-dialog";
import type { Activity, Role } from "@/types";

interface ActivityCardProps {
  activity: Activity;
  userRole: Role;
}

export function ActivityCard({ activity, userRole }: ActivityCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = userRole === "ADMIN_KEGIATAN" || userRole === "ADMIN_APLIKASI";

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/activities/${activity.id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        toast.success("Kegiatan berhasil dihapus.");
        window.location.reload();
      } else {
        toast.error(data.error || "Gagal menghapus kegiatan.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-lg font-semibold text-[var(--color-text)] leading-snug flex-1 min-w-0">
              {activity.title}
            </h2>
            {isAdmin && (
              <div className="flex gap-1.5 flex-shrink-0">
                <Link
                  href={`/kegiatan/${activity.id}/edit`}
                  className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => setShowDeleteDialog(true)}
                  className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  title="Hapus"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-light)] flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Tanggal
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {formatDateIndonesia(activity.activityDate)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
                <Clock size={14} className="text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Jam
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {formatTime(activity.invitationTime)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={14} className="text-sky-600 dark:text-sky-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Lokasi
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {activity.location}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center flex-shrink-0">
                <Shirt size={14} className="text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Dresscode
                </p>
                <p className="text-sm font-medium text-[var(--color-text)]">
                  {activity.dresscode}
                </p>
              </div>
            </div>

            {activity.transitLocation && (
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center flex-shrink-0">
                  <MapPinned size={14} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Transit
                  </p>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    {activity.transitLocation}
                  </p>
                </div>
              </div>
            )}

            {activity.description && (
              <div
                className={`flex items-start gap-2.5 ${activity.transitLocation ? "" : "md:col-span-2"}`}
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <FileText size={14} className="text-gray-500 dark:text-gray-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Keterangan
                  </p>
                  <p className="text-sm text-[var(--color-text)] leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        activityTitle={activity.title}
      />
    </>
  );
}
