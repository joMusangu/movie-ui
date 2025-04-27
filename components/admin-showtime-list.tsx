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
import { Edit, MoreVertical, Plus, Search, Trash2 } from "lucide-react"
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
const mockShowtimes = [
  {
    id: "st1",
    movie: "Interstellar",
    date: "2025-04-26",
    time: "14:30",
    capacity: 60,
    reservedSeats: 15,
  },
  {
    id: "st2",
    movie: "Interstellar",
    date: "2025-04-26",
    time: "18:00",
    capacity: 60,
    reservedSeats: 28,
  },
  {
    id: "st3",
    movie: "Interstellar",
    date: "2025-04-26",
    time: "21:30",
    capacity: 60,
    reservedSeats: 10,
  },
  {
    id: "st4",
    movie: "Interstellar",
    date: "2025-04-27",
    time: "15:00",
    capacity: 60,
    reservedSeats: 12,
  },
  {
    id: "st5",
    movie: "Interstellar",
    date: "2025-04-27",
    time: "19:30",
    capacity: 60,
    reservedSeats: 20,
  },
  {
    id: "st6",
    movie: "The Dark Knight",
    date: "2025-04-26",
    time: "15:00",
    capacity: 60,
    reservedSeats: 22,
  },
  {
    id: "st7",
    movie: "The Dark Knight",
    date: "2025-04-26",
    time: "19:00",
    capacity: 60,
    reservedSeats: 35,
  },
  {
    id: "st8",
    movie: "The Dark Knight",
    date: "2025-04-27",
    time: "16:30",
    capacity: 60,
    reservedSeats: 18,
  },
]

export function AdminShowtimeList() {
  const [showtimes, setShowtimes] = useState(mockShowtimes)
  const [searchTerm, setSearchTerm] = useState("")
  const [showtimeToDelete, setShowtimeToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredShowtimes = showtimes.filter(
    (showtime) =>
      showtime.movie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      showtime.date.includes(searchTerm) ||
      showtime.time.includes(searchTerm),
  )

  const handleDeleteShowtime = (id: string) => {
    setShowtimeToDelete(id)
  }

  const confirmDelete = () => {
    if (showtimeToDelete) {
      // In a real app, this would be a fetch to your Django backend
      // const response = await fetch(`/api/showtimes/${showtimeToDelete}`, {
      //   method: 'DELETE',
      // })

      // Update local state
      setShowtimes(showtimes.filter((showtime) => showtime.id !== showtimeToDelete))

      toast({
        title: "Showtime deleted",
        description: "The showtime has been deleted successfully.",
      })

      setShowtimeToDelete(null)
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
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search showtimes..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Showtime
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Movie</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Reserved</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShowtimes.length > 0 ? (
                filteredShowtimes.map((showtime) => (
                  <TableRow key={showtime.id}>
                    <TableCell className="font-medium">{showtime.movie}</TableCell>
                    <TableCell>{formatDate(showtime.date)}</TableCell>
                    <TableCell>{showtime.time}</TableCell>
                    <TableCell>{showtime.capacity}</TableCell>
                    <TableCell>{showtime.reservedSeats}</TableCell>
                    <TableCell>{showtime.capacity - showtime.reservedSeats}</TableCell>
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
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteShowtime(showtime.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No showtimes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!showtimeToDelete} onOpenChange={(open) => !open && setShowtimeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the showtime and all associated reservations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
