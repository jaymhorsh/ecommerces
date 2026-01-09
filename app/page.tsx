"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ShoppingCart, ArrowRight, Sparkles, Star } from "lucide-react"
import { useProductsQuery } from "@/hooks/use-products-query"
import { useCart } from "@/components/cart/cart-context"
import { formatCurrency } from "@/utils/helpers"
import { motion, AnimatePresence } from "motion/react"
import type { Product } from "@/lib/types"

// Skeleton for loading state
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card animate-pulse rounded-xl">
      <div className="aspect-[4/5] w-full bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded-full w-16" />
        </div>
      </div>
    </Card>
  )
}

// Featured product card with hover effects
function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart, loading: isLoading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAdding || isLoading) return

    try {
      setIsAdding(true)
      await addToCart(product.id, 1)
    } catch (error) {
      // Error handled by context
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link href={`/product/${product.id}`} className="block group">
        <Card className="overflow-hidden border-0 bg-card transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col rounded-xl">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
            <img
              src={product.thumbnail || product.images?.[0] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="text-xs font-medium text-white px-3 py-1 bg-black/50 rounded-full">
                  Out of Stock
                </span>
              </div>
            )}
          </div>
          <div className="p-3 flex flex-col flex-1">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {product.category}
            </p>
            <h3 className="mb-1 font-medium text-sm text-foreground line-clamp-2 group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
                />
              ))}
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <span className="text-base font-bold text-primary">{formatCurrency(product.price)}</span>
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
    </motion.div>
  )
}

export default function Home() {
  const { data: productsData, isLoading } = useProductsQuery({ limit: 10 })
  const products = productsData?.data || []

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium text-primary">New Arrivals</span>
            </div>
            <h1 className="text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              Shop Smarter,
              <br />
              <span className="text-primary">Live Better</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              Discover our curated collection of premium products at unbeatable prices.
            </p>
            <div className="mt-8 flex gap-4">
              <Link href="/shop-all">
                <Button size="lg" className="gap-2 rounded-full">
                  <ShoppingCart className="h-5 w-5" />
                  Shop Now
                </Button>
              </Link>
              <Link href="/shop-all">
                <Button size="lg" variant="outline" className="rounded-full">
                  Browse All
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
              <p className="text-sm text-muted-foreground mt-1">Hand-picked just for you</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/shop-all">
                  <Button variant="ghost" className="gap-1 group">
                    View All
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </motion.div>
              ) : products.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {products.map((product, index) => (
                    <FeaturedProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-muted-foreground">No products available at the moment.</p>
                  <Link href="/shop-all">
                    <Button variant="outline" className="mt-4 rounded-full">
                      Browse Shop
                    </Button>
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

      {/* CTA Section */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Ready to explore more?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Discover our full collection with amazing deals and fast shipping.
            </p>
            <Link href="/shop-all">
              <Button size="lg" className="mt-6 gap-2 rounded-full">
                Explore Shop
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
