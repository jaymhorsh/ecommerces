import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'sonner';
import type { Cart, CartItem, Product } from '@/lib/types';
import { cartService } from '@/services/cart';
import { calculateCartTotals } from '@/utils/helpers';

interface CartState {
  // State
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;

  // Actions
  setCart: (cart: Cart | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasHydrated: (state: boolean) => void;

  // Cart operations
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;

  // Aliases for legacy code
  items: CartItem[];
  addItem: (productId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;

  // Computed
  getTotals: () => {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // Initial state
      cart: null,
      isLoading: false,
      error: null,
      hasHydrated: false,

      // Getter for items (alias for cart.items)
      get items() {
        return get().cart?.items || [];
      },

      // Setters
      setCart: (cart) => set({ cart }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      setHasHydrated: (state) => set({ hasHydrated: state }),

      // Fetch cart from API
      fetchCart: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartService.getCart();
          set({ cart: response.data, isLoading: false });
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to fetch cart';
          set({ error: message, isLoading: false });
        }
      },

      // Add item to cart
      addToCart: async (productId, quantity = 1) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartService.addToCart(productId, quantity);
          set({ cart: response.data, isLoading: false });
          toast.success('Item added to cart!');
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to add item to cart';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw err;
        }
      },

      // Update cart item quantity
      updateCartItem: async (itemId, quantity) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartService.updateCartItem(itemId, quantity);
          set({ cart: response.data, isLoading: false });
          toast.success('Cart updated!');
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to update cart';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw err;
        }
      },

      // Remove item from cart
      removeFromCart: async (itemId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await cartService.removeFromCart(itemId);
          set({ cart: response.data, isLoading: false });
          toast.success('Item removed from cart!');
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to remove item';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw err;
        }
      },

      // Clear entire cart
      clearCart: async () => {
        try {
          set({ isLoading: true, error: null });
          await cartService.clearCart();
          set({ cart: null, isLoading: false });
          toast.success('Cart cleared!');
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Failed to clear cart';
          set({ error: message, isLoading: false });
          toast.error(message);
          throw err;
        }
      },

      // Calculate totals
      getTotals: () => {
        const cart = get().cart;
        if (!cart || !cart.items.length) {
          return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
        }

        const subtotal = cart.items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );

        return calculateCartTotals(subtotal);
      },

      // Get total item count
      getItemCount: () => {
        const cart = get().cart;
        if (!cart) return 0;
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
      },

      // Aliases for legacy code
      addItem: async (productId, quantity = 1) => {
        return get().addToCart(productId, quantity);
      },
      removeItem: async (itemId) => {
        return get().removeFromCart(itemId);
      },
      updateQuantity: async (itemId, quantity) => {
        return get().updateCartItem(itemId, quantity);
      },
    }),
    {
      name: 'ecommerce-cart-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        cart: state.cart,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);
