"use client"

import React, { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Heart, MapPin, Clock, Globe, Minus, Plus, X, Loader2 } from "lucide-react"
import { fetchProduct } from "@/api/services/products"
import { createOrder } from "@/api/services/orders"
import { toggleFavorite, checkFavorite } from "@/api/services/favorites"
import { useCustomToast } from "@/components/custom-toast"
import type { Product } from "@/types/product"
import type { CreateOrderPayload } from "@/types/order"

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showAnimation, setShowAnimation] = useState(false)

  // Fetch product data
  const { data: product, isLoading, isError, error } = useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })

  // Check if product is favorite
  const { data: isProductFavorite } = useQuery({
    queryKey: ['favorite', id],
    queryFn: () => checkFavorite(id),
    enabled: !!id,
  })

  // Update isFavorite state when isProductFavorite data changes
  React.useEffect(() => {
    if (isProductFavorite !== undefined) {
      setIsFavorite(isProductFavorite)
    }
  }, [isProductFavorite])

  // Favorites mutation
  const favoriteMutation = useMutation({
    mutationFn: async (productId: string) => {
      return await toggleFavorite(productId)
    },
    onSuccess: (data) => {
      setIsFavorite(data.isFavorite)
      queryClient.invalidateQueries({ queryKey: ['favorite', id] })
      toast.success(data.isFavorite ? "Added to favorites" : "Removed from favorites")
    },
    onError: () => {
      toast.error("Failed to update favorites")
    }
  })

  // Order creation mutation
  const orderMutation = useMutation({
    mutationFn: async (orderData: CreateOrderPayload) => {
      return await createOrder(orderData)
    },
    onSuccess: (order) => {
      setShowAnimation(true)
      toast.success("Order created successfully!", "Your order has been placed")
      setTimeout(() => {
        router.push("/orders")
      }, 3000)
    },
    onError: (error: any) => {
      toast.error("Failed to create order", error?.message || "Please try again")
    }
  })

  const handleFavoriteToggle = () => {
    if (product) {
      favoriteMutation.mutate(product._id)
    }
  }

  const handleReserve = () => {
    if (product) {
      const orderData = {
        productId: product._id,
        quantity,
        businessId: product.business?._id,
        totalPrice: product.discountPrice * quantity,
      }
      orderMutation.mutate(orderData)
    }
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)

  const buildPickupWindow = (product: Product) => {
    if (!product.pickupStartTime && !product.pickupEndTime) return null
    const start = product.pickupStartTime ?? ""
    const end = product.pickupEndTime ?? ""
    if (!start) return end ? `Pickup until ${end}` : null
    if (!end) return `Pickup after ${start}`
    return `${start} - ${end}`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00B14F]" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to load product</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#00B14F] text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const pickupTime = buildPickupWindow(product)
  const businessName = product.business?.name ?? "Partner"
  const businessAvatar = product.business?.avatar ?? null
  const businessAddress = product.business?.address ?? "Address not available"

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
        {/* Header Image */}
        <div className="relative h-64">
          <img
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => router.back()}
            className="absolute top-4 left-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="absolute top-4 left-20 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
            {product.stock > 10 ? "10+ LEFT" : `${product.stock} LEFT`}
          </div>
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteMutation.isPending}
            className="absolute top-4 right-4 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
          >
            {favoriteMutation.isPending ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Heart className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
            )}
          </button>
          <div className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-xl flex items-center justify-center shadow-lg">
            {businessAvatar ? (
              <img src={businessAvatar} alt={businessName} className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                {businessName.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-full shadow-lg">
            <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)} UZS</span>
            <span className="text-xl font-bold ml-2">{formatPrice(product.discountPrice)} UZS</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pb-32">
          <div className="px-6 py-6">
            {/* Product Info */}
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-gray-600 mb-4">{product.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-1">
                <span className="text-yellow-500">★</span>
                <span className="font-semibold">4.5</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{businessName}</span>
              </div>
              {pickupTime && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{pickupTime}</span>
                </div>
              )}
            </div>

            {/* What will you rescue */}
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3">What will you rescue?</h2>
              <p className="text-gray-700">{product.description}</p>
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                <span>📦</span>
                <span>{product.quantity.amount} {product.quantity.unit}</span>
              </div>
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
                  <p className="font-semibold">{businessAddress}</p>
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
              disabled={orderMutation.isPending || product.stock < quantity}
              className="flex-1 h-14 bg-[#00B14F] hover:bg-[#009940] text-white rounded-xl text-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {orderMutation.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                `Reserve for ${formatPrice(product.discountPrice * quantity)} UZS`
              )}
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