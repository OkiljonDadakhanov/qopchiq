"use client"

import {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  type ChangeEvent,
} from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, User, Mail, Phone, Loader2 } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/store/store"
import { useCustomToast } from "@/components/custom-toast"
import { FormField } from "@/components/form-field"
import {
  useUpdateProfile,
  useFetchProfile,
  useUpdateAvatar,
} from "@/hooks/profile"
import type { UpdateProfileData } from "@/types/profile"

const MAX_AVATAR_SIZE = 5 * 1024 * 1024; // 5MB limit aligned with backend

const getAvatarUrl = (avatar: unknown): string | null => {
  if (!avatar) return null
  if (typeof avatar === "string") return avatar
  if (typeof avatar === "object" && "url" in (avatar as Record<string, unknown>)) {
    return (avatar as { url?: string }).url ?? null
  }
  return null
}

export default function EditProfileForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const storeUser = useAppStore((state) => state.user)
  const {
    data: profile,
    isPending: isProfilePending,
    isFetching: isProfileFetching,
  } = useFetchProfile()
  const updateProfileMutation = useUpdateProfile()
  const updateAvatarMutation = useUpdateAvatar()
  const toast = useCustomToast()

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: storeUser?.name ?? "",
    email: storeUser?.email ?? "",
    phone: storeUser?.phone ?? "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    getAvatarUrl(storeUser?.avatar ?? null),
  )
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const releasePreviewUrl = useCallback((url: string | null) => {
    if (url && url.startsWith("blob:")) {
      URL.revokeObjectURL(url)
    }
  }, [])

  const initialProfileState = useMemo(() => {
    if (!profile) return null

    return {
      name: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      avatarUrl: profile.avatar?.url ?? null,
    }
  }, [profile])

  // ✅ Prefill form from profile data and avoid unnecessary resets
  useEffect(() => {
    if (!initialProfileState) return

    setFormData((prev) => {
      if (
        prev.name === initialProfileState.name &&
        prev.email === initialProfileState.email &&
        prev.phone === initialProfileState.phone
      ) {
        return prev
      }

      return {
        name: initialProfileState.name,
        email: initialProfileState.email,
        phone: initialProfileState.phone,
      }
    })

    if (!avatarFile) {
      setAvatarPreview((prev) => {
        releasePreviewUrl(prev)
        return initialProfileState.avatarUrl
      })
    }
  }, [initialProfileState, avatarFile, releasePreviewUrl])

  useEffect(() => {
    return () => {
      releasePreviewUrl(avatarPreview)
    }
  }, [avatarPreview, releasePreviewUrl])

  // ✅ Handle input changes
  const handleChange = useCallback(
    (field: keyof UpdateProfileData, value: string) => {
      setFormData((prev) => {
        if (prev[field] === value) return prev
        return { ...prev, [field]: value }
      })
    },
    []
  )

  // ✅ Avatar upload preview and upload
  const handleAvatarClick = useCallback(() => fileInputRef.current?.click(), [])

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file", "Please select a valid image file.")
        event.target.value = ""
        return
      }

      if (file.size > MAX_AVATAR_SIZE) {
        toast.error(
          "File too large",
          "Please choose an image smaller than 5MB.",
        )
        event.target.value = ""
        return
      }

      setAvatarFile(file)
      setAvatarPreview((prev) => {
        releasePreviewUrl(prev)
        return URL.createObjectURL(file)
      })
    },
    [releasePreviewUrl, toast],
  )

  const resetAvatarSelection = useCallback(() => {
    setAvatarFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }, [])


  const isSaving =
    updateProfileMutation.isPending || updateAvatarMutation.isPending
  const isProfileLoading = isProfilePending && !initialProfileState;
  const displayAvatar = avatarPreview ?? initialProfileState?.avatarUrl ?? null;

  const hasProfileChanges = useMemo(() => {
    if (!initialProfileState) return false

    return (
      formData.name !== initialProfileState.name ||
      formData.email !== initialProfileState.email ||
      formData.phone !== initialProfileState.phone
    )
  }, [formData.email, formData.name, formData.phone, initialProfileState])

  const canSave = (hasProfileChanges || !!avatarFile) && !isSaving

  // ✅ Save handler using React Query mutation
  const handleSave = useCallback(async () => {
    try {
      if (isSaving) return
      if (!formData.name?.trim() || !formData.email?.trim()) {
        toast.error("Validation Error", "Name and Email are required.");
        return;
      }

      if (hasProfileChanges) {
        await updateProfileMutation.mutateAsync(formData)
      }

      if (avatarFile) {
        const updatedProfile = await updateAvatarMutation.mutateAsync(avatarFile)
        setAvatarPreview((prev) => {
          const nextUrl = updatedProfile.avatar?.url ?? prev
          if (nextUrl !== prev) {
            releasePreviewUrl(prev)
          }
          return nextUrl
        })
        resetAvatarSelection()
      }

      toast.success(
        "Profile Updated",
        "Your profile has been updated successfully.",
      );
      router.push("/profile");
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error(
        "Update Failed",
        err.message || "Failed to update profile. Please try again.",
      );
    }
  }, [
    formData,
    toast,
    updateProfileMutation,
    avatarFile,
    updateAvatarMutation,
    router,
    isSaving,
    hasProfileChanges,
    resetAvatarSelection,
    releasePreviewUrl,
  ]);


  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold">Edit Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-36">
        {(isProfileLoading || isProfileFetching) && (
          <p className="flex items-center gap-2 text-sm text-gray-500 mb-6" role="status">
            <Loader2 className="h-4 w-4 animate-spin text-[#00B14F]" />
            {isProfileLoading
              ? "Loading your profile details..."
              : "Refreshing your profile data..."}
          </p>
        )}
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {displayAvatar ? (
                <Image
                  src={displayAvatar}
                  alt="Avatar Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized={displayAvatar.startsWith("blob:")}
                />
              ) : (
                <User className="w-16 h-16 text-[#00B14F]" />
              )}
            </div>

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={isSaving || isProfileLoading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#00B14F] rounded-full flex items-center justify-center shadow-md hover:bg-[#009940] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
              disabled={isSaving || isProfileLoading}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <FormField
            id="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={formData.name ?? ""}
            onChange={(e) => handleChange("name", e.target.value)}
            icon={<User className="w-4 h-4" />}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email ?? ""}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            icon={<Mail className="w-4 h-4" />}
          />

          <div>
            <Label
              htmlFor="phone"
              className="text-sm font-medium text-gray-700 mb-2 block"
            >
              Phone Number
            </Label>
            <div className="flex gap-2">
              <Input
                value="+998"
                className="h-12 rounded-lg border-gray-300 w-24 text-center bg-gray-50"
                disabled
              />
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="90 123 45 67"
                  value={formData.phone ?? ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="h-12 rounded-lg border-gray-300 pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Enter your phone number without the country code (+998)
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-white border-t border-gray-100 shadow-lg">
        <Button
          onClick={handleSave}
          disabled={!canSave || isProfileLoading}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-2xl text-base font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isSaving ? "Saving..." : canSave ? "Save Changes" : "No changes yet"}
        </Button>
      </div>
    </div>
  )
}
