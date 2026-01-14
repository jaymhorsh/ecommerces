"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { InputHTMLAttributes } from "react"

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  helperText?: string
}

export function FormField({ label, error, helperText, ...props }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={props.id}>{label}</Label>
      <Input {...props} className={error ? "border-destructive" : ""} />
      {error && <p className="text-xs text-destructive">{error}</p>}
      {helperText && <p className="text-xs text-muted-foreground">{helperText}</p>}
    </div>
  )
}
