"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/navbar"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [adminUsername, setAdminUsername] = useState("")
  const [adminPassword, setAdminPassword] = useState("") // Empty password field that must be typed
  const { login, isLoading } = useAuth()
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState("user")
  const [debugInfo, setDebugInfo] = useState<string>("")

  // Debug: Check cookies
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const checkCookies = () => {
        setDebugInfo(`Cookies: ${document.cookie || "No cookies found"}`)
      }

      checkCookies()

      // Check cookies every 2 seconds
      const interval = setInterval(checkCookies, 2000)

      return () => clearInterval(interval)
    }
  }, [])

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(username, password)

      // Debug: Check cookies after login
      if (process.env.NODE_ENV !== "production") {
        setTimeout(() => {
          setDebugInfo(`Cookies after login: ${document.cookie || "No cookies found"}`)
          console.log("Cookies after login:", document.cookie)
        }, 500)
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please check your credentials and try again.")
    }
  }

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(adminUsername, adminPassword)

      // Debug: Check cookies after login
      if (process.env.NODE_ENV !== "production") {
        setTimeout(() => {
          setDebugInfo(`Cookies after admin login: ${document.cookie || "No cookies found"}`)
          console.log("Cookies after admin login:", document.cookie)
        }, 500)
      }
    } catch (error) {
      console.error("Admin login error:", error)
      setError("Admin login failed. Please check your credentials and try again.")
    }
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user">User</TabsTrigger>
              <TabsTrigger value="admin">Admin</TabsTrigger>
            </TabsList>

            <TabsContent value="user">
              <form onSubmit={handleUserSubmit}>
                <CardContent className="space-y-4">
                  {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Enter your username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  {/* Debug info */}
                  {process.env.NODE_ENV !== "production" && (
                    <div className="text-xs text-muted-foreground overflow-hidden break-all border p-2 rounded">
                      <p>{debugInfo}</p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-primary hover:underline">
                      Register
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={handleAdminSubmit}>
                <CardContent className="space-y-4">
                  {error && <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">{error}</div>}

                  <div className="space-y-2">
                    <Label htmlFor="admin-username">Admin Username</Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter admin username"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Admin Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter admin password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Use the admin password to access the dashboard.</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Admin Login"
                    )}
                  </Button>
                </CardFooter>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
