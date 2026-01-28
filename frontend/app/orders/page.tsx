"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Clock, MapPin, QrCode, CheckCircle, XCircle, Loader2 } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"
import { fetchOrders } from "@/api/services/orders"
import type { Order } from "@/types/order"

export default function OrdersPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"pickup" | "delivery">("pickup")

  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 1000 * 30, // 30 seconds
  })

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending'
      case 'confirmed':
        return 'Confirmed'
      case 'ready':
        return 'Ready for pickup'
      case 'completed':
        return 'Completed'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50'
      case 'confirmed':
        return 'text-blue-600 bg-blue-50'
      case 'ready':
        return 'text-green-600 bg-green-50'
      case 'completed':
        return 'text-green-700 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#00B14F]" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

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
            <div className="w-full space-y-4">
              {orders.map((order: Order) => (
                <div key={order._id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <img
                      src={order.product?.images?.[0] || "/placeholder.svg"}
                      alt={order.product?.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{order.product?.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{order.product?.business?.name}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-semibold">Qty: {order.quantity}</span>
                        <span className="text-sm font-bold text-[#00B14F]">
                          {formatPrice(order.totalPrice)} UZS
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(order.status)}
                            <span>{getStatusText(order.status)}</span>
                          </div>
                        </div>
                        {order.qrToken && (
                          <button className="flex items-center gap-1 text-sm text-blue-600">
                            <QrCode className="w-4 h-4" />
                            <span>QR Code</span>
                          </button>
                        )}
                      </div>
                      {order.product?.business?.address && (
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{order.product.business.address}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </div>
  )
}