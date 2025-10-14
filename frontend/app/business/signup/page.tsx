"use client"

import type React from "react"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useBusinessRegister } from "@/hooks/business-auth"
import { useCustomToast } from "@/components/custom-toast"

const sanitizePhone = (value: string) => value.replace(/[^0-9+]/g, "")

export default function BusinessSignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: "",
    email: "",
    phone: "",
    password: "",
  })

  const toast = useCustomToast()
  const registerMutation = useBusinessRegister()

  const isSubmitting = registerMutation.isPending

  const isFormValid = useMemo(() => {
    return (
      formData.businessName.trim().length > 1 &&
      formData.email.trim().length > 3 &&
      formData.password.trim().length >= 6
    )
  }, [formData.businessName, formData.email, formData.password])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormValid || isSubmitting) {
      return
    }

    try {
      const rawPhone = sanitizePhone(formData.phone.trim())

      const payload = {
        name: formData.businessName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: rawPhone.length ? rawPhone : undefined,
      }

      await registerMutation.mutateAsync(payload)

      toast.success(
        "Account created",
        "Welcome to Qopchiq! Let’s finish setting up your business.",
      )

      router.push("/business/onboarding")
    } catch (error: any) {
      console.error("Business signup failed:", error)
      toast.error(
        "Signup failed",
        error?.message || "Unable to create your business account. Please try again.",
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8">
            <ArrowLeft className="w-4 h-4 " />
            Back to home
          </Link>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="flex flex-col items-center mb-8">
              <Image src="/logo.png" alt="Qopchiq" width={64} height={64} className="w-16 h-16 mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 text-center">Join Qopchiq as a business</h1>
              <p className="text-sm text-gray-600 text-center mt-2">Start reducing waste and earning revenue today</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your restaurant or store name"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  required
                />
              </div>

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
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className="w-full bg-[#00B14F] hover:bg-[#009940] disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                  </span>
                ) : (
                  "Create business account"
                )}
              </Button>
            </form>

            <p className="text-sm text-center text-gray-600 mt-6">
              Already have an account?{" "}
              <Link href="/business/signin" className="text-[#00B14F] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
