import { useCartStore } from "@/store/cart"
import { calculateCartTotals, getCartItemCount, getUniqueItemCount } from "@/utils/cart-helpers"

export function useCartHelpers() {
  const {cart} = useCartStore()

  return {
    cart,
    totals: calculateCartTotals(cart),
    itemCount: getCartItemCount(cart),
    uniqueItemCount: getUniqueItemCount(cart),
    isEmpty: !cart?.items?.length,
  }
}
