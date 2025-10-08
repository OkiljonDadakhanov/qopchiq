"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useCustomToast } from "@/components/custom-toast";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error("Request Failed", data.message || "Email not found.");
        setLoading(false);
        return;
      }

      toast.success("Email Sent", "Check your inbox for password reset instructions.");

      // ✅ Save email temporarily (so CheckEmail page can show it)
      sessionStorage.setItem("resetEmail", email);

      // ✅ Redirect to Check Email page
      router.push("/check-email");
    } catch (err: any) {
      toast.error("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
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
