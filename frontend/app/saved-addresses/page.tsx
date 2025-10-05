"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Navigation } from "lucide-react"

export default function SavedAddressesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-white flex flex-col">
     

      {/* Header */}
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Saved addresses</h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-8">
        {/* Empty State */}
        <div className="bg-blue-50 rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Navigation className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-base font-semibold mb-2">Add frequently used addresses</p>
          <p className="text-base font-semibold mb-4">and save time</p>
          <button onClick={() => router.push("/add-address")} className="text-blue-600 underline font-medium">
            Add new address
          </button>
        </div>
      </div>
    </div>
  )
}
