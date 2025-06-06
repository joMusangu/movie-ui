// Base API URL - change this to your Django backend URL
export const API_BASE_URL = "http://localhost:8000/api"

// Helper function for making API requests
export async function fetchAPI(endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${API_BASE_URL}${endpoint}`

  // Default headers
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  }

  // Include credentials to send cookies with requests
  const config: RequestInit = {
    ...options,
    headers,
    credentials: "include",
  }

  const response = await fetch(url, config)

  // Handle non-JSON responses
  const contentType = response.headers.get("content-type")
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json()

    // If the response is not ok, throw an error with the response data
    if (!response.ok) {
      throw new Error(data.error || "An error occurred")
    }

    return data
  }

  // For non-JSON responses
  if (!response.ok) {
    throw new Error("An error occurred")
  }

  return response
}

// Authentication API calls
export const authAPI = {
  login: async (username: string, password: string) => {
    try {
      // Direct fetch call with proper headers
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Login error:", response.status, errorData)
        throw new Error(errorData.error || "Invalid credentials")
      }

      return await response.json()
    } catch (error) {
      console.error("Login fetch error:", error)
      throw error
    }
  },

  register: async (username: string, email: string, password: string) => {
    return fetchAPI("/register/", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  },

  logout: async () => {
    return fetchAPI("/logout/", {
      method: "POST",
    })
  },

  getCurrentUser: async (username: string) => {
    try {
      return await fetchAPI(`/user/current/?username=${username}`)
    } catch (error) {
      return null
    }
  },

  getUserProfile: async (username: string) => {
    try {
      return await fetchAPI(`/user/profile/?username=${username}`)
    } catch (error) {
      // Return a default guest profile instead of throwing an error
      return {
        id: 0,
        username: "Guest",
        email: "",
        first_name: "",
        last_name: "",
        is_admin: false,
        date_joined: new Date().toISOString(),
      }
    }
  },

  updateUserProfile: async (data: {
    username: string
    first_name?: string
    last_name?: string
    email?: string
    current_password?: string
    new_password?: string
  }) => {
    return fetchAPI("/user/profile/", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}

// Movies API calls
export const moviesAPI = {
  getAll: async () => {
    try {
      const response = await fetchAPI("/movies/")
      // Transform the response to match the expected format if needed
      return response.map((movie: any) => ({
        ...movie,
        id: movie.id.toString(), // Ensure ID is a string for consistency
        showtimeCount: 0, // Default value since the API doesn't provide this
      }))
    } catch (error) {
      console.error("Error fetching movies:", error)
      return []
    }
  },

  getById: async (id: string) => {
    return fetchAPI(`/movies/${id}/`)
  },

  create: async (movieData: FormData) => {
    return fetchAPI("/movies/create/", {
      method: "POST",
      body: movieData,
      headers: {}, // Let the browser set the content type for FormData
    })
  },

  update: async (id: string, movieData: FormData) => {
    return fetchAPI(`/movies/${id}/update/`, {
      method: "PUT",
      body: movieData,
      headers: {}, // Let the browser set the content type for FormData
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/movies/${id}/delete/`, {
      method: "DELETE",
    })
  },
}

// Ratings API calls
export const ratingsAPI = {
  getMovieRatings: async (movieId: string) => {
    return fetchAPI(`/movies/${movieId}/ratings/`)
  },

  submitRating: async (movieId: string, data: { score: number; comment?: string; username?: string }) => {
    return fetchAPI(`/movies/${movieId}/ratings/`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  updateRating: async (movieId: string, data: { score: number; comment?: string; username?: string }) => {
    return fetchAPI(`/movies/${movieId}/ratings/`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  getUserRating: async (movieId: string, username: string) => {
    try {
      return await fetchAPI(`/movies/${movieId}/ratings/user/?username=${username}`)
    } catch (error) {
      return null
    }
  },
}

// Showtimes API calls
export const showtimesAPI = {
  getAll: async (params?: { date?: string; movieId?: string }) => {
    let queryString = ""

    if (params) {
      const queryParams = new URLSearchParams()
      if (params.date) queryParams.append("date", params.date)
      if (params.movieId) queryParams.append("movie_id", params.movieId)
      queryString = `?${queryParams.toString()}`
    }

    return fetchAPI(`/showtimes/${queryString}`)
  },

  create: async (data: {
    movieId: string
    date: string
    time: string
    capacity?: number
  }) => {
    // Use the correct endpoint as specified
    return fetchAPI("/showtimes/create/", {
      method: "POST",
      body: JSON.stringify({
        movie_id: data.movieId,
        date: data.date,
        time: data.time,
        capacity: data.capacity || 60,
      }),
    })
  },

  delete: async (id: string) => {
    return fetchAPI(`/showtimes/${id}/delete/`, {
      method: "DELETE",
    })
  },
}

// Reservations API calls
export const reservationsAPI = {
  create: async (data: { showtimeId: string; ticketCount: number; username: string }) => {
    return fetchAPI("/reservations/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  getUserReservations: async (username: string) => {
    return fetchAPI(`/reservations/user/?username=${username}`)
  },

  cancel: async (id: string, username: string) => {
    return fetchAPI(`/reservations/${id}/cancel/`, {
      method: "DELETE",
      body: JSON.stringify({ username }),
    })
  },
}

// Admin API calls
export const adminAPI = {
  getDashboard: async () => {
    return fetchAPI("/admin/dashboard/")
  },

  promoteUser: async (userId: string) => {
    return fetchAPI(`/admin/users/${userId}/promote/`, {
      method: "POST",
    })
  },

  demoteUser: async (userId: string, adminUsername: string) => {
    return fetchAPI(`/admin/users/${userId}/demote/`, {
      method: "POST",
      body: JSON.stringify({ admin_username: adminUsername }),
    })
  },
}
