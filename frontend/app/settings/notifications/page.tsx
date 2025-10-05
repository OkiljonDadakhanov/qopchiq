"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function NotificationsPage() {
  const router = useRouter()
  const [pushNotifications, setPushNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [newOffers, setNewOffers] = useState(true)
  const [promotions, setPromotions] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
    

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">Manage how you receive notifications from Qopchiq.</p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-4">Notification Channels</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">Push Notifications</p>
                  <p className="text-sm text-gray-600">Receive notifications on your device</p>
                </div>
                <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="font-semibold">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive updates via email</p>
                </div>
                <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold mb-4">Notification Types</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-semibold">Order Updates</p>
                  <p className="text-sm text-gray-600">Status changes and pickup reminders</p>
                </div>
                <Switch checked={orderUpdates} onCheckedChange={setOrderUpdates} />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="font-semibold">New Offers</p>
                  <p className="text-sm text-gray-600">When new packages are available nearby</p>
                </div>
                <Switch checked={newOffers} onCheckedChange={setNewOffers} />
              </div>
              <div className="flex items-center justify-between py-3 border-t border-gray-100">
                <div>
                  <p className="font-semibold">Promotions</p>
                  <p className="text-sm text-gray-600">Special deals and discounts</p>
                </div>
                <Switch checked={promotions} onCheckedChange={setPromotions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
