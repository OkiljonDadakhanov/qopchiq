"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, ShieldCheck, ShieldAlert, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { api } from "@/api/api"
import { useAppStore, useHasHydrated } from "@/store/store"

export default function ProfilePage() {
  const router = useRouter()
  const hasHydrated = useHasHydrated()
  const { user, setUser, clearAll } = useAppStore()

  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const fetchedRef = useRef(false) // ✅ prevent double-fetch

  // ✅ Fetch user profile once after hydration
  useEffect(() => {
    if (!hasHydrated || fetchedRef.current) return
    fetchedRef.current = true

    const fetchProfile = async () => {
      try {
        if (!user?.token) {
          router.push("/signin")
          return
        }

        const { data } = await api.get("/api/users/me")

        if (data?.user) {
          setUser({
            ...user,
            name: data.user.name ?? user.name,
            email: data.user.email ?? user.email,
            isVerified: data.user.isVerified ?? user.isVerified,
          })
        }
      } catch (err) {
        console.error("Error fetching profile:", err)
        router.push("/signin")
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [hasHydrated, router, setUser]) // ✅ no "user" dependency

  // ✅ Delete account
  const handleDeleteAccount = async () => {
    const confirmed = confirm("⚠️ Are you sure you want to permanently delete your account?")
    if (!confirmed) return

    try {
      setDeleting(true)
      if (!user?.token) {
        alert("You must be signed in to delete your account.")
        router.push("/signin")
        return
      }

      const res = await api.delete("/api/users/me")
      const data = res.data

      if (!res.status.toString().startsWith("2") || data.success === false) {
        throw new Error(data.message || "Failed to delete account")
      }

      clearAll() // ✅ Clear Zustand & localStorage
      alert("✅ Your account has been deleted successfully.")
      router.push("/signin")
    } catch (err) {
      console.error("Delete error:", err)
      alert("❌ Failed to delete account. Please try again.")
    } finally {
      setDeleting(false)
    }
  }

  if (!hasHydrated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    )
  }

  if (!user) return null

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

        <h2 className="text-2xl font-bold text-center mb-2">{user.name}</h2>

        <div className="flex justify-center items-center mb-8 text-sm text-gray-500">
          {user.isVerified ? (
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
              <p className="text-base font-medium">{user.name || "Not set"}</p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Email*</p>
              <p className="text-base font-medium">{user.email || "Not provided"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="sticky bottom-20 px-6 pb-6 bg-white border-t border-gray-100 shadow-sm space-y-3">
        <Button
          onClick={() => router.push("/profile/edit")}
          className="cursor-pointer w-full h-14 bg-white hover:bg-gray-50 text-black border-2 border-gray-900 rounded-2xl text-base font-semibold shadow-sm"
        >
          Edit
        </Button>

        <Button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="cursor-pointer w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          {deleting ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  )
}
