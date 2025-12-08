import { prisma } from '../config/database';
import { Product, Category } from '../types/prisma';
import { AppError } from '../middleware/error.middleware';

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
}

export class ProductService {
  // Get all products with filters and pagination
  async getProducts(
    filters: ProductFilters,
    page: number = 1,
    limit: number = 12
  ): Promise<{ products: Product[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (filters.category) {
      where.category = filters.category.toUpperCase();
    }

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    // Get products and total count
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  // Get product by ID
  async getProductById(productId: string): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  // Create new product (Admin only)
  async createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    const product = await prisma.product.create({
      data: {
        ...productData,
        category: productData.category.toUpperCase() as Category,
      },
    });

    return product;
  }

  // Update product (Admin only)
  async updateProduct(productId: string, updates: Partial<Product>): Promise<Product> {
    const product = await prisma.product.update({
      where: { id: productId },
      data: updates,
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  // Delete product (Admin only)
  async deleteProduct(productId: string): Promise<void> {
    await prisma.product.delete({
      where: { id: productId },
    });
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    return prisma.product.findMany({
      where: { featured: true },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update product stock
  async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock + quantity < 0) {
      throw new AppError('Insufficient stock', 400);
    }

    return prisma.product.update({
      where: { id: productId },
      data: { stock: { increment: quantity } },
    });
  }
}
