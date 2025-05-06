"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Ticket } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface PaymentSuccessProps {
  movieTitle: string
  showDate: string
  showTime: string
  venue: string
  ticketCount: number
  totalPrice: number
  reservationId: string
}

export function PaymentSuccess({
  movieTitle,
  showDate,
  showTime,
  venue,
  ticketCount,
  totalPrice,
  reservationId,
}: PaymentSuccessProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  // Countdown to redirect
  useEffect(() => {
    if (countdown <= 0) {
      router.push("/reservations")
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card className="border-green-200 shadow-lg">
        <CardHeader className="bg-green-50 text-green-700 rounded-t-lg">
          <div className="flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="h-16 w-16 text-green-500 mb-2" />
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-bold text-lg mb-2">{movieTitle}</h3>
              <p className="text-muted-foreground">
                {venue} • {showDate} • {showTime}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tickets:</span>
                <span>
                  {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Price per ticket:</span>
                <span>$12.00</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total paid:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="font-medium mb-1">Reservation ID: {reservationId}</p>
              <p>A confirmation email has been sent with your tickets and QR code.</p>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <p className="text-sm text-center text-muted-foreground">
            Redirecting to your reservations in {countdown} seconds...
          </p>
          <div className="flex gap-3 w-full">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
            <Link href="/reservations" className="flex-1">
              <Button className="w-full">
                <Ticket className="mr-2 h-4 w-4" />
                My Reservations
              </Button>
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
