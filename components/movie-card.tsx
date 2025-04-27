import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/star-rating"

interface MovieCardProps {
  id: string
  title: string
  genre: string
  imageUrl: string
  averageRating?: number
  ratingCount?: number
}

export function MovieCard({ id, title, genre, imageUrl, averageRating = 0, ratingCount = 0 }: MovieCardProps) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="aspect-[2/3] relative">
        <img src={imageUrl || "/placeholder.svg"} alt={title} className="object-cover w-full h-full" />
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
          {genre}
        </div>

        {/* Rating badge in the bottom left corner */}
        {averageRating > 0 && (
          <div className="absolute bottom-2 left-2 bg-black/70 text-white rounded-md px-2 py-1 flex items-center gap-1">
            <StarRating initialRating={averageRating} size="sm" className="mr-1" />
            <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
            {ratingCount > 0 && <span className="text-xs text-gray-300">({ratingCount})</span>}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg line-clamp-1">{title}</h3>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/movies/${id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
