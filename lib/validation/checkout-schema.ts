import { z } from "zod"
import type { CheckoutFormData } from "@/types"

export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(3, "ZIP code is required"),
  cardNumber: z.string().min(13, "Invalid card number"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "Invalid CVV"),
  nameOnCard: z.string().min(2, "Name on card is required"),
})

export type { CheckoutFormData }
