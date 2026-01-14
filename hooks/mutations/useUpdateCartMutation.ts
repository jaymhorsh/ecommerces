import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart"
import type { Cart } from "@/lib/types"
import cartService from "@/services/cart"

const CART_QUERY_KEY = ["cart"]

export const useUpdateCartMutation = () => {
  const queryClient = useQueryClient()
  const setCart = useCartStore((state) => state.setCart)

  const {
    mutateAsync: updateCartFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (payload: { itemId: number; quantity: number }) =>
      await cartService.updateCartItem(payload.itemId, payload.quantity),
    onSuccess: (response) => {
      const cartData = response.data as Cart
      setCart(cartData)
      queryClient.setQueryData(CART_QUERY_KEY, response)
      toast.success("Cart updated!")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to update cart"
      toast.error(message)
    },
  })

  return { updateCartFn, isLoading, error }
}
