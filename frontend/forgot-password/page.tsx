"use client"
import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { useCustomToast } from "@/components/custom-toast"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const toast = useCustomToast()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      })

      const data = await res.json()

      // Check if the response indicates an error
      if (!res.ok || data.success === false) {
        toast.error("Request Failed", data.message || "Something went wrong.")
        setLoading(false)
        return
      }

      // Success case
      toast.success("Email Sent", "Please check your email for password reset instructions.")

      // Clear form
      setEmail("")

      // Optional: redirect to signin or stay on page
      // router.push("/signin")
    } catch (err: any) {
      toast.error("Request Failed", err.message || "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          We'll send you a link to reset your password
        </p>
      </div>

      <Button 
        type="submit" 
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]"
        disabled={loading}
      >
        {loading ? "Sending..." : "SEND RESET LINK"}
      </Button>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Remember your password?{" "}
          <Link href="/signin" className="font-semibold text-[#00B14F] hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  )
}