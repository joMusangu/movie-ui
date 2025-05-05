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
import { showtimesAPI, moviesAPI } from "@/lib/api"

// Interface for showtime data
interface Showtime {
  id: string
  movie: {
    id: string
    title: string
  }
  venue?: string
  date: string
  time: string
  capacity: number
  reserved_seats: number
  available_seats: number
}

// Interface for movie data
interface Movie {
  id: string
  title: string
}

// Available venues
const venues = ["Lubbock", "Amarillo", "Levelland", "Plainview", "Snyder", "Abilene"]

export function AdminShowtimeList() {
  const [showtimes, setShowtimes] = useState<Showtime[]>([])
  const [movies, setMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showtimeToDelete, setShowtimeToDelete] = useState<string | null>(null)
  const [isAddShowtimeOpen, setIsAddShowtimeOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newShowtime, setNewShowtime] = useState({
    movie: "",
    venue: "",
    date: "",
    time: "",
    capacity: "60",
  })
  const { toast } = useToast()

  // Fetch showtimes and movies from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch showtimes
        const showtimeData = await showtimesAPI.getAll()

        // Add venue information to showtimes (since the API doesn't provide it)
        const showtimesWithVenues = showtimeData.map((showtime: Showtime, index: number) => ({
          ...showtime,
          venue: venues[index % venues.length], // Assign venues in a round-robin fashion
        }))

        setShowtimes(showtimesWithVenues)

        // Fetch movies for the dropdown
        const movieData = await moviesAPI.getAll()
        setMovies(movieData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load showtimes. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

  const filteredShowtimes = showtimes.filter(
    (showtime) =>
      showtime.movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (showtime.venue && showtime.venue.toLowerCase().includes(searchTerm.toLowerCase())) ||
      showtime.date.includes(searchTerm) ||
      showtime.time.includes(searchTerm),
  )

  const handleDeleteShowtime = (id: string) => {
    setShowtimeToDelete(id)
  }

  const confirmDelete = async () => {
    if (showtimeToDelete) {
      try {
        await showtimesAPI.delete(showtimeToDelete)

        // Update local state
        setShowtimes(showtimes.filter((showtime) => showtime.id !== showtimeToDelete))

        toast({
          title: "Showtime deleted",
          description: "The showtime has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting showtime:", error)
        toast({
          title: "Error",
          description: "Failed to delete showtime. Please try again.",
          variant: "destructive",
        })
      } finally {
        setShowtimeToDelete(null)
      }
    }
  }

  // Update the handleAddShowtime function to handle the API response correctly
  const handleAddShowtime = async () => {
    // Validate form
    if (!newShowtime.movie || !newShowtime.venue || !newShowtime.date || !newShowtime.time) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Show loading state
      toast({
        title: "Adding showtime",
        description: "Please wait while we add the showtime...",
      })

      const response = await showtimesAPI.create({
        movieId: newShowtime.movie,
        date: newShowtime.date,
        time: newShowtime.time,
        capacity: Number.parseInt(newShowtime.capacity),
      })

      // Find the movie title
      const selectedMovie = movies.find((movie) => movie.id === newShowtime.movie)

      // Add to local state
      setShowtimes([
        ...showtimes,
        {
          id: response.id || `st${showtimes.length + 1}`,
          movie: {
            id: newShowtime.movie,
            title: selectedMovie?.title || "Unknown Movie",
          },
          venue: newShowtime.venue,
          date: newShowtime.date,
          time: newShowtime.time,
          capacity: Number.parseInt(newShowtime.capacity),
          reserved_seats: 0,
          available_seats: Number.parseInt(newShowtime.capacity),
        },
      ])

      toast({
        title: "Showtime added",
        description: "The showtime has been added successfully.",
      })

      // Reset form and close dialog
      setNewShowtime({
        movie: "",
        venue: "",
        date: "",
        time: "",
        capacity: "60",
      })
      setIsAddShowtimeOpen(false)
    } catch (error) {
      console.error("Error adding showtime:", error)
      toast({
        title: "Error",
        description: "Failed to add showtime. Please check the API endpoint and try again.",
        variant: "destructive",
      })
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
          <Button onClick={() => setIsAddShowtimeOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Showtime
          </Button>
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
                  <TableHead>Movie</TableHead>
                  <TableHead>Venue</TableHead>
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
                      <TableCell className="font-medium">{showtime.movie.title}</TableCell>
                      <TableCell>{showtime.venue}</TableCell>
                      <TableCell>{formatDate(showtime.date)}</TableCell>
                      <TableCell>{showtime.time}</TableCell>
                      <TableCell>{showtime.capacity}</TableCell>
                      <TableCell>{showtime.reserved_seats}</TableCell>
                      <TableCell>{showtime.available_seats}</TableCell>
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
                    <TableCell colSpan={8} className="h-24 text-center">
                      No showtimes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Showtime Dialog */}
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

      {/* Add Showtime Dialog */}
      <Dialog open={isAddShowtimeOpen} onOpenChange={setIsAddShowtimeOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Showtime</DialogTitle>
            <DialogDescription>Enter the details for the new showtime.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="movie" className="text-right">
                Movie
              </Label>
              <Select
                value={newShowtime.movie}
                onValueChange={(value) => setNewShowtime({ ...newShowtime, movie: value })}
              >
                <SelectTrigger id="movie" className="col-span-3">
                  <SelectValue placeholder="Select movie" />
                </SelectTrigger>
                <SelectContent>
                  {movies.map((movie) => (
                    <SelectItem key={movie.id} value={movie.id}>
                      {movie.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="venue" className="text-right">
                Venue
              </Label>
              <Select
                value={newShowtime.venue}
                onValueChange={(value) => setNewShowtime({ ...newShowtime, venue: value })}
              >
                <SelectTrigger id="venue" className="col-span-3">
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {venues.map((venue) => (
                    <SelectItem key={venue} value={venue}>
                      {venue}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={newShowtime.date}
                onChange={(e) => setNewShowtime({ ...newShowtime, date: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={newShowtime.time}
                onChange={(e) => setNewShowtime({ ...newShowtime, time: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                Capacity
              </Label>
              <Input
                id="capacity"
                type="number"
                value={newShowtime.capacity}
                onChange={(e) => setNewShowtime({ ...newShowtime, capacity: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddShowtimeOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddShowtime}>Add Showtime</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
