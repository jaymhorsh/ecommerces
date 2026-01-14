"use client"

import { useRouter } from "next/navigation"
import { useCartStore } from "@/store/cart"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummaryCheckout } from "@/components/checkout/order-summary-checkout"

export default function CheckoutPage() {
  const router = useRouter()
  const {cart} = useCartStore()
  const handleOrderSuccess = (orderId: number) => {
    router.push(`/orders/${orderId}`)
  }

  const items = cart?.items || []

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20 lg:pt-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some items to your cart before checking out.</p>
            <Link href="/shop-all">
              <Button size="lg" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <CheckoutForm onSuccess={handleOrderSuccess} />
          </div>

          <OrderSummaryCheckout cart={cart} />
        </div>
      </div>
    </div>
  )
}
