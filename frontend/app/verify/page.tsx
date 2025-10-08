"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"



export default function VerifyEmailPage() {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-email`, {
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
      setError(err.message || "Failed to verify email.")
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
        <h1 className="mt-4 text-2xl font-semibold text-gray-900">Verify Your Email</h1>
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
          <button
            type="button"
            className="font-semibold text-[#00B14F] hover:underline"
            onClick={() => alert("Resend code feature coming soon")}
          >
            Resend
          </button>
        </div>
      </form>
    </div>
  )
}
