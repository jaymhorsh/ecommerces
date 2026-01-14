"use client"

import { formatCurrency } from "@/utils/helpers"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import type { Cart } from "@/lib/types"

interface CartSummaryProps {
  cart: Cart | null
  isLoading?: boolean
}

export function CartSummary({ cart, isLoading }: CartSummaryProps) {
  const items = cart?.items || []
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const tax = Number((subtotal * 0.1).toFixed(2))
  const shipping = subtotal > 100 ? 0 : 9.99
  const total = Number((subtotal + tax + shipping).toFixed(2))

  return (
    <Card className="border border-border bg-card sticky top-24 p-6 space-y-4">
      <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Tax (10%)</span>
          <span className="font-semibold">{formatCurrency(tax)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Shipping
            {shipping === 0 && <span className="text-primary ml-2">(Free)</span>}
          </span>
          <span className="font-semibold">{formatCurrency(shipping)}</span>
        </div>
      </div>

      <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span className="text-primary">{formatCurrency(total)}</span>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full" size="lg" disabled={isLoading || items.length === 0}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/shop-all">
        <Button variant="outline" className="w-full bg-transparent">
          Continue Shopping
        </Button>
      </Link>

      {shipping === 0 && (
        <p className="text-xs text-center text-green-600 bg-green-50 dark:bg-green-950/30 rounded p-2">
          Free shipping on orders over $100!
        </p>
      )}
    </Card>
  )
}
