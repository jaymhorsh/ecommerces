// Navigation Types
export interface NavItem {
  label: string;
  href: string;
}

// Product Types
export interface Product {
  id: number;
  _id?: string; // Alias for id (backwards compatibility)
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  thumbnail?: string;
  image?: string; // Single image (first image or thumbnail)
  rating?: number;
  discountPercentage?: number;
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Cart {
  id: number;
  sessionId: string;
  items: CartItem[];
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product: Product;
}

export interface Order {
  id: number;
  sessionId: string;
  status: 'pending' | 'placed' | 'shipped' | 'delivered';
  subtotal: number;
  tax: number;
  total: number;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
  shipping: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Filter Types
export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
}

// Collection type for shop pages
export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
}
