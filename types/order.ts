import type { Product } from "./product"

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  quantity: number
  price: number
  product: Product
}

export interface Order {
  id: number
  sessionId: string
  status: "pending" | "placed" | "shipped" | "delivered"
  subtotal: number
  tax: number
  total: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface CreateOrderRequest {
  email: string
  firstName: string
  lastName: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber: string
  expiryDate: string
  cvv: string
  nameOnCard: string
}
