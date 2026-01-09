'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';

/**
 * Hook to access and manage cart state
 * Wrapper around Zustand store with auto-fetch on mount
 */
export const useCart = () => {
  const {
    cart,
    isLoading,
    error,
    hasHydrated,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getTotals,
    getItemCount,
  } = useCartStore();

  // Fetch cart on mount (after hydration)
  useEffect(() => {
    if (hasHydrated) {
      fetchCart();
    }
  }, [hasHydrated, fetchCart]);

  return {
    // State
    cart,
    items: cart?.items ?? [],
    isLoading,
    error,
    hasHydrated,

    // Actions
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,

    // Computed
    totals: getTotals(),
    itemCount: getItemCount(),
    isEmpty: !cart?.items?.length,
  };
};
