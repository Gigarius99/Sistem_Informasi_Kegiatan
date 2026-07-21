"use client";

import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  activityTitle: string;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  activityTitle,
}: DeleteConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => !isLoading && onOpenChange(false)}
      />

      {/* Dialog */}
      <div
        className="relative w-full max-w-md rounded-2xl p-8 shadow-2xl animate-[fadeIn_0.3s_ease-out]"
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(220,38,38,0.12)" }}
          >
            <AlertTriangle size={32} style={{ color: "#DC2626" }} />
          </div>
        </div>

        {/* Content */}
        <h2
          className="text-center font-black mb-3"
          style={{ fontSize: "22px", color: "var(--color-text)" }}
        >
          Hapus Kegiatan?
        </h2>
        <p
          className="text-center mb-2"
          style={{ fontSize: "17px", color: "var(--color-text-muted)" }}
        >
          Anda akan menghapus kegiatan:
        </p>
        <p
          className="text-center font-bold mb-6 px-4"
          style={{ fontSize: "18px", color: "var(--color-text)" }}
        >
          &ldquo;{activityTitle}&rdquo;
        </p>
        <p
          className="text-center mb-8"
          style={{ fontSize: "15px", color: "#DC2626" }}
        >
          Tindakan ini tidak dapat dibatalkan.
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors flex-1 justify-center"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            className="btn-danger flex-1 justify-center"
            onClick={onConfirm}
            disabled={isLoading}
            id="confirm-delete"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
