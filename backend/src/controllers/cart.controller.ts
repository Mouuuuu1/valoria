import { Response } from 'express';
import { validationResult } from 'express-validator';
import { CartService } from '../services/cart.service';
import { asyncHandler } from '../middleware/error.middleware';
import { AuthRequest } from '../middleware/auth.middleware';

const cartService = new CartService();

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.getCart(req.user._id);

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
export const addToCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      errors: errors.array()
    });
    return;
  }

  const { productId, quantity } = req.body;

  const cart = await cartService.addToCart(req.user._id, productId, quantity);

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private
export const updateCartItem = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    res.status(400).json({
      status: 'error',
      message: 'Quantity must be at least 1'
    });
    return;
  }

  const cart = await cartService.updateCartItem(
    req.user._id,
    req.params.productId,
    quantity
  );

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private
export const removeFromCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);

  res.status(200).json({
    status: 'success',
    data: {
      cart
    }
  });
});

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = asyncHandler(async (req: AuthRequest, res: Response) => {
  await cartService.clearCart(req.user._id);

  res.status(200).json({
    status: 'success',
    message: 'Cart cleared successfully'
  });
});
