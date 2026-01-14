"use client"
import { motion, AnimatePresence } from "framer-motion"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/types/product"

interface ProductMotionGridProps {
  products: Product[]
}

export function ProductMotionGrid({ products }: ProductMotionGridProps) {
  return (
    <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence>
        {products.map((product, idx) => (
          <ProductCard key={product.id} product={product} index={idx} />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}