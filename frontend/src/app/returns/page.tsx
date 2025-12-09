'use client';

import { FiRefreshCw, FiCheck, FiX, FiMail, FiCreditCard, FiRepeat } from 'react-icons/fi';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiRefreshCw className="text-3xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-gray-600">
            Our hassle-free return and exchange policy
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Eligibility */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCheck className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Eligibility</h2>
                
                {/* First Time Order */}
                <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h3 className="font-semibold text-amber-800 mb-2">First Time Order</h3>
                  <p className="text-amber-700">
                    You can check the bag with the courier in front of him, but after he leaves there will be <strong>no refund</strong>.
                  </p>
                </div>

                {/* Second Time Order */}
                <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">Second Time Order & Beyond</h3>
                  <p className="text-green-700 mb-3">
                    Valoria accepts returns and exchanges within <strong>2 days</strong> of receiving your order if:
                  </p>
                  <ul className="space-y-2 text-green-700">
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" />
                      <span>The item is unused</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" />
                      <span>In its original packaging</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FiCheck className="text-green-600 flex-shrink-0" />
                      <span>With all tags and accessories included</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Non-Returnable Items */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiX className="text-xl text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Non-Returnable Items</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <FiX className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Items damaged due to misuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiX className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Items without original packaging or tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <FiX className="text-red-500 mt-1 flex-shrink-0" />
                    <span>Clearance or discounted items (unless defective)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Return Process */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiMail className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Return Process</h2>
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
                    <div>
                      <p className="text-gray-600">Contact our support team at <a href="mailto:valoria.eg@gmail.com" className="text-primary-600 font-semibold hover:underline">valoria.eg@gmail.com</a> within 7 days.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
                    <div>
                      <p className="text-gray-600">Provide your order number and reason for the return.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
                    <div>
                      <p className="text-gray-600">Our team will arrange a courier pickup or guide you to the nearest return point.</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
                    <div>
                      <p className="text-gray-600">Once inspected, your refund will be processed within <strong>5–10 business days</strong>.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </div>
          </section>

          {/* Refund Method */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiCreditCard className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Refund Method</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Refunds are issued to the same payment method used during purchase.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Cash-on-delivery orders receive refunds via <strong>bank transfer</strong> or <strong>wallet transfer</strong>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiRepeat className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Exchanges</h2>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Exchanges depend on product availability.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>If your requested item is unavailable, you may choose another item or receive store credit.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need to start a return?</p>
          <a 
            href="mailto:valoria.eg@gmail.com" 
            className="btn-primary inline-block"
          >
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
