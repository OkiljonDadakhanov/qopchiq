"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Home, Building2, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddAddressPage() {
  const router = useRouter()
  const [addressType, setAddressType] = useState<"home" | "office" | "other">("home")

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
        <h1 className="text-xl font-bold">New address</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        {/* Address Type Selection */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Select address type</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setAddressType("home")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${
                addressType === "home" ? "border-[#00B14F] bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <Home className={`w-8 h-8 ${addressType === "home" ? "text-[#00B14F]" : "text-gray-600"}`} />
              <span className={`text-sm font-medium ${addressType === "home" ? "text-[#00B14F]" : "text-gray-600"}`}>
                Home
              </span>
            </button>
            <button
              onClick={() => setAddressType("office")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${
                addressType === "office" ? "border-[#00B14F] bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <Building2 className={`w-8 h-8 ${addressType === "office" ? "text-[#00B14F]" : "text-gray-600"}`} />
              <span className={`text-sm font-medium ${addressType === "office" ? "text-[#00B14F]" : "text-gray-600"}`}>
                Office
              </span>
            </button>
            <button
              onClick={() => setAddressType("other")}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 ${
                addressType === "other" ? "border-[#00B14F] bg-green-50" : "border-gray-200 bg-white"
              }`}
            >
              <MapPin className={`w-8 h-8 ${addressType === "other" ? "text-[#00B14F]" : "text-gray-600"}`} />
              <span className={`text-sm font-medium ${addressType === "other" ? "text-[#00B14F]" : "text-gray-600"}`}>
                Other
              </span>
            </button>
          </div>
        </div>

        {/* Pickup Details */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Pickup details</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-sm text-gray-600 mb-2 block">
                Name
              </Label>
              <Input id="name" placeholder="Enter name" className="h-12 rounded-xl border-gray-200" />
            </div>

            <div>
              <Label htmlFor="surname" className="text-sm text-gray-600 mb-2 block">
                Surname
              </Label>
              <Input id="surname" placeholder="Enter surname" className="h-12 rounded-xl border-gray-200" />
            </div>

            <div>
              <Label htmlFor="street" className="text-sm text-gray-600 mb-2 block">
                Street
              </Label>
              <Input id="street" placeholder="Enter street" className="h-12 rounded-xl border-gray-200" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="building" className="text-sm text-gray-600 mb-2 block">
                  Building no
                </Label>
                <Input id="building" placeholder="Building" className="h-12 rounded-xl border-gray-200" />
              </div>
              <div>
                <Label htmlFor="flat" className="text-sm text-gray-600 mb-2 block">
                  Flat no
                </Label>
                <Input id="flat" placeholder="Flat" className="h-12 rounded-xl border-gray-200" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip" className="text-sm text-gray-600 mb-2 block">
                  Zip code
                </Label>
                <Input
                  id="zip"
                  placeholder="100000"
                  defaultValue="100000"
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="city" className="text-sm text-gray-600 mb-2 block">
                  City
                </Label>
                <Input
                  id="city"
                  placeholder="Tashkent"
                  defaultValue="Tashkent"
                  className="h-12 rounded-xl border-gray-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area" className="text-sm text-gray-600 mb-2 block">
                  Area code
                </Label>
                <Input id="area" placeholder="+998" defaultValue="+998" className="h-12 rounded-xl border-gray-200" />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-gray-600 mb-2 block">
                  Phone
                </Label>
                <Input id="phone" placeholder="Enter phone" className="h-12 rounded-xl border-gray-200" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm text-gray-600 mb-2 block">
                Address notes
              </Label>
              <Input id="notes" placeholder="Additional information" className="h-12 rounded-xl border-gray-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 border-t border-gray-100">
        <Button
          onClick={() => router.back()}
          className="w-full h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-base font-semibold"
        >
          Save Address
        </Button>
      </div>
    </div>
  )
}
