import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { OrderService } from '../services/order.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const orderService = new OrderService();

// @desc    Create guest order
// @route   POST /api/orders/guest
// @access  Public
export const createGuestOrder = asyncHandler(async (req: Request, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
    return;
  }

  const { items, shippingAddress, guestEmail, paymentMethod } = req.body;

  const order = await orderService.createGuestOrder(
    items,
    shippingAddress,
    guestEmail,
    paymentMethod
  );

  res.status(201).json({
    status: 'success',
    data: {
      order: transformOrder(order),
      orderNumber: order.orderNumber,
    }
  });
});

// @desc    Get guest order by order number
// @route   GET /api/orders/guest/:orderNumber
// @access  Public
export const getGuestOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderNumber } = req.params;
  const { email } = req.query;

  const order = await orderService.getGuestOrderByNumber(
    orderNumber,
    email as string | undefined
  );

  res.status(200).json({
    status: 'success',
    data: {
      order: transformOrder(order)
    }
  });
});

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

  const { shippingAddress, paymentMethod } = req.body;

  const order = await orderService.createOrder(
    req.user.id,
    shippingAddress,
    paymentMethod
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
  const orders = await orderService.getUserOrders(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      orders: orders.map(transformOrder)
    }
  });
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userId = req.user.role.toLowerCase() === 'admin' ? undefined : req.user.id;
  const order = await orderService.getOrderById(req.params.id, userId);

  res.status(200).json({
    status: 'success',
    data: {
      order: transformOrder(order)
    }
  });
});

// Helper function to transform order for frontend
const transformOrder = (order: any) => {
  if (!order) return order;
  const { status, items, ...rest } = order;
  return {
    ...rest,
    orderStatus: status,
    items: items?.map((item: any) => ({
      productId: item.productId,
      name: item.product?.name || 'Unknown',
      price: item.price,
      quantity: item.quantity,
      image: item.product?.images?.[0] || '',
    })) || [],
  };
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req: AuthRequest, res: Response) => {
  const orders = await orderService.getAllOrders();

  res.status(200).json({
    status: 'success',
    data: { orders: orders.map(transformOrder) }
  });
});

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { orderStatus, paymentStatus } = req.body;

  let order;
  if (orderStatus) {
    order = await orderService.updateOrderStatus(req.params.id, orderStatus);
  }
  if (paymentStatus) {
    order = await orderService.updatePaymentStatus(req.params.id, paymentStatus);
  }

  res.status(200).json({
    status: 'success',
    data: {
      order: transformOrder(order)
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
  // TODO: Implement getOrderStatistics in OrderService
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Statistics endpoint - to be implemented'
    }
  });
});
