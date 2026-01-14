"use client"

import type React from "react"
import { useState } from "react"
import { useCreateOrderMutation } from "@/hooks"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle, Loader2, Lock, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import type { CheckoutFormProps, CheckoutFormData } from "@/types"

export function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    nameOnCard: "",
  })

  const { createOrderFn, isLoading, error } = useCreateOrderMutation()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!formData.email || !formData.firstName || !formData.address) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const response = await createOrderFn()
      onSuccess(response.data.id)
    } catch (err) {
      // Error handled by mutation
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error instanceof Error ? error.message : "Failed to process order"}</span>
        </div>
      )}

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Contact Information</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="you@example.com"
            />
          </div>
        </div>
      </Card>

      {/* Shipping Address */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Shipping Address</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="address">Address</Label>
            <Input
              type="text"
              id="address"
              name="address"
              required
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input type="text" id="city" name="city" required value={formData.city} onChange={handleInputChange} />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              name="state"
              required
              value={formData.state}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select State</option>
              <option value="LA">Lagos</option>
              <option value="AB">Abia</option>
              <option value="KN">Kano</option>
              <option value="OY">Oyo</option>
            </select>
          </div>
          <div>
            <Label htmlFor="zipCode">ZIP Code</Label>
            <Input
              type="text"
              id="zipCode"
              name="zipCode"
              required
              value={formData.zipCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </Card>

      {/* Payment Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Payment Information</h2>
        <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-300">
              This is a demo. No real payment will be processed.
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="nameOnCard">Name on Card</Label>
            <Input
              type="text"
              id="nameOnCard"
              name="nameOnCard"
              required
              value={formData.nameOnCard}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              type="text"
              id="cardNumber"
              name="cardNumber"
              required
              value={formData.cardNumber}
              onChange={handleInputChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                type="text"
                id="expiryDate"
                name="expiryDate"
                required
                value={formData.expiryDate}
                onChange={handleInputChange}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                type="text"
                id="cvv"
                name="cvv"
                required
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Submit Button */}
      <Button type="submit" size="lg" className="w-full gap-2" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CheckCircle className="h-4 w-4" />
            Place Order
          </>
        )}
      </Button>
    </form>
  )
}
