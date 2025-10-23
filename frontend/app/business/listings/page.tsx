"use client"

import Link from "next/link"
import Image from "next/image"
import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCustomToast } from "@/components/custom-toast"
import { useBusinessAccount, useBusinessIsHydrated } from "@/store/business-store"
import {
  fetchMyProducts,
  updateProductStatus,
  deleteProduct,
} from "@/api/services/products"
import type { Product } from "@/types/product"

const formatPrice = (value: number) =>
  new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)

const getStatusLabel = (status: Product["status"]) => {
  switch (status) {
    case "available":
      return { label: "active", className: "bg-green-100 text-green-700" }
    case "inactive":
      return { label: "inactive", className: "bg-gray-100 text-gray-700" }
    case "sold":
      return { label: "sold", className: "bg-blue-100 text-blue-700" }
    case "expired":
      return { label: "expired", className: "bg-red-100 text-red-700" }
    default:
      return { label: status, className: "bg-gray-100 text-gray-700" }
  }
}

export default function BusinessListingsPage() {
  const toast = useCustomToast()
  const queryClient = useQueryClient()
  const business = useBusinessAccount()
  const isHydrated = useBusinessIsHydrated()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["business-products", business?.id],
    queryFn: fetchMyProducts,
    enabled: isHydrated && !!business?.id,
  })

  const products = useMemo(() => data ?? [], [data])

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Product["status"] }) =>
      updateProductStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-products", business?.id] })
      toast.success("Listing updated", "Your listing status has been updated")
    },
    onError: (mutationError: any) => {
      toast.error("Unable to update", mutationError?.message ?? "Please try again")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["business-products", business?.id] })
      toast.success("Listing removed", "The listing has been deleted")
    },
    onError: (mutationError: any) => {
      toast.error("Unable to delete", mutationError?.message ?? "Please try again")
    },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/business/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <h1 className="font-bold text-gray-900">My listings</h1>
            </div>
            <Link href="/business/listings/new">
              <Button className="bg-[#00B14F] hover:bg-[#009940]">
                <Plus className="w-4 h-4 mr-2" />
                Add listing
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="bg-white rounded-xl p-12 shadow-sm text-center text-gray-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-3" />
            Loading your listings…
          </div>
        ) : null}

        {isError ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6">
            <p className="font-semibold">Unable to load listings</p>
            <p className="text-sm mt-2">{error instanceof Error ? error.message : "Please try again later."}</p>
          </div>
        ) : null}

        {!isLoading && !isError && products.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center text-gray-500">
            <p className="font-semibold mb-2">You have not added any listings yet.</p>
            <p className="text-sm">Create your first listing to let customers discover your rescue packs.</p>
            <Link href="/business/listings/new">
              <Button className="mt-6 bg-[#00B14F] hover:bg-[#009940]">Create listing</Button>
            </Link>
          </div>
        ) : null}

        <div className="space-y-4">
          {products.map((listing) => {
            const statusBadge = getStatusLabel(listing.status)
            const isDeactivated = listing.status === "inactive"

            return (
              <div key={listing._id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <Image
                    src={listing.images?.[0] || "/placeholder.svg"}
                    alt={listing.title}
                    width={100}
                    height={100}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-gray-900">{listing.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-[#00B14F]">
                            {formatPrice(listing.discountPrice)} UZS
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(listing.originalPrice)} UZS
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusBadge.className}`}>
                        {statusBadge.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-4 space-y-1">
                      <div>Quantity: {listing.quantity.amount} {listing.quantity.unit}</div>
                      <div>Stock left: {listing.stock}</div>
                      {listing.pickupStartTime || listing.pickupEndTime ? (
                        <div>
                          Pickup window: {listing.pickupStartTime ?? ""}
                          {listing.pickupEndTime ? ` - ${listing.pickupEndTime}` : ""}
                        </div>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link href={`/business/listings/${listing._id}/edit`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleStatusMutation.mutate({
                            id: listing._id,
                            status: isDeactivated ? "available" : "inactive",
                          })
                        }
                        disabled={toggleStatusMutation.isPending}
                      >
                        {toggleStatusMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : isDeactivated ? (
                          <Eye className="w-4 h-4 mr-2" />
                        ) : (
                          <EyeOff className="w-4 h-4 mr-2" />
                        )}
                        {isDeactivated ? "Activate" : "Deactivate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 bg-transparent"
                        onClick={() => deleteMutation.mutate(listing._id)}
                        disabled={deleteMutation.isPending}
                      >
                        {deleteMutation.isPending ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4 mr-2" />
                        )}
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
