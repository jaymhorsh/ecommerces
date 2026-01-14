import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { useCartStore } from "@/store/cart"
import type { Cart } from "@/lib/types"
import cartService from "@/services/cart"

const CART_QUERY_KEY = ["cart"]

export const useRemoveFromCartMutation = () => {
  const queryClient = useQueryClient()
  const setCart = useCartStore((state) => state.setCart)

  const {
    mutateAsync: removeFromCartFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (itemId: number) => await cartService.removeFromCart(itemId),
    onSuccess: (response) => {
      const cartData = response.data as Cart
      setCart(cartData)
      queryClient.setQueryData(CART_QUERY_KEY, response)
      toast.success("Item removed!")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to remove item"
      toast.error(message)
    },
  })

  return { removeFromCartFn, isLoading, error }
}
