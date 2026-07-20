const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Update admin to ADMIN_APLIKASI
  const admin = await prisma.user.findUnique({ where: { username: 'admin' } });
  if (admin) {
    await prisma.user.update({
      where: { username: 'admin' },
      data: { role: 'ADMIN_APLIKASI' }
    });
    console.log('Admin role updated to ADMIN_APLIKASI');
  }

  // Update atasan to PIMPINAN
  const atasan = await prisma.user.findUnique({ where: { username: 'atasan' } });
  if (atasan) {
    await prisma.user.update({
      where: { username: 'atasan' },
      data: { role: 'PIMPINAN' }
    });
    console.log('Atasan role updated to PIMPINAN');
  }

  // Find users that have role ADMIN and change them to ADMIN_KEGIATAN
  await prisma.user.updateMany({
    where: { role: 'ADMIN' },
    data: { role: 'ADMIN_KEGIATAN' }
  });
  console.log('Other ADMINs changed to ADMIN_KEGIATAN');

  // Find users that have role ATASAN and change them to PIMPINAN
  await prisma.user.updateMany({
    where: { role: 'ATASAN' },
    data: { role: 'PIMPINAN' }
  });
  console.log('Other ATASANs changed to PIMPINAN');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });