import { Cart, ICart } from '../models/cart.model';
import { Product } from '../models/product.model';
import { AppError } from '../middleware/error.middleware';

export class CartService {
  // Get user's cart with populated product details
  async getCart(userId: string): Promise<any> {
    let cart = await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name price images stock'
    });

    if (!cart) {
      // Create empty cart if doesn't exist
      cart = await Cart.create({ userId, items: [] });
    }

    // Calculate cart total
    const cartWithTotal = cart.toObject();
    const total = cartWithTotal.items.reduce((sum: number, item: any) => {
      return sum + (item.productId?.price || 0) * item.quantity;
    }, 0);

    return {
      ...cartWithTotal,
      total
    };
  }

  // Add item to cart
  async addToCart(userId: string, productId: string, quantity: number): Promise<ICart> {
    // Check if product exists and has sufficient stock
    const product = await Product.findById(productId);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock available', 400);
    }

    // Find or create cart
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // Update quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.stock < newQuantity) {
        throw new AppError('Insufficient stock available', 400);
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      cart.items.push({
        productId: productId as any,
        quantity,
        addedAt: new Date()
      });
    }

    await cart.save();
    
    return await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name price images stock'
    }) as ICart;
  }

  // Update cart item quantity
  async updateCartItem(userId: string, productId: string, quantity: number): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    // Check product stock
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    if (product.stock < quantity) {
      throw new AppError('Insufficient stock available', 400);
    }

    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );

    if (itemIndex === -1) {
      throw new AppError('Item not found in cart', 404);
    }

    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    return await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name price images stock'
    }) as ICart;
  }

  // Remove item from cart
  async removeFromCart(userId: string, productId: string): Promise<ICart> {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError('Cart not found', 404);
    }

    // Filter out the item
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );

    await cart.save();

    return await Cart.findOne({ userId }).populate({
      path: 'items.productId',
      select: 'name price images stock'
    }) as ICart;
  }

  // Clear cart
  async clearCart(userId: string): Promise<void> {
    const cart = await Cart.findOne({ userId });

    if (cart) {
      cart.items = [];
      await cart.save();
    }
  }
}
