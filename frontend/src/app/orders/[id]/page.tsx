'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { FiCheckCircle, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import Link from 'next/link';

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    loadOrder();
  }, [isAuthenticated, params.id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const orderData = await api.getOrderById(params.id as string);
      setOrder(orderData);
    } catch (error) {
      console.error('Failed to load order:', error);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING':
        return <FiPackage className="text-yellow-600" size={24} />;
      case 'CONFIRMED':
        return <FiCheckCircle className="text-blue-600" size={24} />;
      case 'SHIPPED':
        return <FiTruck className="text-green-600" size={24} />;
      case 'DELIVERED':
        return <FiHome className="text-green-700" size={24} />;
      default:
        return <FiPackage className="text-gray-600" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-4xl">
        {/* Success Message */}
        <div className="card bg-green-50 border-green-200 mb-8 text-center">
          <FiCheckCircle className="text-green-600 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-green-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-green-700 mb-4">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <p className="text-sm text-green-600">
            Order Number: <span className="font-mono font-bold">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Status */}
        <div className="card mb-6">
          <div className="flex items-center gap-4 mb-4">
            {getStatusIcon(order.orderStatus)}
            <div>
              <h2 className="text-xl font-bold">Order Status</h2>
              <p className="text-gray-600 capitalize">{order.orderStatus.toLowerCase()}</p>
            </div>
          </div>
          <div className="text-sm text-gray-600">
            <p>Placed on: {new Date(order.createdAt).toLocaleString()}</p>
            <p>Payment Status: <span className="capitalize">{order.paymentStatus.toLowerCase()}</span></p>
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className="w-20 h-20 bg-gray-100 rounded flex-shrink-0">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="text-sm font-semibold text-primary-600">
                    {item.price.toFixed(2)} EGP each
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{(item.price * item.quantity).toFixed(2)} EGP</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p className="font-semibold">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
              {order.shippingAddress.zipCode}
            </p>
            <p>{order.shippingAddress.country}</p>
            <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Order Total */}
        <div className="card">
          <div className="space-y-2">
            <div className="flex justify-between text-lg">
              <span>Subtotal</span>
              <span>{(order.totalAmount - (order.totalAmount >= 100 ? 0 : 10)).toFixed(2)} EGP</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>{order.totalAmount >= 100 ? 'FREE' : '10.00 EGP'}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-2 border-t">
              <span>Total</span>
              <span className="text-primary-600">{order.totalAmount.toFixed(2)} EGP</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Link href="/products" className="btn-primary flex-1 text-center">
            Continue Shopping
          </Link>
          <Link href="/profile" className="btn-secondary flex-1 text-center">
            View All Orders
          </Link>
        </div>
      </div>
    </div>
  );
}
