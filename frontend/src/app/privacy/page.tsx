'use client';

import { FiShield, FiDatabase, FiLock, FiEye, FiShare2, FiUser, FiRefreshCw } from 'react-icons/fi';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-3xl text-primary-600" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-gray-600">
            Valoria is committed to protecting your personal information
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: December 2025
          </p>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* 1. Information We Collect */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiDatabase className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                <p className="text-gray-600 mb-4">We may collect:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Name, phone number, address (for shipping)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Email address</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Payment details (securely processed through trusted gateways)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Device information and browsing behavior on our website</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. How We Use Your Information */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiEye className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">Your data is used to:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Process and deliver orders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Improve website performance and user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Communicate order updates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Provide customer support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Send promotional offers (only if you opt-in)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Protect Your Information */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiLock className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">3. How We Protect Your Information</h2>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>All data is encrypted and stored securely.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Payment information is processed through PCI-compliant partners.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>We never share personal data without your consent.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. Cookies */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiDatabase className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">4. Cookies</h2>
                <p className="text-gray-600 mb-4">Valoria uses cookies to:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Improve website functionality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Save your preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Analyze traffic to enhance performance</span>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">
                  You may disable cookies through your browser settings.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Sharing Your Information */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiShare2 className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">5. Sharing Your Information</h2>
                <p className="text-gray-600 mb-4">We only share information with:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Shipping partners</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Payment processors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Analytics tools (non-identifiable data)</span>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4 font-semibold">
                  We do not sell or rent your personal information.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Your Rights */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiUser className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">6. Your Rights</h2>
                <p className="text-gray-600 mb-4">You may:</p>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Request access to your personal data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Request correction or deletion</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-600 mt-1">•</span>
                    <span>Opt-out of marketing communications at any time</span>
                  </li>
                </ul>
                <p className="text-gray-600 mt-4">
                  Contact: <a href="mailto:valoria.eg@gmail.com" className="text-primary-600 hover:underline">valoria.eg@gmail.com</a>
                </p>
              </div>
            </div>
          </section>

          {/* 7. Policy Updates */}
          <section className="card">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FiRefreshCw className="text-xl text-primary-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">7. Policy Updates</h2>
                <p className="text-gray-600">
                  We may update this policy occasionally. Changes will be posted on this page with the updated date.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Questions about our privacy policy?</p>
          <a 
            href="mailto:valoria.eg@gmail.com" 
            className="btn-primary inline-block"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
