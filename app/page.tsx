"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MovieCard } from "@/components/movie-card"
import { Navbar } from "@/components/navbar"
import { Search } from "lucide-react"
import { moviesAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Movie {
  id: string
  title: string
  genre: string
  poster_image: string | null
}

export default function MoviesPage() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Fetch movies from API
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await moviesAPI.getAll()
        setMovies(data)
        setFilteredMovies(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchMovies()
  }, [toast])

  // Filter movies based on search term and genre
  useEffect(() => {
    let result = movies

    if (searchTerm) {
      result = result.filter((movie) => movie.title.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedGenre && selectedGenre !== "all") {
      result = result.filter((movie) => movie.genre === selectedGenre)
    }

    setFilteredMovies(result)
  }, [searchTerm, selectedGenre, movies])

  // Get unique genres for filter
  const genres = Array.from(new Set(movies.map((movie) => movie.genre)))

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Movies</h1>
          <p className="text-muted-foreground">Browse our collection of movies</p>
        </header>

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search movies..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by genre" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genres</SelectItem>
              {genres.map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="rounded-lg bg-muted animate-pulse h-[400px]"></div>
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                genre={movie.genre}
                imageUrl={movie.poster_image || "/placeholder.svg"}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">No movies found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filter criteria</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedGenre("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
