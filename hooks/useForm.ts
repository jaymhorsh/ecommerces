"use client"

import type React from "react"

import { useState, useCallback } from "react"
import type { ZodSchema } from "zod"

interface UseFormOptions<T> {
  initialValues: T
  onSubmit: (values: T) => Promise<void>
  validationSchema?: ZodSchema
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validationSchema,
}: UseFormOptions<T>) {
  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setValues((prev) => ({
        ...prev,
        [name]: value,
      }))
      // Clear error for this field on change
      if (errors[name as keyof T]) {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }))
      }
    },
    [errors],
  )

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate if schema is provided
      if (validationSchema) {
        try {
          validationSchema.parse(values)
          setErrors({})
        } catch (error: any) {
          const newErrors: Partial<Record<keyof T, string>> = {}
          error.errors?.forEach((err: any) => {
            const path = err.path[0]
            newErrors[path as keyof T] = err.message
          })
          setErrors(newErrors)
          return
        }
      }

      try {
        setIsSubmitting(true)
        await onSubmit(values)
      } catch (error) {
        // Error is handled by the callback
      } finally {
        setIsSubmitting(false)
      }
    },
    [values, onSubmit, validationSchema],
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
  }, [initialValues])

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
    setValues,
  }
}
