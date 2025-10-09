"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Package, Mail, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCustomToast } from "@/components/custom-toast";

export default function MorePage() {
  const router = useRouter();
  const toast = useCustomToast();
  const [showCO2Modal, setShowCO2Modal] = useState(false);
  const [fullName, setFullName] = useState<string>("User");

  // ✅ Read user info if available, else redirect
  useEffect(() => {
    try {
      const token = localStorage.getItem("qopchiq_token");
      if (!token) {
        router.push("/signin");
        return;
      }

      // Optional: still load user name from cookie if available
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith("qopchiq_user="));
      if (cookie) {
        const user = JSON.parse(decodeURIComponent(cookie.split("=")[1]));
        setFullName(user.name || "User");
      }
    } catch {
      setFullName("User");
    }
  }, [router]);

  // ✅ Logout logic
  const handleLogout = () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem("qopchiq_token");

      // Remove old cookie (if still exists)
      document.cookie =
        "qopchiq_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      toast.success("Logged out", "You have successfully signed out.");
      router.push("/signin");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout Failed", "Something went wrong while logging out.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">
            Hey, {fullName ? fullName.split(" ")[0] : "User"}!
          </h1>
          <button
            onClick={() => router.push("/profile")}
            className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
          >
            <User className="w-6 h-6 text-[#00B14F]" />
          </button>
        </div>

        {/* Impact Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Your impact in numbers!</h2>
          <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-lg font-semibold mb-1">What does saving</p>
                <p className="text-lg font-semibold">0 kg of CO₂ really mean?</p>
                <button className="text-sm text-[#00B14F] underline mt-2">
                  Find out!
                </button>
              </div>
              <div className="text-6xl">🌍</div>
            </div>
          </div>

          <button
            onClick={() => setShowCO2Modal(true)}
            className="flex items-center gap-2 text-sm text-gray-600 mb-4"
          >
            <span>ℹ️</span>
            <span className="underline">
              Curious how we count it? Click here to see!
            </span>
          </button>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-gray-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Packages rescued</p>
              <p className="text-3xl font-bold">0</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
                <span className="text-2xl">💰</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Savings</p>
              <p className="text-3xl font-bold">
                0 <span className="text-lg">UZS</span>
              </p>
            </div>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">User profile</h2>
          <button
            onClick={() => router.push("/profile")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Your profile</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/saved-addresses")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Saved addresses</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Good to Know Section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Good to Know</h2>
          <p className="text-sm text-gray-600 mb-4">
            See how to use Qopchiq with ease
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-yellow-100 rounded-3xl p-6 border-2 border-dashed border-yellow-300">
              <p className="text-sm font-bold mb-2">Get to know</p>
              <p className="text-sm font-bold mb-4">Qopchiq better</p>
              <div className="text-4xl">🥗</div>
            </div>
            <div className="bg-gray-100 rounded-3xl p-6 border-2 border-dashed border-gray-300">
              <p className="text-sm text-gray-400 font-bold mb-2">New tips</p>
              <p className="text-sm text-gray-400 font-bold mb-4">coming soon!</p>
              <div className="text-4xl opacity-30">⭐</div>
            </div>
          </div>
        </div>

        {/* Access Settings Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">Access settings</h2>
            <Settings className="w-5 h-5 text-gray-400" />
          </div>
          <button
            onClick={() => router.push("/settings/notifications")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Notifications</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/settings/location")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Location</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/settings/marketing")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Marketing consents</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Contact Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <Mail className="w-6 h-6 text-gray-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">Something on your mind?</p>
            <button className="text-sm text-[#00B14F] underline">
              Get in touch
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">About</h2>
            <span className="text-xl">📖</span>
          </div>
          <button
            onClick={() => router.push("/faq")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">FAQ</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/terms")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Terms and Conditions</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/privacy")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Privacy policy</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
          <button
            onClick={() => router.push("/licenses")}
            className="w-full flex items-center justify-between py-4 border-b border-gray-100"
          >
            <span className="text-base">Licenses</span>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        

        {/* Seller CTA */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="flex-1">
            <p className="font-semibold mb-1">
              Want to start selling surplus on Qopchiq?
            </p>
            <button className="text-sm text-[#00B14F] underline">
              Join Qopchiq
            </button>
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-6">
          <p className="text-center text-sm text-gray-600 mb-4">Follow us</p>
          <div className="flex items-center justify-center gap-6">
            <button className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">f</span>
            </button>
            <button className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">📷</span>
            </button>
            <button className="w-14 h-14 bg-black rounded-full flex items-center justify-center">
              <span className="text-white text-xl font-bold">♪</span>
            </button>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="mb-15 w-full py-6 rounded-full text-base font-semibold border-2"
        >
          Logout
        </Button>
      </div>

      {/* CO2 Modal */}
      <Sheet open={showCO2Modal} onOpenChange={setShowCO2Modal}>
        <SheetContent side="bottom" className="rounded-t-3xl">
          <SheetHeader className="text-center">
            <div className="flex justify-center mb-6">
              <div className="text-8xl">🌍💚</div>
            </div>
            <SheetTitle className="text-2xl font-bold text-center">
              How do we count the CO₂ saved?
            </SheetTitle>
            <SheetDescription className="text-base text-gray-600 leading-relaxed pt-4">
              We rely on data from the FAO report and estimate CO₂ savings
              based on typical product sets usually found in our packages — so
              you can see how every rescue really helps the planet 🌍💚
            </SheetDescription>
          </SheetHeader>
          <div className="pt-6">
            <Button
              onClick={() => setShowCO2Modal(false)}
              className="w-full bg-[#00B14F] hover:bg-[#009940] text-white rounded-full py-6 text-base font-semibold"
            >
              Got it!
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
