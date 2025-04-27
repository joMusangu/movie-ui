"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Search, ShieldCheck, UserCog, UserX } from "lucide-react"
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
const mockUsers = [
  {
    id: "u1",
    username: "admin",
    email: "admin@example.com",
    isAdmin: true,
    dateJoined: "2025-01-15",
    reservationCount: 5,
  },
  {
    id: "u2",
    username: "john_doe",
    email: "john@example.com",
    isAdmin: false,
    dateJoined: "2025-02-10",
    reservationCount: 8,
  },
  {
    id: "u3",
    username: "jane_smith",
    email: "jane@example.com",
    isAdmin: false,
    dateJoined: "2025-02-15",
    reservationCount: 3,
  },
  {
    id: "u4",
    username: "robert_johnson",
    email: "robert@example.com",
    isAdmin: false,
    dateJoined: "2025-03-01",
    reservationCount: 0,
  },
  {
    id: "u5",
    username: "sarah_williams",
    email: "sarah@example.com",
    isAdmin: false,
    dateJoined: "2025-03-10",
    reservationCount: 2,
  },
  {
    id: "u6",
    username: "michael_brown",
    email: "michael@example.com",
    isAdmin: false,
    dateJoined: "2025-03-15",
    reservationCount: 1,
  },
  {
    id: "u7",
    username: "emily_davis",
    email: "emily@example.com",
    isAdmin: false,
    dateJoined: "2025-03-20",
    reservationCount: 4,
  },
  {
    id: "u8",
    username: "david_miller",
    email: "david@example.com",
    isAdmin: true,
    dateJoined: "2025-03-25",
    reservationCount: 2,
  },
]

export function AdminUserList() {
  const [users, setUsers] = useState(mockUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [userToPromote, setUserToPromote] = useState<string | null>(null)
  const [userToDemote, setUserToDemote] = useState<string | null>(null)
  const { toast } = useToast()

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handlePromoteUser = (id: string) => {
    setUserToPromote(id)
  }

  const handleDemoteUser = (id: string) => {
    setUserToDemote(id)
  }

  const confirmPromote = () => {
    if (userToPromote) {
      // In a real app, this would be a fetch to your Django backend
      // const response = await fetch(`/api/users/${userToPromote}/promote`, {
      //   method: 'POST',
      // })

      // Update local state
      setUsers(users.map((user) => (user.id === userToPromote ? { ...user, isAdmin: true } : user)))

      toast({
        title: "User promoted",
        description: "The user has been promoted to admin successfully.",
      })

      setUserToPromote(null)
    }
  }

  const confirmDemote = () => {
    if (userToDemote) {
      // In a real app, this would be a fetch to your Django backend
      // const response = await fetch(`/api/users/${userToDemote}/demote`, {
      //   method: 'POST',
      // })

      // Update local state
      setUsers(users.map((user) => (user.id === userToDemote ? { ...user, isAdmin: false } : user)))

      toast({
        title: "User demoted",
        description: "The user has been demoted from admin successfully.",
      })

      setUserToDemote(null)
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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Reservations</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {user.isAdmin ? (
                        <Badge className="bg-primary">Admin</Badge>
                      ) : (
                        <Badge variant="outline">User</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatDate(user.dateJoined)}</TableCell>
                    <TableCell>{user.reservationCount}</TableCell>
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
                          {!user.isAdmin ? (
                            <DropdownMenuItem onClick={() => handlePromoteUser(user.id)}>
                              <ShieldCheck className="mr-2 h-4 w-4" />
                              Promote to Admin
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem onClick={() => handleDemoteUser(user.id)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Remove Admin
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem>
                            <UserCog className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!userToPromote} onOpenChange={(open) => !open && setUserToPromote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Promote User to Admin</AlertDialogTitle>
            <AlertDialogDescription>
              This will give the user full administrative privileges. They will be able to manage movies, showtimes, and
              other users.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmPromote}>Promote User</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!userToDemote} onOpenChange={(open) => !open && setUserToDemote(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Admin Privileges</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove administrative privileges from the user. They will no longer be able to access the admin
              dashboard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDemote}>Remove Admin</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
