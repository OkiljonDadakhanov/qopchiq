"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Lock } from "lucide-react"

export function SignInForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Sign in submitted:", { email, password })
    // Add your sign in logic here
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Email or Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
      </div>

      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
      </div>

      <Button type="submit" className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
        SIGN IN
      </Button>

      <div className="text-center">
        <Link href="/forgot-password" className="text-sm font-semibold text-[#00B14F] hover:underline">
          Forgot password?
        </Link>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="font-semibold text-[#00B14F] hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  )
}
