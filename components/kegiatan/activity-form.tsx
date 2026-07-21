"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Loader2,
  Save,
  ArrowLeft,
  CalendarDays,
  Clock,
  Plus,
  GripVertical,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { Activity } from "@/types";

interface FieldConfig {
  id: string;
  name: string;
  label: string;
  type: string;
  inputType: string;
  order: number;
}

interface ActivityFormProps {
  mode: "create" | "edit";
  initialData?: Activity & { customFields?: string | null };
}

export function ActivityForm({ mode, initialData }: ActivityFormProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fields, setFields] = useState<FieldConfig[]>([]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"ADD" | "EDIT">("ADD");
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [customLabel, setCustomLabel] = useState("");
  const [customInputType, setCustomInputType] = useState("text");

  useEffect(() => {
    setMounted(true);
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const res = await fetch("/api/fields");
      const data = await res.json();
      if (data.success) {
        setFields(data.data);
        initializeFormData(data.data);
      }
    } catch {
      toast.error("Gagal mengambil konfigurasi form");
    } finally {
      setIsLoading(false);
    }
  };

  const initializeFormData = (configs: FieldConfig[]) => {
    const initData: Record<string, string> = {};
    configs.forEach((f) => {
      initData[f.name] = "";
    });

    if (mode === "edit" && initialData) {
      const date = new Date(initialData.activityDate);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");

      initData.title = initialData.title;
      initData.activityDate = `${yyyy}-${mm}-${dd}`;
      initData.location = initialData.location;
      initData.transitLocation = initialData.transitLocation ?? "";
      initData.dresscode = initialData.dresscode;
      initData.invitationTime = initialData.invitationTime;
      initData.description = initialData.description ?? "";

      if (initialData.customFields) {
        try {
          const customParsed = JSON.parse(initialData.customFields);
          Object.keys(customParsed).forEach((key) => {
            if (configs.find((c) => c.name === key)) {
              initData[key] = customParsed[key];
            }
          });
        } catch (e) {
          console.error("Gagal mem-parsing custom fields", e);
        }
      }
    }
    setFormData(initData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(fields);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFields(items); // Optimistic UI update

    try {
      await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REORDER", fields: items }),
      });
    } catch {
      toast.error("Gagal menyimpan urutan baru");
      fetchFields(); // revert
    }
  };

  const handleSaveField = async () => {
    if (!customLabel.trim()) {
      toast.error("Label tidak boleh kosong");
      return;
    }
    const payload = {
      action: modalMode,
      fieldData: {
        id: editingField?.id,
        label: customLabel,
        inputType: customInputType,
      },
    };

    try {
      const res = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(`Variabel berhasil ${modalMode === "ADD" ? "ditambahkan" : "diperbarui"}`);
        setShowModal(false);
        fetchFields();
      } else {
        toast.error(data.error || "Gagal menyimpan variabel");
      }
    } catch {
      toast.error("Terjadi kesalahan server");
    }
  };

  const handleDeleteField = async (id: string, name: string) => {
    if (!confirm("Hapus variabel ini secara permanen? Data pada kegiatan sebelumnya mungkin akan hilang di tabel.")) return;
    try {
      const res = await fetch("/api/fields", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "DELETE", fieldData: { id } }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Variabel dihapus");
        setFields(fields.filter((f) => f.id !== id));
        const newForm = { ...formData };
        delete newForm[name];
        setFormData(newForm);
      }
    } catch {
      toast.error("Gagal menghapus variabel");
    }
  };

  const openAddModal = () => {
    setModalMode("ADD");
    setEditingField(null);
    setCustomLabel("");
    setCustomInputType("text");
    setShowModal(true);
  };

  const openEditModal = (field: FieldConfig) => {
    setModalMode("EDIT");
    setEditingField(field);
    setCustomLabel(field.label);
    setCustomInputType(field.inputType);
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic Validation for standard required fields
    const newErrors: Record<string, string> = {};
    fields.forEach((f) => {
      if (f.type === "standard" && f.name !== "transitLocation" && f.name !== "description") {
        if (!formData[f.name]) {
          newErrors[f.name] = `${f.label} wajib diisi`;
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      // Build Payload
      const payload: Record<string, any> = {};
      const customPayload: Record<string, string> = {};

      fields.forEach((f) => {
        if (f.type === "standard") {
          payload[f.name] = formData[f.name];
        } else {
          customPayload[f.name] = formData[f.name] || "";
        }
      });

      payload.customFields = JSON.stringify(customPayload);
      if (mode === "edit") payload.id = initialData!.id;

      const url = mode === "edit" ? `/api/activities/${initialData!.id}` : "/api/activities";
      const method = mode === "edit" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(mode === "edit" ? "Kegiatan berhasil diperbarui." : "Kegiatan berhasil disimpan.");
        router.push("/dashboard");
        router.refresh();
      } else {
        if (data.errors) setErrors(data.errors);
        toast.error(data.error || "Gagal menyimpan kegiatan.");
      }
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted || isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={40} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 mb-6 font-semibold transition-colors"
        style={{ color: "var(--color-text-muted)", fontSize: "16px" }}
      >
        <ArrowLeft size={20} />
        Kembali ke Dashboard
      </Link>

      <div
        className="rounded-2xl p-8 shadow-lg"
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-black mb-1" style={{ fontSize: "26px", color: "var(--color-text)" }}>
              {mode === "edit" ? "Edit Kegiatan" : "Tambah Kegiatan Baru"}
            </h1>
            <p style={{ fontSize: "15px", color: "var(--color-text-muted)" }}>
              Isi informasi kegiatan. Tarik (drag) icon di sebelah kiri untuk mengubah urutan form.
            </p>
          </div>
          <button onClick={openAddModal} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors py-2 flex-shrink-0 text-sm">
            <Plus size={18} /> Tambah Variabel
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="form-fields">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {fields.map((field, index) => (
                    <Draggable key={field.id} draggableId={field.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${
                            snapshot.isDragging
                              ? "bg-[var(--color-surface)] shadow-lg border-[var(--color-primary)] scale-[1.01] z-50"
                              : "bg-[var(--color-card)] border-[var(--color-card-border)] hover:border-[var(--color-border)]"
                          }`}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="mt-8 p-1 rounded-lg hover:bg-[var(--color-surface-2)] cursor-grab active:cursor-grabbing opacity-50 group-hover:opacity-100 transition-opacity"
                          >
                            <GripVertical size={20} />
                          </div>

                          <div className="flex-1 min-w-0" data-error={errors[field.name] ? true : undefined}>
                            <div className="flex items-center justify-between mb-2">
                              <label
                                htmlFor={field.name}
                                className="font-bold flex items-center gap-2"
                                style={{ fontSize: "15px", color: "var(--color-text)" }}
                              >
                                {field.label}
                                {field.type === "custom" && (
                                  <span className="text-xs bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200 px-2 py-0.5 rounded-full font-semibold">
                                    Custom
                                  </span>
                                )}
                                {field.type === "standard" && field.name !== "transitLocation" && field.name !== "description" && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>

                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => openEditModal(field)}
                                  className="p-1.5 text-amber-600 hover:bg-amber-50 rounded"
                                >
                                  <Pencil size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteField(field.id, field.name)}
                                  className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>

                            <div className="relative">
                              {field.inputType === "date" && (
                                <CalendarDays
                                  size={18}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                  style={{ color: "var(--color-text-muted)" }}
                                />
                              )}
                              {field.inputType === "time" && (
                                <Clock
                                  size={18}
                                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                                  style={{ color: "var(--color-text-muted)" }}
                                />
                              )}

                              {field.inputType === "textarea" ? (
                                <textarea
                                  id={field.name}
                                  name={field.name}
                                  value={formData[field.name] || ""}
                                  onChange={handleChange}
                                  rows={3}
                                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] resize-none text-[15px] p-3"
                                  style={{
                                    borderColor: errors[field.name] ? "#DC2626" : "var(--color-input-border)",
                                  }}
                                  disabled={isSaving}
                                />
                              ) : (
                                <input
                                  id={field.name}
                                  name={field.name}
                                  type={field.inputType}
                                  value={formData[field.name] || ""}
                                  onChange={handleChange}
                                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] text-[15px] py-2.5"
                                  style={{
                                    paddingLeft: field.inputType === "date" || field.inputType === "time" ? "36px" : "12px",
                                    borderColor: errors[field.name] ? "#DC2626" : "var(--color-input-border)",
                                  }}
                                  disabled={isSaving}
                                />
                              )}
                            </div>
                            {errors[field.name] && (
                              <p className="mt-1 font-semibold" style={{ color: "#DC2626", fontSize: "13px" }}>
                                ⚠ {errors[field.name]}
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex gap-4 mt-8">
            <button type="submit" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center py-3.5 text-base" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save size={20} /> {mode === "edit" ? "Simpan Perubahan" : "Simpan Kegiatan"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* MODAL TAMBAH/EDIT VARIABEL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--color-card)] rounded-2xl w-full max-w-md shadow-2xl animate-in animate-[fadeIn_0.3s_ease-out] zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[var(--color-border)]">
              <h2 className="text-lg font-bold">
                {modalMode === "ADD" ? "Tambah Variabel Baru" : "Edit Variabel"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-[var(--color-text-muted)] hover:text-red-500">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block font-semibold mb-1 text-sm text-[var(--color-text)]">
                  Nama / Label Variabel
                </label>
                <input
                  type="text"
                  value={customLabel}
                  onChange={(e) => setCustomLabel(e.target.value)}
                  placeholder="Contoh: Susunan Acara, Penanggung Jawab..."
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] py-2 text-sm"
                  autoFocus
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-sm text-[var(--color-text)]">
                  Jenis Input
                </label>
                <select
                  value={customInputType}
                  onChange={(e) => setCustomInputType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border bg-[var(--color-input-bg)] text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)] py-2 text-sm bg-[var(--color-input-bg)] appearance-none"
                >
                  <option value="text">Teks Singkat (Text)</option>
                  <option value="textarea">Teks Panjang (Keterangan / Paragraf)</option>
                  <option value="date">Tanggal</option>
                  <option value="time">Waktu / Jam</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-[var(--color-border)] bg-[var(--color-surface)] rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] text-sm font-medium hover:bg-[var(--color-surface-2)] transition-colors py-2 text-sm">
                Batal
              </button>
              <button onClick={handleSaveField} className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed py-2 text-sm">
                Simpan Variabel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
