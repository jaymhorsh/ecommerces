
'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { X, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/utils/helpers"
import type { ProductFiltersProps } from "@/types"

export function ProductFilters({
  selectedCategory,
  categories,
  minPrice,
  maxPrice,
  priceRange,
  onCategoryChange,
  onPriceChange,
  onReset,
}: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Categories</h3>
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
              {selectedCategory === "all" && <ArrowRight className="h-3 w-3 ml-auto" />}
            </button>
          </li>
          {categories.map((category) => (
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
                {selectedCategory === category.value && <ArrowRight className="h-3 w-3 ml-auto" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-4">Price Range</h3>
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
      <Button variant="outline" className="w-full bg-transparent" onClick={onReset}>
        <X className="h-4 w-4 mr-2" />
        Reset Filters
      </Button>
    </div>
  )
}
