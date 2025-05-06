"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface ExpiryDateInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: () => void
  className?: string
}

export function ExpiryDateInput({ value, onChange, onComplete, className }: ExpiryDateInputProps) {
  const [focused, setFocused] = useState(false)

  // Format expiry date as MM/YY
  const formatExpiryDate = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "")

    // Limit to 4 digits
    const trimmed = digits.slice(0, 4)

    // Add slash after first 2 digits if we have more than 2
    if (trimmed.length > 2) {
      return `${trimmed.slice(0, 2)}/${trimmed.slice(2)}`
    }

    return trimmed
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    onChange(formatted)

    // If we have 4 digits (5 chars with slash), trigger onComplete
    if (formatted.replace(/\//g, "").length === 4 && onComplete) {
      onComplete()
    }
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder="MM/YY"
        className={cn("font-mono", focused && "border-primary")}
        maxLength={5} // MM/YY = 5 chars
      />
    </div>
  )
}
