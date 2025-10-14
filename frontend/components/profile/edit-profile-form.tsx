"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Mail, Phone, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormField } from "@/components/form-field"
import { AvatarUploader } from "@/components/profile/avatar-uploader"
import { useCustomToast } from "@/components/custom-toast"
import { useFetchProfile, useUpdateAvatar, useUpdateProfile } from "@/hooks/profile"
import type { UpdateProfileData, UserProfile } from "@/types/profile"

const profileSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(2, "Name should contain at least 2 characters")
    .max(120, "Name is too long"),
  email: z
    .string({ required_error: "Email is required" })
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .optional()
    .transform((value) => value?.trim() ?? ""),
})

type ProfileFormValues = z.infer<typeof profileSchema>

const normalizePhone = (value?: string | null) => value?.replace(/[^0-9]/g, "") ?? ""

const mapProfileToForm = (profile?: UserProfile | null): ProfileFormValues => ({
  name: profile?.name ?? "",
  email: profile?.email ?? "",
  phone: normalizePhone(profile?.phone ?? profile?.phoneNumber),
})

export default function EditProfileForm() {
  const router = useRouter()
  const toast = useCustomToast()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const { data: profile, isLoading: isProfileLoading } = useFetchProfile()
  const updateProfileMutation = useUpdateProfile()
  const updateAvatarMutation = useUpdateAvatar()

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const initialValues = useMemo(() => mapProfileToForm(profile), [profile])

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  })

  useEffect(() => {
    form.reset(initialValues)
    if (profile?.avatar && typeof profile.avatar === "object") {
      setAvatarPreview(profile.avatar.url)
    } else if (typeof profile?.avatar === "string") {
      setAvatarPreview(profile.avatar)
    } else {
      setAvatarPreview(null)
    }
    setAvatarFile(null)
  }, [form, initialValues, profile?.avatar])

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview)
      }
    }
  }, [avatarPreview])

  const onAvatarPick = () => fileInputRef.current?.click()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Unsupported file", "Please upload an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", "Max file size is 5MB")
      return
    }

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview)
    }

    setAvatarFile(file)
    const previewUrl = URL.createObjectURL(file)
    setAvatarPreview(previewUrl)
  }

  const buildPayload = (values: ProfileFormValues): UpdateProfileData => {
    const payload: UpdateProfileData = {}
    if (values.name !== profile?.name) payload.name = values.name.trim()
    if (values.email !== profile?.email) payload.email = values.email.trim()

    const currentPhone = normalizePhone(profile?.phone ?? profile?.phoneNumber)
    if (values.phone && values.phone !== currentPhone) {
      payload.phone = values.phone
    }

    if (!values.phone && currentPhone) {
      payload.phone = ""
    }

    return payload
  }

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildPayload(values)
    const hasAvatarUpdate = !!avatarFile

    if (Object.keys(payload).length === 0 && !hasAvatarUpdate) {
      toast.info("No changes", "Update a field or choose a new photo before saving")
      return
    }

    try {
      if (Object.keys(payload).length > 0) {
        await updateProfileMutation.mutateAsync(payload)
      }

      if (hasAvatarUpdate && avatarFile) {
        await updateAvatarMutation.mutateAsync(avatarFile)
      }

      toast.success("Profile updated", "Your profile changes have been saved")
      router.push("/profile")
    } catch (error: any) {
      console.error("Profile update failed", error)
      toast.error("Update failed", error?.message ?? "Unable to update profile. Please try again.")
    }
  })

  const isSaving =
    form.formState.isSubmitting ||
    updateProfileMutation.isPending ||
    updateAvatarMutation.isPending

  const isDirty = form.formState.isDirty || !!avatarFile

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="sticky top-0 z-30 bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft />
        </Button>
        <h1 className="text-lg font-semibold">Edit profile</h1>
      </div>

      <form className="flex-1 overflow-y-auto px-6 py-8 pb-36 space-y-8" onSubmit={onSubmit}>
        <AvatarUploader
          previewUrl={avatarPreview}
          isUploading={updateAvatarMutation.isPending}
          onPick={onAvatarPick}
          disabled={isProfileLoading}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={updateAvatarMutation.isPending}
        />

        <div className="space-y-6">
          <FormField
            id="name"
            label="Name"
            type="text"
            placeholder="Enter your name"
            value={form.watch("name")}
            onChange={(event) => form.setValue("name", event.target.value, { shouldDirty: true })}
            icon={<User className="w-4 h-4" />}
            error={form.formState.errors.name?.message}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={form.watch("email")}
            onChange={(event) => form.setValue("email", event.target.value, { shouldDirty: true })}
            icon={<Mail className="w-4 h-4" />}
            error={form.formState.errors.email?.message}
          />

          <div>
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 mb-2 block">
              Phone number
            </Label>
            <div className="flex gap-2">
              <Input value="+998" className="h-12 rounded-lg border-gray-300 w-24 text-center bg-gray-50" disabled />
              <div className="flex-1 relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="90 123 45 67"
                  value={form.watch("phone")}
                  onChange={(event) => form.setValue("phone", normalizePhone(event.target.value), { shouldDirty: true })}
                  className="h-12 rounded-lg border-gray-300 pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Enter your phone number without the country code (+998)</p>
            {form.formState.errors.phone?.message ? (
              <p className="text-xs text-red-500 mt-1">{form.formState.errors.phone.message}</p>
            ) : null}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-white border-t border-gray-100 shadow-lg">
          <Button
            type="submit"
            disabled={!isDirty || isSaving}
            className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-2xl text-base font-semibold"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}

