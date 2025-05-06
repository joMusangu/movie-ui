"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CreditCardInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: () => void
  className?: string
}

export function CreditCardInput({ value, onChange, onComplete, className }: CreditCardInputProps) {
  const [focused, setFocused] = useState(false)

  // Format credit card number with spaces
  const formatCardNumber = (input: string) => {
    // Remove all non-digit characters
    const digits = input.replace(/\D/g, "")

    // Limit to 16 digits
    const trimmed = digits.slice(0, 16)

    // Add spaces after every 4 digits
    const formatted = trimmed.replace(/(\d{4})(?=\d)/g, "$1 ")

    return formatted
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    onChange(formatted)

    // If we have 16 digits (19 chars with spaces), trigger onComplete
    if (formatted.replace(/\s/g, "").length === 16 && onComplete) {
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
        placeholder="0000 0000 0000 0000"
        className={cn("pr-10 font-mono", focused && "border-primary")}
        maxLength={19} // 16 digits + 3 spaces
      />
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <line x1="2" x2="22" y1="10" y2="10" />
        </svg>
      </div>
    </div>
  )
}
