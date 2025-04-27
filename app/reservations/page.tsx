"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Film, Ticket } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Navbar } from "@/components/navbar"
import { reservationsAPI } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Reservation {
  id: string
  movie: {
    id: string
    title: string
    poster_image: string | null
  }
  showtime: {
    date: string
    time: string
  }
  ticket_count: number
  total_price: number
  status: string
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("upcoming")
  const { toast } = useToast()

  // Fetch user reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const data = await reservationsAPI.getUserReservations()
        setReservations(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load reservations. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [toast])

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const handleCancelReservation = async (reservationId: string) => {
    try {
      await reservationsAPI.cancel(reservationId)

      // Update local state
      setReservations(reservations.map((r) => (r.id === reservationId ? { ...r, status: "cancelled" } : r)))

      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const upcomingReservations = reservations.filter((r) => r.status === "upcoming")
  const pastReservations = reservations.filter((r) => r.status === "completed" || r.status === "cancelled")

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">My Reservations</h1>
          <p className="text-muted-foreground">Manage your movie reservations</p>
        </header>

        <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming">
              Upcoming Reservations
              {upcomingReservations.length > 0 && (
                <span className="ml-2 bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {upcomingReservations.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="past">Past Reservations</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="rounded-lg bg-muted animate-pulse h-[200px]"></div>
                ))}
              </div>
            ) : upcomingReservations.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {upcomingReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{reservation.movie.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex gap-4">
                        <img
                          src={reservation.movie.poster_image || "/placeholder.svg"}
                          alt={reservation.movie.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            {formatDate(reservation.showtime.date)}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            {reservation.showtime.time}
                          </div>
                          <div className="flex items-center text-sm">
                            <Ticket className="w-4 h-4 mr-2 text-muted-foreground" />
                            {reservation.ticket_count} {reservation.ticket_count === 1 ? "ticket" : "tickets"}
                          </div>
                          <div className="font-medium">Total: ${reservation.total_price.toFixed(2)}</div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" className="text-destructive hover:text-destructive">
                            Cancel Reservation
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will cancel your reservation for {reservation.movie.title} on{" "}
                              {formatDate(reservation.showtime.date)} at {reservation.showtime.time}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Cancel Reservation
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Ticket className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No upcoming reservations</h3>
                <p className="text-muted-foreground mb-6">You don't have any upcoming movie reservations.</p>
                <Link href="/movies">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[...Array(2)].map((_, index) => (
                  <div key={index} className="rounded-lg bg-muted animate-pulse h-[200px]"></div>
                ))}
              </div>
            ) : pastReservations.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-6">
                {pastReservations.map((reservation) => (
                  <Card key={reservation.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{reservation.movie.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-4">
                        <img
                          src={reservation.movie.poster_image || "/placeholder.svg"}
                          alt={reservation.movie.title}
                          className="w-20 h-30 object-cover rounded"
                        />
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            {formatDate(reservation.showtime.date)}
                          </div>
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                            {reservation.showtime.time}
                          </div>
                          <div className="flex items-center text-sm">
                            <Ticket className="w-4 h-4 mr-2 text-muted-foreground" />
                            {reservation.ticket_count} {reservation.ticket_count === 1 ? "ticket" : "tickets"}
                          </div>
                          <div className="font-medium">Total: ${reservation.total_price.toFixed(2)}</div>
                          <div className="text-sm">
                            Status:{" "}
                            <span className={reservation.status === "completed" ? "text-green-500" : "text-red-500"}>
                              {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Film className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No past reservations</h3>
                <p className="text-muted-foreground mb-6">You haven't watched any movies with us yet.</p>
                <Link href="/movies">
                  <Button>Browse Movies</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
