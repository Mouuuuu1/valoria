'use client';

import { FiPackage, FiTruck, FiMapPin, FiAlertCircle } from 'react-icons/fi';

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiPackage className="text-3xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-gray-600">
            Everything you need to know about our delivery process
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Processing Time */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPackage className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Processing Time</h2>
                <p className="text-gray-600">
                  All orders are processed within <strong>3–4 business days</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Shipping Within Egypt */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiTruck className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Shipping Within Egypt</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span><strong>Standard Delivery:</strong> 3–4 business days, depending on your city.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Deliveries are handled through trusted local couriers to ensure fast and secure delivery.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Shipping fees are calculated at checkout based on your location.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMapPin className="text-xl text-gray-500" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">International Shipping</h2>
                <p className="text-gray-600">
                  Currently, <strong>Valoria ships only within Egypt</strong>.
                </p>
              </div>
            </div>
          </section>

          {/* Order Tracking */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiPackage className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Once your order ships, you will receive an email or SMS with your tracking number.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>You can track your package at any time until it reaches your doorstep.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Failed Delivery */}
          <section className="card bg-amber-50 border-amber-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiAlertCircle className="text-xl text-amber-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4 text-amber-800">Failed Delivery / Address Issues</h2>
                <ul className="space-y-3 text-amber-700">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>Please ensure your address and phone number are correct to avoid delays.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 mt-1">•</span>
                    <span>If the courier fails to deliver after multiple attempts, your order may be returned.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Have questions about shipping?</p>
          <a 
            href="/contact" 
            className="btn-primary inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
