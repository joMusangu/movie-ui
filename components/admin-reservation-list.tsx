"use client"

import { useState } from "react"
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

// Mock data - in a real app, this would come from your Django backend
const mockReservations = [
  {
    id: "r1",
    user: "john_doe",
    movie: "Interstellar",
    date: "2025-04-28",
    time: "18:00",
    ticketCount: 2,
    totalPrice: 24.0,
    status: "upcoming",
  },
  {
    id: "r2",
    user: "jane_smith",
    movie: "The Dark Knight",
    date: "2025-05-01",
    time: "20:30",
    ticketCount: 3,
    totalPrice: 36.0,
    status: "upcoming",
  },
  {
    id: "r3",
    user: "robert_johnson",
    movie: "Inception",
    date: "2025-04-15",
    time: "19:00",
    ticketCount: 1,
    totalPrice: 12.0,
    status: "completed",
  },
  {
    id: "r4",
    user: "sarah_williams",
    movie: "Pulp Fiction",
    date: "2025-04-20",
    time: "17:30",
    ticketCount: 2,
    totalPrice: 24.0,
    status: "completed",
  },
  {
    id: "r5",
    user: "michael_brown",
    movie: "The Godfather",
    date: "2025-04-22",
    time: "18:30",
    ticketCount: 4,
    totalPrice: 48.0,
    status: "completed",
  },
  {
    id: "r6",
    user: "emily_davis",
    movie: "Avengers: Endgame",
    date: "2025-04-30",
    time: "19:30",
    ticketCount: 2,
    totalPrice: 24.0,
    status: "upcoming",
  },
  {
    id: "r7",
    user: "david_miller",
    movie: "The Shawshank Redemption",
    date: "2025-05-02",
    time: "20:00",
    ticketCount: 1,
    totalPrice: 12.0,
    status: "upcoming",
  },
  {
    id: "r8",
    user: "john_doe",
    movie: "The Matrix",
    date: "2025-05-05",
    time: "21:00",
    ticketCount: 3,
    totalPrice: 36.0,
    status: "upcoming",
  },
]

export function AdminReservationList() {
  const [reservations, setReservations] = useState(mockReservations)
  const [searchTerm, setSearchTerm] = useState("")
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.movie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.date.includes(searchTerm),
  )

  const handleDeleteReservation = (id: string) => {
    setReservationToDelete(id)
  }

  const confirmDelete = () => {
    if (reservationToDelete) {
      // In a real app, this would be a fetch to your Django backend
      // const response = await fetch(`/api/reservations/${reservationToDelete}`, {
      //   method: 'DELETE',
      // })

      // Update local state
      setReservations(reservations.filter((reservation) => reservation.id !== reservationToDelete))

      toast({
        title: "Reservation cancelled",
        description: "The reservation has been cancelled successfully.",
      })

      setReservationToDelete(null)
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
                    <TableCell className="font-medium">{reservation.user}</TableCell>
                    <TableCell>{reservation.movie}</TableCell>
                    <TableCell>{formatDate(reservation.date)}</TableCell>
                    <TableCell>{reservation.time}</TableCell>
                    <TableCell>{reservation.ticketCount}</TableCell>
                    <TableCell>${reservation.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {reservation.status === "upcoming" ? (
                        <Badge className="bg-green-500">Upcoming</Badge>
                      ) : (
                        <Badge variant="outline">Completed</Badge>
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
