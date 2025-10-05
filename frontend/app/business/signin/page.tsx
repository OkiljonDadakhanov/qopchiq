"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function BusinessSigninPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.push("/business/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <Image src="/logo.png" alt="Qopchiq" width={64} height={64} className="w-16 h-16 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 text-center">Business sign in</h1>
              <p className="text-sm text-gray-600 text-center mt-2">Welcome back to your business dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="business@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                <Link href="/business/forgot-password" className="text-[#00B14F] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full bg-[#00B14F] hover:bg-[#009940]">
                Sign in
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link href="/business/signup" className="text-[#00B14F] font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
