"use client"

import { useRouter } from "next/navigation"
import { MapPin, Heart } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"

const favourites = [
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

export default function FavouritesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h1 className="text-2xl font-bold">Favourites</h1>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 py-6">
            {favourites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Heart className="w-20 h-20 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">No favourites yet</p>
                <p className="text-gray-400 text-sm text-center mt-2">Start adding your favorite restaurants</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favourites.map((offer) => (
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
                        <Heart className="w-5 h-5 fill-red-500 text-red-500" />
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
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  )
}