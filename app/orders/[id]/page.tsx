"use client"

import { useParams } from "next/navigation"
import { useOrderByIdQuery } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, Package, Printer, Home } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/utils/helpers"
import { useRef, useState } from "react"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = Number(params.id as string)
  const receiptRef = useRef<HTMLDivElement>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  const { data, isLoading, error } = useOrderByIdQuery(orderId)
  const order = data?.data

  const handlePrintReceipt = () => {
    if (!order) return

    setIsPrinting(true)

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt #${order.id}</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #ccc;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 5px;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 5px;
          }
          .items {
            margin-bottom: 20px;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
          }
          .totals {
            margin-top: 20px;
            border-top: 2px dashed #ccc;
            padding-top: 20px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .final-total {
            font-size: 18px;
            font-weight: bold;
            display: flex;
            justify-content: space-between;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Store404</div>
          <p>Order Confirmation</p>
        </div>
        <div class="order-info">
          <div>
            <strong>Order ID:</strong><br/>#${order.id}
          </div>
          <div style="text-align: right;">
            <strong>Date:</strong><br/>${formatDate(order.createdAt || new Date().toISOString())}
          </div>
        </div>
        <div class="items">
          <strong>Items:</strong>
          ${order.items
            ?.map(
              (item: any) => `
            <div class="item">
              <div>
                <div>${item.product.name}</div>
                <small>Qty: ${item.quantity}</small>
              </div>
              <div>${formatCurrency(item.product.price * item.quantity)}</div>
            </div>
          `,
            )
            .join("")}
        </div>
        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.subtotal || 0)}</span>
          </div>
          <div class="total-row">
            <span>Tax (10%):</span>
            <span>${formatCurrency(order.tax || 0)}</span>
          </div>
          <div class="total-row">
            <span>Shipping:</span>
            <span>${formatCurrency(order.shipping || 0)}</span>
          </div>
          <div class="final-total">
            <span>Total:</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
        </div>
      </body>
      </html>
    `

    const printWindow = window.open("", "", "height=400,width=600")
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.print()
    }

    setIsPrinting(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading order</p>
          <Link href="/orders">
            <Button>Back to Orders</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      {/* Success Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
          <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground">Thank you for your order. We'll send you a confirmation email shortly.</p>
      </div>

      {/* Order Details Card */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Order Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  className={order.status === "delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium">{formatDate(order.createdAt || new Date().toISOString())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Items:</span>
                <span className="font-medium">{order.items?.length || 0}</span>
              </div>
            </div>
          </Card>

          <Card className="bg-card border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4">Order Total</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>{formatCurrency(order.subtotal || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (10%):</span>
                <span>{formatCurrency(order.tax || 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span>{formatCurrency(order.shipping || 0)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span className="text-primary text-lg">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="bg-card border border-border p-6 mb-8">
          <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
          <div className="space-y-4">
            {order.items?.map((item: any) => (
              <div
                key={item.id}
                className="flex justify-between items-center pb-4 border-b border-border last:border-b-0"
              >
                <div>
                  <p className="font-medium text-foreground">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <span className="font-semibold text-foreground">
                  {formatCurrency(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-4 flex-wrap">
          <Button onClick={handlePrintReceipt} disabled={isPrinting} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print Receipt
          </Button>
          <Link href="/orders" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full">
              Back to Orders
            </Button>
          </Link>
          <Link href="/shop-all" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Package className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/" className="flex-1 md:flex-none">
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
