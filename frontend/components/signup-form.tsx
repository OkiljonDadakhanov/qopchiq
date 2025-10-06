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
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!agreedToTerms) {
      setError("Please agree to the terms and policy before signing up.")
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: fullName,
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong.")
      }

      setSuccess("Account created successfully! Please verify your email.")
      setFullName("")
      setEmail("")
      setPassword("")
      setAgreedToTerms(false)
    } catch (err: any) {
      setError(err.message || "Failed to sign up.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name */}
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

      {/* Email */}
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

      {/* Password */}
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

      {/* Terms Checkbox */}
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

      {/* Submit Button */}
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]"
        disabled={loading}
      >
        {loading ? "Signing up..." : "SIGN UP"}
      </Button>

      {/* Feedback */}
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      {success && <p className="text-sm text-green-600 text-center">{success}</p>}

      {/* Footer Links */}
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
