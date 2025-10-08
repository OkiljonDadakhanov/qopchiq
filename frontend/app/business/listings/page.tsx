"use client"

import Link from "next/link"
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BusinessListingsPage() {
  const listings = [
    {
      id: "1",
      name: "Surprise breakfast bag",
      price: "15,000 UZS",
      originalPrice: "45,000 UZS",
      quantity: 5,
      pickupTime: "8:00 - 10:00",
      status: "active",
      image: "/hearty-breakfast.png",
    },
    {
      id: "2",
      name: "Lunch combo",
      price: "25,000 UZS",
      originalPrice: "75,000 UZS",
      quantity: 8,
      pickupTime: "12:00 - 14:00",
      status: "active",
      image: "/diverse-lunch-spread.png",
    },
    {
      id: "3",
      name: "Bakery box",
      price: "12,000 UZS",
      originalPrice: "40,000 UZS",
      quantity: 0,
      pickupTime: "16:00 - 18:00",
      status: "inactive",
      image: "/bustling-bakery.png",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link href="/business/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 fixed" />
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
        <div className="space-y-4">
          {listings.map((listing) => (
            <div key={listing.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <Image
                  src={listing.image || "/placeholder.svg"}
                  alt={listing.name}
                  width={100}
                  height={100}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900">{listing.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-lg font-bold text-[#00B14F]">{listing.price}</span>
                        <span className="text-sm text-gray-500 line-through">{listing.originalPrice}</span>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        listing.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {listing.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>Quantity: {listing.quantity} available</div>
                    <div>Pickup: {listing.pickupTime}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/business/listings/${listing.id}/edit`}>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm">
                      {listing.status === "active" ? (
                        <>
                          <EyeOff className="w-4 h-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
