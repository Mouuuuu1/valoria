'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { FiCheckCircle, FiPackage, FiMail, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function GuestOrderPage({ params }: { params: { orderNumber: string } }) {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState(email);
  const [showLookup, setShowLookup] = useState(!email);

  useEffect(() => {
    if (email) {
      loadOrder(email);
    } else {
      setLoading(false);
    }
  }, [params.orderNumber, email]);

  const loadOrder = async (emailToUse: string) => {
    try {
      setLoading(true);
      const orderData = await api.getGuestOrder(params.orderNumber, emailToUse);
      setOrder(orderData);
      setShowLookup(false);
    } catch (error: any) {
      toast.error('Order not found. Please check your order number and email.');
      setShowLookup(true);
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupEmail) {
      loadOrder(lookupEmail);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom max-w-2xl flex justify-center">
          <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Show lookup form if email not provided or order not found
  if (showLookup && !order) {
    return (
      <div className="py-12">
        <div className="container-custom max-w-md">
          <div className="card text-center">
            <FiSearch className="mx-auto text-gray-400 mb-4" size={48} />
            <h1 className="text-2xl font-bold mb-2">Look Up Your Order</h1>
            <p className="text-gray-600 mb-6">
              Enter the email address you used when placing your order
            </p>

            <form onSubmit={handleLookup} className="space-y-4">
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Order Number</label>
                <input
                  type="text"
                  value={params.orderNumber}
                  className="input-field bg-gray-50"
                  disabled
                />
              </div>
              <div className="text-left">
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={lookupEmail}
                  onChange={(e) => setLookupEmail(e.target.value)}
                  className="input-field"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Find My Order
              </button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Link href="/orders/lookup" className="text-primary-600 hover:text-primary-700 text-sm">
                Don&apos;t know your order number? Look it up here
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-12">
        <div className="container-custom max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="text-gray-600 mb-6">
            We couldn&apos;t find an order with that number and email combination.
          </p>
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const shippingAddress = order.shippingAddress;

  return (
    <div className="py-12">
      <div className="container-custom max-w-2xl">
        {/* Success Message */}
        <div className="text-center mb-8">
          <FiCheckCircle className="mx-auto text-green-500 mb-4" size={64} />
          <h1 className="text-3xl font-bold mb-2">Thank You for Your Order!</h1>
          <p className="text-gray-600">
            Order confirmation has been sent to <span className="font-medium">{(shippingAddress as any)?.email || lookupEmail}</span>
          </p>
        </div>

        {/* Order Details */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600">Order Number</p>
              <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
            </div>
            <span className={`px-4 py-2 rounded-full font-medium ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus}
            </span>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-1">Order Date</p>
            <p className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiPackage />
            Order Items
          </h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0 last:pb-0">
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
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  <p className="font-semibold text-primary-600">
                    {(item.price * item.quantity).toFixed(2)} EGP
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t mt-4 pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary-600">{order.totalAmount.toFixed(2)} EGP</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="card mb-6">
          <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
          <div className="text-gray-700">
            <p className="font-medium">{shippingAddress.fullName}</p>
            <p>{shippingAddress.street}</p>
            <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}</p>
            <p>{shippingAddress.country}</p>
            <p className="mt-2">Phone: {shippingAddress.phone}</p>
          </div>
        </div>

        {/* Save Order Info Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <FiMail className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-800">Save Your Order Details</h3>
              <p className="text-blue-700 text-sm mt-1">
                Save your order number <span className="font-mono font-bold">{order.orderNumber}</span> to track your order.
                You can look up your order anytime at{' '}
                <Link href="/orders/lookup" className="underline">
                  Order Lookup
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-primary">
            Continue Shopping
          </Link>
          <Link href="/orders/lookup" className="btn-outline">
            Track Another Order
          </Link>
        </div>
      </div>
    </div>
  );
}
