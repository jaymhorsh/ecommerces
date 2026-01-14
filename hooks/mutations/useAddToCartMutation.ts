import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import cartService from "@/services/cart"
import { useCartStore } from "@/store/cart"
import type { Cart } from "@/lib/types"

const CART_QUERY_KEY = ["cart"]

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient()
  const setCart = useCartStore((state) => state.setCart)

  const {
    mutateAsync: addToCartFn,
    isPending: isLoading,
    error,
  } = useMutation({
    mutationFn: async (payload: { productId: number; quantity: number }) =>
      await cartService.addToCart(payload.productId, payload.quantity),
    onSuccess: (response) => {
      const cartData = response.data as Cart
      setCart(cartData)
      queryClient.setQueryData(CART_QUERY_KEY, response)
      toast.success("Item added to cart!")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.error || "Failed to add item to cart"
      toast.error(message)
    },
  })

  return { addToCartFn, isLoading, error }
}
