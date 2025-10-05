"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function BusinessOrdersPage() {
  const [filter, setFilter] = useState("all")

  const orders = [
    {
      id: "1",
      customer: "Akmal K.",
      phone: "+998 90 123 45 67",
      item: "Surprise breakfast bag",
      quantity: 1,
      total: "15,000 UZS",
      pickupTime: "8:00 - 10:00",
      status: "pending",
      time: "10 mins ago",
    },
    {
      id: "2",
      customer: "Dilnoza S.",
      phone: "+998 91 234 56 78",
      item: "Lunch combo",
      quantity: 2,
      total: "50,000 UZS",
      pickupTime: "12:00 - 14:00",
      status: "ready",
      time: "25 mins ago",
    },
    {
      id: "3",
      customer: "Jasur M.",
      phone: "+998 93 345 67 89",
      item: "Bakery box",
      quantity: 1,
      total: "12,000 UZS",
      pickupTime: "16:00 - 18:00",
      status: "completed",
      time: "1 hour ago",
    },
  ]

  const filteredOrders = filter === "all" ? orders : orders.filter((order) => order.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-16">
            <Link href="/business/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <h1 className="font-bold text-gray-900">Orders</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["all", "pending", "ready", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                filter === status ? "bg-[#00B14F] text-white" : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-900">{order.customer}</h3>
                  <p className="text-sm text-gray-600">{order.phone}</p>
                  <p className="text-xs text-gray-500 mt-1">{order.time}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "ready"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">{order.item}</span>
                  <span className="text-gray-900">×{order.quantity}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Pickup time</span>
                  <span className="text-gray-900">{order.pickupTime}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-[#00B14F]">{order.total}</span>
                </div>
              </div>

              {order.status === "pending" && (
                <div className="flex gap-2">
                  <Button className="flex-1 bg-[#00B14F] hover:bg-[#009940]">
                    <Check className="w-4 h-4 mr-2" />
                    Mark as ready
                  </Button>
                  <Button variant="outline" className="flex-1 text-red-600 hover:text-red-700 bg-transparent">
                    <X className="w-4 h-4 mr-2" />
                    Cancel order
                  </Button>
                </div>
              )}

              {order.status === "ready" && (
                <Button className="w-full bg-[#00B14F] hover:bg-[#009940]">
                  <Check className="w-4 h-4 mr-2" />
                  Mark as completed
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
