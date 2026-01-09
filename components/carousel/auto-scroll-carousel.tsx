"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface AutoScrollCarouselProps {
  items: React.ReactNode[]
  itemWidth?: number
  gap?: number
  autoScrollInterval?: number
  pauseOnHover?: boolean
  onItemClick?: (index: number) => void
}

export const AutoScrollCarousel = ({
  items,
  itemWidth = 280,
  gap = 16,
  autoScrollInterval = 3000,
  pauseOnHover = true,
  onItemClick,
}: AutoScrollCarouselProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-scroll functionality
  useEffect(() => {
    const startAutoScroll = () => {
      if (scrollContainerRef.current && !isDragging) {
        autoScrollIntervalRef.current = setInterval(() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current
            const scrollAmount = itemWidth + gap

            // Scroll to the right
            container.scrollBy({
              left: scrollAmount,
              behavior: "smooth",
            })

            // Reset to beginning if at the end
            if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 100) {
              setTimeout(() => {
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollLeft = 0
                }
              }, 300)
            }
          }
        }, autoScrollInterval)
      }
    }

    const stopAutoScroll = () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current)
      }
    }

    startAutoScroll()

    return () => stopAutoScroll()
  }, [itemWidth, gap, autoScrollInterval, isDragging])

  // Drag functionality
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX - (scrollContainerRef.current?.offsetLeft || 0))
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
    const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 1.5 // Scroll-fast
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = scrollLeft - walk
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = itemWidth + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative group">
      {/* Left Arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-6 w-6 text-primary hover:text-primary/80 transition-colors" />
      </button>

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: itemWidth }} onClick={() => onItemClick?.(index)}>
            {item}
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-6 w-6 text-primary hover:text-primary/80 transition-colors" />
      </button>
    </div>
  )
}
