"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { CO2ModalProps } from "@/types/more"

export function CO2Modal({ isOpen, onClose, co2SavedKg = 0 }: CO2ModalProps) {
  const co2 = Math.max(0.1, co2SavedKg || 0)

  // Realistic equivalents
  const kmDrivenEq = (co2 / 0.192).toFixed(1) // 0.192 kg CO₂/km
  const smartphonesChargedEq = Math.round(co2 / 0.008) // 8 g CO₂/charge
  const treesMonthEq = (co2 / 1.75).toFixed(1) // 1.75 kg/month/tree

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl sm:max-w-md sm:mx-auto sm:rounded-3xl overflow-y-auto"
      >
        <SheetHeader className="text-center">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="text-6xl sm:text-8xl">🌍💚</div>
          </div>
          <SheetTitle className="text-xl sm:text-2xl font-bold text-center">
            Your Impact on the Planet
          </SheetTitle>
          <SheetDescription className="text-sm sm:text-base text-gray-600 leading-relaxed pt-3 sm:pt-4 px-2">
            Every meal you rescue helps cut food waste and reduce greenhouse gas
            emissions. Here’s what your saved CO₂ equals to in real life:
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 sm:mt-6 grid grid-cols-1 gap-3 sm:gap-4">
          <div className="bg-green-50 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              Your saved CO₂
            </div>
            <div className="text-2xl sm:text-3xl font-bold">{co2} kg CO₂</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              ≈ Not driving
            </div>
            <div className="text-lg sm:text-xl font-semibold">
              {kmDrivenEq} km
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              ≈ Smartphone charges
            </div>
            <div className="text-lg sm:text-xl font-semibold">
              {smartphonesChargedEq.toLocaleString()} charges
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 text-center">
            <div className="text-xs sm:text-sm text-gray-600 mb-1">
              ≈ Trees absorbing (1 month)
            </div>
            <div className="text-lg sm:text-xl font-semibold">
              {treesMonthEq} trees
            </div>
          </div>
        </div>

        <div className="pt-6 pb-3 sm:pb-4 px-2">
          <Button
            onClick={onClose}
            className="w-full bg-[#00B14F] hover:bg-[#009943] text-white rounded-full py-5 text-base sm:text-lg font-semibold"
          >
            Got it!
          </Button>
          <p className="mt-3 text-center text-[11px] sm:text-xs text-gray-400">
            Sources: U.S. EPA (2023), CarbonFund.org, WWF Forestry Report
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
