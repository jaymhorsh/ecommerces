"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { EmptyStateProps } from "@/types"

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  actionOnClick,
  children,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Icon className="h-16 w-16 text-muted-foreground mb-4" />
      <h2 className="text-xl font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground mb-6">{description}</p>
      {children}
      {actionLabel &&
        (actionHref ? (
          <Link href={actionHref}>
            <Button size="lg">{actionLabel}</Button>
          </Link>
        ) : (
          <Button size="lg" onClick={actionOnClick}>
            {actionLabel}
          </Button>
        ))}
    </div>
  )
}
