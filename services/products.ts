import api from '@/lib/axios-instance';
import type {
  Product,
  ApiResponse,
  PaginatedResponse,
  ProductFilters,
} from '@/lib/types';

export const productService = {
  // Get all products with optional filters
  getProducts: async (
    filters: ProductFilters = {}
  ): Promise<PaginatedResponse<Product>> => {
    const {data} = await api.get('/products', { params: filters });
    return data;
  },

  // Get a single product by ID
  getProduct: async (id: number): Promise<ApiResponse<Product>> => {
    const {data} = await api.get(`/products/${id}`);
    return data;
  },

};

export default productService;
