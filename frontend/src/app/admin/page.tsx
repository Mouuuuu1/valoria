'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { FiPackage, FiShoppingCart, FiUsers, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadStats();
  }, [isAuthenticated, isAdmin]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [products, orders, users] = await Promise.all([
        api.getProducts({ limit: 1000 }),
        api.getAllOrders(),
        api.getAllUsers(),
      ]);

      const totalRevenue = (orders.orders || []).reduce((sum, order) => sum + order.totalAmount, 0);

      setStats({
        totalProducts: products.products?.length || 0,
        totalOrders: orders.orders?.length || 0,
        totalUsers: users.users?.length || 0,
        totalRevenue,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total Products</p>
                    <p className="text-3xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <FiPackage className="text-5xl text-blue-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Total Orders</p>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <FiShoppingCart className="text-5xl text-green-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Users</p>
                    <p className="text-3xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <FiUsers className="text-5xl text-purple-200" />
                </div>
              </div>

              <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">Total Revenue</p>
                    <p className="text-3xl font-bold">{stats.totalRevenue.toFixed(2)} EGP</p>
                  </div>
                  <FiDollarSign className="text-5xl text-orange-200" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => router.push('/admin/products')}
                className="card hover:shadow-lg transition-shadow text-left group"
              >
                <FiPackage className="text-4xl text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Manage Products</h3>
                <p className="text-gray-600">Add, edit, or remove products from your catalog</p>
              </button>

              <button
                onClick={() => router.push('/admin/orders')}
                className="card hover:shadow-lg transition-shadow text-left group"
              >
                <FiShoppingCart className="text-4xl text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Manage Orders</h3>
                <p className="text-gray-600">View and update order status and details</p>
              </button>

              <button
                onClick={() => router.push('/admin/users')}
                className="card hover:shadow-lg transition-shadow text-left group"
              >
                <FiUsers className="text-4xl text-primary-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Manage Users</h3>
                <p className="text-gray-600">View user accounts and their activity</p>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
