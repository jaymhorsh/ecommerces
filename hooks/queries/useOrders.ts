"use client";

import { useQuery } from "@tanstack/react-query";
import { orderService } from "@/services/orders";

export const useOrderByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrder(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
export const useOrdersQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => orderService.getOrders(),
    staleTime: 5 * 60 * 1000,
  });
}