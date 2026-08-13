'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from "@/lib/utils"

import type { GoogleReview } from '@/data/reviews'

export type { GoogleReview }

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

const AVATAR_COLORS = [
  'bg-purple-600', 'bg-blue-500', 'bg-emerald-600',
  'bg-rose-500', 'bg-amber-600', 'bg-indigo-600',
  'bg-pink-600', 'bg-teal-600',
]

function avatarColor(id: number | string): string {
  const n = typeof id === 'number'
    ? id
    : Array.from(String(id)).reduce((s, c) => s + c.charCodeAt(0), 0)
  return AVATAR_COLORS[n % AVATAR_COLORS.length]
}

function GoogleG() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" className="flex-shrink-0">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function FiveStars() {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" width="16" height="16" fill="#FBBC04" aria-hidden="true">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
      <span className="ml-1.5 inline-flex items-center justify-center w-[18px] h-[18px] rounded-full bg-blue-500 flex-shrink-0">
        <svg viewBox="0 0 10 10" width="10" height="10" fill="none" aria-hidden="true">
          <path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
  )
}

function ReviewModal({ review, onClose }: { review: GoogleReview; onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div
        className="relative bg-white rounded-2xl p-6 shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>

        <div className="flex items-start justify-between gap-2 mb-4 pr-8">
          <div className="flex items-center gap-3 min-w-0">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0",
              avatarColor(review.id)
            )}>
              {getInitials(review.name)}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 leading-tight">{review.name}</p>
              <p className="text-gray-400 text-sm mt-0.5">{review.timeAgo}</p>
            </div>
          </div>
          <GoogleG />
        </div>

        <FiveStars />

        <p className="mt-4 text-gray-700 text-sm leading-relaxed">{review.text}</p>
      </div>
    </div>
  )
}

interface GoogleReviewCarouselProps {
  reviews: GoogleReview[]
  className?: string
}

export function GoogleReviewCarousel({ reviews, className }: GoogleReviewCarouselProps) {
  const [current, setCurrent] = React.useState(0)
  const [selected, setSelected] = React.useState<GoogleReview | null>(null)
  const total = reviews.length

  const next = React.useCallback(() => setCurrent(i => (i + 1) % total), [total])
  const prev = React.useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])

  const touchX = React.useRef<number | null>(null)

  return (
    <>
      <div className={cn("relative px-10 sm:px-14", className)}>
        {/* Prev arrow */}
        <button
          onClick={prev}
          aria-label="Previous review"
          className="absolute left-0 top-1/3 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/15 hover:bg-white/30 border border-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          onTouchStart={e => { touchX.current = e.touches[0].clientX }}
          onTouchEnd={e => {
            if (touchX.current === null) return
            const d = touchX.current - e.changedTouches[0].clientX
            if (Math.abs(d) > 60) d > 0 ? next() : prev()
            touchX.current = null
          }}
        >
          {[0, 1, 2].map(offset => {
            const review = reviews[(current + offset) % total]
            return (
              <div
                key={`${current}-${offset}`}
                onClick={() => setSelected(review)}
                className={cn(
                  "bg-white rounded-2xl p-5 flex flex-col gap-3 shadow-sm cursor-pointer",
                  "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200",
                  offset === 1 && "hidden md:flex",
                  offset === 2 && "hidden lg:flex",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    {review.avatar ? (
                      <img
                        src={review.avatar}
                        alt={review.name}
                        className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className={cn(
                        "w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0",
                        avatarColor(review.id)
                      )}>
                        {getInitials(review.name)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{review.name}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{review.timeAgo}</p>
                    </div>
                  </div>
                  <GoogleG />
                </div>

                <FiveStars />

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">{review.text}</p>

                <span className="text-xs text-gray-400 mt-auto">Tap to read more</span>
              </div>
            )
          })}
        </div>

        {/* Next arrow */}
        <button
          onClick={next}
          aria-label="Next review"
          className="absolute right-0 top-1/3 -translate-y-1/2 z-10 w-9 h-9 sm:w-10 sm:h-10 bg-white/15 hover:bg-white/30 border border-white/25 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center items-center gap-1.5 mt-8">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to review ${i + 1}`}
              className={cn(
                "rounded-full transition-all duration-300",
                i === current
                  ? "w-5 h-2 bg-white"
                  : "w-2 h-2 bg-white/30 hover:bg-white/50"
              )}
            />
          ))}
        </div>
      </div>

      {selected && (
        <ReviewModal review={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
