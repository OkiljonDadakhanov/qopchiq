"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("Loading...");
  const [email, setEmail] = useState("");

  useEffect(() => {
    try {
      // 🧠 Read user cookie from document.cookie
      const match = document.cookie.match(/(?:^|;\s*)qopchiq_user=([^;]+)/);
      if (match) {
        const decoded = decodeURIComponent(match[1]);
        const user = JSON.parse(decoded);

        setName(user.name || "User");
        setEmail(user.email || "Not provided");
      } else {
        // No cookie → redirect to sign-in page
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error reading user cookie:", error);
      router.push("/signin");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Your profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-[#00B14F]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-8">{name}</h2>

        {/* Your Data Section */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your data</h3>

          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-base font-medium">{name}</p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Email*</p>
              <p className="text-base font-medium">{email}</p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <div className="flex gap-2">
                <p className="text-base font-medium text-gray-400">+998</p>
                <p className="text-base font-medium">90 123 45 67</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="sticky bottom-20 px-6 pb-6 bg-white border-t border-gray-100 shadow-sm">
  <Button
    onClick={() => router.push("/profile/edit")}
    className="w-full h-14 bg-white hover:bg-gray-50 text-black border-2 border-gray-900 rounded-2xl text-base font-semibold shadow-sm"
  >
    Edit
  </Button>
</div>

    </div>
  );
}
