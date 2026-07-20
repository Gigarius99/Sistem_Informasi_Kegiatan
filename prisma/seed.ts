import { prisma } from "../lib/db";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Seeding database...");

  // Hash passwords
  const adminPassword = await bcrypt.hash("admin123", 12);
  const atasanPassword = await bcrypt.hash("atasan123", 12);

  // Create Admin user
  const admin = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      name: "Administrator",
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Created admin: ${admin.username}`);

  // Create Atasan user
  const atasan = await prisma.user.upsert({
    where: { username: "atasan" },
    update: {},
    create: {
      name: "Pimpinan Kantor",
      username: "atasan",
      password: atasanPassword,
      role: "ATASAN",
    },
  });
  console.log(`✅ Created atasan: ${atasan.username}`);

  // Sample activities
  const sampleActivities = [
    {
      title: "Rapat Koordinasi Bulanan",
      activityDate: new Date("2026-07-21"),
      location: "Ruang Rapat Utama Kantor Bupati",
      transitLocation: "Rumah Dinas Bupati",
      dresscode: "PDH Khaki",
      invitationTime: "08:00",
      description: "Mohon hadir 15 menit sebelum acara dimulai.",
      createdBy: admin.id,
    },
    {
      title: "Upacara Peringatan Hari Kemerdekaan",
      activityDate: new Date("2026-08-17"),
      location: "Lapangan Upacara Kantor Bupati",
      transitLocation: null,
      dresscode: "Pakaian KORPRI Lengkap",
      invitationTime: "07:00",
      description: "Peserta hadir pukul 06:30 WIB.",
      createdBy: admin.id,
    },
    {
      title: "Pertemuan dengan Delegasi Kabupaten Tetangga",
      activityDate: new Date("2026-07-28"),
      location: "Pendopo Kabupaten",
      transitLocation: "Kantor Dinas Hubungan Antar Daerah",
      dresscode: "Batik Resmi",
      invitationTime: "10:00",
      description: "Agenda: diskusi kerjasama pembangunan daerah.",
      createdBy: admin.id,
    },
    {
      title: "Rapat Anggaran APBD Tahun 2027",
      activityDate: new Date("2026-07-17"),
      location: "Aula DPRD Kabupaten",
      transitLocation: null,
      dresscode: "Jas Resmi",
      invitationTime: "09:00",
      description: "Bawa dokumen RAPBD dan dokumen pendukung.",
      createdBy: admin.id,
    },
    {
      title: "Kunjungan Kerja ke Kecamatan Selatan",
      activityDate: new Date("2026-07-18"),
      location: "Kantor Kecamatan Selatan",
      transitLocation: "Pos Pelayanan Terpadu",
      dresscode: "PDH Khaki",
      invitationTime: "07:30",
      description: "Inspeksi fasilitas pelayanan publik tingkat kecamatan.",
      createdBy: admin.id,
    },
  ];

  for (const activity of sampleActivities) {
    const created = await prisma.activity.create({
      data: activity,
    });

    // Log the creation
    await prisma.activityLog.create({
      data: {
        userId: admin.id,
        activityId: created.id,
        action: "CREATE_ACTIVITY",
      },
    });
    console.log(`✅ Created activity: ${created.title}`);
  }

  const standardFields = [
    { name: "title", label: "Judul Acara / Kegiatan", type: "standard", inputType: "text" },
    { name: "activityDate", label: "Hari / Tanggal Kegiatan", type: "standard", inputType: "date" },
    { name: "location", label: "Lokasi Kegiatan", type: "standard", inputType: "text" },
    { name: "transitLocation", label: "Lokasi Transit", type: "standard", inputType: "text" },
    { name: "dresscode", label: "Dresscode", type: "standard", inputType: "text" },
    { name: "invitationTime", label: "Jam Undangan", type: "standard", inputType: "time" },
    { name: "description", label: "Keterangan", type: "standard", inputType: "textarea" },
  ];

  for (let i = 0; i < standardFields.length; i++) {
    const field = standardFields[i];
    await prisma.fieldConfig.upsert({
      where: { name: field.name },
      update: {
        label: field.label,
        type: field.type,
        inputType: field.inputType,
        order: i + 1,
      },
      create: {
        name: field.name,
        label: field.label,
        type: field.type,
        inputType: field.inputType,
        order: i + 1,
      },
    });
  }
  console.log("✅ Seeded default field configs");

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
