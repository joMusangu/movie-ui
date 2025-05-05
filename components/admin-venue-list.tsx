"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

// Mock data for venues
const mockVenues = [
  {
    id: "1",
    name: "Lubbock",
    address: "123 Main St, Lubbock, TX",
    capacity: 180,
    screens: 6,
    weeklyRevenue: 12480,
    monthlyRevenue: 49920,
    yearlyRevenue: 599040,
  },
  {
    id: "2",
    name: "Amarillo",
    address: "456 Oak Ave, Amarillo, TX",
    capacity: 150,
    screens: 5,
    weeklyRevenue: 10250,
    monthlyRevenue: 41000,
    yearlyRevenue: 492000,
  },
  {
    id: "3",
    name: "Levelland",
    address: "789 Pine Rd, Levelland, TX",
    capacity: 120,
    screens: 4,
    weeklyRevenue: 8150,
    monthlyRevenue: 32600,
    yearlyRevenue: 391200,
  },
  {
    id: "4",
    name: "Plainview",
    address: "101 Elm St, Plainview, TX",
    capacity: 90,
    screens: 3,
    weeklyRevenue: 6300,
    monthlyRevenue: 25200,
    yearlyRevenue: 302400,
  },
  {
    id: "5",
    name: "Snyder",
    address: "202 Cedar Ln, Snyder, TX",
    capacity: 90,
    screens: 3,
    weeklyRevenue: 5980,
    monthlyRevenue: 23920,
    yearlyRevenue: 287040,
  },
  {
    id: "6",
    name: "Abilene",
    address: "303 Maple Dr, Abilene, TX",
    capacity: 150,
    screens: 5,
    weeklyRevenue: 9870,
    monthlyRevenue: 39480,
    yearlyRevenue: 473760,
  },
]

// Chart data
const revenueData = mockVenues.map((venue) => ({
  name: venue.name,
  weekly: venue.weeklyRevenue,
  monthly: venue.monthlyRevenue / 4, // Average weekly from monthly
}))

export function AdminVenueList() {
  const [venues] = useState(mockVenues)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const filteredVenues = venues.filter((venue) => venue.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Venue Revenue</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={revenueData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value) => [`$${value}`, "Revenue"]} />
                <Legend />
                <Bar dataKey="weekly" name="Weekly Revenue" fill="#8884d8" />
                <Bar dataKey="monthly" name="Avg Weekly (Monthly)" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Card>

      <Card>
        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search venues..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Venue</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Screens</TableHead>
                  <TableHead>Weekly Revenue</TableHead>
                  <TableHead>Monthly Revenue</TableHead>
                  <TableHead>Yearly Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVenues.length > 0 ? (
                  filteredVenues.map((venue) => (
                    <TableRow key={venue.id}>
                      <TableCell className="font-medium">{venue.name}</TableCell>
                      <TableCell>{venue.address}</TableCell>
                      <TableCell>{venue.capacity}</TableCell>
                      <TableCell>{venue.screens}</TableCell>
                      <TableCell>{formatCurrency(venue.weeklyRevenue)}</TableCell>
                      <TableCell>{formatCurrency(venue.monthlyRevenue)}</TableCell>
                      <TableCell>{formatCurrency(venue.yearlyRevenue)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No venues found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  )
}
