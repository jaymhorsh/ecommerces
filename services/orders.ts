import api from "@/lib/axios-instance";
import type { Order, ApiResponse } from "@/lib/types";
import { getSessionId } from "@/utils/helpers";

// Store order IDs in localStorage for session-based order tracking
const ORDER_STORAGE_KEY = "order_ids";

const getStoredOrderIds = (): number[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(ORDER_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const addOrderId = (orderId: number): void => {
  if (typeof window === "undefined") return;
  const ids = getStoredOrderIds();
  if (!ids.includes(orderId)) {
    ids.push(orderId);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(ids));
  }
};

export const orderService = {
  // Create a new order from the current cart
  createOrder: async (): Promise<ApiResponse<Order>> => {
    const sessionId = getSessionId();
    const { data } = await api.post("/orders", { sessionId });
    if (data?.data?.id) {
      addOrderId(data.data.id);
    }
    return data;
  },

  // Get order by ID
  getOrder: async (id: number): Promise<ApiResponse<Order>> => {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  // Get all orders for current session (fetches stored order IDs)
  getOrders: async (): Promise<ApiResponse<Order[]>> => {
    const orderIds = getStoredOrderIds();
    console.log("Fetching orders for IDs:", orderIds);
    if (orderIds.length === 0) {
      return { success: true, data: [] };
    }
    // Fetch all orders by their IDs
    const orderPromises = orderIds.map((id) =>
      api
        .get(`/orders/${id}`)
        .then((res) => res.data?.data)
        .catch(() => null)
    );

    const orders = await Promise.all(orderPromises);
    const validOrders = orders.filter(
      (order): order is Order => order !== null
    );

    return { success: true, data: validOrders };
  },
};

export default orderService;
