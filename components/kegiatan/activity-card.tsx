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

  const isAdmin = userRole === "ADMIN";

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
      <article className="activity-card fade-in">
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <h2
              className="font-bold leading-tight mb-1"
              style={{
                fontSize: "clamp(18px, 3vw, 24px)",
                color: "var(--color-text)",
              }}
            >
              {activity.title}
            </h2>
          </div>

          {/* Admin Actions */}
          {isAdmin && (
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/kegiatan/${activity.id}/edit`}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(217,119,6,0.12)",
                  color: "#D97706",
                  border: "1px solid rgba(217,119,6,0.25)",
                }}
                title="Edit kegiatan"
              >
                <Pencil size={18} />
              </Link>
              <button
                onClick={() => setShowDeleteDialog(true)}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110"
                style={{
                  backgroundColor: "rgba(220,38,38,0.12)",
                  color: "#DC2626",
                  border: "1px solid rgba(220,38,38,0.25)",
                }}
                title="Hapus kegiatan"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Card Body — Detail Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Tanggal */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(210,0,26,0.1)" }}
            >
              <Calendar size={19} style={{ color: "var(--color-primary)" }} />
            </div>
            <div>
              <p
                className="font-semibold mb-0.5"
                style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Tanggal
              </p>
              <p
                className="font-bold"
                style={{ fontSize: "17px", color: "var(--color-text)" }}
              >
                {formatDateIndonesia(activity.activityDate)}
              </p>
            </div>
          </div>

          {/* Jam */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(5,150,105,0.1)" }}
            >
              <Clock size={19} style={{ color: "#059669" }} />
            </div>
            <div>
              <p
                className="font-semibold mb-0.5"
                style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Jam Undangan
              </p>
              <p
                className="font-bold"
                style={{ fontSize: "17px", color: "var(--color-text)" }}
              >
                {formatTime(activity.invitationTime)}
              </p>
            </div>
          </div>

          {/* Lokasi */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(59,130,246,0.1)" }}
            >
              <MapPin size={19} style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <p
                className="font-semibold mb-0.5"
                style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Lokasi
              </p>
              <p
                className="font-semibold"
                style={{ fontSize: "17px", color: "var(--color-text)" }}
              >
                {activity.location}
              </p>
            </div>
          </div>

          {/* Dresscode */}
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
              style={{ backgroundColor: "rgba(124,58,237,0.1)" }}
            >
              <Shirt size={19} style={{ color: "#7C3AED" }} />
            </div>
            <div>
              <p
                className="font-semibold mb-0.5"
                style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
              >
                Dresscode
              </p>
              <p
                className="font-semibold"
                style={{ fontSize: "17px", color: "var(--color-text)" }}
              >
                {activity.dresscode}
              </p>
            </div>
          </div>

          {/* Lokasi Transit — jika ada */}
          {activity.transitLocation && (
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(217,119,6,0.1)" }}
              >
                <MapPinned size={19} style={{ color: "#D97706" }} />
              </div>
              <div>
                <p
                  className="font-semibold mb-0.5"
                  style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  Lokasi Transit
                </p>
                <p
                  className="font-semibold"
                  style={{ fontSize: "17px", color: "var(--color-text)" }}
                >
                  {activity.transitLocation}
                </p>
              </div>
            </div>
          )}

          {/* Keterangan — jika ada */}
          {activity.description && (
            <div
              className={`flex items-start gap-3 ${!activity.transitLocation ? "" : ""}`}
              style={{ gridColumn: activity.transitLocation ? "1 / -1" : undefined }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ backgroundColor: "rgba(107,114,128,0.1)" }}
              >
                <FileText size={19} style={{ color: "#6B7280" }} />
              </div>
              <div className="flex-1">
                <p
                  className="font-semibold mb-0.5"
                  style={{ fontSize: "13px", color: "var(--color-text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}
                >
                  Keterangan
                </p>
                <p
                  className="leading-relaxed"
                  style={{ fontSize: "16px", color: "var(--color-text)" }}
                >
                  {activity.description}
                </p>
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Delete Confirmation Dialog */}
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
