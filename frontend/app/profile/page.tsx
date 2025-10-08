"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, ShieldCheck, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const router = useRouter();
  const [userData, setUserData] = useState<{
    name: string;
    email: string;
    phone?: string;
    isVerified?: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 🧠 Read token from cookies
        const match = document.cookie.match(/(?:^|;\s*)qopchiq_token=([^;]+)/);
        if (!match) {
          console.warn("No token found, redirecting...");
          router.push("/signin");
          return;
        }

        const token = decodeURIComponent(match[1]);

        // 🌐 Fetch profile
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          console.error("Profile fetch failed, redirecting...");
          router.push("/signin");
          return;
        }

        const data = await res.json();
        setUserData(data.user);
      } catch (err) {
        console.error("Profile error:", err);
        router.push("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 px-6 py-4 flex items-center gap-4 border-b border-gray-100 bg-white">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Your profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        <div className="flex justify-center mb-8">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <User className="w-16 h-16 text-[#00B14F]" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">{userData.name}</h2>

        <div className="flex justify-center items-center mb-8 text-sm text-gray-500">
          {userData.isVerified ? (
            <div className="flex items-center gap-1 text-green-600">
              <ShieldCheck className="w-4 h-4" />
              Verified
            </div>
          ) : (
            <div className="flex items-center gap-1 text-red-500">
              <ShieldAlert className="w-4 h-4" />
              Not verified
            </div>
          )}
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your data</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-base font-medium">{userData.name || "Not set"}</p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Email*</p>
              <p className="text-base font-medium">{userData.email || "Not provided"}</p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Phone</p>
              <div className="flex gap-2">
                <p className="text-base font-medium text-gray-400">+998</p>
                <p className="text-base font-medium">{userData.phone || "not set"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <div className="sticky bottom-20 px-6 pb-6 bg-white border-t border-gray-100 shadow-sm">
        <Button
          onClick={() => router.push("/profile/edit")}
          className="cursor-pointer w-full h-14 bg-white hover:bg-gray-50 text-black border-2 border-gray-900 rounded-2xl text-base font-semibold shadow-sm"
        >
          Edit
        </Button>
      </div>
    </div>
  );
}
