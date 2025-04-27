"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { moviesAPI, reservationsAPI } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StarRating } from "@/components/star-rating"
import { MovieRatingForm } from "@/components/movie-rating-form"
import { MovieRatingsList } from "@/components/movie-rating-list"

interface Movie {
  id: string
  title: string
  description: string
  genre: string
  director: string
  cast: string[]
  duration: string
  poster_image: string | null
  showtimes: Showtime[]
  average_rating: number
  rating_count: number
}

interface Showtime {
  id: string
  date: string
  time: string
  available_seats: number
}

export default function MovieDetailPage() {
  const params = useParams()
  const { id } = params
  const [movie, setMovie] = useState<Movie | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null)
  const [ticketCount, setTicketCount] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("showtimes")
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  // Fetch movie details from API
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await moviesAPI.getById(id as string)
        setMovie(data)

        if (data && data.showtimes.length > 0) {
          // Set default selected date to the first available date
          const dates = Array.from(new Set<string>(data.showtimes.map((st: Showtime) => st.date)))
          setSelectedDate(dates[0])
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMovie()
    }
  }, [id, toast])

  // Get unique dates for showtimes
  const availableDates = movie ? Array.from(new Set(movie.showtimes.map((st) => st.date))) : []

  // Get showtimes for selected date
  const showtimesForDate = movie ? movie.showtimes.filter((st) => st.date === selectedDate) : []

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const handleShowtimeSelect = (showtime: Showtime) => {
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to book tickets.",
        variant: "destructive",
      })
      return
    }

    setSelectedShowtime(showtime)
    setIsDialogOpen(true)
  }

  const handleReservation = async () => {
    if (!selectedShowtime) return

    try {
      await reservationsAPI.create({
        showtimeId: selectedShowtime.id,
        ticketCount,
      })

      toast({
        title: "Reservation successful",
        description: `You have reserved ${ticketCount} ticket(s) for ${movie?.title} on ${formatDate(selectedShowtime.date)} at ${selectedShowtime.time}.`,
      })

      setIsDialogOpen(false)
      setTicketCount(1)
    } catch (error) {
      toast({
        title: "Reservation failed",
        description: "There was an error making your reservation. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle rating update
  const handleRatingSubmitted = async () => {
    if (id) {
      try {
        const updatedMovie = await moviesAPI.getById(id as string)
        setMovie(updatedMovie)
      } catch (error) {
        console.error("Error refreshing movie data:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="h-[600px] bg-muted rounded"></div>
              <div className="md:col-span-2 space-y-4">
                <div className="h-10 bg-muted rounded w-3/4"></div>
                <div className="h-6 bg-muted rounded w-1/4"></div>
                <div className="h-24 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-1/2"></div>
                <div className="h-6 bg-muted rounded w-1/3"></div>
                <div className="h-6 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!movie) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Movie Not Found</h1>
          <p className="mb-6">The movie you are looking for does not exist.</p>
          <Link href="/movies">
            <Button>Back to Movies</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/movies">
            <Button variant="ghost">← Back to Movies</Button>
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="relative">
              <img
                src={movie.poster_image || "/placeholder.svg"}
                alt={movie.title}
                className="w-full rounded-lg shadow-lg"
              />
              {movie.average_rating > 0 && (
                <div className="absolute top-4 left-4 bg-black/70 text-white rounded-md px-3 py-2 flex items-center gap-2">
                  <StarRating initialRating={movie.average_rating} size="sm" />
                  <span className="font-bold">{movie.average_rating.toFixed(1)}</span>
                  <span className="text-sm text-gray-300">({movie.rating_count})</span>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge>{movie.genre}</Badge>
              <div className="flex items-center text-muted-foreground">
                <Clock className="w-4 h-4 mr-1" />
                {movie.duration}
              </div>
            </div>

            <p className="mb-6">{movie.description}</p>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-medium">Director</p>
                  <p className="text-muted-foreground">{movie.director}</p>
                </div>
                <div>
                  <p className="font-medium">Cast</p>
                  <p className="text-muted-foreground">{movie.cast.join(", ")}</p>
                </div>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList>
                <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
                <TabsTrigger value="ratings">Ratings & Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="showtimes" className="pt-4">
                <div className="mb-4">
                  <Label htmlFor="date-select">Select Date</Label>
                  <Select value={selectedDate} onValueChange={setSelectedDate}>
                    <SelectTrigger id="date-select" className="w-full md:w-[250px]">
                      <SelectValue placeholder="Select date" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDates.map((date: string) => (
                        <SelectItem key={date} value={date}>
                          {formatDate(date)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedDate && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {showtimesForDate.map((showtime: Showtime) => (
                      <Card key={showtime.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                              <span className="font-medium">{showtime.time}</span>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {showtime.available_seats} seats available
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => handleShowtimeSelect(showtime)}
                            disabled={showtime.available_seats === 0}
                          >
                            {showtime.available_seats > 0 ? "Book Tickets" : "Sold Out"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ratings" className="pt-4">
                <div className="space-y-8">
                  {isAuthenticated && <MovieRatingForm movieId={movie.id} onRatingSubmitted={handleRatingSubmitted} />}

                  <div>
                    <h3 className="text-xl font-semibold mb-4">User Reviews</h3>
                    <MovieRatingsList movieId={movie.id} />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Tickets</DialogTitle>
              <DialogDescription>
                {selectedShowtime && (
                  <div>
                    {movie.title} on {formatDate(selectedShowtime.date)} at {selectedShowtime.time}
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ticket-count">Number of Tickets</Label>
                <Select
                  value={ticketCount.toString()}
                  onValueChange={(value) => setTicketCount(Number.parseInt(value))}
                >
                  <SelectTrigger id="ticket-count">
                    <SelectValue placeholder="Select number of tickets" />
                  </SelectTrigger>
                  <SelectContent>
                    {[...Array(Math.min(8, selectedShowtime?.available_seats || 8))].map((_, i) => {
                      const num = i + 1
                      return (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "ticket" : "tickets"}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Price per ticket:</span>
                  <span>$12.00</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${(ticketCount * 12).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReservation}>Confirm Reservation</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
