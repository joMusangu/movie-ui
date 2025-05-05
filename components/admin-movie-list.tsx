"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
import { Edit, MoreVertical, Search, Trash2, Plus } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { moviesAPI } from "@/lib/api"

// Fallback mock data in case API fails
const mockMovies = [
  {
    id: "1",
    title: "Inception",
    genre: "Science Fiction",
    director: "Christopher Nolan",
    duration: "2h 28m",
    showtimeCount: 5,
  },
  {
    id: "2",
    title: "Minecraft: The Movie",
    genre: "Action",
    director: "Jared Hess",
    duration: "2h 15m",
    showtimeCount: 4,
  },
  {
    id: "3",
    title: "Avengers: Endgame",
    genre: "Action",
    director: "Anthony Russo",
    duration: "3h 2m",
    showtimeCount: 3,
  },
  {
    id: "4",
    title: "The Batman",
    genre: "Action",
    director: "Matt Reeves",
    duration: "2h 56m",
    showtimeCount: 2,
  },
  {
    id: "5",
    title: "Spider-Man: No Way Home",
    genre: "Adventure",
    director: "Jon Watts",
    duration: "2h 28m",
    showtimeCount: 3,
  },
  {
    id: "6",
    title: "The Lion King",
    genre: "Animation",
    director: "Jon Favreau",
    duration: "1h 58m",
    showtimeCount: 6,
  },
  {
    id: "7",
    title: "Sinners",
    genre: "Drama, Thriller",
    director: "Ryan Coogler",
    duration: "2h 10m",
    showtimeCount: 2,
  },
  {
    id: "8",
    title: "The Matrix Resurrections",
    genre: "Sci-Fi",
    director: "Lana Wachowski",
    duration: "2h 28m",
    showtimeCount: 3,
  },
  {
    id: "9",
    title: "Dune: Part Two",
    genre: "Adventure",
    director: "Denis Villeneuve",
    duration: "2h 45m",
    showtimeCount: 4,
  },
  {
    id: "10",
    title: "Oppenheimer",
    genre: "Biography, Drama, History",
    director: "Christopher Nolan",
    duration: "3h 0m",
    showtimeCount: 5,
  },
  {
    id: "11",
    title: "Guardians of the Galaxy Vol. 3",
    genre: "Action, Adventure, Comedy",
    director: "James Gunn",
    duration: "2h 30m",
    showtimeCount: 3,
  },
  {
    id: "12",
    title: "Your Name",
    genre: "Animation, Drama, Fantasy, Romance",
    director: "Makoto Shinkai",
    duration: "1h 52m",
    showtimeCount: 2,
  },
]

// Available genres for the dropdown
const genres = [
  "Action",
  "Adventure",
  "Animation",
  "Biography",
  "Comedy",
  "Drama",
  "Fantasy",
  "History",
  "Romance",
  "Sci-Fi",
  "Science Fiction",
  "Thriller",
]

export function AdminMovieList() {
  const [movies, setMovies] = useState(mockMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null)
  const [isAddMovieOpen, setIsAddMovieOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    director: "",
    duration: "",
    description: "",
  })
  const { toast } = useToast()

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesAPI.getAll()
        if (data && data.length > 0) {
          setMovies(data)
        }
      } catch (error) {
        console.error("Error fetching movies:", error)
        toast({
          title: "Error",
          description: "Failed to load movies. Using mock data instead.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [toast])

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteMovie = (id: string | number) => {
    setMovieToDelete(id.toString())
  }

  const confirmDelete = async () => {
    if (movieToDelete) {
      try {
        await moviesAPI.delete(movieToDelete)

        // Update local state
        setMovies(movies.filter((movie) => movie.id.toString() !== movieToDelete))

        toast({
          title: "Movie deleted",
          description: "The movie has been deleted successfully.",
        })
      } catch (error) {
        console.error("Error deleting movie:", error)
        toast({
          title: "Error",
          description: "Failed to delete movie. Please try again.",
          variant: "destructive",
        })
      } finally {
        setMovieToDelete(null)
      }
    }
  }

  const handleAddMovie = async () => {
    // Validate form
    if (!newMovie.title || !newMovie.genre || !newMovie.director || !newMovie.duration) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    try {
      // Create FormData for the API
      const formData = new FormData()
      formData.append("title", newMovie.title)
      formData.append("genre", newMovie.genre)
      formData.append("director", newMovie.director)
      formData.append("duration", newMovie.duration)
      formData.append("description", newMovie.description)

      const response = await moviesAPI.create(formData)

      // Add to local state
      setMovies([
        ...movies,
        {
          id: response.id,
          title: newMovie.title,
          genre: newMovie.genre,
          director: newMovie.director,
          duration: newMovie.duration,
          showtimeCount: 0,
        },
      ])

      toast({
        title: "Movie added",
        description: "The movie has been added successfully.",
      })

      // Reset form and close dialog
      setNewMovie({
        title: "",
        genre: "",
        director: "",
        duration: "",
        description: "",
      })
      setIsAddMovieOpen(false)
    } catch (error) {
      console.error("Error adding movie:", error)
      toast({
        title: "Error",
        description: "Failed to add movie. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsAddMovieOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Movie
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
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>
                  <TableHead>Director</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Showtimes</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovies.length > 0 ? (
                  filteredMovies.map((movie) => (
                    <TableRow key={movie.id}>
                      <TableCell className="font-medium">{movie.title}</TableCell>
                      <TableCell>{movie.genre}</TableCell>
                      <TableCell>{movie.director}</TableCell>
                      <TableCell>{movie.duration}</TableCell>
                      <TableCell>{movie.showtimeCount || 0}</TableCell>
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
                              <Link href={`/admin/movies/${movie.id}`} className="flex items-center w-full">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteMovie(movie.id)}>
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
                    <TableCell colSpan={6} className="h-24 text-center">
                      No movies found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Movie Dialog */}
      <AlertDialog open={!!movieToDelete} onOpenChange={(open) => !open && setMovieToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the movie and all associated showtimes and
              reservations.
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

      {/* Add Movie Dialog */}
      <Dialog open={isAddMovieOpen} onOpenChange={setIsAddMovieOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Movie</DialogTitle>
            <DialogDescription>Enter the details for the new movie.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={newMovie.title}
                onChange={(e) => setNewMovie({ ...newMovie, title: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="genre" className="text-right">
                Genre
              </Label>
              <Select value={newMovie.genre} onValueChange={(value) => setNewMovie({ ...newMovie, genre: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="director" className="text-right">
                Director
              </Label>
              <Input
                id="director"
                value={newMovie.director}
                onChange={(e) => setNewMovie({ ...newMovie, director: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right">
                Duration
              </Label>
              <Input
                id="duration"
                value={newMovie.duration}
                onChange={(e) => setNewMovie({ ...newMovie, duration: e.target.value })}
                placeholder="e.g. 2h 30m"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={newMovie.description}
                onChange={(e) => setNewMovie({ ...newMovie, description: e.target.value })}
                className="col-span-3"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMovieOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMovie}>Add Movie</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
