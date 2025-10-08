"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-100 text-center space-y-6">
        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00B14F]/10">
          <Mail className="h-8 w-8 text-[#00B14F]" />
        </div>

        {/* Title & Message */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            We’ve sent a password reset link to your registered email address. <br />
            Please check your inbox (and spam folder) for instructions to reset your password.
          </p>
        </div>

        {/* CTA Button */}


        {/* Support Message */}
        <p className="text-xs text-gray-500 mt-4">
          Didn’t receive the email? Try again in a few minutes or contact{" "}
          <span className="font-medium text-[#00B14F]">support@qopchiq.uz</span>.
        </p>
      </div>
    </div>
  );
}
