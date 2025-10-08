"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { useCustomToast } from "@/components/custom-toast";

export default function ResetPasswordTokenPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useCustomToast();
  const router = useRouter();
  const { token } = useParams(); // ✅ Get token from URL

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match", "Please make sure both fields match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error("Error", data.message || "Failed to reset password.");
        setLoading(false);
        return;
      }

      setIsSubmitted(true);
      toast.success("Success", "Your password has been reset successfully.");
    } catch (err: any) {
      toast.error("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Success Screen
  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00B14F]/10">
          <Lock className="h-8 w-8 text-[#00B14F]" />
        </div>
        <div>
          <h3 className="mb-2 text-xl font-bold text-gray-900">
            Password Reset Successful
          </h3>
          <p className="text-sm text-gray-600">
            You can now sign in using your new password.
          </p>
        </div>
        <Link href="/signin" className="block w-full">
          <Button className="h-12 w-full rounded-lg bg-[#00B14F] font-semibold text-white hover:bg-[#009943]">
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  // ✅ Main Reset Form
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00B14F]/10">
            <Lock className="h-8 w-8 text-[#00B14F]" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Reset Your Password</h2>
          <p className="text-sm text-gray-600">
            Enter your new password below to regain access to your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg border-gray-300 pl-10"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="text-center">
            <Link href="/signin" className="text-sm text-gray-600 hover:text-gray-900">
              Back to Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
