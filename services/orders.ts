import api from '@/lib/axios-instance';
import type { Order, ApiResponse } from '@/lib/types';
import { getSessionId } from '@/utils/helpers';

export const orderService = {
  /**
   * Create a new order from the current cart
   */
  createOrder: async (): Promise<ApiResponse<Order>> => {
    const sessionId = getSessionId();
    const response = await api.post('/orders', { sessionId });
    return response.data;
  },

  /**
   * Get order by ID
   */
  getOrder: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  /**
   * Get all orders for current session
   */
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const sessionId = getSessionId();
    const response = await api.get(`/orders/session/${sessionId}`);
    return response.data;
  },

  /**
   * Generate receipt for an order
   */
  getReceipt: async (orderId: number): Promise<ApiResponse<Order>> => {
    const response = await api.get(`/orders/${orderId}/receipt`);
    return response.data;
  },

  /**
   * Cancel an order
   */
  cancelOrder: async (id: number): Promise<ApiResponse<Order>> => {
    const response = await api.patch(`/orders/${id}`, { status: 'cancelled' });
    return response.data;
  },
};

export default orderService;
