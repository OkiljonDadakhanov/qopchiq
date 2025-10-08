"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const [formData, setFormData] = useState({
    name: "Akilhan",
    username: "akilhanmedia",
    email: "akilhanmedia@gmail.com",
    phone: "90 123 45 67",
  })

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAvatarClick = () => fileInputRef.current?.click()

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAvatarFile(file)
      const previewURL = URL.createObjectURL(file)
      setAvatarPreview(previewURL)
    }
  }

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData()
      formDataToSend.append("name", formData.name)
      formDataToSend.append("username", formData.username)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("phone", formData.phone)
      if (avatarFile) formDataToSend.append("avatar", avatarFile)

      // await fetch("/api/profile/update", { method: "POST", body: formDataToSend })
      router.push("/profile")
    } catch (error) {
      console.error("Error saving profile:", error)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100 shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 pb-36">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
              {avatarPreview ? (
                <Image
                  src={avatarPreview}
                  alt="Avatar Preview"
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
              className="absolute bottom-0 right-0 w-10 h-10 bg-[#00B14F] rounded-full flex items-center justify-center shadow-lg hover:bg-[#009940] transition"
            >
              <Camera className="w-5 h-5 text-white" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-sm text-gray-600 mb-2 block">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="h-14 rounded-xl border-gray-200"
            />
          </div>

          <div>
            <Label htmlFor="username" className="text-sm text-gray-600 mb-2 block">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="h-14 rounded-xl border-gray-200"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-sm text-gray-600 mb-2 block">
              Email*
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="h-14 rounded-xl border-gray-200"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm text-gray-600 mb-2 block">
              Phone
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="+998"
                className="h-14 rounded-xl border-gray-200 w-24"
                disabled
              />
              <Input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-14 rounded-xl border-gray-200 flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Save Button */}
      <div className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-white border-t border-gray-100 shadow-lg">
        <Button
          onClick={handleSave}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-2xl text-base font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
