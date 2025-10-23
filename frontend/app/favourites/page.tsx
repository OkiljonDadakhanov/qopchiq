"use client"

import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MapPin, Heart, Loader2 } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"
import { fetchFavorites } from "@/api/services/favorites"
import { removeFromFavorites } from "@/api/services/favorites"
import { useCustomToast } from "@/components/custom-toast"
import type { Product } from "@/types/product"

export default function FavouritesPage() {
  const router = useRouter()
  const toast = useCustomToast()
  const queryClient = useQueryClient()

  const { data: favorites = [], isLoading, isError } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const removeMutation = useMutation({
    mutationFn: removeFromFavorites,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      toast.success("Removed from favorites")
    },
    onError: () => {
      toast.error("Failed to remove from favorites")
    }
  })

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
          <p className="text-gray-600">Loading favorites...</p>
        </div>
      </div>
    )
  }

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
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Heart className="w-20 h-20 text-gray-300 mb-4" />
                <p className="text-gray-500 text-center">No favourites yet</p>
                <p className="text-gray-400 text-sm text-center mt-2">Start adding your favorite products</p>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((product: Product) => {
                  const pickupTime = buildPickupWindow(product)
                  const businessName = product.business?.name ?? "Partner"
                  const businessAvatar = product.business?.avatar ?? null

                  return (
                    <div
                      key={product._id}
                      onClick={() => router.push(`/restaurant/${product._id}`)}
                      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer"
                    >
                      {/* Image */}
                      <div className="relative h-48">
                        <img
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-yellow-300 px-3 py-1 rounded-full text-xs font-bold">
                          {product.stock > 10 ? "10+ LEFT" : `${product.stock} LEFT`}
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            removeMutation.mutate(product._id)
                          }}
                          className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                          disabled={removeMutation.isPending}
                        >
                          {removeMutation.isPending ? (
                            <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                          ) : (
                            <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                          )}
                        </button>
                        <div className="absolute bottom-3 left-3 w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-md">
                          {businessAvatar ? (
                            <img src={businessAvatar} alt={businessName} className="w-12 h-12 rounded-lg object-cover" />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                              {businessName.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="absolute bottom-3 right-3 bg-white px-4 py-2 rounded-full shadow-md">
                          <span className="text-gray-400 line-through text-sm">{formatPrice(product.originalPrice)} UZS</span>
                          <span className="text-lg font-bold ml-2">{formatPrice(product.discountPrice)} UZS</span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-1">{product.title}</h3>
                        <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
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
                              <span>🕐</span>
                              <span>{pickupTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
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