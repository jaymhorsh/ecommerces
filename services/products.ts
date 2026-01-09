import api from "@/lib/axios-instance";
import type {
  Product,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
} from "@/lib/types";

export const productService = {
  /**
   * Get all products with optional filters
   */
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("products", { params: filters });
    return response.data;
  },

  /**
   * Get a single product by ID
   */
  getProduct: async (id: number): Promise<ApiResponse<Product>> => {
    const response = await api.get(`products/${id}`);
    return response.data;
  },

  /**
   * Search products by query
   */
  searchProducts: async (
    query: string,
    limit = 30
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get("products/search", {
      params: { q: query, limit },
    });
    return response.data;
  },

  /**
   * Get products by category
   */
  getProductsByCategory: async (
    category: string,
    limit = 30
  ): Promise<PaginatedResponse<Product>> => {
    const response = await api.get(`products/category/${category}`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get all categories
   */
  getCategories: async (): Promise<string[]> => {
    const response = await api.get("products/categories");
    return response.data;
  },
};

export default productService;
