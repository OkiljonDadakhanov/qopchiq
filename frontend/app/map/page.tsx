"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react"

export default function MapPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
  

      {/* Header */}
      <div className="px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => router.back()} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="font-bold text-lg">Tashkent</h2>
            <p className="text-sm text-gray-600">Within 5 km</p>
          </div>
          <button className="p-2">
            <SlidersHorizontal className="w-6 h-6" />
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-2">
          <button className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          <button className="flex-1 h-12 bg-gray-50 rounded-full px-4 flex items-center justify-center gap-2">
            <span className="text-sm">Show unavailable</span>
          </button>
        </div>
      </div>

      {/* Map View */}
      <div className="flex-1 relative bg-gray-100">
        {/* Simulated map with markers */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-blue-50">
          {/* Map markers */}
          <div className="absolute top-1/4 left-1/4 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            5
          </div>
          <div className="absolute top-1/3 right-1/4 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            4
          </div>
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            11
          </div>
          <div className="absolute bottom-1/4 right-1/3 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            3
          </div>
          <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            5
          </div>
          <div className="absolute bottom-1/2 right-1/2 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            3
          </div>
          <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            2
          </div>
          <div className="absolute bottom-1/5 right-1/5 w-12 h-12 bg-[#B8E986] rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
            2
          </div>

          {/* Center text */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-gray-400 opacity-30">
            Tashkent
          </div>
        </div>
      </div>
    </div>
  )
}
