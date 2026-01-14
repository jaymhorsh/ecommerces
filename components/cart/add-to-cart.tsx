"use client"

import { PlusCircleIcon, ShoppingCart } from "lucide-react"
import { useTransition, type ReactNode } from "react"
import { Button, type ButtonProps } from "../ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Loader } from "../ui/loader"
import { useAddToCartMutation } from "@/hooks"


interface AddToCartProps extends ButtonProps {
  productId: number
  isOutOfStock: boolean
  quantity?: number
  iconOnly?: boolean
  icon?: ReactNode
  className?: string
}



export function AddToCart({
  productId,
  isOutOfStock,
  quantity = 1,
  className,
  iconOnly = false,
  icon = <PlusCircleIcon />,
  ...buttonProps
}: AddToCartProps) {
  const {addToCartFn, isLoading: addToCartLoading} =  useAddToCartMutation()
  // Handle transition state for better UX
  const [isPending, startTransition] = useTransition()
  const isLoading = isPending || addToCartLoading
  const isDisabled = isOutOfStock || isLoading

  const getButtonText = () => {
    if (isOutOfStock) return "Out Of Stock"
    return "Add To Cart"
  }

  const getLoaderSize = () => {
    const buttonSize = buttonProps.size
    if (buttonSize === "sm" || buttonSize === "icon-sm" || buttonSize === "icon") return "sm"
    if (buttonSize === "icon-lg") return "default"
    if (buttonSize === "lg") return "lg"
    return "default"
  }

  const handleAddToCart = () => {
    startTransition(async () => {
      await addToCartFn({ productId, quantity })
    })
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleAddToCart()
      }}
      className={className}
    >
      <Button
        type="submit"
        aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
        disabled={isDisabled}
        className={iconOnly ? undefined : "flex relative justify-between items-center w-full"}
        {...buttonProps}
      >
        <AnimatePresence initial={false} mode="wait">
          {iconOnly ? (
            <motion.div
              key={isLoading ? "loading" : "icon"}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center items-center"
            >
              {isLoading ? <Loader size={getLoaderSize()} /> : <span className="inline-block">{icon}</span>}
            </motion.div>
          ) : (
            <motion.div
              key={isLoading ? "loading" : getButtonText()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex justify-center items-center w-full"
            >
              {isLoading ? (
                <Loader size={getLoaderSize()} />
              ) : (
                <div className="flex justify-between items-center w-full">
                  <span>{getButtonText()}</span>
                  <ShoppingCart className="h-4 w-4" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </form>
  )
}

export default AddToCart
