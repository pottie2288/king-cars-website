'use client'

import * as React from "react"
import { cn } from "@/lib/utils"

interface Testimonial {
  id: number | string
  name: string
  avatar: string
  description: string
}

interface TestimonialCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  testimonials: Testimonial[]
  showArrows?: boolean
  showDots?: boolean
}

const TestimonialCarousel = React.forwardRef<HTMLDivElement, TestimonialCarouselProps>(
  ({ className, testimonials, showArrows = true, showDots = true, ...props }, ref) => {
    const [currentIndex, setCurrentIndex] = React.useState(0)

    // Touch swipe tracking — fully passive, no document listeners
    const touchStartX = React.useRef<number | null>(null)

    const prev = () => setCurrentIndex(i => (i - 1 + testimonials.length) % testimonials.length)
    const next = () => setCurrentIndex(i => (i + 1) % testimonials.length)

    const onTouchStart = (e: React.TouchEvent) => {
      touchStartX.current = e.touches[0].clientX
    }

    const onTouchEnd = (e: React.TouchEvent) => {
      if (touchStartX.current === null) return
      const delta = touchStartX.current - e.changedTouches[0].clientX
      if (Math.abs(delta) > 60) delta > 0 ? next() : prev()
      touchStartX.current = null
    }

    return (
      <div
        ref={ref}
        className={cn("h-72 w-full flex items-center justify-center", className)}
        {...props}
      >
        <div
          className="relative w-80 h-64"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {testimonials.map((testimonial, index) => {
            const offset = (index - currentIndex + testimonials.length) % testimonials.length
            const isCurrent = offset === 0
            const isPrev = offset === 1
            const isNext = offset === 2

            if (!isCurrent && !isPrev && !isNext) return null

            return (
              <div
                key={testimonial.id}
                className={cn(
                  "absolute w-full h-full rounded-2xl bg-white shadow-xl",
                  "transition-all duration-300 ease-out",
                  isCurrent ? "cursor-grab" : "pointer-events-none",
                )}
                style={{
                  zIndex: isCurrent ? 3 : isPrev ? 2 : 1,
                  transform: isCurrent
                    ? "scale(1) rotate(0deg) translateY(0)"
                    : isPrev
                    ? "scale(0.95) rotate(-2deg) translateY(8px)"
                    : "scale(0.90) rotate(-4deg) translateY(16px)",
                  opacity: isCurrent ? 1 : isPrev ? 0.6 : 0.3,
                }}
              >
                {showArrows && isCurrent && (
                  <div className="absolute inset-x-0 top-2 flex justify-between px-4">
                    <button
                      onClick={prev}
                      className="text-2xl select-none text-gray-300 hover:text-gray-400 p-1"
                      aria-label="Previous"
                    >
                      ←
                    </button>
                    <button
                      onClick={next}
                      className="text-2xl select-none text-gray-300 hover:text-gray-400 p-1"
                      aria-label="Next"
                    >
                      →
                    </button>
                  </div>
                )}

                <div className="p-6 flex flex-col items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <h3 className="text-lg font-semibold text-gray-800">{testimonial.name}</h3>
                  <p className="text-center text-sm text-gray-600">{testimonial.description}</p>
                </div>
              </div>
            )
          })}

          {showDots && (
            <div className="absolute -bottom-8 left-0 right-0 flex justify-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === currentIndex ? "bg-king-blue" : "bg-gray-300",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  },
)
TestimonialCarousel.displayName = "TestimonialCarousel"

export { TestimonialCarousel, type Testimonial }
