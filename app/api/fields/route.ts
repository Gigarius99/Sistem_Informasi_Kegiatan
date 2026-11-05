import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getTargetUserId() {
  const session = await auth();
  if (!session?.user) return null;

  const userRole = (session.user as any).role;
  let parentId = (session.user as any).parentId;
  
  // Jika PIMPINAN login dan parentId kosong di session (karena login sebelum update), ambil dari database
  if (userRole === "PIMPINAN" && !parentId) {
    const userFromDb = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { parentId: true },
    });
    parentId = userFromDb?.parentId;
  }
  
  if (userRole === "ADMIN_KEGIATAN") return session.user.id;
  if (userRole === "PIMPINAN") return parentId;
  
  // ADMIN_APLIKASI bisa mengembalikan id sendiri
  if (userRole === "ADMIN_APLIKASI") return session.user.id;
  
  return null;
}

const standardFieldsTemplate = [
  { name: "title", label: "Judul Acara / Kegiatan", type: "standard", inputType: "text" },
  { name: "activityDate", label: "Hari / Tanggal Kegiatan", type: "standard", inputType: "date" },
  { name: "location", label: "Lokasi Kegiatan", type: "standard", inputType: "text" },
  { name: "transitLocation", label: "Lokasi Transit", type: "standard", inputType: "text" },
  { name: "dresscode", label: "Dresscode", type: "standard", inputType: "text" },
  { name: "invitationTime", label: "Jam Undangan", type: "standard", inputType: "time" },
  { name: "description", label: "Keterangan", type: "standard", inputType: "textarea" },
];

// GET /api/fields
export async function GET() {
  try {
    const targetUserId = await getTargetUserId();
    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    let fields = await prisma.fieldConfig.findMany({
      where: { userId: targetUserId },
      orderBy: { order: "asc" },
    });

    // Auto-initialize jika belum ada field untuk atasan ini
    if (fields.length === 0) {
      const creates = standardFieldsTemplate.map((f, i) => 
        prisma.fieldConfig.create({
          data: {
            ...f,
            order: i + 1,
            userId: targetUserId,
          },
        })
      );
      fields = await prisma.$transaction(creates);
    }

    return NextResponse.json({ success: true, data: fields });
  } catch (error) {
    console.error("API Fields Error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Gagal mengambil field." }, { status: 500 });
  }
}

// POST /api/fields -> Update order, Add new field, Edit label, or Delete
export async function POST(req: Request) {
  try {
    const session = await auth();
    const userRole = (session?.user as any)?.role;
    
    if (userRole !== "ADMIN_APLIKASI" && userRole !== "ADMIN_KEGIATAN") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const targetUserId = await getTargetUserId();
    if (!targetUserId) {
      return NextResponse.json({ success: false, error: "Unauthorized target" }, { status: 403 });
    }

    const { action, fields, fieldData } = await req.json();

    if (action === "REORDER") {
      if (!Array.isArray(fields)) return NextResponse.json({ success: false }, { status: 400 });
      // Gunakan bulk update, perbarui hanya jika userId cocok (keamanan)
      const updates = fields.map((f: { id: string }, index: number) => 
        prisma.fieldConfig.updateMany({
          where: { id: f.id, userId: targetUserId },
          data: { order: index + 1 },
        })
      );
      await prisma.$transaction(updates);
      return NextResponse.json({ success: true });
    }

    if (action === "ADD") {
      const { label, inputType } = fieldData;
      const count = await prisma.fieldConfig.count({ where: { userId: targetUserId } });
      const newField = await prisma.fieldConfig.create({
        data: {
          name: `custom_${Date.now()}`,
          label,
          type: "custom",
          inputType,
          order: count + 1,
          userId: targetUserId,
        },
      });
      return NextResponse.json({ success: true, data: newField });
    }

    if (action === "EDIT") {
      const { id, label, inputType } = fieldData;
      // Field standard terikat ke kolom DB: tipe input & nama tidak boleh diubah,
      // hanya label. Kalau diubah (mis. activityDate jadi "time"), simpan kegiatan gagal.
      const target = await prisma.fieldConfig.findFirst({
        where: { id, userId: targetUserId },
        select: { type: true },
      });
      const updated = await prisma.fieldConfig.updateMany({
        where: { id, userId: targetUserId },
        data: target?.type === "standard" ? { label } : { label, inputType },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "DELETE") {
      const { id } = fieldData;
      // Field standard tidak boleh dihapus; form jadi kehilangan kolom wajib.
      const target = await prisma.fieldConfig.findFirst({
        where: { id, userId: targetUserId },
        select: { type: true },
      });
      if (target?.type === "standard") {
        return NextResponse.json(
          { success: false, error: "Field standar tidak bisa dihapus, hanya labelnya yang bisa diubah." },
          { status: 400 }
        );
      }
      await prisma.fieldConfig.deleteMany({
        where: { id, userId: targetUserId },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("API Fields Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
