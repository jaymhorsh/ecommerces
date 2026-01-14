"use client"

import { formatCurrency } from "@/utils/helpers"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { Cart } from "@/lib/types"

interface OrderSummaryCheckoutProps {
  cart: Cart | null
}

export function OrderSummaryCheckout({ cart }: OrderSummaryCheckoutProps) {
  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = Number((subtotal * 0.1).toFixed(2))
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = Number((subtotal + tax + shipping).toFixed(2))

  return (
    <Card className="border border-border bg-card sticky top-24 p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="h-16 w-16 rounded overflow-hidden bg-muted shrink-0">
              <img
                src={item.product.thumbnail || item.product.images?.[0] || "/placeholder.svg"}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm line-clamp-1">{item.product.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-primary">{formatCurrency(item.product.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      <Separator className="my-4" />

      {/* Totals */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span>{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Shipping
            {shipping === 0 && <span className="text-primary ml-1">(Free)</span>}
          </span>
          <span>{formatCurrency(shipping)}</span>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>

      {shipping === 0 && (
        <p className="text-xs text-center text-green-600 bg-green-50 dark:bg-green-950/30 rounded p-2 mt-4">
          Free shipping on orders over $100!
        </p>
      )}
    </Card>
  )
}
