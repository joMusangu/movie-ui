"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Film, Users, Calendar, BarChart3, Plus } from "lucide-react"
import { AdminMovieList } from "@/components/admin-movie-list"
import { AdminShowtimeList } from "@/components/admin-showtime-list"
import { AdminUserList } from "@/components/admin-user-list"
import { AdminReservationList } from "@/components/admin-reservation-list"
import { AdminVenueList } from "@/components/admin-venue-list"
import { adminAPI, moviesAPI } from "@/lib/api"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardStats, setDashboardStats] = useState({
    movieCount: 12,
    userCount: 245,
    todayReservations: 18,
    weeklyRevenue: 1248,
  })

  // Check if user is admin and fetch dashboard stats
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Check if the user has admin cookie
        const isAdminUser = document.cookie.includes("is_admin=true")
        setIsAdmin(isAdminUser)

        if (isAdminUser) {
          try {
            // Try to fetch dashboard stats from API
            const stats = await adminAPI.getDashboard()
            setDashboardStats({
              movieCount: stats.movie_count || 12,
              userCount: stats.user_count || 245,
              todayReservations: stats.today_reservations || 18,
              weeklyRevenue: stats.weekly_revenue || 1248,
            })
          } catch (error) {
            console.error("Error fetching dashboard stats:", error)
            // If API fails, try to at least get the movie count
            try {
              const movies = await moviesAPI.getAll()
              if (movies && movies.length > 0) {
                setDashboardStats((prev) => ({
                  ...prev,
                  movieCount: movies.length,
                }))
              }
            } catch (movieError) {
              console.error("Error fetching movie count:", movieError)
            }
          }
        }
      } finally {
        setIsLoading(false)
      }
    }

    initializeDashboard()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
          <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-8 bg-muted rounded w-1/3 mb-4"></div>
          <div className="h-64 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p className="mb-6">You do not have permission to access the admin dashboard.</p>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage movies, venues, showtimes, users, and reservations</p>
        </div>
        <div className="flex gap-4">
          <Link href="/">
            <Button variant="ghost">View Site</Button>
          </Link>
          <Link href="/admin/movies/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Movie
            </Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Movies</CardTitle>
            <Film className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.movieCount}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.userCount}</div>
            <p className="text-xs text-muted-foreground">+32 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Reservations (Today)</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardStats.todayReservations}</div>
            <p className="text-xs text-muted-foreground">+3 from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue (This Week)</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${dashboardStats.weeklyRevenue}</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="movies">
        <TabsList className="mb-6">
          <TabsTrigger value="movies">Movies</TabsTrigger>
          <TabsTrigger value="venues">Venues</TabsTrigger>
          <TabsTrigger value="showtimes">Showtimes</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="reservations">Reservations</TabsTrigger>
        </TabsList>

        <TabsContent value="movies">
          <AdminMovieList />
        </TabsContent>

        <TabsContent value="venues">
          <AdminVenueList />
        </TabsContent>

        <TabsContent value="showtimes">
          <AdminShowtimeList />
        </TabsContent>

        <TabsContent value="users">
          <AdminUserList />
        </TabsContent>

        <TabsContent value="reservations">
          <AdminReservationList />
        </TabsContent>
      </Tabs>
    </div>
  )
}
