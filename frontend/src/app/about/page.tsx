'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiAward, FiShield, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  const values = [
    {
      icon: FiHeart,
      title: 'Authentic Brands',
      description: 'We import bags from world-renowned brands like Coach, Michael Kors, and Chanel, ensuring you get genuine quality.',
    },
    {
      icon: FiAward,
      title: 'Premium Quality',
      description: 'Every bag we sell meets the highest standards of craftsmanship and durability.',
    },
    {
      icon: FiShield,
      title: 'Customer Trust',
      description: 'First-time buyers can inspect their bag with the courier. Returning customers enjoy a 48-hour refund window.',
    },
    {
      icon: FiUsers,
      title: 'Loyal Rewards',
      description: 'We value our customers — enjoy 20% off on your second order as our way of saying thank you.',
    },
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="container-custom mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Valoria</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Valoria brings you premium imported bags from the world's most loved brands. 
            Based in Egypt, we're dedicated to offering authentic, stylish bags that make a statement.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Valoria was founded in 2025 with a passion for bringing the finest imported bags 
                  to Egypt. We noticed that fashion-forward Egyptians deserved better access to 
                  premium brands without the hassle of international shopping.
                </p>
                <p>
                  We carefully curate our collection from famous brands including Coach, Michael Kors, 
                  and Chanel, ensuring every piece meets our high standards for quality and style.
                </p>
                <p>
                  Our commitment to customer satisfaction sets us apart. First-time customers can 
                  inspect their purchase with our courier, and loyal returning customers enjoy 
                  extended refund policies and exclusive discounts.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=400&fit=crop"
                alt="Luxury Bags Collection"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-custom mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Valoria</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div key={index} className="card text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                <value.icon size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom">
        <div className="card bg-primary-600 text-white text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Bag?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our collection of authentic imported bags from top brands.
          </p>
          <Link href="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
