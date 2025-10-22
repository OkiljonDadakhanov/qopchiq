"use client"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { KNOW_QOPCHIQ } from "@/constants/more"

interface KnowQopchiqModalProps {
  isOpen: boolean
  onClose: () => void
}

export function KnowQopchiqModal({ isOpen, onClose }: KnowQopchiqModalProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className="rounded-t-3xl">
        <SheetHeader className="text-center">
          <div className="flex justify-center mb-6">
            <div className="text-7xl">🥗⭐</div>
          </div>
          <SheetTitle className="text-2xl font-bold text-center">
            {KNOW_QOPCHIQ.title}
          </SheetTitle>
          <SheetDescription className="text-base text-gray-600 leading-relaxed pt-4">
            {KNOW_QOPCHIQ.description}
          </SheetDescription>
        </SheetHeader>
        <ul className="mt-4 space-y-3">
          {KNOW_QOPCHIQ.bullets.map((b, i) => (
            <li key={i} className="bg-white border border-gray-200 rounded-2xl p-4 text-sm text-gray-700">
              {b}
            </li>
          ))}
        </ul>
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


