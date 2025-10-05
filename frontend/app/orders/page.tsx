"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Package, Heart, ShoppingBag, Menu } from "lucide-react"

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery">("pickup")
  const [orders] = useState<any[]>([]) // Empty for now

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100">
        <span className="text-sm font-medium">9:19</span>
      </div>

      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-4xl font-bold">Orders</h1>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 border-b border-gray-100">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("pickup")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "pickup" ? "bg-white border-2 border-gray-900 text-gray-900" : "bg-gray-100 text-gray-400"
            }`}
          >
            Pickup
          </button>
          <button
            onClick={() => setActiveTab("delivery")}
            className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
              activeTab === "delivery" ? "bg-white border-2 border-gray-900 text-gray-900" : "bg-gray-100 text-gray-400"
            }`}
          >
            Delivery
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {orders.length === 0 ? (
          <>
            {/* Empty State */}
            <div className="flex flex-col items-center text-center max-w-sm">
              <div className="mb-8">
                <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Fork */}
                  <rect x="40" y="60" width="8" height="100" rx="4" fill="#1a1a1a" />
                  <rect x="40" y="40" width="8" height="30" rx="4" fill="#1a1a1a" />
                  <rect x="52" y="40" width="8" height="30" rx="4" fill="#1a1a1a" />
                  <rect x="64" y="40" width="8" height="30" rx="4" fill="#1a1a1a" />

                  {/* Knife */}
                  <rect x="152" y="60" width="8" height="100" rx="4" fill="#1a1a1a" />
                  <path d="M148 40 L164 40 L156 60 Z" fill="#1a1a1a" />

                  {/* Plate */}
                  <ellipse cx="100" cy="100" rx="70" ry="70" fill="#FDE047" />
                  <ellipse cx="100" cy="100" rx="60" ry="60" fill="#FEF08A" />
                  <ellipse cx="100" cy="100" rx="50" ry="50" fill="#FDE047" />

                  {/* Food items on plate */}
                  <path
                    d="M 80 90 Q 85 80 90 90 Q 95 100 90 110 Q 85 120 80 110 Q 75 100 80 90 Z"
                    fill="#D97706"
                    stroke="#92400E"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M 105 85 Q 110 75 115 85 Q 120 95 115 105 Q 110 115 105 105 Q 100 95 105 85 Z"
                    fill="#D97706"
                    stroke="#92400E"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>

              <h2 className="text-2xl font-bold mb-3">No orders yet</h2>
              <p className="text-gray-600 text-base leading-relaxed">
                When you place an order, the confirmation will appear here.
              </p>
            </div>
          </>
        ) : (
          <div className="w-full space-y-4">{/* Orders will be displayed here */}</div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-gray-100 bg-white">
        <div className="flex items-center justify-around py-3">
          <button
            onClick={() => router.push("/feed")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
          >
            <Package className="w-6 h-6" />
            <span className="text-xs font-medium">Pick up</span>
          </button>
          <button
            onClick={() => router.push("/favourites")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">Favourites</span>
          </button>
          <button className="flex flex-col items-center gap-1 px-4 py-2 text-[#00B14F]">
            <ShoppingBag className="w-6 h-6" />
            <span className="text-xs font-medium">Orders</span>
            <div className="w-12 h-1 bg-[#00B14F] rounded-full mt-1" />
          </button>
          <button
            onClick={() => router.push("/more")}
            className="flex flex-col items-center gap-1 px-4 py-2 text-gray-400"
          >
            <Menu className="w-6 h-6" />
            <span className="text-xs font-medium">More</span>
          </button>
        </div>
      </div>
    </div>
  )
}
