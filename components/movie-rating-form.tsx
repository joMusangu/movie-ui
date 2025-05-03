"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { StarRating } from "@/components/star-rating"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
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
      const username = localStorage.getItem("username")

      if (!username) {
        setIsLoading(false)
        return
      }

      try {
        // Direct API call instead of using the ratingsAPI helper
        const response = await fetch(`http://localhost:8000/api/movies/${movieId}/ratings/user/?username=${username}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
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
  }, [movieId])

  const handleRatingChange = (rating: number) => {
    setUserRating(rating)
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
  }

  // Update the handleSubmit function to include the username
  const handleSubmit = async () => {
    if (userRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      })
      return
    }

    const username = localStorage.getItem("username")

    setIsSubmitting(true)

    try {
      // Direct fetch call with proper headers
      const url = `http://localhost:8000/api/movies/${movieId}/ratings/`
      const method = hasExistingRating ? "PUT" : "POST"

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Requested-With": "XMLHttpRequest", // This helps with CSRF protection
        },
        credentials: "include", // Important for sending cookies
        body: JSON.stringify({
          score: userRating,
          comment: comment,
          username: username, // Include the username if available
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Rating submission error:", response.status, errorData)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

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
      console.error("Error submitting rating:", error)
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
