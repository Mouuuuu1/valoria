'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  return (
    <div className="py-12 min-h-screen">
      <div className="container-custom max-w-2xl">
        <div className="card text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-6">
              <FiCheckCircle className="text-green-600" size={64} />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg mb-8">
            Thank you for your order. We&apos;ve received your order and will process it shortly.
          </p>

          {/* Order Details */}
          {orderNumber && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <p className="text-sm text-gray-600 mb-2">Order Number</p>
              <p className="text-2xl font-bold text-primary-600">{orderNumber}</p>
              {email && (
                <p className="text-sm text-gray-600 mt-4">
                  A confirmation email has been sent to <strong>{email}</strong>
                </p>
              )}
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8 text-left">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <FiPackage className="text-blue-600" />
              What happens next?
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">1</span>
                <span>We&apos;ll review your order and confirm availability</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">2</span>
                <span>You&apos;ll receive an email confirmation with your order details</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">3</span>
                <span>We&apos;ll prepare your items for shipping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 text-sm">4</span>
                <span>Your order will be delivered to your address within 3-5 business days</span>
              </li>
            </ol>
          </div>

          {/* Contact Information */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              <strong>Need help?</strong> Contact us at{' '}
              <a href="mailto:valoria.eg@gmail.com" className="underline">
                valoria.eg@gmail.com
              </a>{' '}
              or call{' '}
              <a href="tel:+201110241005" className="underline">
                +20 111 024 1005
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary flex items-center justify-center gap-2"
            >
              <FiHome />
              Back to Home
            </Link>
            <Link
              href="/products"
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
