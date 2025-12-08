import axios, { AxiosInstance, AxiosError } from 'axios';
import { User, Product, Cart, Order, ApiResponse, PaginationResult } from '@/types';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiResponse<any>>) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(name: string, email: string, password: string) {
    const { data } = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/register',
      { name, email, password }
    );
    return data.data!;
  }

  async login(email: string, password: string) {
    const { data } = await this.client.post<ApiResponse<{ user: User; token: string }>>(
      '/auth/login',
      { email, password }
    );
    return data.data!;
  }

  async getMe() {
    const { data } = await this.client.get<ApiResponse<{ user: User }>>('/auth/me');
    return data.data!.user;
  }

  async updateProfile(updates: Partial<User>) {
    const { data } = await this.client.put<ApiResponse<{ user: User }>>('/auth/profile', updates);
    return data.data!.user;
  }

  // Product endpoints
  async getProducts(params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    page?: number;
    limit?: number;
  }) {
    const { data } = await this.client.get<ApiResponse<PaginationResult<Product>>>('/products', { params });
    return data.data!;
  }

  async getProductById(id: string) {
    const { data } = await this.client.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return data.data!.product;
  }

  async getFeaturedProducts(limit?: number) {
    const { data } = await this.client.get<ApiResponse<{ products: Product[] }>>(
      '/products/featured',
      { params: { limit } }
    );
    return data.data!.products;
  }

  async createProduct(productData: Partial<Product>) {
    const { data } = await this.client.post<ApiResponse<{ product: Product }>>('/products', productData);
    return data.data!.product;
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data } = await this.client.put<ApiResponse<{ product: Product }>>(`/products/${id}`, updates);
    return data.data!.product;
  }

  async deleteProduct(id: string) {
    await this.client.delete(`/products/${id}`);
  }

  // Cart endpoints
  async getCart() {
    const { data } = await this.client.get<ApiResponse<{ cart: Cart }>>('/cart');
    return data.data!.cart;
  }

  async addToCart(productId: string, quantity: number) {
    const { data } = await this.client.post<ApiResponse<{ cart: Cart }>>('/cart', {
      productId,
      quantity,
    });
    return data.data!.cart;
  }

  async updateCartItem(productId: string, quantity: number) {
    const { data } = await this.client.put<ApiResponse<{ cart: Cart }>>(`/cart/${productId}`, {
      quantity,
    });
    return data.data!.cart;
  }

  async removeFromCart(productId: string) {
    const { data } = await this.client.delete<ApiResponse<{ cart: Cart }>>(`/cart/${productId}`);
    return data.data!.cart;
  }

  async clearCart() {
    await this.client.delete('/cart');
  }

  // Order endpoints
  async createOrder(orderData: {
    items: any[];
    shippingAddress: any;
    paymentIntentId?: string;
  }) {
    const { data } = await this.client.post<ApiResponse<{ order: Order }>>('/orders', orderData);
    return data.data!.order;
  }

  async getUserOrders() {
    const { data } = await this.client.get<ApiResponse<{ orders: Order[] }>>('/orders');
    return data.data!.orders;
  }

  async getOrderById(id: string) {
    const { data } = await this.client.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return data.data!.order;
  }

  async createPaymentIntent(amount: number) {
    const { data } = await this.client.post<ApiResponse<{ clientSecret: string; paymentIntentId: string }>>(
      '/orders/payment/create-intent',
      { amount }
    );
    return data.data!;
  }

  // Admin endpoints
  async getAllOrders(page?: number, limit?: number) {
    const { data } = await this.client.get<ApiResponse<PaginationResult<Order>>>('/orders/admin/all', {
      params: { page, limit },
    });
    return data.data!;
  }

  async updateOrderStatus(id: string, orderStatus: string, paymentStatus?: string) {
    const { data } = await this.client.put<ApiResponse<{ order: Order }>>(`/orders/${id}/status`, {
      orderStatus,
      paymentStatus,
    });
    return data.data!.order;
  }

  async getOrderStatistics() {
    const { data } = await this.client.get<ApiResponse<any>>('/orders/admin/statistics');
    return data.data!;
  }

  async getAllUsers(page?: number, limit?: number) {
    const { data } = await this.client.get<ApiResponse<PaginationResult<User>>>('/users', {
      params: { page, limit },
    });
    return data.data!;
  }
}

export const api = new ApiClient();
