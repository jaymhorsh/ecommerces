import api from '@/lib/axios-instance';
import type { Cart, ApiResponse } from '@/lib/types';
import { getSessionId } from '@/utils/helpers';

export const cartService = {
  /**
   * Get cart by session ID
   */
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const response = await api.get(`cart/${sessionId}`);
    return response.data;
  },

  /**
   * Add item to cart
   */
  addToCart: async (
    productId: number,
    quantity: number
  ): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const response = await api.post(`/cart/${sessionId}`, {
      productId,
      quantity,
    });
    return response.data;
  },

  /**
   * Update cart item quantity
   */
  updateCartItem: async (
    itemId: number,
    quantity: number
  ): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const response = await api.put(`/cart/${sessionId}/items/${itemId}`, {
      quantity,
    });
    return response.data;
  },

  /**
   * Remove item from cart
   */
  removeFromCart: async (itemId: number): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${sessionId}/items/${itemId}`);
    return response.data;
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const response = await api.delete(`/cart/${sessionId}`);
    return response.data;
  },
};

export default cartService;
