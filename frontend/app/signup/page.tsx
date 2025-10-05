import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { SignUpForm } from "@/components/signup-form"
import Image from "next/image"

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-6 py-3 text-sm">
      
        <div className="flex items-center gap-1">
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M2 20h4v-4H2v4zm6 0h4V10H8v10zm6 0h4V4h-4v16zm6-10v10h4V10h-4z" />
            </svg>
          </div>
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
            </svg>
          </div>
          <div className="h-3 w-3">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.67 4H14V2h-4v2H8.33C7.6 4 7 4.6 7 5.33v15.33C7 21.4 7.6 22 8.33 22h7.33c.74 0 1.34-.6 1.34-1.33V5.33C17 4.6 16.4 4 15.67 4z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="px-6 py-4">
        <Link href="/onboarding" className="inline-flex items-center text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <Image src="/logo.png" alt="Qopchiq" width={32} height={32} className="w-8 h-8" />
            <h1 className="font-serif text-3xl font-bold text-[#00B14F]">Qopchiq</h1>
          </div>
          <p className="text-sm text-gray-600">
            Save food, save money, save the planet.
            <br />
            Create your account today.
          </p>
        </div>

        <SignUpForm />
      </div>
    </div>
  )
}
