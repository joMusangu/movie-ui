"use client"

import { useState, useEffect } from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  initialRating?: number
  totalStars?: number
  size?: "sm" | "md" | "lg"
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  initialRating = 0,
  totalStars = 5,
  size = "md",
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)

  // Update internal rating when initialRating prop changes
  useEffect(() => {
    setRating(initialRating)
  }, [initialRating])

  // Determine the current display rating
  const displayRating = hoverRating || rating

  // Size classes for the stars
  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  }

  // Handle star click
  const handleStarClick = (starValue: number) => {
    if (!interactive) return

    // If clicking the same star again, remove the rating
    const newRating = starValue === rating ? 0 : starValue
    setRating(newRating)

    if (onRatingChange) {
      onRatingChange(newRating)
    }
  }

  return (
    <div className={cn("flex items-center", className)} onMouseLeave={() => interactive && setHoverRating(0)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1
        const isFilled = starValue <= displayRating

        return (
          <Star
            key={index}
            className={cn(
              sizeClasses[size],
              "transition-colors",
              isFilled ? "fill-yellow-400 text-yellow-400" : "fill-transparent text-gray-300",
              interactive && "cursor-pointer",
            )}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => interactive && setHoverRating(starValue)}
          />
        )
      })}
    </div>
  )
}
