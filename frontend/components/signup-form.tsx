"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/form-field"
import { useCustomToast } from "@/components/custom-toast"
import { useRegister } from "@/hooks/auth"
import type { SignUpCredentials } from "@/types/types"

const ROUTES = {
  VERIFY: "/verify",
  SIGNIN: "/signin",
  TERMS: "/terms",
} as const

const TOAST_MESSAGES = {
  SUCCESS: {
    title: "Account Created",
    description: "Check your email for verification.",
  },
  TERMS_REQUIRED: {
    title: "Terms Required",
    description: "Please agree to the terms first.",
  },
  ERROR: {
    title: "Signup Failed",
  },
} as const

interface SignUpFormData extends SignUpCredentials {
  agreedToTerms: boolean
}

export function SignUpForm() {
  const router = useRouter()
  const toast = useCustomToast()
  const registerMutation = useRegister()

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    agreedToTerms: false,
  })

  const [showTermsWarning, setShowTermsWarning] = useState(false)
  const isSubmittingRef = useRef(false)
  const isLoading = registerMutation.status === "pending"

  const handleChange = (
    field: keyof SignUpFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (field === "agreedToTerms" && value) setShowTermsWarning(false)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isSubmittingRef.current || isLoading) return
    if (!formData.agreedToTerms) {
      setShowTermsWarning(true)
      toast.warning(
        TOAST_MESSAGES.TERMS_REQUIRED.title,
        TOAST_MESSAGES.TERMS_REQUIRED.description
      )
      return
    }

    setShowTermsWarning(false)
    isSubmittingRef.current = true

    try {
      const { name, email, password } = formData
      const credentials: SignUpCredentials = { name, email, password }
      const data = await registerMutation.mutateAsync(credentials)

      if (!data || data.success === false || !data.accessToken) {
        throw new Error(data?.message || "Signup failed")
      }

      toast.success(
        TOAST_MESSAGES.SUCCESS.title,
        TOAST_MESSAGES.SUCCESS.description
      )
      router.push(ROUTES.VERIFY)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed"
      toast.error(TOAST_MESSAGES.ERROR.title, message)
    } finally {
      setTimeout(() => {
        isSubmittingRef.current = false
      }, 1000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10 sm:px-6">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-md sm:p-8">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Create Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Name */}
          <FormField
            id="name"
            label="Full Name"
            type="text"
            placeholder="Rixsimberganov Feruzbek"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            icon={<UserIcon className="h-5 w-5 text-gray-500" />}
          />

          {/* Email */}
          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="example@email.com"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            icon={<Mail className="h-5 w-5 text-gray-500" />}
          />

          {/* Password */}
          <FormField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
            icon={<Lock className="h-5 w-5 text-gray-500" />}
          />

          {/* Terms */}
          <div className="flex flex-col gap-1">
            <div
              className={`flex items-start gap-2 rounded-md p-2 transition-colors ${
                showTermsWarning ? "bg-red-50 border border-red-400" : ""
              }`}
            >
              <Checkbox
                id="terms"
                checked={formData.agreedToTerms}
                onCheckedChange={(checked) =>
                  handleChange("agreedToTerms", checked as boolean)
                }
              />
              <label
                htmlFor="terms"
                className="text-sm text-gray-600 leading-snug"
              >
                I understand the{" "}
                <Link
                  href={ROUTES.TERMS}
                  className="font-medium text-[#00B14F] hover:underline"
                >
                  terms & policy
                </Link>
                .
              </label>
            </div>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943] disabled:opacity-60"
            disabled={isLoading || isSubmittingRef.current}
          >
            {isLoading || isSubmittingRef.current ? "Signing up..." : "SIGN UP"}
          </Button>

          {/* Divider */}
          <div className="flex items-center justify-center gap-2 py-2 text-sm text-gray-400">
            <div className="h-px w-1/4 bg-gray-200"></div>
            <span>or</span>
            <div className="h-px w-1/4 bg-gray-200"></div>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Have an account?{" "}
              <Link
                href={ROUTES.SIGNIN}
                className="font-semibold text-[#00B14F] hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
