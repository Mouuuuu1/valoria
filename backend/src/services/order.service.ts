import { Order, IOrder } from '../models/order.model';
import { Product } from '../models/product.model';
import { Cart } from '../models/cart.model';
import { AppError } from '../middleware/error.middleware';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
});

export class OrderService {
  // Create new order
  async createOrder(
    userId: string,
    items: any[],
    shippingAddress: any,
    paymentIntentId?: string
  ): Promise<IOrder> {
    // Validate and prepare order items
    const orderItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        
        if (!product) {
          throw new AppError(`Product ${item.productId} not found`, 404);
        }

        if (product.stock < item.quantity) {
          throw new AppError(`Insufficient stock for ${product.name}`, 400);
        }

        return {
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          image: product.images[0]
        };
      })
    );

    // Calculate total
    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentIntentId,
      paymentStatus: paymentIntentId ? 'completed' : 'pending',
      orderStatus: 'processing'
    });

    // Update product stock
    await Promise.all(
      orderItems.map(async (item) => {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      })
    );

    // Clear user's cart
    await Cart.findOneAndUpdate(
      { userId },
      { items: [] }
    );

    return order;
  }

  // Get user's orders
  async getUserOrders(userId: string): Promise<IOrder[]> {
    return await Order.find({ userId })
      .sort('-createdAt')
      .populate('userId', 'name email');
  }

  // Get order by ID
  async getOrderById(orderId: string, userId?: string): Promise<IOrder> {
    const query: any = { _id: orderId };
    if (userId) query.userId = userId;

    const order = await Order.findOne(query)
      .populate('userId', 'name email');

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  // Get all orders (Admin only)
  async getAllOrders(page: number = 1, limit: number = 20): Promise<any> {
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('userId', 'name email'),
      Order.countDocuments()
    ]);

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  // Update order status (Admin only)
  async updateOrderStatus(
    orderId: string,
    orderStatus: string,
    paymentStatus?: string
  ): Promise<IOrder> {
    const updates: any = { orderStatus };
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(
      orderId,
      updates,
      { new: true, runValidators: true }
    );

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order;
  }

  // Create Stripe payment intent
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<any> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        automatic_payment_methods: {
          enabled: true
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };
    } catch (error: any) {
      throw new AppError(`Payment error: ${error.message}`, 400);
    }
  }

  // Get order statistics (Admin only)
  async getOrderStatistics(): Promise<any> {
    const [
      totalOrders,
      totalRevenue,
      pendingOrders,
      completedOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Order.countDocuments({ orderStatus: 'processing' }),
      Order.countDocuments({ orderStatus: 'delivered' })
    ]);

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      pendingOrders,
      completedOrders
    };
  }
}
