"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function MarketingPage() {
  const router = useRouter()
  const [emailMarketing, setEmailMarketing] = useState(false)
  const [smsMarketing, setSmsMarketing] = useState(false)
  const [pushMarketing, setPushMarketing] = useState(false)
  const [partnerOffers, setPartnerOffers] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Status Bar */}
     

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Marketing Consents</h1>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <p className="text-gray-600 mb-6">
          Choose how you'd like to hear about special offers, promotions, and news from Qopchiq.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="font-semibold">Email Marketing</p>
              <p className="text-sm text-gray-600">Receive promotional emails</p>
            </div>
            <Switch checked={emailMarketing} onCheckedChange={setEmailMarketing} />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="font-semibold">SMS Marketing</p>
              <p className="text-sm text-gray-600">Receive promotional text messages</p>
            </div>
            <Switch checked={smsMarketing} onCheckedChange={setSmsMarketing} />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="font-semibold">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive promotional push notifications</p>
            </div>
            <Switch checked={pushMarketing} onCheckedChange={setPushMarketing} />
          </div>

          <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <div>
              <p className="font-semibold">Partner Offers</p>
              <p className="text-sm text-gray-600">Receive offers from our partners</p>
            </div>
            <Switch checked={partnerOffers} onCheckedChange={setPartnerOffers} />
          </div>
        </div>

        <div className="mt-8 bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            You can change these preferences at any time. Unsubscribing from marketing communications won't affect
            important service notifications about your orders.
          </p>
        </div>
      </div>
    </div>
  )
}
