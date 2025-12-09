'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            Valoria
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="hover:text-primary-600 transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-primary-600 transition-colors">
              Products
            </Link>
            <Link href="/about" className="hover:text-primary-600 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-primary-600 transition-colors">
              Contact
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:text-primary-600 transition-colors">
                Admin
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Cart - Always visible */}
            <Link
              href="/cart"
              className="relative hover:text-primary-600 transition-colors"
            >
              <FiShoppingCart className="text-2xl" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link
                  href="/profile"
                  className="hover:text-primary-600 transition-colors flex items-center gap-2"
                >
                  <FiUser className="text-2xl" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-primary-600 transition-colors"
                  title="Logout"
                >
                  <FiLogOut className="text-2xl" />
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:text-primary-600 transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <FiX className="text-2xl" />
              ) : (
                <FiMenu className="text-2xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/about"
                className="hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="hover:text-primary-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
