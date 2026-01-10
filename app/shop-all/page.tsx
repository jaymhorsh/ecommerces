"use client"

import type React from "react"
import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useProductsStore, CATEGORIES } from "@/store/products-store"
import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Search, SlidersHorizontal, Loader2, X, ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { formatCurrency, debounce } from "@/utils/helpers"
import { motion, AnimatePresence } from "motion/react"
import Link from "next/link"
import type { Product } from "@/lib/types"

const PRODUCTS_PER_PAGE = 12

// Helper to get category label
function getCategoryLabel(category: string): string {
  const found = CATEGORIES.find(c => c.value === category)
  return found?.label || category
}

// Product card skeleton for loading state
function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card animate-pulse rounded-xl">
      <div className="aspect-[4/5] w-full bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded-full w-16" />
        </div>
      </div>
    </Card>
  )
}

// Sidebar skeleton
function SidebarSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-4 bg-muted rounded w-20" />
      ))}
    </div>
  )
}

// Product card matching client style
function ShopProductCard({ product, index }: { product: Product; index: number }) {
  const { addToCart, loading } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const isOutOfStock = product.stock === 0

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isOutOfStock || isAdding || loading) return

    try {
      setIsAdding(true)
      await addToCart(product.id, 1)
    } catch (error) {
      // Error is handled by CartContext
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
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
              {getCategoryLabel(product.category)}
            </span>
            <h3 className="font-medium text-sm text-foreground mb-1 line-clamp-2">{product.name}</h3>
            
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`h-3 w-3 ${i < Math.floor(product.rating || 4.8) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30'}`} 
                />
              ))}
              <span className="text-[10px] text-muted-foreground ml-1">({product.rating || 4.8})</span>
            </div>

            <div className="flex items-center justify-between mt-auto pt-2">
              <p className="text-base font-bold text-foreground">{formatCurrency(product.price)}</p>
              <Button
                size="sm"
                variant={isOutOfStock ? "secondary" : "default"}
                disabled={isOutOfStock || isAdding || loading}
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

// Sidebar filter component
function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  priceRange,
  onPriceChange,
  onReset,
}: {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  minPrice: number
  maxPrice: number
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  onReset: () => void
}) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
          Categories
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => onCategoryChange("all")}
              className={`text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 group ${
                selectedCategory === "all"
                  ? "text-primary font-medium bg-primary/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Products
              {selectedCategory === "all" && (
                <ArrowRight className="h-3 w-3 ml-auto" />
              )}
            </button>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.value}>
              <button
                onClick={() => onCategoryChange(category.value)}
                className={`text-sm w-full text-left px-2 py-1.5 rounded-md transition-colors flex items-center gap-1 group ${
                  selectedCategory === category.value
                    ? "text-primary font-medium bg-primary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {category.label}
                {selectedCategory === category.value && (
                  <ArrowRight className="h-3 w-3 ml-auto" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">
          Price Range
        </h3>
        <div className="space-y-5">
          <Slider
            value={priceRange}
            min={minPrice}
            max={maxPrice}
            step={10}
            onValueChange={(value) => onPriceChange(value as [number, number])}
            className="w-full"
          />
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="min-price" className="text-xs text-muted-foreground block">
                Min
              </Label>
              <Input
                id="min-price"
                type="number"
                value={priceRange[0]}
                onChange={(e) => onPriceChange([Number(e.target.value), priceRange[1]])}
                className="h-9 text-sm"
              />
            </div>
            <span className="text-muted-foreground mt-6">-</span>
            <div className="flex-1 space-y-2">
              <Label htmlFor="max-price" className="text-xs text-muted-foreground block">
                Max
              </Label>
              <Input
                id="max-price"
                type="number"
                value={priceRange[1]}
                onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
                className="h-9 text-sm"
              />
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
          </p>
        </div>
      </div>

      <Separator />

      {/* Reset Filters */}
      <Button variant="outline" className="w-full" onClick={onReset}>
        <X className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  )
}

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const { 
    products, 
    isLoading, 
    error, 
    currentPage,
    totalPages,
    totalProducts,
    fetchProducts, 
    fetchByCategory, 
    searchProducts,
    setPage 
  } = useProductsStore()

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Calculate min/max prices from products
  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 1000000 }
    const prices = products.map((p) => p.price)
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.max(1000000, Math.ceil(Math.max(...prices))),
    }
  }, [products])

  // Filter products by price
  const filteredProducts = useMemo(() => {
    return products.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    )
  }, [products, priceRange])

  // Load initial data
  useEffect(() => {
    fetchProducts(PRODUCTS_PER_PAGE, 1)
  }, [fetchProducts])

  // Handle category from URL
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      fetchByCategory(categoryFromUrl, PRODUCTS_PER_PAGE, 1)
    }
  }, [searchParams, fetchByCategory])

  // Update price range when products load
  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice])
    }
  }, [minPrice, maxPrice, products.length])

  // Debounced search function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsSearching(false)
      if (query.trim()) {
        searchProducts(query, PRODUCTS_PER_PAGE)
      } else {
        fetchProducts(PRODUCTS_PER_PAGE, 1)
      }
    }, 500),
    [searchProducts, fetchProducts]
  )

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setIsSearching(true)
    debouncedSearch(value)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearching(false)
    if (search.trim()) {
      searchProducts(search, PRODUCTS_PER_PAGE)
    } else {
      fetchProducts(PRODUCTS_PER_PAGE, 1)
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setMobileFiltersOpen(false)
    if (category === "all") {
      router.push("/shop-all")
      fetchProducts(PRODUCTS_PER_PAGE, 1)
    } else {
      router.push(`/shop-all?category=${encodeURIComponent(category)}`)
      fetchByCategory(category, PRODUCTS_PER_PAGE, 1)
    }
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  const handleResetFilters = () => {
    setSelectedCategory("all")
    setSearch("")
    setPriceRange([minPrice, maxPrice])
    router.push("/shop-all")
    fetchProducts(PRODUCTS_PER_PAGE, 1)
    setMobileFiltersOpen(false)
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || isLoading) return
    
    setPage(page)
    
    if (selectedCategory !== "all") {
      fetchByCategory(selectedCategory, PRODUCTS_PER_PAGE, page)
    } else {
      fetchProducts(PRODUCTS_PER_PAGE, page)
    }
    
    // Scroll to top of products
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const handlePreviousPage = () => {
    handlePageChange(currentPage - 1)
  }

  const handleNextPage = () => {
    handlePageChange(currentPage + 1)
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisiblePages = 5
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)
      
      if (currentPage > 3) {
        pages.push("...")
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push("...")
      }
      
      // Always show last page
      if (!pages.includes(totalPages)) {
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  return (
    <div className="min-h-screen bg-background pt-24 lg:pt-28">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-foreground">Shop All</h1>
          <p className="mt-2 text-muted-foreground">
            Discover our full collection of premium products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={handleCategoryChange}
                minPrice={minPrice}
                maxPrice={maxPrice}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Products Area */}
          <div className="flex-1">
            {/* Search and Mobile Filter */}
            <div className="flex gap-3 mb-6">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 pr-10"
                  value={search}
                  onChange={handleSearchChange}
                />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                )}
              </form>

              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="lg:hidden shrink-0">
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-3 w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterSidebar
                      selectedCategory={selectedCategory}
                      onCategoryChange={handleCategoryChange}
                      minPrice={minPrice}
                      maxPrice={maxPrice}
                      priceRange={priceRange}
                      onPriceChange={handlePriceChange}
                      onReset={handleResetFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {(selectedCategory !== "all" || search) && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== "all" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleCategoryChange("all")}
                    className="gap-1"
                  >
                    {getCategoryLabel(selectedCategory)}
                    <X className="h-3 w-3" />
                  </Button>
                )}
                {search && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSearch("")
                      fetchProducts(PRODUCTS_PER_PAGE, 1)
                    }}
                    className="gap-1"
                  >
                    Search: "{search}"
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
                {error}
              </div>
            )}

            {/* Products Grid */}
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
              ) : filteredProducts.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                >
                  {filteredProducts.map((product, index) => (
                    <ShopProductCard key={product.id} product={product} index={index} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-20"
                >
                  <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline" onClick={handleResetFilters}>
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Pagination */}
            {!isLoading && totalPages > 1 && filteredProducts.length > 0 && (
              <div className="flex flex-col gap-4 pt-8 sm:flex-row sm:items-center sm:justify-between border-t border-border/50 mt-8">
                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  Showing <span className="font-semibold text-foreground">{(currentPage - 1) * PRODUCTS_PER_PAGE + 1}</span> to{' '}
                  <span className="font-semibold text-foreground">{Math.min(currentPage * PRODUCTS_PER_PAGE, totalProducts)}</span> of{' '}
                  <span className="font-semibold text-foreground">{totalProducts}</span> products
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 bg-muted/50 rounded-full px-2 py-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1 || isLoading}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {getPageNumbers().map((page, index) => (
                      typeof page === "number" ? (
                        <Button
                          key={page}
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(page)}
                          disabled={isLoading}
                          className={`h-8 w-8 rounded-full p-0 text-sm font-normal ${
                            page === currentPage 
                              ? 'bg-background shadow-sm text-foreground' 
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {page}
                        </Button>
                      ) : (
                        <span key={`ellipsis-${index}`} className="px-1 text-muted-foreground">
                          {page}
                        </span>
                      )
                    ))}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages || isLoading}
                      className="h-8 w-8 rounded-full p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
