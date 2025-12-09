'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiSearch, FiPackage } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { api } from '@/lib/api';

export default function OrderLookupPage() {
  const router = useRouter();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderNumber.trim() || !email.trim()) {
      toast.error('Please enter both order number and email');
      return;
    }

    setLoading(true);

    try {
      // Verify the order exists
      await api.getGuestOrder(orderNumber.trim(), email.trim());
      // Redirect to order page
      router.push(`/orders/guest/${orderNumber.trim()}?email=${encodeURIComponent(email.trim())}`);
    } catch (error: any) {
      toast.error('Order not found. Please check your order number and email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom max-w-md">
        <div className="text-center mb-8">
          <FiPackage className="mx-auto text-primary-600 mb-4" size={48} />
          <h1 className="text-3xl font-bold mb-2">Track Your Order</h1>
          <p className="text-gray-600">
            Enter your order number and email to view your order status
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Order Number *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                className="input-field"
                placeholder="ORD-1234567890-ABC"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                You received this in your order confirmation email
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                The email you used when placing your order
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiSearch />
              {loading ? 'Searching...' : 'Find My Order'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <p className="text-gray-600 text-sm mb-4">
              Have an account?{' '}
              <Link href="/login?redirect=/profile" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>{' '}
              to view all your orders
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-gray-600 hover:text-gray-800">
            ← Back to Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
