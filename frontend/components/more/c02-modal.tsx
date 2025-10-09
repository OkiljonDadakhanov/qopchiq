"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { CO2_INFO } from "@/constants/more"
import type { CO2ModalProps } from "@/types/more"

export function CO2Modal({ isOpen, onClose }: CO2ModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="text-8xl">🌍💚</div>
          </div>
          <SheetTitle className="text-2xl font-bold text-center">
            {CO2_INFO.title}
          </SheetTitle>
          <SheetDescription className="text-base text-gray-600 leading-relaxed pt-4">
            {CO2_INFO.description}
          </SheetDescription>
        </SheetHeader>
        <div className="pt-6">
          <Button
            onClick={onClose}
            className="w-full bg-[#00B14F] hover:bg-[#009943] text-white rounded-full py-6 text-base font-semibold"
          >
            Got it!
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}