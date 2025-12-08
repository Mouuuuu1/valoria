import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Classic Leather Tote",
    description: "Elegant leather tote bag perfect for everyday use. Features multiple compartments and a secure zipper closure.",
    price: 129.99,
    category: "TOTE",
    stock: 25,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500"
    ],
    featured: true
  },
  {
    name: "Vintage Crossbody Bag",
    description: "Compact crossbody bag with adjustable strap. Perfect for hands-free convenience.",
    price: 89.99,
    category: "CROSSBODY",
    stock: 30,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500"
    ],
    featured: true
  },
  {
    name: "Designer Shoulder Bag",
    description: "Luxurious shoulder bag with premium hardware and soft leather finish.",
    price: 199.99,
    category: "SHOULDER",
    stock: 15,
    images: [
      "https://images.unsplash.com/photo-1564422167509-4f3295f60e0b?w=500"
    ],
    featured: true
  },
  {
    name: "Evening Clutch",
    description: "Elegant clutch perfect for formal occasions. Features gold-tone chain strap.",
    price: 79.99,
    category: "CLUTCH",
    stock: 20,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500"
    ],
    featured: false
  },
  {
    name: "Travel Backpack",
    description: "Spacious backpack with multiple pockets and padded laptop compartment.",
    price: 149.99,
    category: "BACKPACK",
    stock: 18,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
    ],
    featured: true
  },
  {
    name: "Sequined Evening Bag",
    description: "Glamorous evening bag with sequin detailing and satin interior.",
    price: 95.99,
    category: "EVENING",
    stock: 12,
    images: [
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500"
    ],
    featured: false
  },
  {
    name: "Mini Crossbody",
    description: "Cute mini crossbody bag perfect for essentials. Lightweight and stylish.",
    price: 69.99,
    category: "CROSSBODY",
    stock: 35,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500"
    ],
    featured: false
  },
  {
    name: "Premium Tote Bag",
    description: "Large tote bag with reinforced handles and premium canvas material.",
    price: 159.99,
    category: "TOTE",
    stock: 22,
    images: [
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500"
    ],
    featured: true
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await prisma.$connect();
    console.log('✅ PostgreSQL connected successfully');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.product.deleteMany();
    await prisma.user.deleteMany();

    // Create admin user
    console.log('👤 Creating admin user...');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@valorina.com',
        password: adminPassword,
        role: 'ADMIN'
      }
    });

    // Create customer user
    const customerPassword = await bcrypt.hash('customer123', 10);
    const customer = await prisma.user.create({
      data: {
        name: 'Customer User',
        email: 'customer@valorina.com',
        password: customerPassword,
        role: 'CUSTOMER'
      }
    });

    // Create products
    console.log('📦 Creating sample products...');
    for (const productData of sampleProducts) {
      await prisma.product.create({
        data: {
          ...productData,
          category: productData.category as any
        }
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@valorina.com / admin123');
    console.log('Customer: customer@valorina.com / customer123');

  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
