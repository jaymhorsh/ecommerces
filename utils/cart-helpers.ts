import type { Cart } from "@/lib/types"

export function calculateCartTotals(cart: Cart | null) {
  if (!cart?.items?.length) {
    return { subtotal: 0, tax: 0, shipping: 0, total: 0 }
  }

  const subtotal = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = Number((subtotal * 0.1).toFixed(2))
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = Number((subtotal + tax + shipping).toFixed(2))

  return { subtotal, tax, shipping, total }
}

export function getCartItemCount(cart: Cart | null): number {
  if (!cart?.items) return 0
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
}

export function getUniqueItemCount(cart: Cart | null): number {
  if (!cart?.items) return 0
  return cart.items.length
}
