"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { PaymentSuccess } from "@/components/payment-success"
import { Navbar } from "@/components/navbar"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  // Get parameters from URL
  const movieTitle = searchParams.get("title") || "Movie"
  const showDate = searchParams.get("date") || "Date"
  const showTime = searchParams.get("time") || "Time"
  const venue = searchParams.get("venue") || "Venue"
  const ticketCount = Number.parseInt(searchParams.get("tickets") || "1", 10)
  const totalPrice = Number.parseFloat(searchParams.get("total") || "12")
  const reservationId = searchParams.get("id") || "Unknown"

  // Validate that we have the required parameters
  useEffect(() => {
    if (!searchParams.get("id")) {
      // If no reservation ID, redirect to home
      router.push("/")
    } else {
      setIsLoading(false)
    }
  }, [searchParams, router])

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-64px)]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <PaymentSuccess
        movieTitle={movieTitle}
        showDate={showDate}
        showTime={showTime}
        venue={venue}
        ticketCount={ticketCount}
        totalPrice={totalPrice}
        reservationId={reservationId}
      />
    </div>
  )
}
