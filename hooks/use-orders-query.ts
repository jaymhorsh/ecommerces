'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orders';
import { useCartStore } from '@/store/cart-store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

/**
 * Hook to fetch all orders for current session
 */
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ['orders'],
    queryFn: () => orderService.getOrders(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single order by ID
 */
export const useOrderByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch order receipt
 */
export const useOrderReceiptQuery = (orderId: number) => {
  return useQuery({
    queryKey: ['order', orderId, 'receipt'],
    queryFn: () => orderService.getReceipt(orderId),
    enabled: !!orderId,
  });
};

/**
 * Hook to create a new order
 */
export const useCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setCart } = useCartStore();

  return useMutation({
    mutationFn: () => orderService.createOrder(),
    onSuccess: (data) => {
      // Invalidate orders query to refetch
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      
      // Clear the cart after successful order
      setCart(null);
      queryClient.invalidateQueries({ queryKey: ['cart'] });

      toast.success('Order placed successfully!');
      
      // Redirect to order confirmation page
      if (data.data?.id) {
        router.push(`/orders?id=${data.data.id}`);
      }
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to create order';
      toast.error(message);
    },
  });
};

/**
 * Hook to cancel an order
 */
export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: number) => orderService.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      toast.success('Order cancelled successfully!');
    },
    onError: (error) => {
      const message =
        error instanceof Error ? error.message : 'Failed to cancel order';
      toast.error(message);
    },
  });
};
