"use client"

import { useCallback } from "react"
import { Camera, User } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"

const isBlobLike = (url?: string | null) => {
  if (!url) return false
  return url.startsWith("blob:") || url.startsWith("data:")
}

type AvatarUploaderProps = {
  previewUrl?: string | null
  isUploading?: boolean
  onPick: () => void
  disabled?: boolean
}

export function AvatarUploader({ previewUrl, isUploading, onPick, disabled }: AvatarUploaderProps) {
  const handleClick = useCallback(() => {
    if (!disabled) onPick()
  }, [disabled, onPick])

  return (
    <div className="flex justify-center mb-8">
      <div className="relative">
        <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {previewUrl ? (
            isBlobLike(previewUrl) ? (
              <img src={previewUrl} alt="Profile avatar" className="w-full h-full object-cover" />
            ) : (
              <Image
                src={previewUrl}
                alt="Profile avatar"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized
              />
            )
          ) : (
            <User className="w-16 h-16 text-[#00B14F]" />
          )}
        </div>

        <button
          type="button"
          onClick={handleClick}
          disabled={disabled || isUploading}
          className={cn(
            "absolute bottom-0 right-0 w-11 h-11 rounded-full flex items-center justify-center shadow-lg",
            "bg-[#00B14F] text-white transition hover:bg-[#009940]",
            (disabled || isUploading) && "opacity-50 cursor-not-allowed"
          )}
        >
          <Camera className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

