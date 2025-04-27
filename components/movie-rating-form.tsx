"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { ratingsAPI } from "@/lib/api"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MovieRatingFormProps {
  movieId: string
  onRatingSubmitted?: () => void
}

interface UserRating {
  id: string
  score: number
  comment: string | null
  created_at: string
}

export function MovieRatingForm({ movieId, onRatingSubmitted }: MovieRatingFormProps) {
  const { isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [userRating, setUserRating] = useState<number>(0)
  const [comment, setComment] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasExistingRating, setHasExistingRating] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Fetch user's existing rating if authenticated
  useEffect(() => {
    const fetchUserRating = async () => {
      if (!isAuthenticated) {
        setIsLoading(false)
        return
      }

      try {
        const data = await ratingsAPI.getUserRating(movieId)
        if (data) {
          setUserRating(data.score)
          setComment(data.comment || "")
          setHasExistingRating(true)
        }
      } catch (error) {
        // User hasn't rated this movie yet, which is fine
        console.log("No rating found for this user")
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRating()
  }, [movieId, isAuthenticated])

  const handleRatingChange = (rating: number) => {
    setUserRating(rating)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to rate this movie.",
        variant: "destructive",
      })
      return
    }

    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const method = hasExistingRating ? ratingsAPI.updateRating : ratingsAPI.submitRating
      await method(movieId, {
        score: userRating,
        comment,
      })

      setHasExistingRating(true)
      setIsSuccess(true)

      toast({
        title: "Rating submitted",
        description: hasExistingRating ? "Your rating has been updated." : "Your rating has been submitted.",
      })

      // Notify parent component that rating was submitted
      if (onRatingSubmitted) {
        onRatingSubmitted()
      }

      // Reset success message after a delay
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rate this movie</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isSuccess && (
          <Alert className="mb-4">
            <AlertDescription>Thank you for your rating!</AlertDescription>
          </Alert>
        )}

        <div>
          <p className="mb-2 font-medium">Your rating</p>
          <StarRating initialRating={userRating} interactive={true} size="lg" onRatingChange={handleRatingChange} />
        </div>

        <div>
          <p className="mb-2 font-medium">Your review (optional)</p>
          <Textarea
            placeholder="Write your thoughts about this movie..."
            value={comment}
            onChange={handleCommentChange}
            rows={4}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSubmit} disabled={isSubmitting || userRating === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : hasExistingRating ? (
            "Update Rating"
          ) : (
            "Submit Rating"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
