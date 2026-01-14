"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/auth"
// import { AuthModal } from "@/components/auth/auth-modal"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"

interface CheckoutGateProps {
  children: ReactNode
  onProceed?: () => void
}

export function CheckoutGate({ children, onProceed }: CheckoutGateProps) {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return (
      <>
        <Button onClick={() => setAuthModalOpen(true)} className="w-full" size="lg">
          Sign In to Continue
        </Button>
        {/* <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} onSuccess={onProceed} /> */}
      </>
    )
  }

  return <>{children}</>
}
