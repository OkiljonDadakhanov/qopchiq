"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function EditProfilePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "Akilhan",
    email: "akilhanmedia@gmail.com",
    phone: "90 123 45 67",
  })

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    // TODO: Save profile data to backend
    router.push("/profile")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-medium">9:19</span>
      </div>

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Avatar */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-16 h-16 text-[#00B14F]" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-[#00B14F] rounded-full flex items-center justify-center shadow-lg">
              <Camera className="w-5 h-5 text-white" />
            </button>
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
              <Input placeholder="+998" className="h-14 rounded-xl border-gray-200 w-24" disabled />
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

      {/* Save Button */}
      <div className="p-6 border-t border-gray-100">
        <Button
          onClick={handleSave}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-base font-semibold"
        >
          Save Changes
        </Button>
      </div>
    </div>
  )
}
