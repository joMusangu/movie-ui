"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { Calendar, User, Lock } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Personal information state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [homeAddress, setHomeAddress] = useState("")
  const [isUpdatingInfo, setIsUpdatingInfo] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)

  // Password change state
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const username = localStorage.getItem("username")

        if (!username) {
          // Set default guest profile if no username is found
          setUser({
            username: "Guest",
            email: "",
            first_name: "",
            last_name: "",
            date_joined: new Date().toISOString(),
          })
          setIsLoading(false)
          return
        }

        const response = await fetch(`http://localhost:8000/api/user/profile/?username=${username}`, {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          credentials: "include",
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          setFirstName(userData.first_name || "")
          setLastName(userData.last_name || "")
          setEmail(userData.email || "")
          setHomeAddress(userData.home_address || "")
        } else {
          // Set default guest profile if API call fails
          setUser({
            username: "Guest",
            email: "",
            first_name: "",
            last_name: "",
            date_joined: new Date().toISOString(),
          })
          console.log("Using default guest profile")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        // Set default user instead of redirecting
        setUser({
          username: "Guest",
          email: "",
          first_name: "",
          last_name: "",
          date_joined: new Date().toISOString(),
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdatingInfo(true)
    setUpdateSuccess(false)

    const username = localStorage.getItem("username")

    if (!username) {
      toast({
        title: "Update failed",
        description: "You need to be logged in to update your profile.",
        variant: "destructive",
      })
      setIsUpdatingInfo(false)
      return
    }

    try {
      const response = await fetch("http://localhost:8000/api/user/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username, // Include the username
          first_name: firstName,
          last_name: lastName,
          email,
          home_address: homeAddress,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        setUpdateSuccess(true)
        toast({
          title: "Profile updated",
          description: "Your profile information has been updated successfully.",
        })

        // Reset success message after a delay
        setTimeout(() => {
          setUpdateSuccess(false)
        }, 3000)
      } else {
        // Handle unauthorized or other errors
        toast({
          title: "Update failed",
          description: "You need to be logged in to update your profile.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Update failed",
        description: "An error occurred while updating your profile.",
        variant: "destructive",
      })
    } finally {
      setIsUpdatingInfo(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")
    setPasswordSuccess(false)

    const username = localStorage.getItem("username")

    if (!username) {
      setPasswordError("You need to be logged in to change your password")
      return
    }

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    setIsChangingPassword(true)

    try {
      const response = await fetch("http://localhost:8000/api/user/profile/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: username, // Include the username
          current_password: currentPassword,
          new_password: newPassword,
        }),
      })

      if (response.ok) {
        setPasswordSuccess(true)
        toast({
          title: "Password updated",
          description: "Your password has been changed successfully.",
        })

        // Clear password fields on success
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")

        // Reset success message after a delay
        setTimeout(() => {
          setPasswordSuccess(false)
        }, 3000)
      } else {
        // Handle unauthorized or other errors
        const errorData = await response.json().catch(() => ({}))
        setPasswordError(errorData.error || "You need to be logged in to change your password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      setPasswordError("An error occurred while changing your password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>

          <div className="mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary text-primary-foreground rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.username}</CardTitle>
                    <CardDescription>
                      <div className="flex items-center mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        Member since {formatDate(user.date_joined)}
                      </div>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <Tabs defaultValue="personal-info">
            <TabsList className="mb-6">
              <TabsTrigger value="personal-info">
                <User className="w-4 h-4 mr-2" />
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal-info">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateInfo}>
                  <CardContent className="space-y-4">
                    {updateSuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>Your profile has been updated successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="home-address">Home Address</Label>
                      <Textarea
                        id="home-address"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        placeholder="Enter your home address"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" value={user.username} disabled className="bg-muted" />
                      <p className="text-sm text-muted-foreground">Username cannot be changed</p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isUpdatingInfo}>
                      {isUpdatingInfo ? "Saving..." : "Save Changes"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your password to keep your account secure</CardDescription>
                </CardHeader>
                <form onSubmit={handleChangePassword}>
                  <CardContent className="space-y-4">
                    {passwordSuccess && (
                      <Alert className="bg-green-50 text-green-800 border-green-200">
                        <AlertDescription>Your password has been changed successfully!</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter your new password"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your new password"
                        required
                      />
                      {passwordError && <p className="text-sm text-destructive">{passwordError}</p>}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isChangingPassword}>
                      {isChangingPassword ? "Changing Password..." : "Change Password"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
