export interface Product {
  id: number
  _id?: string // Alias for id (backwards compatibility)
  name: string
  description: string
  price: number
  category: string
  stock: number
  images: string[]
  thumbnail?: string
  image?: string // Single image (first image or thumbnail)
  rating?: number
  discountPercentage?: number
  createdAt: string
  updatedAt: string
}

export interface ProductFilters {
  search?: string
  category?: string
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}
