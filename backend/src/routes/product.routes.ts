import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts
} from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { productValidation, idValidation } from '../middleware/validation.middleware';

const router = Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/', getAllProducts);
router.get('/:id', idValidation, getProductById);

// Admin routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  productValidation,
  createProduct
);
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  idValidation,
  updateProduct
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  idValidation,
  deleteProduct
);

export default router;
