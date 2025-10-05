"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"

const foodTypes = [
  { id: "meals", label: "Meals", icon: "🍽️" },
  { id: "bakery", label: "Bakery", icon: "🥐" },
  { id: "groceries", label: "Groceries", icon: "🛒" },
  { id: "plants", label: "Plants", icon: "🌸" },
  { id: "cosmetics", label: "Cosmetics", icon: "💄" },
  { id: "other", label: "Other", icon: "🔘" },
]

const dietOptions = [
  { id: "vegetarian", label: "Vegetarian", icon: "🌱" },
  { id: "vegan", label: "Vegan", icon: "🥬" },
]

export default function FiltersPage() {
  const router = useRouter()
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [allDay, setAllDay] = useState(true)

  const toggleFoodType = (id: string) => {
    setSelectedFoodTypes((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const toggleDiet = (id: string) => {
    setSelectedDiets((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const resetFilters = () => {
    setShowUnavailable(false)
    setSelectedFoodTypes([])
    setSelectedDiets([])
    setAllDay(true)
  }

  const activeFiltersCount = selectedFoodTypes.length + selectedDiets.length + (showUnavailable ? 1 : 0)

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Status Bar */}
 

      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Filters</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* Show Unavailable Toggle */}
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-2xl">👀</span>
            <span className="text-base font-medium">Show unavailable</span>
          </div>
          <Switch checked={showUnavailable} onCheckedChange={setShowUnavailable} />
        </div>

        {/* Food Type Section */}
        <div className="py-6">
          <h2 className="text-xl font-bold mb-4">Food type</h2>
          <div className="space-y-1">
            {foodTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => toggleFoodType(type.id)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{type.icon}</span>
                  <span className="text-base">{type.label}</span>
                </div>
                <Checkbox checked={selectedFoodTypes.includes(type.id)} />
              </button>
            ))}
          </div>
        </div>

        {/* Diet Section */}
        <div className="py-6">
          <h2 className="text-xl font-bold mb-4">Diet</h2>
          <div className="space-y-1">
            {dietOptions.map((diet) => (
              <button
                key={diet.id}
                onClick={() => toggleDiet(diet.id)}
                className="w-full flex items-center justify-between py-4 border-b border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{diet.icon}</span>
                  <span className="text-base">{diet.label}</span>
                </div>
                <Checkbox checked={selectedDiets.includes(diet.id)} />
              </button>
            ))}
          </div>
        </div>

        {/* Pickup Time Section */}
        <div className="py-6">
          <h2 className="text-xl font-bold mb-4">Pickup time</h2>
          <div className="flex items-center justify-between py-4">
            <span className="text-base font-medium">All day</span>
            <Switch checked={allDay} onCheckedChange={setAllDay} />
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <button onClick={resetFilters} className="text-base font-medium underline">
            Reset filters
          </button>
          <Button className="flex-1 bg-[#00B14F] hover:bg-[#009940] text-white rounded-full py-6 text-base font-semibold">
            Filter ({activeFiltersCount})
          </Button>
        </div>
      </div>
    </div>
  )
}
