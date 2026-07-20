import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const dummyTitles = [
    "Rapat Koordinasi Bulanan",
    "Upacara Peringatan Hari Kemerdekaan",
    "Pertemuan dengan Delegasi Kabupaten Tetangga",
    "Rapat Anggaran APBD Tahun 2027",
    "Kunjungan Kerja ke Kecamatan Selatan"
  ];

  for (const title of dummyTitles) {
    await prisma.activity.deleteMany({
      where: {
        title: title
      }
    });
    console.log(`Deleted dummy activities with title: ${title}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
