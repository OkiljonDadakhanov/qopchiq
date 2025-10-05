"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Password reset requested for:", email)
    // Add your password reset logic here
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00B14F]/10">
          <Mail className="h-8 w-8 text-[#00B14F]" />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">Check Your Email</h3>
          <p className="text-sm text-gray-600">
            We've sent password reset instructions to <span className="font-semibold">{email}</span>
          </p>
        </div>
        <Link href="/signin" className="block">
          <Button className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
            Back to Sign In
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
        Send Reset Link
      </Button>

      <div className="text-center">
        <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900">
          Back to Sign In
        </Link>
      </div>
    </form>
  )
}
