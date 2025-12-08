import { Router } from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  createPaymentIntent,
  getOrderStatistics
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { orderValidation, idValidation } from '../middleware/validation.middleware';

const router = Router();

// All order routes require authentication
router.use(authenticate);

// Customer routes
router.post('/', orderValidation, createOrder);
router.get('/', getUserOrders);
router.get('/:id', idValidation, getOrderById);
router.post('/payment/create-intent', createPaymentIntent);

// Admin routes
router.get('/admin/all', authorize('admin'), getAllOrders);
router.get('/admin/statistics', authorize('admin'), getOrderStatistics);
router.put('/:id/status', authorize('admin'), idValidation, updateOrderStatus);

export default router;
