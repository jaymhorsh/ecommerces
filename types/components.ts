import type {  ReactNode } from "react"
import { Product } from "./product"
import { CartItem } from "@/lib/types"
// import type { CartItem, Product } from "./types"

// Product Components
export interface ProductCardProps {
  product: Product
  index: number
}

export interface ProductFiltersProps {
  selectedCategory: string
  categories: Array<{ label: string; value: string }>
  minPrice: number
  maxPrice: number
  priceRange: [number, number]
  onCategoryChange: (category: string) => void
  onPriceChange: (range: [number, number]) => void
  onReset: () => void
}

// Cart Components
export interface CartItemRowProps {
  item: CartItem
  isLoading?: boolean
  onRemove: (itemId: number) => Promise<void>
  onUpdateQuantity: (itemId: number, quantity: number) => Promise<void>
}

export interface CartSummaryProps {
  subtotal: number
  tax: number
  total: number
  itemCount: number
  isLoading?: boolean
  onCheckout?: () => void
}

// Common Components
export interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  actionLabel?: string
  actionHref?: string
  actionOnClick?: () => void
  children?: ReactNode
}

export interface ErrorAlertProps {
  error: Error | string | null
  title?: string
}

export interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
}

// Auth Components
export interface LoginFormProps {
  onSuccess?: () => void
}

export interface RegisterFormProps {
  onSuccess?: () => void
}

export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialTab?: "login" | "register"
}

// Checkout Components
export interface OrderSummaryCheckoutProps {
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  isLoading?: boolean
}
