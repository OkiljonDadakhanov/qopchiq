import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SignInForm } from "@/components/signin-form"
import Image from "next/image"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      

      {/* Back Button */}
      <div className="px-6 py-4">
        <Link href="/onboarding" className="inline-flex items-center text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mb-8 text-center">
          
          <h2 className="mb-2 text-2xl font-bold text-gray-900">Welcome Back!</h2>
          <p className="text-sm text-gray-600">Sign in to continue your sustainable journey.</p>
        </div>

        <SignInForm />
      </div>
    </div>
  )
}
