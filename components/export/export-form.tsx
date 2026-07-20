"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FileSpreadsheet, Download, Loader2, Info } from "lucide-react";

export function ExportForm() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ startDate?: string; endDate?: string }>({});

  const validate = () => {
    const newErrors: { startDate?: string; endDate?: string } = {};
    if (!startDate) newErrors.startDate = "Tanggal awal wajib dipilih";
    if (!endDate) newErrors.endDate = "Tanggal akhir wajib dipilih";
    if (startDate && endDate && startDate > endDate) {
      newErrors.endDate = "Tanggal akhir harus setelah tanggal awal";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExport = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });
      const response = await fetch(`/api/export/excel?${params.toString()}`);

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Gagal mengunduh file");
      }

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      const filename =
        response.headers
          .get("Content-Disposition")
          ?.split("filename=")[1]
          ?.replace(/"/g, "") ??
        `Daftar_Kegiatan_${startDate}_sd_${endDate}.xlsx`;

      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success("File Excel berhasil diunduh!");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Gagal mengunduh file Excel."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Generate filename preview
  const filenamePreview =
    startDate && endDate
      ? `Daftar_Kegiatan_${startDate}_sd_${endDate}.xlsx`
      : null;

  return (
    <div className="max-w-2xl">
      {/* Info Card */}
      <div
        className="rounded-2xl p-6 mb-6 flex items-start gap-4"
        style={{
          backgroundColor: "rgba(59,130,246,0.08)",
          border: "1px solid rgba(59,130,246,0.2)",
        }}
      >
        <Info size={22} style={{ color: "#3B82F6", flexShrink: 0, marginTop: "2px" }} />
        <div>
          <p className="font-bold mb-1" style={{ fontSize: "16px", color: "var(--color-text)" }}>
            Informasi Export
          </p>
          <p style={{ fontSize: "15px", color: "var(--color-text-muted)", lineHeight: 1.7 }}>
            File Excel akan berisi kolom:{" "}
            <strong>Tanggal, Judul Kegiatan, Lokasi, Lokasi Transit, Dresscode, Jam Undangan, Keterangan</strong>.
            Pilih rentang tanggal untuk memfilter data yang akan diekspor.
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div
        className="rounded-2xl p-8 shadow-lg"
        style={{
          backgroundColor: "var(--color-card)",
          border: "1px solid var(--color-card-border)",
        }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "rgba(5,150,105,0.1)" }}
          >
            <FileSpreadsheet size={30} style={{ color: "#059669" }} />
          </div>
          <div>
            <h2 className="font-black" style={{ fontSize: "22px", color: "var(--color-text)" }}>
              Pilih Rentang Tanggal
            </h2>
            <p style={{ fontSize: "15px", color: "var(--color-text-muted)" }}>
              Data yang dieksport akan diurutkan berdasarkan tanggal
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Tanggal Awal */}
          <div>
            <label
              htmlFor="export-start"
              className="block font-bold mb-2"
              style={{ fontSize: "17px", color: "var(--color-text)" }}
            >
              Tanggal Awal
            </label>
            <input
              id="export-start"
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                if (errors.startDate) setErrors((p) => ({ ...p, startDate: undefined }));
              }}
              className="form-input"
              style={{
                fontSize: "17px",
                borderColor: errors.startDate ? "#DC2626" : "var(--color-input-border)",
              }}
            />
            {errors.startDate && (
              <p className="mt-2 font-semibold" style={{ color: "#DC2626", fontSize: "15px" }}>
                ⚠ {errors.startDate}
              </p>
            )}
          </div>

          {/* Tanggal Akhir */}
          <div>
            <label
              htmlFor="export-end"
              className="block font-bold mb-2"
              style={{ fontSize: "17px", color: "var(--color-text)" }}
            >
              Tanggal Akhir
            </label>
            <input
              id="export-end"
              type="date"
              value={endDate}
              min={startDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                if (errors.endDate) setErrors((p) => ({ ...p, endDate: undefined }));
              }}
              className="form-input"
              style={{
                fontSize: "17px",
                borderColor: errors.endDate ? "#DC2626" : "var(--color-input-border)",
              }}
            />
            {errors.endDate && (
              <p className="mt-2 font-semibold" style={{ color: "#DC2626", fontSize: "15px" }}>
                ⚠ {errors.endDate}
              </p>
            )}
          </div>

          {/* Filename Preview */}
          {filenamePreview && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: "var(--color-surface)", border: "1px solid var(--color-border)" }}
            >
              <FileSpreadsheet size={20} style={{ color: "#059669", flexShrink: 0 }} />
              <div>
                <p className="text-xs font-semibold mb-0.5" style={{ color: "var(--color-text-muted)" }}>
                  Nama file yang akan diunduh:
                </p>
                <p className="font-bold" style={{ fontSize: "15px", color: "var(--color-text)", wordBreak: "break-all" }}>
                  {filenamePreview}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isLoading}
          className="btn-primary w-full justify-center text-lg py-4 mt-8"
          id="btn-export-excel"
          style={{ backgroundColor: "#059669" }}
        >
          {isLoading ? (
            <>
              <Loader2 size={22} className="spinner" />
              Menyiapkan File...
            </>
          ) : (
            <>
              <Download size={22} />
              Export Excel
            </>
          )}
        </button>
      </div>
    </div>
  );
}
