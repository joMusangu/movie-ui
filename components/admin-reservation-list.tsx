"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Eye, MoreVertical, Search, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

// Interface for reservation data
interface Reservation {
  id: string
  user: {
    id: string
    username: string
  }
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

export function AdminReservationList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch all reservations
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        // Since we don't have a direct API to get all reservations, we'll use a workaround
        // In a real app, you would have an admin endpoint to get all reservations

        // For now, we'll use the mock data but simulate an API call
        setTimeout(() => {
          // This is where you would normally fetch from the API
          // const data = await reservationsAPI.getAllReservations()

          // Using mock data for now
          const mockReservations = [
            {
              id: "r1",
              user: {
                id: "u1",
                username: "john_doe",
              },
              movie: {
                id: "1",
                title: "Inception",
                poster_image: null,
              },
              showtime: {
                date: "2025-04-28",
                time: "18:00",
              },
              ticket_count: 2,
              total_price: 24.0,
              status: "upcoming",
            },
            {
              id: "r2",
              user: {
                id: "u2",
                username: "jane_smith",
              },
              movie: {
                id: "2",
                title: "Minecraft: The Movie",
                poster_image: null,
              },
              showtime: {
                date: "2025-05-01",
                time: "20:30",
              },
              ticket_count: 3,
              total_price: 36.0,
              status: "upcoming",
            },
            {
              id: "r3",
              user: {
                id: "u3",
                username: "robert_johnson",
              },
              movie: {
                id: "3",
                title: "Avengers: Endgame",
                poster_image: null,
              },
              showtime: {
                date: "2025-04-15",
                time: "19:00",
              },
              ticket_count: 1,
              total_price: 12.0,
              status: "completed",
            },
            {
              id: "r4",
              user: {
                id: "u4",
                username: "sarah_williams",
              },
              movie: {
                id: "4",
                title: "The Batman",
                poster_image: null,
              },
              showtime: {
                date: "2025-04-20",
                time: "17:30",
              },
              ticket_count: 2,
              total_price: 24.0,
              status: "completed",
            },
            {
              id: "r5",
              user: {
                id: "u5",
                username: "michael_brown",
              },
              movie: {
                id: "5",
                title: "Spider-Man: No Way Home",
                poster_image: null,
              },
              showtime: {
                date: "2025-04-22",
                time: "18:30",
              },
              ticket_count: 4,
              total_price: 48.0,
              status: "completed",
            },
            {
              id: "r6",
              user: {
                id: "u6",
                username: "emily_davis",
              },
              movie: {
                id: "6",
                title: "The Lion King",
                poster_image: null,
              },
              showtime: {
                date: "2025-04-30",
                time: "19:30",
              },
              ticket_count: 2,
              total_price: 24.0,
              status: "upcoming",
            },
            {
              id: "r7",
              user: {
                id: "u7",
                username: "david_miller",
              },
              movie: {
                id: "7",
                title: "Sinners",
                poster_image: null,
              },
              showtime: {
                date: "2025-05-02",
                time: "20:00",
              },
              ticket_count: 1,
              total_price: 12.0,
              status: "upcoming",
            },
            {
              id: "r8",
              user: {
                id: "u8",
                username: "john_doe",
              },
              movie: {
                id: "8",
                title: "The Matrix Resurrections",
                poster_image: null,
              },
              showtime: {
                date: "2025-05-05",
                time: "21:00",
              },
              ticket_count: 3,
              total_price: 36.0,
              status: "upcoming",
            },
          ]

          setReservations(mockReservations)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching reservations:", error)
        toast({
          title: "Error",
          description: "Failed to load reservations. Please try again later.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchReservations()
  }, [toast])

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.showtime.date.includes(searchTerm),
  )

  const handleDeleteReservation = (id: string) => {
    setReservationToDelete(id)
  }

  const confirmDelete = async () => {
    if (reservationToDelete) {
      try {
        // In a real app, this would be a fetch to your Django backend
        // await reservationsAPI.adminCancelReservation(reservationToDelete);

        // Update local state
        setReservations(
          reservations.map((reservation) =>
            reservation.id === reservationToDelete ? { ...reservation, status: "cancelled" } : reservation,
          ),
        )

        toast({
          title: "Reservation cancelled",
          description: "The reservation has been cancelled successfully.",
        })

        setReservationToDelete(null)
      } catch (error) {
        console.error("Error cancelling reservation:", error)
        toast({
          title: "Error",
          description: "Failed to cancel reservation. Please try again.",
          variant: "destructive",
        })
        setReservationToDelete(null)
      }
    }
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  return (
    <Card>
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search reservations..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Movie</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Tickets</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReservations.length > 0 ? (
                  filteredReservations.map((reservation) => (
                    <TableRow key={reservation.id}>
                      <TableCell className="font-medium">{reservation.user.username}</TableCell>
                      <TableCell>{reservation.movie.title}</TableCell>
                      <TableCell>{formatDate(reservation.showtime.date)}</TableCell>
                      <TableCell>{reservation.showtime.time}</TableCell>
                      <TableCell>{reservation.ticket_count}</TableCell>
                      <TableCell>${reservation.total_price.toFixed(2)}</TableCell>
                      <TableCell>
                        {reservation.status === "upcoming" ? (
                          <Badge className="bg-green-500">Upcoming</Badge>
                        ) : reservation.status === "completed" ? (
                          <Badge variant="outline">Completed</Badge>
                        ) : (
                          <Badge variant="destructive">Cancelled</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            {reservation.status === "upcoming" && (
                              <DropdownMenuItem onClick={() => handleDeleteReservation(reservation.id)}>
                                <Trash2 className="mr-2 h-4 w-4" />
                                Cancel Reservation
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No reservations found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={!!reservationToDelete} onOpenChange={(open) => !open && setReservationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel the reservation and make the tickets available for other users. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Reservation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
