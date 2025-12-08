import { Product } from './models/product.model';
import { User } from './models/user.model';
import bcrypt from 'bcryptjs';
import { connectDatabase } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const sampleProducts = [
  {
    name: 'Classic Leather Tote',
    description: 'Elegant leather tote bag perfect for everyday use. Spacious interior with multiple compartments.',
    price: 189.99,
    category: 'tote',
    images: [
      'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500'
    ],
    stock: 15,
    material: 'Genuine Leather',
    colors: ['Black', 'Brown', 'Tan'],
    featured: true
  },
  {
    name: 'Mini Crossbody Bag',
    description: 'Compact and stylish crossbody bag for hands-free convenience. Perfect for nights out.',
    price: 79.99,
    category: 'crossbody',
    images: [
      'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=500',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500'
    ],
    stock: 25,
    material: 'Vegan Leather',
    colors: ['Black', 'Red', 'Navy'],
    featured: true
  },
  {
    name: 'Evening Clutch',
    description: 'Sophisticated clutch with metallic finish. Ideal for formal events and special occasions.',
    price: 129.99,
    category: 'clutch',
    images: [
      'https://images.unsplash.com/photo-1564422170194-896b89110ef8?w=500'
    ],
    stock: 10,
    material: 'Satin with Metal Accents',
    colors: ['Gold', 'Silver', 'Rose Gold'],
    featured: true
  },
  {
    name: 'Work Laptop Bag',
    description: 'Professional laptop bag with padded compartment. Combines style with functionality.',
    price: 159.99,
    category: 'handbag',
    images: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=500'
    ],
    stock: 20,
    material: 'Leather',
    colors: ['Black', 'Brown'],
    featured: false
  },
  {
    name: 'Designer Shoulder Bag',
    description: 'Luxury shoulder bag with chain strap. Statement piece for fashion-forward individuals.',
    price: 249.99,
    category: 'shoulder',
    images: [
      'https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=500'
    ],
    stock: 8,
    material: 'Premium Leather',
    colors: ['Burgundy', 'Black', 'Beige'],
    featured: true
  },
  {
    name: 'Casual Canvas Backpack',
    description: 'Stylish canvas backpack for everyday adventures. Multiple pockets for organization.',
    price: 89.99,
    category: 'backpack',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500'
    ],
    stock: 30,
    material: 'Canvas',
    colors: ['Navy', 'Gray', 'Olive'],
    featured: false
  },
  {
    name: 'Slim Card Wallet',
    description: 'Minimalist wallet with RFID protection. Holds cards and cash in sleek design.',
    price: 49.99,
    category: 'wallet',
    images: [
      'https://images.unsplash.com/photo-1627123419938-0c3b7b0e5e71?w=500'
    ],
    stock: 50,
    material: 'Leather',
    colors: ['Black', 'Brown', 'Navy'],
    featured: false
  },
  {
    name: 'Vintage Satchel',
    description: 'Classic satchel with vintage-inspired design. Perfect blend of nostalgia and modern utility.',
    price: 169.99,
    category: 'handbag',
    images: [
      'https://images.unsplash.com/photo-1590739225684-b57631ff2374?w=500'
    ],
    stock: 12,
    material: 'Leather',
    colors: ['Brown', 'Cognac'],
    featured: true
  }
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');
    
    await connectDatabase();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      name: 'Admin User',
      email: 'admin@valorina.com',
      password: hashedPassword,
      role: 'admin'
    });

    // Create sample customer
    const customerPassword = await bcrypt.hash('customer123', 10);
    await User.create({
      name: 'Jane Doe',
      email: 'customer@valorina.com',
      password: customerPassword,
      role: 'customer'
    });

    // Create products
    console.log('📦 Creating sample products...');
    await Product.insertMany(sampleProducts);

    console.log('✅ Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('Admin: admin@valorina.com / admin123');
    console.log('Customer: customer@valorina.com / customer123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seedDatabase();
