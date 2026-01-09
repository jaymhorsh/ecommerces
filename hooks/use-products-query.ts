'use client';

import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/products';
import type { ProductFilters } from '@/lib/types';

/**
 * Hook to fetch all products with optional filters
 */
export const useProductsQuery = (filters: ProductFilters = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to search products
 */
export const useSearchProductsQuery = (query: string, limit = 30) => {
  return useQuery({
    queryKey: ['products', 'search', query, limit],
    queryFn: () => productService.searchProducts(query, limit),
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Hook to fetch a single product by ID
 */
export const useProductByIdQuery = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to fetch all categories
 */
export const useCategoriesQuery = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutes - categories don't change often
  });
};

/**
 * Hook to fetch products by category
 */
export const useProductsByCategoryQuery = (category: string, limit = 30) => {
  return useQuery({
    queryKey: ['products', 'category', category, limit],
    queryFn: () => productService.getProductsByCategory(category, limit),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
  });
};
