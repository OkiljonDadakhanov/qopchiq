"use client"

import { useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Edit,
  Phone,
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

  const {
    data: profile,
    status,
    error,
    isFetching,
    isPlaceholderData,
  } = useFetchProfile()

  const avatarUrl = useMemo(() => {
    if (!profile?.avatar) return null
    if (typeof profile.avatar === "string") return profile.avatar
    return profile.avatar.url || null
  }, [profile?.avatar])

  const phoneNumber = useMemo(() => {
    const phone = profile?.phone || profile?.phoneNumber || user?.phone || null
    return phone
  }, [profile?.phone, profile?.phoneNumber, user?.phone, profile])

  useEffect(() => {
    if (status === "success" && profile && !isPlaceholderData) {
      setUser({
        name: profile.name,
        email: profile.email,
        token: user?.token,
        isVerified: profile.isVerified ?? false,
        phone: profile.phone || profile.phoneNumber,
        avatar: profile.avatar,
      })
    }
  }, [status, profile, isPlaceholderData, setUser, user?.token])

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

  if (!hasHydrated || (status === "pending" && !profile)) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-gray-500 px-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00B14F] mb-3"></div>
        <p className="text-sm">Loading profile...</p>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center px-4">
        <ShieldAlert size={40} className="text-red-500 mb-3" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Failed to Load Profile
        </h2>
        <p className="text-sm text-gray-600 mb-4 max-w-sm">
          {(error as Error).message ||
            "Something went wrong while loading your profile."}
        </p>
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Button
            onClick={() => router.refresh()}
            className="w-full bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl px-4 py-2.5 text-sm"
          >
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full rounded-xl px-4 py-2.5 text-sm"
          >
            Go Home
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      {/* Mobile container */}
      <div className="relative w-full max-w-sm bg-white min-h-screen shadow-xl border-x border-gray-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 px-4 py-3 flex items-center gap-3 border-b border-gray-100 bg-white z-10">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold">Your profile</h1>
          {isFetching && !isPlaceholderData && (
            <span className="ml-auto text-xs text-gray-400">Refreshing…</span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 px-4 py-5 pb-28 overflow-y-auto">
          <ProfileAvatar avatarUrl={avatarUrl} />
          <h2 className="text-xl font-bold text-center mb-1.5">
            {profile?.name || "User"}
          </h2>

          <div className="flex justify-center items-center mb-5 text-sm">
            {profile?.isVerified ? (
              <div className="flex items-center gap-1.5 text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2.5 py-1 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Not verified</span>
              </div>
            )}
          </div>

          <div className="mb-5">
            <h3 className="text-sm font-semibold mb-3 px-0.5">Your data</h3>
            <div className="space-y-3 bg-gray-50 rounded-xl p-3.5">
              <div className="pb-2.5 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Name</p>
                <p className="text-sm font-semibold text-gray-900">
                  {profile?.name || "Not set"}
                </p>
              </div>

              <div className="pb-2.5 border-b border-gray-200">
                <p className="text-xs text-gray-600 mb-1 font-medium">Email</p>
                <p className="text-sm font-semibold text-gray-900 break-all">
                  {profile?.email || "Not provided"}
                </p>
              </div>

              <div className="pb-2.5">
                <p className="text-xs text-gray-600 mb-1 font-medium flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  Phone
                </p>
                {phoneNumber ? (
                  <p className="text-sm font-semibold text-gray-900">
                    +998 {phoneNumber}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">Not provided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 py-3.5 bg-white border-t border-gray-200 shadow-lg space-y-2">
          <Button
            onClick={() => router.push("/profile/edit")}
            className="w-full h-11 bg-[#00B14F] hover:bg-[#009940] text-white rounded-full text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
          >
            <Edit className="w-4 h-4" />
            Edit Profile
          </Button>

          <Button
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="w-full h-11 bg-white hover:bg-red-50 text-red-600 border-2 border-red-600 rounded-full text-sm font-semibold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
            {deleteUserMutation.isPending ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  )
}
