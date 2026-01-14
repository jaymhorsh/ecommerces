import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { orderService } from "@/services/orders"
import { useCartStore } from "@/store/cart"

export const useCreateOrderMutation = () => {
  const {clearCart} = useCartStore()

  const {
    mutateAsync: createOrderFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async () => await orderService.createOrder(),
    onSuccess: (response) => {
      
      clearCart()
      toast.success("Order placed successfully!")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to place order"
      toast.error(message)
    },
  })

  return { createOrderFn, isLoading, error }
}
