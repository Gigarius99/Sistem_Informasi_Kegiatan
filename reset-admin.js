const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {
      password: hashedPassword,
      role: 'ADMIN_APLIKASI',
    },
    create: {
      name: 'Administrator',
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN_APLIKASI',
    },
  });
  
  console.log('✅ Admin account reset successfully.');
  console.log(`Username: ${admin.username}`);
  console.log('Password: admin123');
  console.log(`Role: ${admin.role}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });