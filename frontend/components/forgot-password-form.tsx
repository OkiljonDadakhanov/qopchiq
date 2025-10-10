"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useCustomToast } from "@/components/custom-toast";
import { useForgotPassword } from "@/hooks/auth"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const forgotMutation = useForgotPassword()
  const loading = forgotMutation.status === 'pending'
  const toast = useCustomToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forgotMutation.mutateAsync({ email })

      toast.success("Email Sent", "Check your inbox for password reset instructions.")
      sessionStorage.setItem("resetEmail", email)
      router.push("/check-email")
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Something went wrong.'
      toast.error("Request Failed", message)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </Button>

      <div className="text-center">
        <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900">
          Back to Sign In
        </Link>
      </div>
    </form>
  );
}
