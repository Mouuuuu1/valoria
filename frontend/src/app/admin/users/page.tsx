'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { User } from '@/types';
import { FiSearch, FiMail, FiCalendar } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function AdminUsers() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      router.push('/');
      return;
    }
    loadUsers();
  }, [isAuthenticated, isAdmin]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const result = await api.getAllUsers();
      setUsers(result.users || []);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Manage Users</h1>

        {/* Search */}
        <div className="card mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
              placeholder="Search users..."
            />
          </div>
        </div>

        {/* Users Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full flex justify-center p-12">
              <div className="animate-spin h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="col-span-full text-center p-12 text-gray-500">
              No users found
            </div>
          ) : (
            filteredUsers.map((u) => (
              <div key={u.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{u.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                      <FiMail size={14} />
                      {u.email}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded text-sm font-medium ${
                    u.role === 'admin' 
                      ? 'bg-purple-100 text-purple-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {u.role}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <FiCalendar size={14} />
                    <span>Joined: {new Date(u.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  {u.phone && (
                    <div className="text-gray-600">
                      <span className="font-medium">Phone:</span> {u.phone}
                    </div>
                  )}

                  {u.address && (
                    <div className="text-gray-600 pt-2 border-t">
                      <p className="font-medium mb-1">Address:</p>
                      <p className="text-xs">
                        {u.address.street && `${u.address.street}, `}
                        {u.address.city && `${u.address.city}, `}
                        {u.address.state} {u.address.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
