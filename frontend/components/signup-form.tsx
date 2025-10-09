"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, User as UserIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FormField } from "@/components/form-field"
import { useCustomToast } from "@/components/custom-toast"
import { useAppStore } from "@/store/store"
import { authApi } from "@/api/api"
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
  const setUser = useAppStore((state) => state.setUser)

  const [formData, setFormData] = useState<SignUpFormData>({
    name: "",
    email: "",
    password: "",
    agreedToTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showTermsWarning, setShowTermsWarning] = useState(false)

 

  const handleChange = (
    field: keyof SignUpFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))


    if (field === "agreedToTerms" && value) {
      setShowTermsWarning(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

   
    if (!formData.agreedToTerms) {
      setShowTermsWarning(true)
      toast.warning(
        TOAST_MESSAGES.TERMS_REQUIRED.title,
        TOAST_MESSAGES.TERMS_REQUIRED.description
      )
      return
    }

    setShowTermsWarning(false)
    setIsLoading(true)

    try {
      const { agreedToTerms, ...credentials } = formData
      const data = await authApi.signUp(credentials)

    
      if (data.success === false || !data?.accessToken) {
        throw new Error(data?.message || "Signup failed")
      }

    
      setUser({
        name: formData.name,
        email: formData.email,
        token: data.accessToken,
        isVerified: false,
      })

      toast.success(
        TOAST_MESSAGES.SUCCESS.title,
        TOAST_MESSAGES.SUCCESS.description
      )

      router.push(ROUTES.VERIFY)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Signup failed"
      toast.error(TOAST_MESSAGES.ERROR.title, message)
    } finally {
      setIsLoading(false)
    }
  }

  // ===========================
  // Render
  // ===========================

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
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
            <Link href={ROUTES.TERMS} className="text-[#00B14F] hover:underline">
              terms & policy
            </Link>
            .
          </label>
        </div>
        {showTermsWarning && (
          <p className="text-xs text-red-500 ml-8">
            Please agree before continuing.
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {isLoading ? "Signing up..." : "SIGN UP"}
      </Button>

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