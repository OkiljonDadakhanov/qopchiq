"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Package, ShoppingBag, TrendingUp, Settings, LogOut, Eye } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function BusinessDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    { label: "Active listings", value: "12", change: "+2 this week", icon: Package },
    { label: "Orders today", value: "8", change: "+3 from yesterday", icon: ShoppingBag },
    { label: "Revenue this month", value: "1.2M UZS", change: "+15% from last month", icon: TrendingUp },
    { label: "Items saved", value: "156", change: "This month", icon: Package },
  ]

  const recentOrders = [
    { id: "1", customer: "Akmal K.", item: "Surprise bag", time: "10 mins ago", status: "pending" },
    { id: "2", customer: "Dilnoza S.", item: "Bakery box", time: "25 mins ago", status: "ready" },
    { id: "3", customer: "Jasur M.", item: "Lunch combo", time: "1 hour ago", status: "completed" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="Qopchiq" width={32} height={32} className="w-8 h-8" />
              <div>
                <h1 className="font-bold text-gray-900">Green Cafe</h1>
                <p className="text-xs text-gray-500">Business Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/business/profile">
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className="w-8 h-8 text-[#00B14F]" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
              <div className="text-xs text-gray-500">{stat.change}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Quick actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/business/listings/new">
                  <Button className="w-full bg-[#00B14F] hover:bg-[#009940]">
                    <Plus className="w-4 h-4 mr-2" />
                    Add listing
                  </Button>
                </Link>
                <Link href="/business/listings">
                  <Button variant="outline" className="w-full bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    View all listings
                  </Button>
                </Link>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent orders</h2>
                <Link href="/business/orders" className="text-sm text-[#00B14F] hover:underline">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div>
                      <div className="font-medium text-gray-900">{order.customer}</div>
                      <div className="text-sm text-gray-600">{order.item}</div>
                      <div className="text-xs text-gray-500 mt-1">{order.time}</div>
                    </div>
                    <div>
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
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Impact Card */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
              <h3 className="font-bold text-gray-900 mb-4">Your impact</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">156 kg</div>
                  <div className="text-sm text-gray-600">Food waste prevented</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">312 kg</div>
                  <div className="text-sm text-gray-600">CO₂ emissions saved</div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Tips for success</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Update your listings daily for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Respond to orders within 15 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#00B14F]">•</span>
                  <span>Add photos to increase sales by 40%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
