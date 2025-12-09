const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// Get DATABASE_URL from command line argument
const databaseUrl = process.argv[2];

if (!databaseUrl) {
  console.error('❌ Please provide DATABASE_URL as argument');
  console.log('Usage: node seed-admin.js "postgresql://..."');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: { db: { url: databaseUrl } }
});

async function main() {
  console.log('�� Creating admin user...');

  const hashedPassword = await bcrypt.hash('moustafa123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'moustafaaabokhosheim@gmail.com' },
    update: {},
    create: {
      email: 'moustafaaabokhosheim@gmail.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('✅ Admin user created!');
  console.log('📧 Email: moustafaaabokhosheim@gmail.com');
  console.log('🔑 Password: moustafa123');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error:', e);
    prisma.$disconnect();
    process.exit(1);
  });
