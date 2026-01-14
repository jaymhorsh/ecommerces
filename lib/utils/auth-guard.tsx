"use client"

import type React from "react"

import { useAuthStore } from "@/store/auth"
import { LoginModal } from "@/components/auth/login-modal"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface ProtectedProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export function Protected({ children, fallback }: ProtectedProps) {
  const user = useAuthStore((state) => state.user)
  const hasHydrated = useAuthStore((state) => state.hasHydrated)
  const [showLoginModal, setShowLoginModal] = useState(false)

  if (!hasHydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <>
        {fallback || (
          <div className="text-center py-20">
            <p className="text-muted-foreground">Please log in to continue</p>
          </div>
        )}
        <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      </>
    )
  }

  return <>{children}</>
}
