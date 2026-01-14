export interface CheckoutFormProps {
  onSuccess: (orderId: number) => void
}

export interface CheckoutFormData {
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
