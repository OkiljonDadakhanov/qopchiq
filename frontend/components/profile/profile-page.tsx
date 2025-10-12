"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Edit,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAppStore, useHasHydrated } from "@/store/store"
import { useFetchProfile, useDeleteUser } from "@/hooks/profile"
import { useCustomToast } from "@/components/custom-toast"
import { useToast } from "@/components/ui/use-toast"
import ProfileAvatar from "./avatar"

export default function ProfilePage() {
  const router = useRouter()
  const { user, setUser, clearAll } = useAppStore()
  const hasHydrated = useHasHydrated()
  const deleteUserMutation = useDeleteUser()
  const customToast = useCustomToast()
  const { toast } = useToast()

  const { data: profile, status, error, refetch } = useFetchProfile()

  // ✅ Refetch profile on mount
  useEffect(() => {
    refetch()
  }, [refetch])

  // ✅ Sync React Query → Zustand
  useEffect(() => {
    if (status === "success" && profile) {
      setUser({
        name: profile.name,
        email: profile.email,
        token: user?.token,
        isVerified: profile.isVerified ?? false,
        phone: profile.phone,
        avatar: profile.avatar,
      })
    }
  }, [status, profile, setUser, user?.token])

  // ✅ Refetch when page regains focus
  useEffect(() => {
    const handleFocus = () => refetch()
    const handleVisibilityChange = () => {
      if (!document.hidden) refetch()
    }
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [refetch])

  const handleDelete = () => {
    toast({
      title: "Confirm Account Deletion",
      description:
        "This action is irreversible. All your data will be permanently deleted.",
      duration: 10000,
      action: (
        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              try {
                await deleteUserMutation.mutateAsync()
                customToast.success(
                  "Account Deleted",
                  "Your account has been successfully removed."
                )
                clearAll()
                router.push("/")
              } catch (err: any) {
                console.error("Delete error:", err)
                customToast.error(
                  "Delete Failed",
                  err.message ||
                    "Could not delete your account. Please try again."
                )
              }
            }}
            disabled={deleteUserMutation.isPending}
          >
            {deleteUserMutation.isPending ? "Deleting..." : "Confirm Delete"}
          </Button>
        </div>
      ),
    })
  }

  // ✅ Loading state
  if (!hasHydrated || status === "pending") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00B14F] mb-4"></div>
        <p className="text-lg">Loading profile...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-6">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Failed to Load Profile
        </h2>
        <p className="text-gray-600 mb-6 max-w-md">
          {(error as Error).message ||
            "Something went wrong while loading your profile."}
        </p>
        <div className="flex gap-3">
          <Button
            onClick={() => router.refresh()}
            className="bg-[#00B14F] hover:bg-[#009940] text-white"
          >
            Try Again
          </Button>
          <Button variant="outline" onClick={() => router.push("/")}>
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  // ✅ Determine Appwrite avatar URL
  const avatarUrl =
    profile?.avatar?.url ||
    (typeof profile?.avatar === "string" ? profile.avatar : null)

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
        <ProfileAvatar avatarUrl={avatarUrl} />

        <h2 className="text-2xl font-bold text-center mb-2">
          {profile?.name || "User"}
        </h2>

        {/* Verified status */}
        <div className="flex justify-center items-center mb-8 text-sm text-gray-500">
          {profile?.isVerified ? (
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

        {/* Profile fields */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4">Your data</h3>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Name</p>
              <p className="text-base font-medium">
                {profile?.name || "Not set"}
              </p>
            </div>

            <div className="border-b border-gray-100 pb-3">
              <p className="text-sm text-gray-600 mb-1">Email*</p>
              <p className="text-base font-medium">
                {profile?.email || "Not provided"}
              </p>
            </div>

            {(profile?.phone || profile?.phoneNumber) && (
              <div className="border-b border-gray-100 pb-3">
                <p className="text-sm text-gray-600 mb-1">Phone</p>
                <p className="text-base font-medium">
                  +998 {profile.phone ?? profile.phoneNumber}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="sticky bottom-0 px-6 pb-6 bg-white border-t border-gray-100 shadow-sm space-y-3">
        <Button
          onClick={() => router.push("/profile/edit")}
          className="cursor-pointer w-full h-14 bg-white hover:bg-gray-50 text-black border-2 border-gray-900 rounded-2xl text-base font-semibold shadow-sm flex items-center justify-center gap-2"
        >
          <Edit className="w-5 h-5" />
          Edit
        </Button>

        <Button
          onClick={handleDelete}
          disabled={deleteUserMutation.isPending}
          className="cursor-pointer w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl text-base font-semibold flex items-center justify-center gap-2"
        >
          <Trash2 className="w-5 h-5" />
          {deleteUserMutation.isPending ? "Deleting..." : "Delete Account"}
        </Button>
      </div>
    </div>
  )
}
