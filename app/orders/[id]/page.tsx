"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { orderService } from "@/services/orders"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Loader2, Package, Printer, Download, Home } from "lucide-react"
import Link from "next/link"
import { formatCurrency, formatDate } from "@/utils/helpers"
import type { Order } from "@/lib/types"
import { toast } from "sonner"

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const receiptRef = useRef<HTMLDivElement>(null)

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await orderService.getOrder(Number(orderId))
        setOrder(response.data)
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load order")
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

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
          .items { margin-bottom: 20px; }
          .item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
          }
          .item-name { flex: 1; }
          .item-qty { width: 50px; text-align: center; color: #666; }
          .item-price { width: 80px; text-align: right; font-weight: 500; }
          .totals { border-top: 2px solid #333; padding-top: 15px; }
          .total-row { display: flex; justify-content: space-between; padding: 5px 0; }
          .total-row.grand {
            font-size: 18px;
            font-weight: bold;
            border-top: 1px solid #ccc;
            margin-top: 10px;
            padding-top: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px dashed #ccc;
            color: #666;
            font-size: 12px;
          }
          .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 500;
            background: #dcfce7;
            color: #166534;
          }
          @media print { body { margin: 0; padding: 10px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">Store404</div>
          <div>Order Receipt</div>
        </div>
        <div class="order-info">
          <div>
            <strong>Order #${order.id}</strong><br>
            <small>${formatDate(order.createdAt || new Date().toISOString())}</small>
          </div>
          <div style="text-align: right;">
            <span class="status">${order.status.toUpperCase()}</span>
          </div>
        </div>
        <div class="items">
          <h4 style="margin-bottom: 10px;">Items</h4>
          ${order.items?.map(item => `
            <div class="item">
              <span class="item-name">${item.product?.name || 'Product'}</span>
              <span class="item-qty">x${item.quantity}</span>
              <span class="item-price">${formatCurrency((item.product?.price || 0) * item.quantity)}</span>
            </div>
          `).join('')}
        </div>
        <div class="totals">
          <div class="total-row">
            <span>Subtotal</span>
            <span>${formatCurrency(order.total * 0.9)}</span>
          </div>
          <div class="total-row">
            <span>Tax (10%)</span>
            <span>${formatCurrency(order.total * 0.1)}</span>
          </div>
          <div class="total-row">
            <span>Shipping</span>
            <span>FREE</span>
          </div>
          <div class="total-row grand">
            <span>Total</span>
            <span>${formatCurrency(order.total)}</span>
          </div>
        </div>
        <div class="footer">
          <p>Thank you for your purchase!</p>
          <p>Questions? Contact support@store404.com</p>
          <p style="margin-top: 10px;">Printed on ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
      </html>
    `
    
    const printWindow = window.open('', '_blank', 'width=450,height=600')
    if (printWindow) {
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()
      
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
        setIsPrinting(false)
        toast.success('Receipt printed successfully!')
      }, 250)
    } else {
      setIsPrinting(false)
      toast.error('Unable to open print window. Please check your popup settings.')
    }
  }

  const handleDownloadReceipt = () => {
    if (!order) return
    
    const receiptText = `
=====================================
          STORE404 RECEIPT
=====================================

Order #${order.id}
Date: ${formatDate(order.createdAt || new Date().toISOString())}
Status: ${order.status.toUpperCase()}

-------------------------------------
ITEMS
-------------------------------------
${order.items?.map(item => 
  `${item.product?.name || 'Product'}
  Qty: ${item.quantity} x ${formatCurrency(item.product?.price || 0)}
  Subtotal: ${formatCurrency((item.product?.price || 0) * item.quantity)}`
).join('\n\n')}

-------------------------------------
SUMMARY
-------------------------------------
Subtotal:  ${formatCurrency(order.total * 0.9)}
Tax (10%): ${formatCurrency(order.total * 0.1)}
Shipping:  FREE
-------------------------------------
TOTAL:     ${formatCurrency(order.total)}
-------------------------------------

Thank you for your purchase!
Questions? Contact support@store404.com

=====================================
    `
    
    const blob = new Blob([receiptText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `receipt-order-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Receipt downloaded!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-background pt-20 lg:pt-24">
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "We couldn't find this order."}</p>
          <Link href="/shop-all">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    delivered: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Banner */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="p-6 mb-6" ref={receiptRef}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <p className="text-sm text-muted-foreground">Order Number</p>
              <p className="text-lg font-bold text-foreground">#{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">{formatDate(order.createdAt || new Date().toISOString())}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={statusColors[order.status] || statusColors.pending}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <h2 className="font-semibold text-foreground mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-20 w-20 rounded overflow-hidden bg-muted shrink-0">
                  <img
                    src={item.product?.thumbnail || item.product?.images?.[0] || "/placeholder.svg"}
                    alt={item.product?.name || "Product"}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-medium line-clamp-1">{item.product?.name || "Product"}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="font-semibold text-primary">
                    {formatCurrency((item.product?.price || 0) * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Order Total */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.total * 0.9)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.total * 0.1)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </Card>

        {/* Receipt Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handlePrintReceipt}
            disabled={isPrinting}
          >
            {isPrinting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Printer className="h-4 w-4" />
            )}
            {isPrinting ? 'Printing...' : 'Print Receipt'}
          </Button>
          <Button 
            variant="outline" 
            className="flex-1 gap-2" 
            onClick={handleDownloadReceipt}
          >
            <Download className="h-4 w-4" />
            Download Receipt
          </Button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop-all" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <Home className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/orders" className="flex-1">
            <Button className="w-full gap-2">
              <Package className="h-4 w-4" />
              View All Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
