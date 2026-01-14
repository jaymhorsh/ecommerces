import { Card } from "@/components/ui/card"

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 bg-card animate-pulse rounded-xl">
      <div className="aspect-[4/5] w-full bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-muted rounded w-1/4" />
          <div className="h-8 bg-muted rounded-full w-16" />
        </div>
      </div>
    </Card>
  )
}
