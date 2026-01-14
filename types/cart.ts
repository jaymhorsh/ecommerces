import type { Product } from "./product"

export interface CartItem {
  id: number
  cartId: number
  productId: number
  quantity: number
  product: Product
  createdAt: string
  updatedAt: string
}

export interface Cart {
  id: number
  sessionId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}

export interface AddToCartRequest {
  productId: number
  quantity: number
}

export interface UpdateCartRequest {
  cartItemId: number
  quantity: number
}

export interface CartState {
  cart: Cart | null
  hasHydrated: boolean

  setCart: (cart: Cart | null) => void
  setHasHydrated: (state: boolean) => void
  clearCart: () => void
}
