"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, MapPin } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export default function LocationPage() {
  const router = useRouter()
  const [locationEnabled, setLocationEnabled] = useState(true)
  const [currentLocation, setCurrentLocation] = useState("Tashkent, Uzbekistan")

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
    

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Location</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">
          We use your location to show you nearby offers and calculate distances to pickup locations.
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-semibold">Enable Location Services</p>
              <p className="text-sm text-gray-600">Allow Qopchiq to access your location</p>
            </div>
            <Switch checked={locationEnabled} onCheckedChange={setLocationEnabled} />
          </div>

          {locationEnabled && (
            <>
              <div className="border-t border-gray-100 pt-6">
                <h2 className="text-lg font-bold mb-4">Current Location</h2>
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#00B14F]" />
                  <span className="text-base">{currentLocation}</span>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-bold mb-4">Search Radius</h2>
                <p className="text-sm text-gray-600 mb-4">Show offers within:</p>
                <div className="space-y-2">
                  {["2 km", "5 km", "10 km", "20 km"].map((radius) => (
                    <button
                      key={radius}
                      className={`w-full py-3 px-4 rounded-xl border-2 font-semibold ${
                        radius === "5 km"
                          ? "border-[#00B14F] bg-green-50 text-[#00B14F]"
                          : "border-gray-200 text-gray-600"
                      }`}
                    >
                      {radius}
                    </button>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-[#00B14F] hover:bg-[#009940] text-white rounded-full py-6 text-base font-semibold">
                Update Location
              </Button>
            </>
          )}

          {!locationEnabled && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-gray-700 leading-relaxed">
                Location services are disabled. Enable them to see offers near you and get accurate pickup distances.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
