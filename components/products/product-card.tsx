"use client"

import type React from "react"
import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Star } from "lucide-react"
import Link from "next/link"
import { formatCurrency } from "@/utils/helpers"
import { motion } from "framer-motion"
import { useAddToCartMutation } from "@/hooks"
import type { ProductCardProps } from "@/types"

export function ProductCard({ product, index }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addToCartFn, isLoading } = useAddToCartMutation()
  const isOutOfStock = product.stock === 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAdding || isLoading) return

    try {
      setIsAdding(true)
      await addToCartFn({ productId: product.id, quantity: 1 })
    } catch (error) {
      // Error handled by mutation
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.3, delay: index * 0.03 }}
    >
      <Link href={`/product/${product.id}`} className="block group">
        <Card className="overflow-hidden border-0 bg-card hover:shadow-xl transition-all duration-300 h-full flex flex-col rounded-xl">
          <div className="aspect-[4/5] overflow-hidden bg-muted">
            <img
              src={product.thumbnail || product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="p-3 flex flex-col flex-1">
            <span className="inline-block px-2 py-0.5 text-[10px] font-medium bg-primary/10 text-primary rounded-full mb-2 w-fit">
              {product.category}
            </span>
            <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">{product.name}</h3>

            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">({product.rating || 4.8})</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <p className="text-base font-bold text-foreground">{formatCurrency(product.price)}</p>
              <Button
                size="sm"
                variant={isOutOfStock ? "secondary" : "default"}
                disabled={isOutOfStock || isAdding || isLoading}
                onClick={handleAddToCart}
                className="h-8 px-3 text-xs gap-1 rounded-full"
              >
                <ShoppingCart className="h-3 w-3" />
                {isAdding ? "..." : "Add"}
              </Button>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  )
}
