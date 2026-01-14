"use client"

import { AlertCircle } from "lucide-react"

interface ErrorAlertProps {
  message: string
  onDismiss?: () => void
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button onClick={onDismiss} className="text-destructive/60 hover:text-destructive ml-auto">
          ×
        </button>
      )}
    </div>
  )
}
