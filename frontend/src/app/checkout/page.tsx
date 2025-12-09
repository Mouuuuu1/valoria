'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { FiLock, FiUser, FiLogIn, FiDollarSign } from 'react-icons/fi';

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { cart, clearCart, getCartItems } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    paymentMethod: 'cash',
  });

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || prev.fullName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
        street: user.address?.street || prev.street,
        city: user.address?.city || prev.city,
        state: user.address?.state || prev.state,
        zipCode: user.address?.zipCode || prev.zipCode,
        country: user.address?.country || prev.country,
      }));
    }
  }, [isAuthenticated, user]);

  const cartItems = getCartItems();

  useEffect(() => {
    if (cartItems.length === 0) {
      router.push('/cart');
    }
  }, [cartItems, router]);

  const subtotal = cartItems.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const shippingAddress = {
        fullName: formData.fullName,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        phone: formData.phone,
      };

      let orderResult;

      if (isAuthenticated) {
        // Authenticated user checkout
        const items = cartItems.map(item => ({
          productId: item.productId,
          name: item.product?.name || 'Product',
          price: item.product?.price || 0,
          quantity: item.quantity,
          image: item.product?.images?.[0] || '',
        }));

        orderResult = await api.createOrder({
          items,
          shippingAddress,
        });

        // Clear cart
        await clearCart();
        toast.success('Order placed successfully!');
        router.push(`/orders/${orderResult.id}`);
      } else {
        // Guest checkout
        const items = cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        }));

        const result = await api.createGuestOrder({
          items,
          shippingAddress,
          guestEmail: formData.email,
          paymentMethod: formData.paymentMethod,
        });

        // Clear cart
        await clearCart();
        toast.success('Order placed successfully!');
        // Redirect to guest order confirmation page
        router.push(`/orders/guest/${result.orderNumber}?email=${encodeURIComponent(formData.email)}`);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom max-w-6xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Guest Checkout Notice */}
        {!isAuthenticated && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <FiUser className="text-blue-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-800">Checking out as Guest</h3>
                <p className="text-blue-700 text-sm mt-1">
                  You can complete your order without an account. Want to track your orders and save your details?{' '}
                  <Link href="/login?redirect=/checkout" className="underline font-medium hover:text-blue-900">
                    Sign in
                  </Link>{' '}
                  or{' '}
                  <Link href="/register?redirect=/checkout" className="underline font-medium hover:text-blue-900">
                    create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-6">
                {isAuthenticated ? 'Shipping Information' : 'Contact & Shipping Information'}
              </h2>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      required
                      disabled={isAuthenticated}
                    />
                    {!isAuthenticated && (
                      <p className="text-xs text-gray-500 mt-1">
                        We&apos;ll send your order confirmation to this email
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code *</label>
                    <input
                      type="text"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Country *</label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="input-field"
                    required
                  >
                    <option value="USA">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="card">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FiDollarSign />
                Payment Method
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="cash"
                    name="payment"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="cash" className="flex items-center gap-2">
                    <FiDollarSign />
                    Cash on Delivery
                  </label>
                </div>
                <div className="flex items-center gap-4">
                  <input
                    type="radio"
                    id="instapay"
                    name="payment"
                    value="instapay"
                    checked={formData.paymentMethod === 'instapay'}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="instapay">InstaPay Transfer</label>
                </div>
                
                {formData.paymentMethod === 'instapay' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">InstaPay Transfer Instructions:</p>
                    <p className="text-sm text-blue-700">
                      Transfer the total amount to our InstaPay account. Your order will be confirmed once payment is received.
                    </p>
                    <p className="text-sm text-blue-800 font-semibold mt-2">
                      InstaPay Number: 01XXXXXXXXX
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex gap-3 pb-4 border-b">
                    <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                      {item.product?.images?.[0] && (
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.product?.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold text-primary-600">
                        {((item.product?.price || 0) * item.quantity).toFixed(2)} EGP
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 py-4 border-t">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} EGP`}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">{total.toFixed(2)} EGP</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                <FiLock />
                {loading ? 'Processing...' : 'Place Order'}
              </button>

              <p className="text-xs text-gray-600 text-center mt-4">
                <FiLock className="inline" /> Your payment information is secure
              </p>

              {!isAuthenticated && (
                <div className="mt-4 pt-4 border-t text-center">
                  <Link 
                    href="/login?redirect=/checkout" 
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1"
                  >
                    <FiLogIn size={14} />
                    Have an account? Sign in for faster checkout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
