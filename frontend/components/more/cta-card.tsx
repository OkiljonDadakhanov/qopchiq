"use client"

import type { CTACardProps } from "@/types/more"

export function CTACard({ icon, title, actionLabel, onAction }: CTACardProps) {
  return (
    <div className="bg-gray-50 rounded-2xl p-6 mb-6 flex items-center gap-4">
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-semibold mb-1">{title}</p>
        <button 
          onClick={onAction}
          className="text-sm text-[#00B14F] underline hover:text-[#009943] transition-colors"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  )
}