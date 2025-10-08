import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SignUpForm } from "@/components/signup-form";
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Back Button */}
      <div className="px-6 pt-6">
        <Link
          href="/onboarding"
          className="inline-flex items-center text-gray-800 hover:text-[#00B14F] transition-colors"
        >
          <ArrowLeft className="w-6 h-6 mr-1 fixed" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Qopchiq"
              width={120}
              height={120}
              className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32"
            />
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
  );
}
