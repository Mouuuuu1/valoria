'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, CartItem, Product } from '@/types';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity: number, product?: Product) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  getCartItems: () => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const GUEST_CART_KEY = 'valorina_guest_cart';

// Helper to get guest cart from localStorage
const getGuestCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(GUEST_CART_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Helper to save guest cart to localStorage
const saveGuestCart = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
};

// Helper to clear guest cart
const clearGuestCartStorage = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [guestCartItems, setGuestCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart on mount and auth change
  useEffect(() => {
    if (isAuthenticated) {
      // Merge guest cart with user cart if guest had items
      const guestItems = getGuestCart();
      if (guestItems.length > 0) {
        mergeGuestCartWithUserCart(guestItems);
      } else {
        refreshCart();
      }
    } else {
      // Load guest cart from localStorage
      const items = getGuestCart();
      setGuestCartItems(items);
      setCart(null);
    }
  }, [isAuthenticated]);

  // Merge guest cart into user cart when logging in
  const mergeGuestCartWithUserCart = async (guestItems: CartItem[]) => {
    try {
      setLoading(true);
      // Add each guest item to the user's cart
      for (const item of guestItems) {
        try {
          await api.addToCart(item.productId, item.quantity);
        } catch (error) {
          // Item might already exist or product unavailable, continue
          console.warn('Could not merge cart item:', item.productId);
        }
      }
      // Clear guest cart after merge
      clearGuestCartStorage();
      setGuestCartItems([]);
      // Refresh to get the merged cart
      await refreshCart();
    } catch (error) {
      console.error('Failed to merge guest cart:', error);
      await refreshCart();
    } finally {
      setLoading(false);
    }
  };

  const refreshCart = async () => {
    if (!isAuthenticated) {
      const items = getGuestCart();
      setGuestCartItems(items);
      return;
    }
    
    try {
      setLoading(true);
      const cartData = await api.getCart();
      setCart(cartData);
    } catch (error: any) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId: string, quantity: number, product?: Product) => {
    if (isAuthenticated) {
      // Authenticated user - use API
      try {
        const updatedCart = await api.addToCart(productId, quantity);
        setCart(updatedCart);
        toast.success('Added to cart!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to add to cart');
        throw error;
      }
    } else {
      // Guest user - use localStorage
      try {
        // Fetch product details if not provided
        let productData = product;
        if (!productData) {
          productData = await api.getProductById(productId);
        }
        
        const items = [...guestCartItems];
        const existingIndex = items.findIndex(item => item.productId === productId);
        
        if (existingIndex >= 0) {
          items[existingIndex].quantity += quantity;
        } else {
          items.push({
            productId,
            quantity,
            product: productData,
          });
        }
        
        setGuestCartItems(items);
        saveGuestCart(items);
        toast.success('Added to cart!');
      } catch (error: any) {
        toast.error('Failed to add to cart');
        throw error;
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await api.updateCartItem(productId, quantity);
        setCart(updatedCart);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update quantity');
        throw error;
      }
    } else {
      // Guest user - update localStorage
      const items = guestCartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      );
      setGuestCartItems(items);
      saveGuestCart(items);
    }
  };

  const removeItem = async (productId: string) => {
    if (isAuthenticated) {
      try {
        const updatedCart = await api.removeFromCart(productId);
        setCart(updatedCart);
        toast.success('Item removed from cart');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to remove item');
        throw error;
      }
    } else {
      // Guest user - remove from localStorage
      const items = guestCartItems.filter(item => item.productId !== productId);
      setGuestCartItems(items);
      saveGuestCart(items);
      toast.success('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await api.clearCart();
        setCart(null);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to clear cart');
        throw error;
      }
    } else {
      // Guest user - clear localStorage
      setGuestCartItems([]);
      clearGuestCartStorage();
    }
  };

  // Get cart items (works for both authenticated and guest users)
  const getCartItems = (): CartItem[] => {
    if (isAuthenticated) {
      return cart?.items || [];
    }
    return guestCartItems;
  };

  // Calculate item count
  const itemCount = isAuthenticated
    ? (cart?.items.length || 0)
    : guestCartItems.length;

  // Build a unified cart object for guests
  const effectiveCart: Cart | null = isAuthenticated
    ? cart
    : guestCartItems.length > 0
      ? {
          id: 'guest',
          userId: 'guest',
          items: guestCartItems,
          updatedAt: new Date().toISOString(),
        }
      : null;

  const value = {
    cart: effectiveCart,
    loading,
    itemCount,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    refreshCart,
    getCartItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
