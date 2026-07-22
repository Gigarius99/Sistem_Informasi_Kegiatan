"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Search, CalendarRange, X, Pencil, Trash2, Loader2, Maximize, Minimize } from "lucide-react";
import { cn, formatDateIndonesia, formatTime } from "@/lib/utils";
import { apiFetch } from "@/lib/api";
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
      const res = await apiFetch("/api/fields");
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
      const response = await apiFetch(`/api/activities/${deleteActivityId}`, {
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
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center", color: "var(--text-muted)" }}>
        <CalendarRange size={64} style={{ marginBottom: "16px", color: "var(--text-muted)" }} />
        <p
          style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}
        >
          Belum Ada Kegiatan
        </p>
        <p style={{ fontSize: "15px", color: "var(--text-muted)", marginBottom: "24px" }}>
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
        <div className="card" style={{ padding: "16px 20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
            <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>Pencarian Cepat</label>
              <div style={{ position: "relative" }}>
                <Search
                  size={18}
                  style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  placeholder="Cari judul, lokasi, atau dresscode..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>Dari Tanggal</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                  style={{ minWidth: "150px" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)" }}>Sampai Tanggal</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                  style={{ minWidth: "150px" }}
                />
              </div>
              {hasFilters && (
                <div style={{ display: "flex", alignItems: "flex-end" }}>
                  <button onClick={clearFilters} className="btn-outline" style={{ height: "42px", padding: "0 16px" }}>
                    <X size={16} /> Hapus
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty Filter Result */}
      {filtered.length === 0 && hasFilters ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "64px 20px", textAlign: "center" }}>
          <Search size={48} style={{ color: "var(--text-muted)", marginBottom: "16px" }} />
          <p style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", margin: "0 0 8px 0" }}>Tidak Ada Hasil</p>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", margin: "0 0 20px 0" }}>Tidak ada kegiatan yang sesuai.</p>
          <button onClick={clearFilters} className="btn-outline">Hapus Filter</button>
        </div>
      ) : (
        <div 
          ref={containerRef}
          style={{
            width: "100%",
            background: "var(--bg-card)",
            position: "relative",
            transition: "all 0.3s",
            ...(isFullscreen 
              ? { position: "fixed", inset: 0, zIndex: 50, padding: "24px", overflowY: "auto", background: "var(--bg-main)" } 
              : { borderRadius: "var(--radius-lg)", border: "1px solid var(--border)", overflow: "hidden" })
          }}
        >
          {isFullscreen && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", margin: 0 }}>
                Daftar Kegiatan
              </h2>
              <button 
                onClick={toggleFullscreen}
                className="btn-outline"
                style={{ background: "var(--primary-light)", color: "var(--primary)", borderColor: "transparent", fontWeight: 600 }}
              >
                <Minimize size={18} />
                <span>Keluar Fullscreen</span>
              </button>
            </div>
          )}

          {!isFullscreen && (
            <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10 }}>
              <button 
                onClick={toggleFullscreen}
                style={{
                  padding: "8px",
                  borderRadius: "8px",
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s"
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-surface)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
                title="Fullscreen"
              >
                <Maximize size={16} />
              </button>
            </div>
          )}

          <div style={{ overflowX: "auto" }}>
            <table className="data-table" style={isFullscreen ? { minWidth: "1200px", tableLayout: "fixed" } : { tableLayout: "fixed" }}>
            <thead>
              <tr>
                {fields.map((field) => (
                  <th key={field.id} style={{ paddingRight: "16px" }}>
                    {field.label}
                  </th>
                ))}
                {isAdmin && <th style={{ width: "80px", textAlign: "center" }}>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((activity) => (
                <tr key={activity.id}>
                  {fields.map((field) => (
                    <td key={field.id} style={{ wordBreak: "break-word" }}>
                      {renderCellContent(activity, field)}
                    </td>
                  ))}
                  {isAdmin && (
                    <td style={{ textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                        <Link
                          href={`/kegiatan/${activity.id}/edit`}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(217,119,6,0.15)",
                            color: "#D97706",
                            transition: "transform 0.15s"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => confirmDelete(activity.id, activity.title)}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "rgba(220,38,38,0.15)",
                            color: "#DC2626",
                            transition: "transform 0.15s"
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
