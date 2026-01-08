"use client"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset?: () => void
}) {
  return (
    <div className="mx-auto mb-4 mt-20 flex max-w-xl flex-col rounded-lg border border-border bg-white p-8 md:p-12">
      <h2 className="text-xl font-bold">Oh no!</h2>
      <p className="my-2">
        There was an issue with our storefront. This could be a temporary issue, please try your action again.
      </p>
      {error?.message && <p className="text-sm text-muted-foreground mb-4">Error: {error.message}</p>}
      <div className="flex gap-2 flex-col sm:flex-row">
        <Button size="lg" className="mt-4 flex-1" onClick={() => reset?.()} disabled={!reset}>
          Try Again
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="mt-4 flex-1 bg-transparent"
          onClick={() => (window.location.href = "/")}
        >
          Back to Home
        </Button>
      </div>
    </div>
  )
}
