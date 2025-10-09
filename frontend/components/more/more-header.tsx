"use client"

import { User } from "lucide-react"
import type { MoreHeaderProps } from "@/types/more"

export function MoreHeader({ userName, onProfileClick }: MoreHeaderProps) {
  // Get first name from full name
  const firstName = userName?.split(" ")[0] || "User"

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-3xl font-bold">Hey, {firstName}!</h1>
      <button
        onClick={onProfileClick}
        className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
        aria-label="Go to profile"
      >
        <User className="w-6 h-6 text-[#00B14F]" />
      </button>
    </div>
  )
}