"use client"

import { Button } from "@/components/ui/button"
import { ShoppingBag, Loader2 } from "lucide-react"
import Link from "next/link"
import { useCartStore } from "@/store/cart"
import { useRemoveFromCartMutation } from "@/hooks/mutations/useRemoveFromCartMutation"
import { useUpdateCartMutation } from "@/hooks/mutations/useUpdateCartMutation"
import { CartItemRow } from "@/components/cart/cart-item-row"
import { CartSummary } from "@/components/cart/cart-summary"


export default function CartPage() {
  const { cart } = useCartStore()
  const items = cart?.items || []
  const { removeFromCartFn, isLoading: isRemoving } = useRemoveFromCartMutation()
  const { updateCartFn, isLoading: isUpdating } = useUpdateCartMutation()
  const isLoading = isRemoving || isUpdating
  const handleRemove = async (itemId: number) => {
    await removeFromCartFn(itemId)
  }
  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    await updateCartFn({ itemId, quantity })
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Shopping Cart</h1>
          {items.length > 0 && (
            <p className="text-muted-foreground mt-1">
              {items.length} item{items.length !== 1 ? "s" : ""} in your cart
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  isLoading={isLoading}
                  onRemove={() => handleRemove(item.id)}
                  onUpdateQuantity={(quantity) => handleUpdateQuantity(item.id, quantity)}
                />
              ))}
            </div>

            <CartSummary cart={cart} isLoading={isLoading} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">Add some products to your cart to get started</p>
            <Link href="/shop-all">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
