"use client";
import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock } from "lucide-react";
import { useCustomToast } from "@/components/custom-toast";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useCustomToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // if backend sets HttpOnly cookies
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        toast.error("Login Failed", data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      // ✅ Store user info in a cookie (client-side)
      document.cookie = `qopchiq_user=${encodeURIComponent(
        JSON.stringify(data.user)
      )}; path=/; max-age=${60 * 60 * 24 * 7}; secure; samesite=lax`;

      toast.success("Welcome back!", "You have successfully signed in.");

      setEmail("");
      setPassword("");

      router.push("/more");
    } catch (err: any) {
      toast.error("Login Failed", err.message || "Something went wrong.");
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
            placeholder="Email or Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-lg border-gray-300 pl-10"
          />
        </div>
      </div>

      <div>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {loading ? "Signing in..." : "SIGN IN"}
      </Button>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-semibold text-[#00B14F] hover:underline"
        >
          Forgot password?
        </Link>
        <p className="mt-4 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="font-semibold text-[#00B14F] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </form>
  );
}
