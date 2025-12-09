'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();

  if (loading) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-1/4"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
            <div className="h-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="py-12">
        <div className="container-custom">
          <div className="text-center py-12">
            <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <Link href="/products" className="btn-primary inline-block">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total from items
  const subtotal = cart.items.reduce((sum, item) => {
    const price = item.product?.price || 0;
    return sum + (price * item.quantity);
  }, 0);

  const shipping = subtotal >= 100 ? 0 : 10;
  const total = subtotal + shipping;

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.product?.id || item.productId} className="card">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.product?.images?.[0] || '/placeholder.jpg'}
                      alt={item.product?.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product?.id || item.productId}`}
                      className="font-semibold hover:text-primary-600"
                    >
                      {item.product?.name || 'Product'}
                    </Link>
                    <p className="text-sm text-gray-600">{item.product?.category}</p>
                    <p className="text-primary-600 font-bold mt-2">
                      {item.product?.price?.toFixed(2) || '0.00'} EGP
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.product?.id || item.productId, Math.max(1, item.quantity - 1))
                        }
                        className="p-2 hover:bg-gray-100"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="px-4 py-1 border-x text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product?.id || item.productId,
                            Math.min(item.product?.stock || 999, item.quantity + 1)
                          )
                        }
                        className="p-2 hover:bg-gray-100"
                        disabled={item.quantity >= (item.product?.stock || 0)}
                      >
                        <FiPlus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product?.id || item.productId)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 text-sm"
                    >
                      <FiTrash2 size={14} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-20">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{subtotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'FREE' : `${shipping.toFixed(2)} EGP`}
                  </span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-600">
                      {total.toFixed(2)} EGP
                    </span>
                  </div>
                </div>
              </div>

              {subtotal < 100 && (
                <p className="text-sm text-gray-600 mb-4">
                  Add {(100 - subtotal).toFixed(2)} EGP more for free shipping!
                </p>
              )}

              <Link href="/checkout" className="btn-primary w-full block text-center">
                Proceed to Checkout
              </Link>
              
              <Link
                href="/products"
                className="btn-secondary w-full block text-center mt-3"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
