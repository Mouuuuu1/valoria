'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Order } from '@/types';
import { FiSearch, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminOrders() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadOrders();
  }, [isAuthenticated, isAdmin]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const result = await api.getAllOrders();
      setOrders(result.orders || []);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      toast.success('Order status updated');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const updatePaymentStatus = async (orderId: string, status: string) => {
    try {
      await api.updatePaymentStatus(orderId, status);
      toast.success('Payment status updated');
      loadOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
    order.shippingAddress.fullName.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Manage Orders</h1>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search by order number or customer name..."
            />
          </div>
        </div>

        {/* Orders Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-4">Order #</th>
                <th className="text-left p-4">Customer</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Total</th>
                <th className="text-left p-4">Payment</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center p-8 text-gray-500">
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-mono text-sm">{order.orderNumber}</td>
                    <td className="p-4">{order.shippingAddress.fullName}</td>
                    <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold">{order.totalAmount.toFixed(2)} EGP</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-primary-600 hover:bg-primary-50 rounded"
                      >
                        <FiEye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-gray-600">#{selectedOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between p-3 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} EGP</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">{selectedOrder.shippingAddress.fullName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.street}</p>
                  <p className="text-sm text-gray-600">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress.country}</p>
                  <p className="text-sm text-gray-600 mt-2">Phone: {selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Update Order Status */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'PENDING')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'CONFIRMED')}
                    className="px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'SHIPPED')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Shipped
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'DELIVERED')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Delivered
                  </button>
                  <button
                    onClick={() => updateOrderStatus(selectedOrder.id, 'CANCELLED')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              {/* Update Payment Status */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Update Payment Status</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updatePaymentStatus(selectedOrder.id, 'PENDING')}
                    className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200"
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(selectedOrder.id, 'PAID')}
                    className="px-4 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200"
                  >
                    Paid
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(selectedOrder.id, 'FAILED')}
                    className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200"
                  >
                    Failed
                  </button>
                  <button
                    onClick={() => updatePaymentStatus(selectedOrder.id, 'REFUNDED')}
                    className="px-4 py-2 bg-purple-100 text-purple-800 rounded hover:bg-purple-200"
                  >
                    Refunded
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary-600">{selectedOrder.totalAmount.toFixed(2)} EGP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
