import api from '@/lib/axios-instance';
import type { Cart, ApiResponse } from '@/lib/types';
import { getSessionId } from '@/utils/helpers';

const cartService = {
  // Get cart by session ID
  getCart: async (): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const {data} = await api.get(`/cart/${sessionId}`);
    return data;
  },

  // Add item to cart
  addToCart: async (
    productId: number,
    quantity: number
  ): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const {data} = await api.post(`/cart/${sessionId}`, {
      productId,
      quantity,
    });
    return data;
  },

  // Update cart item quantity
  updateCartItem: async (
    itemId: number,
    quantity: number
  ): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const {data} = await api.put(`/cart/${sessionId}/items/${itemId}`, {
      quantity,
    });
    return data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: number): Promise<ApiResponse<Cart>> => {
    const sessionId = getSessionId();
    const {data} = await api.delete(`/cart/${sessionId}/items/${itemId}`);
    return data;
  },
};

export default cartService;
