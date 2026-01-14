"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode, useMemo } from "react"
import { useAuthStore } from "@/store/auth"
import { useCartStore } from "@/store/cart"

export function Provider({ children }: { children: ReactNode }) {
   const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  )
  const {hasHydrated:authHydrated} = useAuthStore()
  const { hasHydrated: cartHydrated
  } = useCartStore()
  
  if (!authHydrated || !cartHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="border-primary h-10 w-10 animate-spin rounded-full border-3 border-t-transparent" />
      </div>
    )
  }
 

  return (
    <QueryClientProvider client={queryClient}>
     {children}
    </QueryClientProvider>
  )
}
