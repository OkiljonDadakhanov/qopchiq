"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
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
  const searchParams = useSearchParams()
  const [showUnavailable, setShowUnavailable] = useState(false)
  const [selectedFoodTypes, setSelectedFoodTypes] = useState<string[]>([])
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [allDay, setAllDay] = useState(true)

  useEffect(() => {
    const showUnavailableParam = searchParams.get("showUnavailable")
    setShowUnavailable(showUnavailableParam === "true")

    const foodTypeParams = searchParams.getAll("foodType")
    if (foodTypeParams.length) {
      setSelectedFoodTypes(foodTypeParams)
    } else {
      const fallback = searchParams.get("foodTypes") || searchParams.get("food_type")
      setSelectedFoodTypes(fallback ? fallback.split(",").filter(Boolean) : [])
    }

    const dietParams = searchParams.getAll("dietary")
    if (dietParams.length) {
      setSelectedDiets(dietParams)
    } else {
      const fallback =
        searchParams.getAll("dietaryPreferences") || searchParams.getAll("diet") || []
      if (fallback.length) {
        setSelectedDiets(fallback)
      } else {
        const singleFallback = searchParams.get("dietaryPreferences")
        setSelectedDiets(singleFallback ? singleFallback.split(",").filter(Boolean) : [])
      }
    }
  }, [searchParams])

  const toggleFoodType = (id: string) => {
    setSelectedFoodTypes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const toggleDiet = (id: string) => {
    setSelectedDiets((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const activeFiltersCount = useMemo(
    () => selectedFoodTypes.length + selectedDiets.length + (showUnavailable ? 1 : 0),
    [selectedFoodTypes.length, selectedDiets.length, showUnavailable]
  )

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (showUnavailable) {
      params.set("showUnavailable", "true")
    }
    selectedFoodTypes.forEach((type) => params.append("foodType", type))
    selectedDiets.forEach((diet) => params.append("dietary", diet))

    router.push(`/feed${params.toString() ? `?${params.toString()}` : ""}`)
  }

  const handleReset = () => {
    setShowUnavailable(false)
    setSelectedFoodTypes([])
    setSelectedDiets([])
    setAllDay(true)
    router.push("/feed")
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
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
          <button onClick={handleReset} className="text-base font-medium underline">
            Reset filters
          </button>
          <Button
            onClick={applyFilters}
            className="flex-1 bg-[#00B14F] hover:bg-[#009940] text-white rounded-full py-6 text-base font-semibold"
          >
            Filter ({activeFiltersCount})
          </Button>
        </div>
      </div>
    </div>
  )
}
