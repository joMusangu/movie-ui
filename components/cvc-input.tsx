"use client"

import type React from "react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CVCInputProps {
  value: string
  onChange: (value: string) => void
  onComplete?: () => void
  className?: string
}

export function CVCInput({ value, onChange, onComplete, className }: CVCInputProps) {
  const [focused, setFocused] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove all non-digit characters
    const digits = e.target.value.replace(/\D/g, "")

    // Limit to 3 or 4 digits (most cards use 3, Amex uses 4)
    const trimmed = digits.slice(0, 4)

    onChange(trimmed)

    // If we have 3 or 4 digits, trigger onComplete
    if ((trimmed.length === 3 || trimmed.length === 4) && onComplete) {
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
        placeholder="000"
        className={cn("font-mono", focused && "border-primary")}
        maxLength={4}
      />
    </div>
  )
}
