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
import { useBusinessSignup } from "@/hooks/business-auth"

const signupSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(7, "Enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type SignupValues = z.infer<typeof signupSchema>

export default function BusinessSignupPage() {
  const router = useRouter()
  const toast = useCustomToast()
  const signupMutation = useBusinessSignup()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      password: "",
    },
  })

  const onSubmit = async (values: SignupValues) => {
    try {
      await signupMutation.mutateAsync({
        name: values.businessName.trim(),
        email: values.email.trim(),
        password: values.password,
        phoneNumber: values.phone.replace(/\s+/g, ""),
      })

      toast.success("Account created", "Check your email to verify your business account")
      router.push("/business/onboarding")
    } catch (error: any) {
      toast.error("Sign up failed", error?.message ?? "Unable to create account. Please try again.")
    }
  }

  const isLoading = signupMutation.isPending || isSubmitting

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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="businessName">Business name</Label>
                <Input
                  id="businessName"
                  type="text"
                  placeholder="Your restaurant or store name"
                  autoComplete="organization"
                  {...register("businessName")}
                />
                {errors.businessName?.message ? (
                  <p className="text-xs text-red-500 mt-1">{errors.businessName.message}</p>
                ) : null}
              </div>

              <div>
                <Label htmlFor="email">Email address</Label>
                <Input id="email" type="email" placeholder="business@example.com" autoComplete="email" {...register("email")} />
                {errors.email?.message ? <p className="text-xs text-red-500 mt-1">{errors.email.message}</p> : null}
              </div>

              <div>
                <Label htmlFor="phone">Phone number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  autoComplete="tel"
                  {...register("phone")}
                />
                {errors.phone?.message ? <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p> : null}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a secure password"
                  autoComplete="new-password"
                  {...register("password")}
                />
                {errors.password?.message ? <p className="text-xs text-red-500 mt-1">{errors.password.message}</p> : null}
              </div>

              <Button type="submit" className="w-full bg-[#00B14F] hover:bg-[#009940]" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create business account"}
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
