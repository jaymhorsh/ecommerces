"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, ArrowRight, Sparkles } from "lucide-react"
import { useProductsQuery } from "@/hooks"
import { motion, AnimatePresence } from "motion/react"
import { ProductCard } from "@/components/products/product-card"
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton"

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
                <Button size="lg" variant="outline" className="rounded-full bg-transparent">
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
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
              <h2 className="text-2xl font-bold text-foreground">Featured Products</h2>
              <p className="text-sm text-muted-foreground mt-1">Hand-picked just for you</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
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
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                <p className="text-muted-foreground">No products available at the moment.</p>
                <Link href="/shop-all">
                  <Button variant="outline" className="mt-4 rounded-full bg-transparent">
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
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">Ready to explore more?</h2>
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
