"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Search, CalendarRange, X, Pencil, Trash2, Loader2, Maximize, Minimize } from "lucide-react";
import { cn, formatDateIndonesia, formatTime } from "@/lib/utils";
import { DeleteConfirmDialog } from "@/components/kegiatan/delete-confirm-dialog";
import type { Activity, Role } from "@/types";

interface FieldConfig {
  id: string;
  name: string;
  label: string;
  type: string;
  inputType: string;
  order: number;
}

interface ActivityListProps {
  activities: (Activity & { customFields?: string | null })[];
  userRole: Role;
  showSearch?: boolean;
}

export function ActivityList({
  activities,
  userRole,
  showSearch = true,
}: ActivityListProps) {
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(true);

  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [deleteActivityId, setDeleteActivityId] = useState<string | null>(null);
  const [deleteActivityTitle, setDeleteActivityTitle] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isAdmin = userRole === "ADMIN_KEGIATAN" || userRole === "ADMIN_APLIKASI";

  useEffect(() => {
    fetchFields();
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const fetchFields = async () => {
    try {
      const res = await fetch("/api/fields");
      const data = await res.json();
      if (data.success) {
        setFields(data.data);
      }
    } catch {
      toast.error("Gagal mengambil konfigurasi tabel");
    } finally {
      setIsLoadingFields(false);
    }
  };

  const filtered = activities.filter((activity) => {
    const matchSearch =
      !search ||
      activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.location.toLowerCase().includes(search.toLowerCase()) ||
      activity.dresscode.toLowerCase().includes(search.toLowerCase());

    const matchStart =
      !startDate ||
      new Date(activity.activityDate) >= new Date(startDate);

    const matchEnd =
      !endDate ||
      new Date(activity.activityDate) <= new Date(endDate + "T23:59:59");

    return matchSearch && matchStart && matchEnd;
  });

  const clearFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
  };

  const hasFilters = search || startDate || endDate;

  const confirmDelete = (id: string, title: string) => {
    setDeleteActivityId(id);
    setDeleteActivityTitle(title);
  };

  const handleDelete = async () => {
    if (!deleteActivityId) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/activities/${deleteActivityId}`, {
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
      setDeleteActivityId(null);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {
        toast.error("Gagal memasuki mode fullscreen");
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const renderCellContent = (activity: any, field: FieldConfig) => {
    if (field.type === "standard") {
      const val = activity[field.name];
      if (field.name === "activityDate") return formatDateIndonesia(val);
      if (field.name === "invitationTime") return formatTime(val);
      return val || "-";
    } else {
      if (!activity.customFields) return "-";
      try {
        const parsed = JSON.parse(activity.customFields);
        return parsed[field.name] || "-";
      } catch {
        return "-";
      }
    }
  };

  if (isLoadingFields) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={40} className="spinner text-primary" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="empty-state">
        <CalendarRange size={80} />
        <p
          className="font-bold mb-2"
          style={{ fontSize: "22px", color: "var(--color-text)" }}
        >
          Belum Ada Kegiatan
        </p>
        <p style={{ fontSize: "17px", color: "var(--color-text-muted)", marginBottom: "24px" }}>
          {isAdmin
            ? "Mulai tambahkan kegiatan pertama Anda."
            : "Belum ada kegiatan yang dijadwalkan."}
        </p>
        {isAdmin && (
          <Link href="/kegiatan/tambah" className="btn-primary">
            Tambah Kegiatan Pertama
          </Link>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Search & Filter */}
      {showSearch && (
        <div className="search-bar mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Pencarian Cepat</label>
              <div className="relative">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Cari judul, lokasi, atau dresscode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="form-input pl-12 w-full"
                  style={{ fontSize: "16px" }}
                />
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: "15px", minWidth: "150px" }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                  style={{ fontSize: "15px", minWidth: "150px" }}
                />
              </div>
              {hasFilters && (
                <div className="flex items-end">
                  <button onClick={clearFilters} className="btn-secondary py-3">
                    <X size={18} /> Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty Filter Result */}
      {filtered.length === 0 && hasFilters ? (
        <div className="empty-state">
          <Search size={60} />
          <p className="font-bold mb-2" style={{ fontSize: "20px", color: "var(--color-text)" }}>Tidak Ada Hasil</p>
          <p style={{ fontSize: "16px", color: "var(--color-text-muted)" }}>Tidak ada kegiatan yang sesuai.</p>
          <button onClick={clearFilters} className="btn-secondary mt-4">Hapus Filter</button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          className={cn(
            "w-full bg-[var(--color-card)] relative transition-all duration-300",
            isFullscreen 
              ? "fixed inset-0 z-50 p-4 md:p-8 overflow-y-auto" 
              : "rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden"
          )}
          style={isFullscreen ? { backgroundColor: "var(--color-background)" } : {}}
        >
          {isFullscreen && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl md:text-4xl font-black text-[var(--color-text)]">
                Daftar Kegiatan
              </h2>
              <button 
                onClick={toggleFullscreen}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors font-semibold"
              >
                <Minimize size={20} />
                <span className="hidden md:inline">Keluar Fullscreen</span>
              </button>
            </div>
          )}

          {!isFullscreen && (
            <div className="absolute top-2 right-2 z-10">
              <button 
                onClick={toggleFullscreen}
                className="p-2 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)] shadow-sm text-[var(--color-text-muted)] hover:bg-[var(--color-surface-2)] transition-colors opacity-60 hover:opacity-100"
                title="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className={cn("w-full text-left", isFullscreen ? "min-w-[1200px]" : "")} style={{ tableLayout: "fixed" }}>
            <thead className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
              <tr>
                {fields.map((field) => (
                  <th key={field.id} className="px-3 py-4 font-bold text-[var(--color-text)] text-[15px] break-words">
                    {field.label}
                  </th>
                ))}
                {isAdmin && <th className="px-2 py-4 font-bold text-[var(--color-text)] text-[15px] text-center w-[8%]">Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity, index) => (
                <tr 
                  key={activity.id} 
                  className={`border-b border-[var(--color-card-border)] transition-colors hover:bg-[var(--color-surface-2)] ${
                    index % 2 === 0 ? 'bg-[var(--color-card)]' : 'bg-[var(--color-surface)]'
                  }`}
                >
                  {fields.map((field) => (
                    <td key={field.id} className="px-3 py-4 align-top text-[15px] font-medium text-[var(--color-text)] break-words whitespace-normal leading-snug">
                      {renderCellContent(activity, field)}
                    </td>
                  ))}
                  {isAdmin && (
                    <td className="px-2 py-4 align-top text-center">
                      <div className="flex flex-col xl:flex-row gap-2 justify-center items-center">
                        <Link
                          href={`/kegiatan/${activity.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ backgroundColor: "rgba(217,119,6,0.15)", color: "#D97706" }}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => confirmDelete(activity.id, activity.title)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                          style={{ backgroundColor: "rgba(220,38,38,0.15)", color: "#DC2626" }}
                          title="Hapus"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <DeleteConfirmDialog
        open={!!deleteActivityId}
        onOpenChange={(open) => !open && setDeleteActivityId(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        activityTitle={deleteActivityTitle}
      />
    </div>
  );
}
