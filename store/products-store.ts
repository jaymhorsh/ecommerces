import { create } from 'zustand';
import { productService } from '@/services/products';
import type { Product, ProductFilters } from '@/lib/types';

// Hardcoded categories (no API endpoint for categories)
export const CATEGORIES = [
  { value: 'solar-panels', label: 'Solar Panels' },
  { value: 'inverters', label: 'Inverters' },
  { value: 'batteries', label: 'Batteries' },
  { value: 'accessories', label: 'Accessories' },
];

interface ProductsStore {
  products: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  // Pagination state
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;

  fetchProducts: (limit?: number, page?: number) => Promise<void>;
  searchProducts: (query: string, limit?: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchByCategory: (category: string, limit?: number, page?: number) => Promise<void>;
  setPage: (page: number) => void;
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalProducts: 0,
  limit: 12,

  setPage: (page: number) => {
    set({ currentPage: page });
  },

  fetchProducts: async (limit = 12, page = 1) => {
    try {
      set({ isLoading: true, error: null });
      // API requires page to be a positive integer (1-based)
      const validPage = Math.max(1, page);
      const filters: ProductFilters = { limit, page: validPage };
      const response = await productService.getProducts(filters);
      set({ 
        products: response.data || [],
        currentPage: validPage,
        totalPages: response.pagination?.totalPages || Math.ceil((response.pagination?.total || 0) / limit),
        totalProducts: response.pagination?.total || 0,
        limit,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to fetch products';
      console.error('[Store] Products fetch error:', msg);
      set({ error: msg, products: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  searchProducts: async (query, limit = 12) => {
    try {
      set({ isLoading: true, error: null });
      // Use main /products endpoint with search query param (same as client project)
      const filters: ProductFilters = { search: query, limit, page: 1 };
      const response = await productService.getProducts(filters);
      set({ 
        products: response.data || [],
        currentPage: 1,
        totalPages: response.pagination?.totalPages || 1,
        totalProducts: response.pagination?.total || response.data?.length || 0,
      });
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : 'Failed to search products';
      console.error('[Store] Search error:', msg);
      set({ error: msg, products: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchCategories: async () => {
    // Categories are hardcoded - no API endpoint
    // Just set from CATEGORIES constant
    set({ categories: CATEGORIES.map(c => c.value) });
  },

  fetchByCategory: async (category, limit = 12, page = 1) => {
    try {
      set({ isLoading: true, error: null });
      const validPage = Math.max(1, page);
      // Use search/category query param instead of separate endpoint
      const filters: ProductFilters = { limit, page: validPage, category };
      const response = await productService.getProducts(filters);
      set({ 
        products: response.data || [],
        currentPage: validPage,
        totalPages: response.pagination?.totalPages || 1,
        totalProducts: response.pagination?.total || response.data?.length || 0,
      });
    } catch (error) {
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to fetch category products';
      console.error('[Store] Category fetch error:', msg);
      set({ error: msg, products: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
