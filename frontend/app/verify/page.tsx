"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useResendVerification } from "@/hooks/auth"
import { useUserEmail } from "@/store/store"

export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)
  const [canResend, setCanResend] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const userEmail = useUserEmail()
  const resendVerificationMutation = useResendVerification()

  // Countdown timer for resend
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendTimer])

  // Start countdown on mount
  useEffect(() => {
    setResendTimer(60)
    setCanResend(false)
  }, [])

  const handleResendCode = async () => {
    if (!userEmail || !canResend) return

    try {
      await resendVerificationMutation.mutateAsync({ email: userEmail })

      toast({
        title: "✅ Code Resent Successfully",
        description: "A new verification code has been sent to your email.",
        duration: 3000,
      })

      setResendTimer(60)
      setCanResend(false)
    } catch (error: any) {
      toast({
        title: "❌ Error",
        description: error.message || "Failed to resend verification code.",
        duration: 3000,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/auth/verify-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Verification failed.")
      }

      toast({
        title: "✅ Verified Successfully",
        description: "Your email has been verified. Redirecting to your feed...",
        duration: 3000,
      })

      setCode("")
      setTimeout(() => router.push("/feed"), 2500)
    } catch (err: any) {
      setError(err.message || "An error occurred during verification.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-10">
      <div className="mb-8 text-center">
        <Image
          src="/logo.png"
          alt="Qopchiq"
          width={120}
          height={120}
          className="mx-auto"
        />
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
          Verify Your Email
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Enter the verification code sent to your email.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
      >
        <div>
          <label htmlFor="code" className="mb-2 block text-sm font-medium text-gray-700">
            Verification Code
          </label>
          <Input
            id="code"
            type="text"
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 tracking-widest text-center"
          />
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]"
          disabled={loading}
        >
          {loading ? "Verifying..." : "VERIFY EMAIL"}
        </Button>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="text-center text-sm text-gray-600">
          Didn’t receive the code?{" "}
          {canResend ? (
            <button
              type="button"
              className="font-semibold text-[#00B14F] hover:underline disabled:opacity-50"
              onClick={handleResendCode}
              disabled={resendVerificationMutation.isPending}
            >
              {resendVerificationMutation.isPending ? "Sending..." : "Resend Code"}
            </button>
          ) : (
            <span className="text-gray-500">
              Resend in ({resendTimer}s)
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
