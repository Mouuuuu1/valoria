import { Response } from 'express';
import { validationResult } from 'express-validator';
import { OrderService } from '../services/order.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const orderService = new OrderService();

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
    return;
  }

  const { items, shippingAddress, paymentIntentId } = req.body;

  const order = await orderService.createOrder(
    req.user._id,
    items,
    shippingAddress,
    paymentIntentId
  );

  res.status(201).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get user orders
// @route   GET /api/orders
// @access  Private
export const getUserOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await orderService.getUserOrders(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      orders
    }
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.role === 'admin' ? undefined : req.user._id;
  const order = await orderService.getOrderById(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  const result = await orderService.getAllOrders(page, limit);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;

  const order = await orderService.updateOrderStatus(
    req.params.id,
    orderStatus,
    paymentStatus
  );

  res.status(200).json({
    status: 'success',
    data: {
      order
    }
  });
});

// @desc    Create payment intent
// @route   POST /api/orders/payment/create-intent
// @access  Private
export const createPaymentIntent = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid amount'
    });
    return;
  }

  const result = await orderService.createPaymentIntent(amount);

  res.status(200).json({
    status: 'success',
    data: result
  });
});

// @desc    Get order statistics (Admin)
// @route   GET /api/orders/admin/statistics
// @access  Private/Admin
export const getOrderStatistics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const statistics = await orderService.getOrderStatistics();

  res.status(200).json({
    status: 'success',
    data: statistics
  });
});
