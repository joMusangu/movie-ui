"use client"

import { useState } from "react"
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
import { Edit, MoreVertical, Search, Trash2 } from "lucide-react"
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
const mockMovies = [
  {
    id: "1",
    title: "Interstellar",
    genre: "Sci-Fi",
    director: "Christopher Nolan",
    duration: "2h 49m",
    showtimeCount: 5,
  },
  {
    id: "2",
    title: "The Dark Knight",
    genre: "Action",
    director: "Christopher Nolan",
    duration: "2h 32m",
    showtimeCount: 4,
  },
  {
    id: "3",
    title: "Inception",
    genre: "Thriller",
    director: "Christopher Nolan",
    duration: "2h 28m",
    showtimeCount: 3,
  },
  {
    id: "4",
    title: "Pulp Fiction",
    genre: "Crime",
    director: "Quentin Tarantino",
    duration: "2h 34m",
    showtimeCount: 2,
  },
  {
    id: "5",
    title: "The Godfather",
    genre: "Crime",
    director: "Francis Ford Coppola",
    duration: "2h 55m",
    showtimeCount: 3,
  },
  {
    id: "6",
    title: "Avengers: Endgame",
    genre: "Action",
    director: "Anthony & Joe Russo",
    duration: "3h 1m",
    showtimeCount: 6,
  },
  {
    id: "7",
    title: "The Shawshank Redemption",
    genre: "Drama",
    director: "Frank Darabont",
    duration: "2h 22m",
    showtimeCount: 2,
  },
  {
    id: "8",
    title: "The Matrix",
    genre: "Sci-Fi",
    director: "The Wachowskis",
    duration: "2h 16m",
    showtimeCount: 3,
  },
]

export function AdminMovieList() {
  const [movies, setMovies] = useState(mockMovies)
  const [searchTerm, setSearchTerm] = useState("")
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.director.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDeleteMovie = (id: string) => {
    setMovieToDelete(id)
  }

  const confirmDelete = () => {
    if (movieToDelete) {
      // In a real app, this would be a fetch to your Django backend
      // const response = await fetch(`/api/movies/${movieToDelete}`, {
      //   method: 'DELETE',
      // })

      // Update local state
      setMovies(movies.filter((movie) => movie.id !== movieToDelete))

      toast({
        title: "Movie deleted",
        description: "The movie has been deleted successfully.",
      })

      setMovieToDelete(null)
    }
  }

  return (
    <Card>
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search movies..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

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
                    <TableCell>{movie.showtimeCount}</TableCell>
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
      </div>

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
    </Card>
  )
}
