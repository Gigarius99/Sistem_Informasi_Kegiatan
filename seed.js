const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({ log: ['error'] });

async function main() {
  console.log("🌱 Seeding database (JS script)...");
  const adminPassword = await bcrypt.hash("admin123", 12);
  const atasanPassword = await bcrypt.hash("atasan123", 12);

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
  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
