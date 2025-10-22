"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AvatarUploader } from "@/components/profile/avatar-uploader";
import { useCustomToast } from "@/components/custom-toast";
import { useFetchProfile, useUpdateProfile } from "@/hooks/profile";
import type { UpdateProfileData, UserProfile } from "@/types/profile";

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
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const normalizePhone = (value?: string | null) =>
  value?.replace(/[^0-9]/g, "") ?? "";

const mapProfileToForm = (profile?: UserProfile | null): ProfileFormValues => ({
  name: profile?.name ?? "",
  email: profile?.email ?? "",
  phone: normalizePhone(profile?.phone ?? profile?.phoneNumber),
});

export default function EditProfileForm() {
  const router = useRouter();
  const toast = useCustomToast();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { data: profile, isLoading: isProfileLoading } = useFetchProfile();
  const updateProfileMutation = useUpdateProfile();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const initialValues = useMemo(() => mapProfileToForm(profile), [profile]);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialValues,
    mode: "onBlur",
  });

  useEffect(() => {
    form.reset(initialValues);
    if (profile?.avatar && typeof profile.avatar === "object") {
      setAvatarPreview(profile.avatar.url);
    } else if (typeof profile?.avatar === "string") {
      setAvatarPreview(profile.avatar);
    } else {
      setAvatarPreview(null);
    }
    setAvatarFile(null);
  }, [form, initialValues, profile?.avatar]);

  useEffect(() => {
    return () => {
      if (avatarPreview?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const onAvatarPick = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Unsupported file", "Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File too large", "Max file size is 5MB");
      return;
    }

    if (avatarPreview?.startsWith("blob:")) {
      URL.revokeObjectURL(avatarPreview);
    }

    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  const buildPayload = (values: ProfileFormValues): UpdateProfileData => {
    const payload: UpdateProfileData = {};
    if (values.name !== profile?.name) payload.name = values.name.trim();
    if (values.email !== profile?.email) payload.email = values.email.trim();

    const currentPhone = normalizePhone(profile?.phone ?? profile?.phoneNumber);
    if (values.phone && values.phone !== currentPhone) {
      payload.phone = values.phone;
    }

    if (!values.phone && currentPhone) {
      payload.phone = "";
    }

    return payload;
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = buildPayload(values);
    const hasAvatarUpdate = !!avatarFile;

    if (Object.keys(payload).length === 0 && !hasAvatarUpdate) {
      toast.info(
        "No changes",
        "Update a field or choose a new photo before saving"
      );
      return;
    }

    try {
      // Use universal API - send both text fields and avatar file in one request
      await updateProfileMutation.mutateAsync({
        payload,
        avatarFile: hasAvatarUpdate ? avatarFile : undefined,
      });

      toast.success("Profile updated", "Your profile changes have been saved");
      router.push("/profile");
    } catch (error: any) {
      console.error("Profile update failed", error);
      toast.error(
        "Update failed",
        error?.message ?? "Unable to update profile. Please try again."
      );
    }
  });

  const isSaving =
    form.formState.isSubmitting || updateProfileMutation.isPending;

  const isDirty = form.formState.isDirty || !!avatarFile;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-0 lg:p-4">
      {/* Mobile Container - Always centered on desktop */}
      <div className="w-full max-w-md bg-white min-h-screen lg:min-h-0 lg:rounded-3xl lg:shadow-2xl lg:overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-100">
          <button
            onClick={() => router.back()}
            className="p-1.5 -ml-1.5 hover:bg-gray-50 rounded-lg transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-bold">Edit profile</h1>
        </div>

        {/* Form Content */}
        <form
          className="flex-1 overflow-y-auto px-4 py-5 pb-24 space-y-6"
          onSubmit={onSubmit}
        >
          {/* Avatar Section */}
          <div className="flex justify-center py-2">
            <AvatarUploader
              previewUrl={avatarPreview}
              isUploading={updateProfileMutation.isPending}
              onPick={onAvatarPick}
              disabled={isProfileLoading}
            />
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={updateProfileMutation.isPending}
          />

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <Label
                htmlFor="name"
                className="text-xs font-medium text-gray-700 mb-1.5 block"
              >
                Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={form.watch("name")}
                  onChange={(event) =>
                    form.setValue("name", event.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="h-11 rounded-xl border-gray-300 pl-10 text-sm"
                />
              </div>
              {form.formState.errors.name?.message && (
                <p className="text-xs text-red-500 mt-1.5">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <Label
                htmlFor="email"
                className="text-xs font-medium text-gray-700 mb-1.5 block"
              >
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={form.watch("email")}
                  onChange={(event) =>
                    form.setValue("email", event.target.value, {
                      shouldDirty: true,
                    })
                  }
                  className="h-11 rounded-xl border-gray-300 pl-10 text-sm"
                />
              </div>
              {form.formState.errors.email?.message && (
                <p className="text-xs text-red-500 mt-1.5">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <Label
                htmlFor="phone"
                className="text-xs font-medium text-gray-700 mb-1.5 block"
              >
                Phone number
              </Label>
              <div className="flex gap-2">
                <Input
                  value="+998"
                  className="h-11 rounded-xl border-gray-300 w-20 text-center bg-gray-50 text-sm font-medium"
                  disabled
                />
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="90 123 45 67"
                    value={form.watch("phone")}
                    onChange={(event) =>
                      form.setValue(
                        "phone",
                        normalizePhone(event.target.value),
                        { shouldDirty: true }
                      )
                    }
                    className="h-11 rounded-xl border-gray-300 pl-10 text-sm"
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Enter without country code
              </p>
              {form.formState.errors.phone?.message && (
                <p className="text-xs text-red-500 mt-1.5">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>
        </form>

        {/* Fixed Bottom Button */}
        <div className="sticky bottom-0 px-4 py-3.5 bg-white border-t border-gray-100 shadow-lg">
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={!isDirty || isSaving}
            className="w-full h-11 bg-[#00B14F] hover:bg-[#009940] text-white rounded-full text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
