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

// ===========================
// Constants
// ===========================
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

// ===========================
// Component
// ===========================
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

  // ===========================
  // Handlers
  // ===========================
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

    console.group("🧾 Signup Form Submission")
    console.log("Form data before submission:", formData)

    // Step 1️⃣ Prevent multiple submits
    if (isSubmittingRef.current || isLoading) {
      console.warn("⚠️ Submission prevented: already in progress")
      console.groupEnd()
      return
    }

    // Step 2️⃣ Validate terms
    if (!formData.agreedToTerms) {
      setShowTermsWarning(true)
      console.warn("⚠️ Terms not accepted")
      toast.warning(
        TOAST_MESSAGES.TERMS_REQUIRED.title,
        TOAST_MESSAGES.TERMS_REQUIRED.description
      )
      console.groupEnd()
      return
    }

    setShowTermsWarning(false)
    isSubmittingRef.current = true

    try {
      console.log("📤 Sending signup request...")
      const { name, email, password } = formData
      const credentials: SignUpCredentials = { name, email, password }

      const data = await registerMutation.mutateAsync(credentials)
      console.log("✅ API response:", data)

      // Step 3️⃣ Validate response
      if (!data || data.success === false || !data.accessToken) {
        console.error("❌ Invalid response or missing token:", data)
        throw new Error(data?.message || "Signup failed")
      }

      // Step 4️⃣ Notify success
      toast.success(
        TOAST_MESSAGES.SUCCESS.title,
        TOAST_MESSAGES.SUCCESS.description
      )
      console.info("🎉 User created successfully — redirecting...")

      // Step 5️⃣ Redirect to verification
      router.push(ROUTES.VERIFY)
    } catch (error) {
      console.error("❌ Signup error:", error)
      const message = error instanceof Error ? error.message : "Signup failed"
      toast.error(TOAST_MESSAGES.ERROR.title, message)
    } finally {
      // Step 6️⃣ Reset submission guard after delay
      setTimeout(() => {
        isSubmittingRef.current = false
        console.log("🔄 Submission flag reset")
        console.groupEnd()
      }, 1000)
    }
  }

  // ===========================
  // Render
  // ===========================
  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {/* =================== Name =================== */}
      <FormField
        id="name"
        label="Full Name"
        type="text"
        placeholder="Rixsimberganov Feruzbek"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        required
        icon={<UserIcon className="h-5 w-5" />}
      />

      {/* =================== Email =================== */}
      <FormField
        id="email"
        label="Email"
        type="email"
        placeholder="example@email.com"
        value={formData.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        icon={<Mail className="h-5 w-5" />}
      />

      {/* =================== Password =================== */}
      <FormField
        id="password"
        label="Password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        icon={<Lock className="h-5 w-5" />}
      />

      {/* =================== Terms & Conditions =================== */}
      <div className="flex flex-col gap-1">
        <div
          className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
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
          <label htmlFor="terms" className="text-sm text-gray-600">
            I understand the{" "}
            <Link
              href={ROUTES.TERMS}
              className="text-[#00B14F] hover:underline"
            >
              terms & policy
            </Link>
            .
          </label>
        </div>
      </div>

      {/* =================== Submit Button =================== */}
      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || isSubmittingRef.current}
      >
        {isLoading || isSubmittingRef.current ? "Signing up..." : "SIGN UP"}
      </Button>

      {/* =================== Footer Links =================== */}
      <div className="text-center space-y-2">
        <p className="text-sm text-gray-500">or sign up with</p>
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
  )
}
