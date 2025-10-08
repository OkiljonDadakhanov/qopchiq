"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, MapPin, Clock, Store } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function BusinessOnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: "",
    address: "",
    description: "",
    openingHours: "",
    logo: null as File | null,
  })

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      router.push("/business/dashboard")
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-4 py-12">
        <div className="w-full max-w-2xl">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="w-4 h-4 fixed" />
            Back
          </button>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? "bg-[#00B14F]" : "bg-gray-200"}`} />
                ))}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {step === 1 && "Business type"}
                {step === 2 && "Location & hours"}
                {step === 3 && "Business details"}
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                {step === 1 && "Tell us what type of business you run"}
                {step === 2 && "Where are you located and when are you open?"}
                {step === 3 && "Add some details about your business"}
              </p>
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { type: "Restaurant", icon: "🍽️" },
                    { type: "Cafe", icon: "☕" },
                    { type: "Bakery", icon: "🥖" },
                    { type: "Grocery Store", icon: "🛒" },
                    { type: "Flower Shop", icon: "🌸" },
                    { type: "Other", icon: "🏪" },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => setFormData({ ...formData, businessType: item.type })}
                      className={`p-6 rounded-xl border-2 transition-all ${
                        formData.businessType === item.type
                          ? "border-[#00B14F] bg-green-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <div className="font-medium text-gray-900">{item.type}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="address">Business address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="address"
                      type="text"
                      placeholder="Street address, city"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="hours">Opening hours</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="hours"
                      type="text"
                      placeholder="e.g., Mon-Fri 9:00-18:00"
                      className="pl-10"
                      value={formData.openingHours}
                      onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="logo">Business logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                      {formData.logo ? (
                        <Image
                          src={URL.createObjectURL(formData.logo) || "/placeholder.svg"}
                          alt="Logo"
                          width={96}
                          height={96}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Store className="w-8 h-8 text-gray-400" />
                      )}
                    </div>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFormData({ ...formData, logo: e.target.files?.[0] || null })}
                      />
                      <div className="px-4 py-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors">
                        <Upload className="w-5 h-5 inline mr-2" />
                        Upload logo
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Business description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell customers about your business..."
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
            )}

            <Button onClick={handleNext} className="w-full mt-8 bg-[#00B14F] hover:bg-[#009940]">
              {step === 3 ? "Complete setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
