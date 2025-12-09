import { prisma } from '../config/database';
import { Order, OrderStatus, PaymentStatus } from '../types/prisma';
import { AppError } from '../middleware/error.middleware';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  fullName?: string;
  phone?: string;
}

interface GuestOrderItem {
  productId: string;
  quantity: number;
}

export class OrderService {
  // Create guest order (no user account required)
  async createGuestOrder(
    items: GuestOrderItem[],
    shippingAddress: ShippingAddress,
    guestEmail: string,
    paymentMethod?: string
  ): Promise<Order> {
    // Validate products and check stock
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } }
    });

    if (products.length !== items.length) {
      throw new AppError('One or more products not found', 400);
    }

    // Check stock availability
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (!product) {
        throw new AppError(`Product not found: ${item.productId}`, 400);
      }
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 400);
      }
    }

    // Calculate total
    const totalAmount = items.reduce((sum, item) => {
      const product = products.find(p => p.id === item.productId)!;
      return sum + product.price * item.quantity;
    }, 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order with transaction (no userId for guest orders)
    const order = await prisma.$transaction(async (tx) => {
      // Create order without userId, store email in guestEmail field
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          totalAmount,
          shippingAddress: shippingAddress as any,
          paymentMethod,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          guestEmail,
        },
      });

      // Create order items and update product stock
      for (const item of items) {
        const product = products.find(p => p.id === item.productId)!;
        
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          },
        });

        // Decrease product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return newOrder;
    });

    // Get full order with items
    return this.getOrderById(order.id);
  }

  // Get guest order by order number and email
  async getGuestOrderByNumber(orderNumber: string, email?: string): Promise<Order> {
    const whereClause: any = { 
      orderNumber,
      userId: null // Guest orders have no userId
    };
    
    // If email provided, add to query
    if (email) {
      whereClause.guestEmail = email;
    }
    
    const order = await prisma.order.findFirst({
      where: whereClause,
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order as any;
  }

  // Create new order
  async createOrder(
    userId: string,
    shippingAddress: ShippingAddress,
    paymentMethod?: string
  ): Promise<Order> {
    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Check stock availability
    for (const item of cart.items) {
      if (item.product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${item.product.name}`, 400);
      }
    }

    // Calculate total
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create order with transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          totalAmount,
          shippingAddress: shippingAddress as any,
          paymentMethod,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      });

      // Create order items and update product stock
      for (const item of cart.items) {
        await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
          },
        });

        // Decrease product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return order;
  }

  // Get orders for user
  async getUserOrders(userId: string): Promise<Order[]> {
    return prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get order by ID
  async getOrderById(orderId: string, userId?: string): Promise<Order> {
    const where: any = { id: orderId };
    if (userId) {
      where.userId = userId;
    }

    const order = await prisma.order.findUnique({
      where,
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order as any;
  }

  // Get all orders (Admin)
  async getAllOrders(): Promise<Order[]> {
    return prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Update order status (Admin)
  async updateOrderStatus(orderId: string, status: OrderStatus): Promise<Order> {
    const order = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  // Create payment intent
  async createPaymentIntent(orderId: string): Promise<{ clientSecret: string }> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalAmount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: order.id,
        orderNumber: order.orderNumber,
      },
    });

    return { clientSecret: paymentIntent.client_secret! };
  }

  // Update payment status
  async updatePaymentStatus(orderId: string, status: PaymentStatus): Promise<Order> {
    return prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
  }
}
