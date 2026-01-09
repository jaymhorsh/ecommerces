import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { AddToCart } from '@/components/cart/add-to-cart';
import { PageLayout } from '@/components/layout/page-layout';
import { formatCurrency } from '@/utils/helpers';
import { productService } from '@/services/products';
import { Badge } from '@/components/ui/badge';
import { Star, Truck, Shield, RefreshCw } from 'lucide-react';
import { CATEGORIES } from '@/store/products-store';

// Helper to get category label
function getCategoryLabel(category: string): string {
  const found = CATEGORIES.find(c => c.value === category);
  return found?.label || category;
}

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Enable ISR with 1 minute revalidation
export const revalidate = 60;

async function getProduct(id: string) {
  try {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) return null;

    const response = await productService.getProduct(productId);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
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
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return notFound();
  }

  const productImage =
    product.images?.[0] || product.thumbnail || '/placeholder.svg';
  const isInStock = product.stock > 0;
  const hasDiscount = product.discountPercentage && product.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? product.price * (1 - (product.discountPercentage || 0) / 100)
    : product.price;

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: productImage,
    offers: {
      '@type': 'Offer',
      availability: isInStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: 'NGN',
      price: discountedPrice,
    },
  };

  return (
    <PageLayout className="bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-8">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/shop-all" className="text-muted-foreground hover:text-foreground transition-colors">Shop</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/shop-all?category=${product.category}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {getCategoryLabel(product.category)}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground font-medium">{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
              <Image
                src={productImage}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
              {hasDiscount && (
                <Badge className="absolute top-4 left-4 bg-red-500 text-white border-0">
                  -{product.discountPercentage}%
                </Badge>
              )}
              {!isInStock && (
                <Badge
                  variant="secondary"
                  className="absolute top-4 right-4 bg-black/70 text-white border-0"
                >
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square overflow-hidden rounded-xl bg-muted cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="space-y-6">
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
                  {getCategoryLabel(product.category)}
                </span>
                <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                  {product.name}
                </h1>
              </div>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-muted-foreground/30'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({product.rating.toFixed(1)}) • 127 reviews
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through">
                    {formatCurrency(product.price)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed text-base">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="flex items-center gap-2">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    isInStock ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className={`text-sm font-medium ${isInStock ? 'text-green-600' : 'text-red-600'}`}>
                  {isInStock
                    ? `${product.stock} in stock`
                    : 'Out of stock'}
                </span>
              </div>

              {/* Add to Cart */}
              <div className="pt-4">
                <AddToCart product={product} size="lg" className="rounded-full h-12 text-base px-8" />
              </div>

              {/* Features */}
              <div className="pt-8 space-y-4 border-t border-border/50 mt-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-xl">
                    <Truck className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Free Shipping</p>
                    <p className="text-sm text-muted-foreground">On orders over ₦50,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-xl">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">2 Year Warranty</p>
                    <p className="text-sm text-muted-foreground">Full manufacturer warranty</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-xl">
                    <RefreshCw className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">30-Day Returns</p>
                    <p className="text-sm text-muted-foreground">Hassle-free return policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
