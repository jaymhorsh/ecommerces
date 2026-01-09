"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"

export function ZustandProvider({ children }: { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return <>{children}</>
}
