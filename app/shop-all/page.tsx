export const dynamic = "force-dynamic";
 
"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Search, SlidersHorizontal, Loader2, X, ChevronLeft, ChevronRight } from "lucide-react"
import { debounce } from "@/utils/helpers"
// Remove direct import of motion/AnimatePresence from page
import { ProductCard } from "@/components/products/product-card"
import { ProductCardSkeleton } from "@/components/products/product-card-skeleton"
import { ProductFilters } from "@/components/products/product-filters"
import { ProductMotionGrid } from "@/components/products/product-motion-grid"
import { useProductsQuery } from "@/hooks/queries/useProducts"
import { CATEGORIES } from "@/lib/constants/products"
import type { ProductFilters as ProductFiltersType } from "@/lib/types"

const PRODUCTS_PER_PAGE = 12

export default function ShopAllPage() {
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<ProductFiltersType>({ limit: PRODUCTS_PER_PAGE, page: 1 })
  const { data, isLoading, error } = useProductsQuery(filters)

  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isSearching, setIsSearching] = useState(false)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const products = data?.data || []
  const totalPages = data?.pagination?.totalPages || 1
  const currentPage = filters.page || 1
  const totalProducts = data?.pagination?.total || 0

  const { minPrice, maxPrice } = useMemo(() => {
    if (products.length === 0) return { minPrice: 0, maxPrice: 1000000 }
    const prices = products.map((p) => p.price)
    return {
      minPrice: Math.floor(Math.min(...prices)),
      maxPrice: Math.max(1000000, Math.ceil(Math.max(...prices))),
    }
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])
  }, [products, priceRange])

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category")
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
      setFilters((f) => ({ ...f, category: categoryFromUrl, page: 1 }))
    }
  }, [searchParams])

  useEffect(() => {
    if (products.length > 0) {
      setPriceRange([minPrice, maxPrice])
    }
  }, [minPrice, maxPrice, products.length])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setIsSearching(false)
      if (query.trim()) {
        setFilters((f) => ({ ...f, search: query, page: 1 }))
      } else {
        setFilters((f) => ({ ...f, search: undefined, page: 1 }))
      }
    }, 500),
    [],
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
      setFilters((f) => ({ ...f, search: search.trim(), page: 1 }))
    } else {
      setFilters((f) => ({ ...f, search: undefined, page: 1 }))
    }
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setFilters((f) => ({
      ...f,
      category: category === "all" ? undefined : category,
      page: 1,
    }))
  }

  const handlePriceChange = (range: [number, number]) => {
    setPriceRange(range)
  }

  const handlePageChange = (newPage: number) => {
    setFilters((f) => ({ ...f, page: newPage }))
  }

  const handleClearFilters = () => {
    setSearch("")
    setSelectedCategory("all")
    setPriceRange([0, 1000000])
    setFilters({ limit: PRODUCTS_PER_PAGE, page: 1 })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-6">Shop All Products</h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6">
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" variant="default" disabled={isSearching}>
              {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
            </Button>
          </form>

          {/* Results count */}
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {totalProducts} products
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              categories={CATEGORIES}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              minPrice={minPrice}
              maxPrice={maxPrice}
              onReset={handleClearFilters}
            />
          </div>
          {/* Filters - Mobile */}
          <div className="lg:hidden mb-6">
            <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent" size="lg">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ProductFilters
                    categories={CATEGORIES}
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                    priceRange={priceRange}
                    onPriceChange={handlePriceChange}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onReset={handleClearFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Error State */}
            {error && (
              <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-center">
                <p className="text-destructive">Failed to load products. Please try again.</p>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(12)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}

            {/* Products */}
            {!isLoading && filteredProducts.length > 0 && (
              <>
                <ProductMotionGrid products={filteredProducts} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1
                        const isCurrentPage = page === currentPage
                        const isNearCurrent = Math.abs(page - currentPage) <= 1
                        const isFirstOrLast = page === 1 || page === totalPages

                        if (isFirstOrLast || isNearCurrent || isCurrentPage) {
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          )
                        }

                        if (isNearCurrent === false && i === 1) {
                          return (
                            <span key="ellipsis" className="px-2">
                              ...
                            </span>
                          )
                        }

                        return null
                      })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Empty State */}
            {!isLoading && filteredProducts.length === 0 && !error && (
              <div className="text-center py-12">
                <X className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
                <Button onClick={handleClearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
