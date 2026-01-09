'use client';

import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/services/products';
import type { Product, ProductFilters } from '@/lib/types';

export const useProducts = (initialFilters?: ProductFilters) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ProductFilters>(initialFilters || {});

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts(filters);
      setProducts(response.data || []);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to fetch products'
      );
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProducts,
  };
};
