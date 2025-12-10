import { Router } from 'express';
import {
  createOrder,
  createGuestOrder,
  getUserOrders,
  getOrderById,
  getGuestOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  createPaymentIntent,
  getOrderStatistics
} from '../controllers/order.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { orderValidation, guestOrderValidation, idValidation } from '../middleware/validation.middleware';

const router = Router();

// Guest checkout route (no authentication required)
router.post('/guest', guestOrderValidation, createGuestOrder);
router.get('/guest/:orderNumber', getGuestOrder);

// All other order routes require authentication
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
router.delete('/:id', authorize('admin'), idValidation, deleteOrder);

export default router;
