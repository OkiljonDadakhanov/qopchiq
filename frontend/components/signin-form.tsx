"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FormField } from "@/components/form-field"
import { useCustomToast } from "@/components/custom-toast"
import { useAppStore } from "@/store/store"
import { useLogin } from "@/hooks/auth"
import type { LoginCredentials } from "@/types/types"

// ===========================
// Constants
// ===========================

const ROUTES = {
  FEED: "/feed",
  SIGNUP: "/signup",
  FORGOT_PASSWORD: "/forgot-password",
} as const

const TOAST_MESSAGES = {
  SUCCESS: {
    title: "Welcome back!",
    description: "You have successfully signed in.",
  },
  INVALID_CREDENTIALS: {
    title: "Invalid Credentials",
    description: "Check your email or password.",
  },
  ERROR: {
    title: "Login Failed",
    description: "An error occurred. Please try again.",
  },
} as const

// ===========================
// Component
// ===========================

export function SignInForm() {
  const router = useRouter()
  const toast = useCustomToast()
  const setUser = useAppStore((state) => state.setUser)

  const loginMutation = useLogin()

  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
  })
  const isLoading = loginMutation.status === 'pending'

  // ===========================
  // Handlers
  // ===========================

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = await loginMutation.mutateAsync(credentials)

      // Check for both success flag and token
      if (data.success === false || !data?.accessToken) {
        throw new Error(data?.message || "Invalid credentials")
      }

      setUser({
        name: data.user?.name || "User",
        email: data.user?.email || credentials.email,
        token: data.accessToken,
        isVerified: true,
      })

      toast.success(
        TOAST_MESSAGES.SUCCESS.title,
        TOAST_MESSAGES.SUCCESS.description
      )

      router.push(ROUTES.FEED)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      const isInvalidCredentials = message.toLowerCase().includes("invalid")

      if (isInvalidCredentials) {
        toast.error(
          TOAST_MESSAGES.INVALID_CREDENTIALS.title,
          TOAST_MESSAGES.INVALID_CREDENTIALS.description
        )
      } else {
        toast.error(TOAST_MESSAGES.ERROR.title, message)
      }
    }
  }

  // ===========================
  // Render
  // ===========================

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <FormField
        id="email"
        label=""
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => handleChange("email", e.target.value)}
        required
        icon={<Mail className="h-5 w-5" />}
      />

      <FormField
        id="password"
        label=""
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => handleChange("password", e.target.value)}
        required
        icon={<Lock className="h-5 w-5" />}
      />

      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Signing in..." : "SIGN IN"}
      </Button>

      <div className="text-center space-y-4">
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="text-sm font-semibold text-[#00B14F] hover:underline"
        >
          Forgot password?
        </Link>

        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href={ROUTES.SIGNUP}
            className="font-semibold text-[#00B14F] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  )
}