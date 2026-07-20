/**
 * lib/export.ts
 * Excel export functionality using ExcelJS
 * Node.js runtime only (Vercel) — tidak kompatibel dengan Edge Runtime
 */

import ExcelJS from "exceljs";
import { formatDateIndonesia, formatTime } from "@/lib/utils";
import type { Activity } from "@/types";

export async function generateActivityExcel(
  activities: Activity[],
  startDate: string,
  endDate: string
): Promise<ArrayBuffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "Sistem Informasi Daftar Kegiatan Kantor";
  workbook.lastModifiedBy = "Sistem";
  workbook.created = new Date();
  workbook.modified = new Date();

  const worksheet = workbook.addWorksheet("Daftar Kegiatan", {
    pageSetup: {
      paperSize: 9, // A4
      orientation: "landscape",
      fitToPage: true,
    },
  });

  // ============================================================
  // Header Row
  // ============================================================
  const headerRow = worksheet.addRow([
    "Tanggal",
    "Judul Kegiatan",
    "Lokasi Kegiatan",
    "Lokasi Transit",
    "Dresscode",
    "Jam Undangan",
    "Keterangan",
  ]);

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFD2001A" }, // Primary red
    };
    cell.font = {
      name: "Calibri",
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 12,
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF999999" } },
      left: { style: "thin", color: { argb: "FF999999" } },
      bottom: { style: "thin", color: { argb: "FF999999" } },
      right: { style: "thin", color: { argb: "FF999999" } },
    };
  });

  headerRow.height = 35;

  // ============================================================
  // Title Banner
  // ============================================================
  worksheet.spliceRows(1, 0, [], [], []);

  const titleRow = worksheet.getRow(1);
  titleRow.height = 40;
  const titleCell = worksheet.getCell("A1");
  titleCell.value =
    "DAFTAR AGENDA KEGIATAN";
  titleCell.font = {
    name: "Calibri",
    bold: true,
    size: 16,
    color: { argb: "FFD2001A" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.mergeCells("A1:G1");

  const subtitleRow = worksheet.getRow(2);
  subtitleRow.height = 25;
  const subtitleCell = worksheet.getCell("A2");
  subtitleCell.value = `Periode: ${formatDateIndonesia(startDate)} s.d. ${formatDateIndonesia(endDate)}`;
  subtitleCell.font = { name: "Calibri", size: 11, italic: true };
  subtitleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.mergeCells("A2:G2");

  const emptyRow = worksheet.getRow(3);
  emptyRow.height = 10;

  // ============================================================
  // Column Widths
  // ============================================================
  worksheet.columns = [
    { key: "tanggal", width: 28 },
    { key: "judul", width: 40 },
    { key: "lokasi", width: 35 },
    { key: "transit", width: 30 },
    { key: "dresscode", width: 20 },
    { key: "jam", width: 15 },
    { key: "keterangan", width: 40 },
  ];

  // ============================================================
  // Data Rows
  // ============================================================
  activities.forEach((activity, index) => {
    const row = worksheet.addRow([
      formatDateIndonesia(activity.activityDate),
      activity.title,
      activity.location,
      activity.transitLocation || "-",
      activity.dresscode,
      formatTime(activity.invitationTime),
      activity.description || "-",
    ]);

    const isEven = index % 2 === 0;
    row.eachCell((cell) => {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: isEven ? "FFFFFFAE7" : "FFEFEFEF" },
      };
      cell.font = { name: "Calibri", size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFCCCCCC" } },
        left: { style: "thin", color: { argb: "FFCCCCCC" } },
        bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
        right: { style: "thin", color: { argb: "FFCCCCCC" } },
      };
    });

    row.height = 30;
  });

  // ============================================================
  // Footer
  // ============================================================
  worksheet.addRow([]);
  const footerRow = worksheet.addRow([
    `Dicetak pada: ${new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
  ]);
  footerRow.getCell(1).font = {
    name: "Calibri",
    size: 10,
    italic: true,
    color: { argb: "FF666666" },
  };
  worksheet.mergeCells(
    `A${footerRow.number}:G${footerRow.number}`
  );

  // ============================================================
  // Generate ArrayBuffer (native BodyInit for Next.js 16)
  // ============================================================
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return arrayBuffer;
}

export function generateExcelFilename(
  startDate: string,
  endDate: string
): string {
  const start = startDate.replace(/-/g, "-");
  const end = endDate.replace(/-/g, "-");
  return `Daftar_Kegiatan_${start}_sd_${end}.xlsx`;
}
