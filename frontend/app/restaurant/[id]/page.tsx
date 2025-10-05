"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MapPin, Clock, Globe, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RestaurantDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  const restaurant = {
    name: "PANNA",
    description: "Traditional Uzbek cuisine",
    image: "/uzbek-plov-rice-dish.jpg",
    logo: "/restaurant-logo.png",
    originalPrice: 40000,
    discountPrice: 19990,
    rating: 4.5,
    distance: "2.8km",
    time: "Today, 03:00 - 23:00",
    packagesLeft: "2 PACKAGES",
    whatYouRescue: "Traditional plov, fresh salads, and homemade bread",
    website: "www.panna.uz",
    address: "Amir Temur Street 15, Tashkent",
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-medium">9:19</span>
      </div>

      {/* Header Image */}
      <div className="relative h-64">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="absolute top-4 left-20 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
          {restaurant.packagesLeft}
        </div>
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
          <img src={restaurant.logo || "/placeholder.svg"} alt="logo" className="w-16 h-16 rounded-lg" />
        </div>
        <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
          <span className="text-gray-400 line-through text-sm">{restaurant.originalPrice} UZS</span>
          <span className="text-xl font-bold ml-2">{restaurant.discountPrice} UZS</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Restaurant Info */}
          <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-gray-600 mb-4">{restaurant.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="font-semibold">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{restaurant.time}</span>
            </div>
          </div>

          {/* What will you rescue */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-3">What will you rescue?</h2>
            <p className="text-gray-700">{restaurant.whatYouRescue}</p>
          </div>

          {/* Consumer Protection */}
          <div className="bg-blue-50 rounded-2xl p-4 mb-6">
            <div className="flex gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-xl">ℹ</span>
              </div>
              <div>
                <p className="font-semibold mb-1">Packages are sold by vendors</p>
                <p className="text-sm text-gray-600 mb-2">
                  Remember, that you're covered by consumer rights protection
                </p>
                <button className="text-sm text-blue-600 underline">Company Info & Responsibilities</button>
              </div>
            </div>
          </div>

          {/* About */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">About</h2>

            {/* Website */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Globe className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">Website</p>
                <button className="text-sm text-blue-600 underline">View page</button>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="font-semibold">{restaurant.address}</p>
                <button className="text-sm text-blue-600 underline">Navigate to Pickup</button>
              </div>
            </div>
          </div>

          {/* Map Preview */}
          <div className="h-48 bg-gray-100 rounded-2xl mb-6 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-[#00B14F] rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-white p-6">
        <div className="flex items-center gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-xl font-bold w-8 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Reserve Button */}
          <Button className="flex-1 h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-lg font-semibold">
            Reserve
          </Button>
        </div>
      </div>
    </div>
  )
}
