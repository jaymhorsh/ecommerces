import { useQuery } from "@tanstack/react-query"
import { productService } from "@/services/products"
import type { ProductFilters } from "@/lib/types"

export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ["products", filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000,
  })
}

export const useProductByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}
