"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, MapPin, Clock, Globe, Minus, Plus, X } from "lucide-react"

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

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

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    if (!isFavorite) {
      // Optionally navigate to favourites page
      // router.push("/favourites")
    }
  }

  const handleReserve = () => {
    setShowAnimation(true)
    setTimeout(() => {
      router.push("/orders")
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
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
            onClick={handleFavoriteToggle}
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
        <div className="flex-1 overflow-y-auto pb-32">
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

      {/* Bottom Bar - Reserve Section */}
      <div className="absolute bottom-20 left-0 right-0 border-t border-gray-100 bg-white p-6">
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
            <button
              onClick={handleReserve}
              className="flex-1 h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-lg font-semibold transition"
            >
              Reserve
            </button>
          </div>
        </div>
        {/* Success Animation Modal */}
        {showAnimation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 max-w-sm mx-4 text-center relative animate-scale-in">
              <button
                onClick={() => {
                  setShowAnimation(false)
                  router.push("/orders")
                }}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Animated Success Icon */}
              <div className="mb-6 relative">
                <div className="w-24 h-24 bg-green-100 rounded-full mx-auto flex items-center justify-center animate-bounce">
                  <svg className="w-12 h-12 text-[#00B14F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {/* Floating leaves animation */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-float-up">🍃</div>
                <div className="absolute top-4 left-1/4 animate-float-up-delay">🌿</div>
                <div className="absolute top-4 right-1/4 animate-float-up-delay-2">🍃</div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">Thank You!</h2>
              <p className="text-gray-600 mb-2">You're saving the planet! 🌍</p>
              <p className="text-sm text-gray-500 mb-6">
                By rescuing this food, you're reducing CO₂ emissions and fighting food waste
              </p>

              <div className="bg-green-50 rounded-2xl p-4 mb-4">
                <p className="text-[#00B14F] font-bold text-lg">~2.5 kg CO₂ saved</p>
                <p className="text-gray-600 text-sm">Equivalent to driving 10km less</p>
              </div>

              <p className="text-xs text-gray-400">Redirecting to your orders...</p>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes scale-in {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-100px) rotate(360deg);
              opacity: 0;
            }
          }

          .animate-scale-in {
            animation: scale-in 0.3s ease-out;
          }

          .animate-float-up {
            animation: float-up 2s ease-out infinite;
          }

          .animate-float-up-delay {
            animation: float-up 2s ease-out 0.3s infinite;
          }

          .animate-float-up-delay-2 {
            animation: float-up 2s ease-out 0.6s infinite;
          }
        `}</style>
      </div>
    </div>
  )
}