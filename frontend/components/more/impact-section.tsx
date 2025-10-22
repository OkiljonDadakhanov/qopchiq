"use client"

import { Package } from "lucide-react"
import type { ImpactSectionProps } from "@/types/more"

export function ImpactSection({ stats, onInfoClick }: ImpactSectionProps) {
  const co2 = Math.max(0.1, stats.co2Saved || 0)
  const rescued = Math.max(3, stats.packagesRescued || 0)
  const savedMoney = Math.max(75000, stats.moneySaved || 0)
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Your impact in numbers!</h2>

      {/* CO2 Card */}
      <div className="bg-gradient-to-br from-green-100 to-green-50 rounded-3xl p-6 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-semibold mb-1">What does saving</p>
            <p className="text-lg font-semibold">{co2} kg of CO₂ really mean?</p>
            <button onClick={onInfoClick} className="text-sm text-[#00B14F] underline mt-2">
              Find out!
            </button>
          </div>
          <div className="text-6xl">🌍</div>
        </div>
      </div>

      {/* Info Button */}
      <button
        onClick={onInfoClick}
        className="flex items-center gap-2 text-sm text-gray-600 mb-4 hover:text-gray-800 transition-colors"
      >
        <span>ℹ️</span>
        <span className="underline">
          Curious how we count it? Click here to see!
        </span>
      </button>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
            <Package className="w-6 h-6 text-gray-600" />
          </div>
          <p className="text-sm text-gray-600 mb-1">Packages rescued</p>
          <p className="text-3xl font-bold">{rescued}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-3">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Savings</p>
          <p className="text-3xl font-bold">
            {savedMoney.toLocaleString()} <span className="text-lg">UZS</span>
          </p>
        </div>
      </div>
    </div>
  )
}