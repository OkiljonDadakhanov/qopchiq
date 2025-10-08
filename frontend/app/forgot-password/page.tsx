import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { ForgotPasswordForm } from "@/components/forgot-password-form"

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      
       
       

      {/* Back Button */}
      <div className="px-6 py-4">
        <Link href="/signin" className="inline-flex items-center text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Forgot Password?</h1>
          <p className="text-sm text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <ForgotPasswordForm />
      </div>
    </div>
  )
}
