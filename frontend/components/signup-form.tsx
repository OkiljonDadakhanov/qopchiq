"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

export function SignUpForm() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Sign up submitted:", { fullName, email, password, agreedToTerms })
    // Add your sign up logic here
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <Input
          id="fullName"
          type="text"
          placeholder="Rixsimberganov Feruzbek"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="h-12 rounded-lg border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <Input
          id="email"
          type="email"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 rounded-lg border-gray-300"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          Password
        </label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 rounded-lg border-gray-300"
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
        />
        <label htmlFor="terms" className="text-sm text-gray-600">
          I understand the{" "}
          <Link href="/terms" className="text-[#00B14F] hover:underline">
            terms & policy
          </Link>
          .
        </label>
      </div>

      <Button type="submit" className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
        SIGN UP
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-500">or sign up with</p>
        <p className="mt-2 text-sm text-gray-600">
          Have an account?{" "}
          <Link href="/signin" className="font-semibold text-[#00B14F] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  )
}
