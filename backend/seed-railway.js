const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL
});

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('moustafa123', 10);
  await prisma.user.upsert({
    where: { email: 'moustafaaabokhosheim@gmail.com' },
    update: {},
    create: {
      email: 'moustafaaabokhosheim@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created');
  console.log('📧 Email: moustafaaabokhosheim@gmail.com');
  console.log('🔑 Password: moustafa123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
