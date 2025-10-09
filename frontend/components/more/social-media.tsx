"use client"

import { SOCIAL_LINKS } from "@/constants/more"

export function SocialMedia() {
  const handleSocialClick = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="mb-6">
      <p className="text-center text-sm text-gray-600 mb-4">Follow us</p>
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.FACEBOOK)}
          className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Facebook"
        >
          <span className="text-white text-xl font-bold">f</span>
        </button>
        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.INSTAGRAM)}
          className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="Instagram"
        >
          <span className="text-white text-xl font-bold">📷</span>
        </button>
        <button
          onClick={() => handleSocialClick(SOCIAL_LINKS.TIKTOK)}
          className="w-14 h-14 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
          aria-label="TikTok"
        >
          <span className="text-white text-xl font-bold">♪</span>
        </button>
      </div>
    </div>
  )
}