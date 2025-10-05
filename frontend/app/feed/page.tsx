"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, SlidersHorizontal, Heart, Package, ShoppingBag, Menu, Map } from "lucide-react"

const offers = [
  {
    id: 1,
    name: "Plov House",
    description: "Traditional Uzbek cuisine",
    image: "/uzbek-plov-rice-dish.jpg",
    originalPrice: 45000,
    discountPrice: 19990,
    rating: 4.7,
    distance: "0.4km",
    time: "Today, 22:30 - 23:00",
    packagesLeft: "5+ LEFT",
    logo: "/restaurant-logo.png",
  },
  {
    id: 2,
    name: "Samarkand Bakery",
    description: "Fresh bread and pastries",
    image: "/fresh-bread-pastries.jpg",
    originalPrice: 35000,
    discountPrice: 15000,
    rating: 4.5,
    distance: "0.6km",
    time: "Today, 23:00 - 01:00",
    packagesLeft: "LAST PACKAGE",
    logo: "/bakery-logo.png",
  },
  {
    id: 3,
    name: "Tashkent Cafe",
    description: "Coffee and snacks",
    image: "/cafe-coffee-pastries.jpg",
    originalPrice: 50000,
    discountPrice: 22000,
    rating: 4.8,
    distance: "0.8km",
    time: "Today, 20:00 - 22:00",
    packagesLeft: "3 PACKAGES",
    logo: "/cafe-logo.png",
  },
]

export default function FeedPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("pickup")

  return (
    <div className="min-h-screen bg-white flex flex-col">
      

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Offers</h1>
          <button onClick={() => router.push("/filters")} className="p-2">
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Tashkent, +/- 5km</span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-6 py-6">
          <h2 className="text-xl font-bold mb-4">Food Waste? No thanks!</h2>

          {/* Offers List */}
          <div className="space-y-4">
            {offers.map((offer) => (
              <div
                key={offer.id}
                onClick={() => router.push(`/restaurant/${offer.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
              >
                {/* Image */}
                <div className="relative h-48">
                  <img
                    src={offer.image || "/placeholder.svg"}
                    alt={offer.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                    {offer.packagesLeft}
                  </div>
                  <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Heart className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 left-3 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                    <img src={offer.logo || "/placeholder.svg"} alt="logo" className="w-12 h-12 rounded-lg" />
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white px-4 py-2 rounded-full shadow-md">
                    <span className="text-gray-400 line-through text-sm">{offer.originalPrice} UZS</span>
                    <span className="text-lg font-bold ml-2">{offer.discountPrice} UZS</span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1">{offer.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{offer.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{offer.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{offer.distance}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>🕐</span>
                      <span>{offer.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 bg-white">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => setActiveTab("pickup")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "pickup" ? "text-[#00B14F]" : "text-gray-400"
            }`}
          >
            <Package className="w-6 h-6" />
            <span className="text-xs font-medium">Pick up</span>
            {activeTab === "pickup" && <div className="w-12 h-1 bg-[#00B14F] rounded-full mt-1" />}
          </button>
          <button
            onClick={() => router.push("/favourites")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "favourites" ? "text-[#00B14F]" : "text-gray-400"
            }`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">Favourites</span>
          </button>
          <button
            onClick={() => router.push("/orders")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
          >
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Orders</span>
          </button>
          <button
            onClick={() => router.push("/more")}
            className={`flex flex-col items-center gap-1 px-4 py-2 ${
              activeTab === "more" ? "text-[#00B14F]" : "text-gray-400"
            }`}
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Floating Map Button */}
      <button
        onClick={() => router.push("/map")}
        className="fixed bottom-24 right-6 w-16 h-16 bg-[#00B14F] rounded-full flex items-center justify-center shadow-lg"
      >
        <Map className="w-7 h-7 text-white" />
      </button>
    </div>
  )
}
