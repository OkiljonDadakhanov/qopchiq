"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCustomToast } from "@/components/custom-toast"
import { useBusinessLogin } from "@/hooks/business-auth"

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type LoginValues = z.infer<typeof loginSchema>

export default function BusinessSigninPage() {
  const router = useRouter()
  const toast = useCustomToast()
  const loginMutation = useBusinessLogin()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      await loginMutation.mutateAsync(values)
      toast.success("Welcome back", "You are now signed in to your business dashboard")
      router.push("/business/dashboard")
    } catch (error: any) {
      toast.error("Sign in failed", error?.message ?? "Unable to sign in. Please try again.")
    }
  }

  const isLoading = loginMutation.isPending || isSubmitting

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
              <h1 className="text-2xl font-bold text-gray-900 text-center">Business sign in</h1>
              <p className="text-sm text-gray-600 text-center mt-2">Welcome back to your business dashboard</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="business@example.com" autoComplete="email" {...register("email")} />
                {errors.email?.message ? (
                  <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  {...register("password")}
                />
                {errors.password?.message ? (
                  <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                ) : null}
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

              <Button type="submit" className="w-full bg-[#00B14F] hover:bg-[#009940]" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
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
