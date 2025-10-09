"use client"

import { ChevronRight } from "lucide-react"
import type { MenuSectionProps } from "@/types/more"

export function MenuSection({ title, icon, items }: MenuSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
        {icon}
      </div>

      {items.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="w-full flex items-center justify-between py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <span className="text-base">{item.label}</span>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      ))}
    </div>
  )
}