"use client"

import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Plus, Minus, Loader2, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/utils/helpers"

export default function CartPage() {
  const { cart, loading, removeFromCart, updateCartItem, getTotals, isReady } = useCart()
  const { subtotal, tax, shipping, total } = getTotals()
  const items = cart?.items || []

  if (!isReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Header */}
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

      {/* Cart Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {items.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id} className="overflow-hidden border border-border bg-card p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-muted">
                      <img
                        src={item.product.thumbnail || item.product.images?.[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-semibold text-foreground text-lg line-clamp-1 hover:text-primary transition-colors">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-primary font-bold">{formatCurrency(item.product.price)}</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          disabled={loading}
                          className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                        >
                          <X className="h-5 w-5 text-muted-foreground" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading || item.quantity <= 1}
                          onClick={() => updateCartItem(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={loading}
                          onClick={() => updateCartItem(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <span className="ml-auto text-sm text-muted-foreground">
                          Subtotal: {formatCurrency(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Order Summary */}
            <div>
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
                  <Button className="w-full" size="lg" disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
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
                    🎉 Free shipping on orders over $100!
                  </p>
                )}
              </Card>
            </div>
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
