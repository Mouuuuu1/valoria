import { Product, IProduct } from '../models/product.model';
import { AppError } from '../middleware/error.middleware';
import { FilterQuery } from 'mongoose';

export interface ProductQuery {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: string;
}

export class ProductService {
  // Get all products with filtering, searching, and pagination
  async getAllProducts(query: ProductQuery) {
    const {
      category,
      minPrice,
      maxPrice,
      search,
      featured,
      page = 1,
      limit = 12,
      sort = '-createdAt'
    } = query;

    // Build filter
    const filter: FilterQuery<IProduct> = {};

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = minPrice;
      if (maxPrice !== undefined) filter.price.$lte = maxPrice;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (featured !== undefined) {
      filter.featured = featured;
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Get product by ID
  async getProductById(productId: string): Promise<IProduct> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  // Create new product (Admin only)
  async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.create(productData);
    return product;
  }

  // Update product (Admin only)
  async updateProduct(productId: string, updates: Partial<IProduct>): Promise<IProduct> {
    const product = await Product.findByIdAndUpdate(
      productId,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product;
  }

  // Delete product (Admin only)
  async deleteProduct(productId: string): Promise<void> {
    const product = await Product.findByIdAndDelete(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 8): Promise<IProduct[]> {
    return await Product.find({ featured: true })
      .sort('-createdAt')
      .limit(limit);
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<IProduct[]> {
    return await Product.find({ category: category.toLowerCase() })
      .sort('-createdAt');
  }

  // Update stock after order
  async updateStock(productId: string, quantity: number): Promise<void> {
    const product = await Product.findById(productId);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock', 400);
    }

    product.stock -= quantity;
    await product.save();
  }
}
