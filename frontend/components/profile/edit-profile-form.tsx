"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, User, Mail, Phone } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAppStore } from "@/store/store"
import { useCustomToast } from "@/components/custom-toast"
import { FormField } from "@/components/form-field"
import { useUpdateProfile, useFetchProfile, useUpdateAvatar } from "@/hooks/profile"
import { useUploadFile } from "@/hooks/use-upload"
import type { UpdateProfileData } from "@/types/profile"

export default function EditProfileForm() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { user, setUser } = useAppStore()
  const { data: profile } = useFetchProfile()
  const updateProfileMutation = useUpdateProfile()
  const updateAvatarMutation = useUpdateAvatar()
  const uploadFileMutation = useUploadFile()
  const toast = useCustomToast()

  const [formData, setFormData] = useState<UpdateProfileData>({
    name: "",
    email: "",
    phone: "",
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  // ✅ Prefill form from profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
      })
      if (profile.avatar) setAvatarPreview(profile.avatar)
    }
  }, [profile])

  // ✅ Handle input changes
  const handleChange = (field: keyof UpdateProfileData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // ✅ Avatar upload preview and upload
  const handleAvatarClick = () => fileInputRef.current?.click()
  // Avatar file selection only
const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    setAvatarFile(file);
    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);
  }
};


  // ✅ Save handler using React Query mutation
  const handleSave = async () => {
    try {
      if (!formData.name?.trim() || !formData.email?.trim()) {
        toast.error("Validation Error", "Name and Email are required.");
        return;
      }
  
      let avatarUrl = profile?.avatar;
  
      // ✅ Upload avatar only if a new file is selected
      if (avatarFile) {
        const fileForm = new FormData();
        fileForm.append("file", avatarFile);
        avatarUrl = await uploadFileMutation.mutateAsync(fileForm);
      }
  
      // ✅ Include avatar & phone in the update payload
      const updatedPayload: UpdateProfileData = {
        ...formData,
        avatar: avatarUrl,
      };
  
      const updatedProfile = await updateProfileMutation.mutateAsync(updatedPayload);
  
      // ✅ Update Zustand immediately (persists to localStorage)
      setUser({
        ...user,
        name: updatedProfile.name,
        email: updatedProfile.email,
        phone: updatedProfile.phone,
        avatar: updatedProfile.avatar,
      });
  
      toast.success("Profile Updated", "Your profile has been updated successfully.");
      router.push("/profile");
    } catch (err: any) {
      console.error("Profile update error:", err);
      toast.error("Update Failed", err.message || "Failed to update profile. Please try again.");
    }
  };
  

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
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : profile?.avatar ? (
                <Image
                  src={profile.avatar}
                  alt="Current Avatar"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                />
              ) : (
                <User className="w-16 h-16 text-[#00B14F]" />
              )}
            </div>

            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={uploadFileMutation.isPending || updateAvatarMutation.isPending}
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
              disabled={uploadFileMutation.isPending || updateAvatarMutation.isPending}
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
          disabled={updateProfileMutation.isPending || uploadFileMutation.isPending || updateAvatarMutation.isPending}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-2xl text-base font-semibold"
        >
          {updateProfileMutation.isPending || uploadFileMutation.isPending || updateAvatarMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  )
}
