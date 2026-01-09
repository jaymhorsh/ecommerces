'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import type { Cart } from '@/lib/types';
import { cartService } from '@/services/cart';
import { getSessionId } from '@/utils/helpers';

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  isReady: boolean;
  sessionId: string;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  clearError: () => void;
  getItemCount: () => number;
  getTotals: () => { subtotal: number; tax: number; shipping: number; total: number };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [sessionId, setSessionId] = useState('');

  // Initialize session ID on mount (client-side only)
  useEffect(() => {
    const id = getSessionId();
    setSessionId(id);
    setIsReady(true);
  }, []);

  const refreshCart = useCallback(async () => {
    if (!sessionId) return;
    
    try {
      setLoading(true);
      const response = await cartService.getCart();
      setCart(response.data);
      setError(null);
    } catch (err: any) {
      // Cart might not exist yet, which is fine
      console.log('Cart fetch:', err.response?.status === 404 ? 'No cart yet' : err.message);
      setCart(null);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  // Fetch cart when session is ready
  useEffect(() => {
    if (isReady && sessionId) {
      refreshCart();
    }
  }, [isReady, sessionId, refreshCart]);

  const addToCart = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await cartService.addToCart(productId, quantity);
      setCart(response.data);
      setError(null);
      toast.success('Item added to cart!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to add item to cart';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await cartService.updateCartItem(itemId, quantity);
      setCart(response.data);
      setError(null);
      toast.success('Cart updated!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to update cart';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true);
      const response = await cartService.removeFromCart(itemId);
      setCart(response.data);
      setError(null);
      toast.success('Item removed from cart!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to remove item';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await cartService.clearCart();
      setCart(null);
      setError(null);
      toast.success('Cart cleared!');
    } catch (err: any) {
      const message = err.response?.data?.error || 'Failed to clear cart';
      setError(message);
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError(null);

  // Return number of unique items in cart (not total quantity)
  const getItemCount = () => {
    if (!cart?.items) return 0;
    return cart.items.length;
  };

  const getTotals = () => {
    if (!cart?.items || cart.items.length === 0) {
      return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    const tax = Number((subtotal * 0.1).toFixed(2));
    const shipping = subtotal > 100 ? 0 : 9.99;
    const total = Number((subtotal + tax + shipping).toFixed(2));

    return { subtotal, tax, shipping, total };
  };

  const value: CartContextType = {
    cart,
    loading,
    error,
    isReady,
    sessionId,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    clearError,
    getItemCount,
    getTotals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
