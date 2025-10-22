"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import BottomNavigation from "@/components/bottom-navigation"

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery">("pickup")
  const [orders] = useState<any[]>([])

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
        {/* Header */}
        <div className="px-6 py-6 border-b border-gray-100">
          <h1 className="text-4xl font-bold">Orders</h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 pb-24">
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
        <BottomNavigation />
      </div>
    </div>
  )
}