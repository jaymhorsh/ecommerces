// Common types used across the app
export interface NavItem {
  label: string
  href: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}
