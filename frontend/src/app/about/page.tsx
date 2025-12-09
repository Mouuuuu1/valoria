'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FiHeart, FiAward, FiGlobe, FiUsers } from 'react-icons/fi';

export default function AboutPage() {
  const values = [
    {
      icon: FiHeart,
      title: 'Crafted with Love',
      description: 'Every bag is designed with passion and attention to detail, ensuring you receive a product that speaks to your style.',
    },
    {
      icon: FiAward,
      title: 'Premium Quality',
      description: 'We use only the finest materials and craftsmanship to create bags that are built to last.',
    },
    {
      icon: FiGlobe,
      title: 'Sustainable Fashion',
      description: 'We are committed to ethical sourcing and sustainable practices to protect our planet.',
    },
    {
      icon: FiUsers,
      title: 'Customer First',
      description: 'Your satisfaction is our priority. We are here to help you find the perfect bag for every occasion.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & Creative Director',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Manager',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop',
    },
  ];

  return (
    <div className="py-12">
      {/* Hero Section */}
      <section className="container-custom mb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Valoria</h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            At Valoria, we believe that a bag is more than just an accessory — it's an expression of who you are. 
            Since our founding, we've been dedicated to creating timeless, elegant bags that combine style with functionality.
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
                  Valoria was born from a simple idea: to create bags that women truly love to carry. 
                  What started as a small passion project in 2020 has grown into a beloved brand known for 
                  its commitment to quality and style.
                </p>
                <p>
                  Our founder, Sarah Johnson, noticed a gap in the market — bags that were either stylish 
                  but impractical, or functional but lacking in design. She set out to bridge that gap, 
                  and Valoria was born.
                </p>
                <p>
                  Today, we continue to push the boundaries of design while staying true to our core values: 
                  quality craftsmanship, timeless elegance, and customer satisfaction.
                </p>
              </div>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
                alt="Our Workshop"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container-custom mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
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

      {/* Team Section */}
      <section className="bg-gray-50 py-16 mb-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="card text-center">
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-custom">
        <div className="card bg-primary-600 text-white text-center py-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Bag?</h2>
          <p className="text-xl mb-8 opacity-90">
            Browse our collection and discover the bag that speaks to your style.
          </p>
          <Link href="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block">
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  );
}
