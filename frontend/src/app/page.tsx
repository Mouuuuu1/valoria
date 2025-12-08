'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';
import { Product } from '@/types';
import { FiShoppingBag, FiArrowRight } from 'react-icons/fi';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await api.getFeaturedProducts(8);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Failed to load featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Discover Your Perfect Bag
            </h1>
            <p className="text-xl mb-8 text-primary-50">
              Explore our exclusive collection of premium women's bags. 
              Elegance meets functionality in every design.
            </p>
            <div className="flex gap-4">
              <Link href="/products" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Shop Now
                <FiArrowRight />
              </Link>
              <Link href="/products?featured=true" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
                View Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Handbag', 'Tote', 'Crossbody', 'Clutch', 'Shoulder', 'Backpack', 'Wallet'].map((category) => (
              <Link
                key={category}
                href={`/products?category=${category.toLowerCase()}`}
                className="card text-center hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <FiShoppingBag className="mx-auto text-5xl text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-semibold text-lg">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="card hover:shadow-lg transition-shadow group"
                >
                  <div className="relative h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary-600">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                    {product.description}
                  </p>
                  <p className="text-primary-600 font-bold text-xl">
                    ${product.price.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary inline-flex items-center gap-2">
              View All Products
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-3xl text-primary-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Handcrafted with the finest materials for lasting elegance
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-3xl text-primary-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">Free Shipping</h3>
              <p className="text-gray-600">
                Complimentary shipping on all orders over $100
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShoppingBag className="text-3xl text-primary-600" />
              </div>
              <h3 className="font-bold text-xl mb-2">30-Day Returns</h3>
              <p className="text-gray-600">
                Not satisfied? Return within 30 days for a full refund
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
