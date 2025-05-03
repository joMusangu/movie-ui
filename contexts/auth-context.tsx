"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

// Define user type
export interface User {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  is_admin: boolean
  date_joined?: string
}

// Define profile update type
export interface ProfileUpdateData {
  first_name?: string
  last_name?: string
  email?: string
  current_password?: string
  new_password?: string
  username: string // Added username for identification
}

// Define auth context type
interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: ProfileUpdateData) => Promise<void>
  isAuthenticated: boolean
  isAdmin: boolean
  goToProfile: () => void
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If there's a username in localStorage, fetch that user
        const storedUsername = localStorage.getItem("username")
        if (storedUsername) {
          const userData = await authAPI.getCurrentUser(storedUsername)
          setUser(userData)
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Login function
  const login = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const userData = await authAPI.login(username, password)
      setUser(userData)
      // Store username in localStorage
      localStorage.setItem("username", username)
      console.log("Stored username in localStorage:", username) // Debug log
      toast({
        title: "Login successful",
        description: "You have been logged in successfully.",
      })
      router.push("/movies")
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      await authAPI.register(username, email, password)
      toast({
        title: "Registration successful",
        description: "Your account has been created successfully. Please log in.",
      })
      router.push("/login")
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "There was an error creating your account.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    setIsLoading(true)
    try {
      await authAPI.logout()
      setUser(null)
      // Remove username from localStorage
      localStorage.removeItem("username")
      toast({
        title: "Logout successful",
        description: "You have been logged out successfully.",
      })
      router.push("/")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update profile function
  const updateProfile = async (data: ProfileUpdateData) => {
    setIsLoading(true)
    try {
      // Get the current username from state or localStorage
      const username = user?.username || localStorage.getItem("username")

      if (!username) {
        throw new Error("No username found. Please log in again.")
      }

      // Add username to the data
      const updatedData = {
        ...data,
        username: username,
      }

      const updatedUser = await authAPI.updateUserProfile(updatedData)
      setUser((prevUser) => ({
        ...prevUser!,
        ...updatedUser,
      }))
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "There was an error updating your profile.",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const goToProfile = () => {
    // Always go to profile, regardless of authentication status
    router.push("/profile")
  }

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.is_admin || false,
    goToProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
