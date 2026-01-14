

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { AddToCart } from "@/components/cart/add-to-cart"
import { PageLayout } from "@/components/layout/page-layout"
import { formatCurrency } from "@/utils/helpers"
import { productService } from "@/services/products"
import { Badge } from "@/components/ui/badge"
import { Star, Truck, Shield, RefreshCw } from "lucide-react"
import { CATEGORIES } from "@/lib/constants/products"

// Helper to get category label
function getCategoryLabel(category: string): string {
  const found = CATEGORIES.find((c) => c.value === category)
  return found?.label || category
}

interface ProductPageProps {
  params: Promise<{ id: string }>
}

// Enable ISR with 1 minute revalidation
export const revalidate = 60

async function getProduct(id: string) {
  try {
    const productId = Number.parseInt(id, 10)
    if (isNaN(productId)) return null

    const response = await productService.getProduct(productId)
    return response.data
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: product.images?.[0]
      ? {
          images: [
            {
              url: product.images[0],
              alt: product.name,
            },
          ],
        }
      : undefined,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProduct(id)

  if (!product) {
    return notFound()
  }

  const productImage = product.images?.[0] || product.thumbnail || "/placeholder.svg"
  const isInStock = typeof product.stock === "number" && product.stock > 0
  const price = typeof product.price === "number" ? product.price : 0
  const discountPercentage = typeof product.discountPercentage === "number" ? product.discountPercentage : 0
  const hasDiscount = discountPercentage > 0
  const discountedPrice = hasDiscount ? price * (1 - discountPercentage / 100) : price

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImage,
    offers: {
      "@type": "Offer",
      availability: isInStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      price: Number(discountedPrice).toFixed(2),
      priceCurrency: "USD",
    },
  }

  return (
    <PageLayout>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/shop-all">Shop</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/shop-all?category=${product.category}`}>
              {getCategoryLabel(product.category)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{product.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Image */}
        <div className="flex items-center justify-center bg-muted rounded-lg overflow-hidden aspect-square">
          <Image
            src={productImage || "/placeholder.svg"}
            alt={product.name}
            width={500}
            height={500}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="mb-4">
            <Badge variant="secondary">{getCategoryLabel(product.category)}</Badge>
          </div>

          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating || 4.8) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">({product.rating || 4.8})</span>
          </div>

          {/* Price */}
          <div className="mb-6">
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-primary">{formatCurrency(discountedPrice)}</span>
                <span className="text-lg text-muted-foreground line-through">{formatCurrency(product.price)}</span>
                <Badge variant="destructive">-{product.discountPercentage}%</Badge>
              </div>
            ) : (
              <span className="text-3xl font-bold">{formatCurrency(product.price)}</span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground mb-6 leading-relaxed">{product.description}</p>

          {/* Stock Status */}
          <div className="mb-6">
            {isInStock ? (
              <Badge variant="default" className="bg-green-600">
                In Stock ({product.stock} available)
              </Badge>
            ) : (
              <Badge variant="destructive">Out of Stock</Badge>
            )}
          </div>

          {/* Add to Cart */}
          <AddToCart productId={product.id} isOutOfStock={!isInStock} className="mb-6" />

          {/* Benefits */}
          <div className="space-y-3 border-t pt-6 mt-6">
            <div className="flex items-start gap-3">
              <Truck className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Free Shipping</p>
                <p className="text-sm text-muted-foreground">On orders over $50</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">1-Year Warranty</p>
                <p className="text-sm text-muted-foreground">Coverage included</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RefreshCw className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">30-Day Returns</p>
                <p className="text-sm text-muted-foreground">No questions asked</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
    </PageLayout>
  )
}
