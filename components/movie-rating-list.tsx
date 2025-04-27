"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { StarRating } from "@/components/star-rating"
import { ratingsAPI } from "@/lib/api"
import { Loader2, MessageSquare } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MovieRatingsListProps {
  movieId: string
}

interface Rating {
  id: string
  user: {
    id: string
    username: string
  }
  score: number
  comment: string | null
  created_at: string
}

interface RatingsData {
  average_rating: number
  rating_count: number
  ratings: Rating[]
}

export function MovieRatingsList({ movieId }: MovieRatingsListProps) {
  const [ratingsData, setRatingsData] = useState<RatingsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const data = await ratingsAPI.getMovieRatings(movieId)
        setRatingsData(data)
      } catch (error) {
        console.error("Error fetching ratings:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRatings()
  }, [movieId])

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  if (!ratingsData || ratingsData.ratings.length === 0) {
    return (
      <div className="text-center py-6">
        <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No reviews yet. Be the first to rate this movie!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center">
          <StarRating initialRating={ratingsData.average_rating} size="lg" className="mr-2" />
          <span className="text-2xl font-bold">{ratingsData.average_rating.toFixed(1)}</span>
        </div>
        <span className="text-muted-foreground">
          Based on {ratingsData.rating_count} {ratingsData.rating_count === 1 ? "review" : "reviews"}
        </span>
      </div>

      {ratingsData.ratings.map((rating) => (
        <Card key={rating.id}>
          <CardHeader className="flex flex-row items-start space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarFallback>{rating.user.username.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{rating.user.username}</p>
                <div className="flex items-center gap-2">
                  <StarRating initialRating={rating.score} size="sm" />
                  <span className="text-xs text-muted-foreground">{formatDate(rating.created_at)}</span>
                </div>
              </div>
            </div>
          </CardHeader>
          {rating.comment && (
            <CardContent>
              <p>{rating.comment}</p>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  )
}
