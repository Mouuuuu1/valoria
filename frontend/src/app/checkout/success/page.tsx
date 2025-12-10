import { Suspense } from 'react';
import Link from 'next/link';
import { FiCheckCircle, FiPackage, FiHome } from 'react-icons/fi';
import OrderSuccessContent from './OrderSuccessContent';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="py-12 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
