import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { ProductService } from '../services/product.service';
import { asyncHandler } from '../middleware/error.middleware';

const productService = new ProductService();

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
  const query = {
    category: req.query.category as string,
    minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
    maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
    search: req.query.search as string,
    featured: req.query.featured ? req.query.featured === 'true' : undefined,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 12,
    sort: req.query.sort as string
  };

  const result = await productService.getAllProducts(query);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.getProductById(req.params.id);

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
    return;
  }

  const product = await productService.createProduct(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      product
    }
  });
});

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  });
});

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  await productService.deleteProduct(req.params.id);

  res.status(200).json({
    status: 'success',
    message: 'Product deleted successfully'
  });
});

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = asyncHandler(async (req: Request, res: Response) => {
  const limit = req.query.limit ? Number(req.query.limit) : 8;
  const products = await productService.getFeaturedProducts(limit);

  res.status(200).json({
    status: 'success',
    data: {
      products
    }
  });
});
