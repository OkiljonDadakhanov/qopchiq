import Image from "next/image"
import { User } from "lucide-react"

const isValidRemoteUrl = (src?: string | null) => {
  if (!src) return false
  try {
    const url = new URL(src)
    return url.protocol === "https:" || url.protocol === "http:"
  } catch {
    return false
  }
}

export default function ProfileAvatar({
  avatarUrl,
}: {
  avatarUrl?: string | null
}) {
  const canRenderImage = isValidRemoteUrl(avatarUrl)

  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
        {canRenderImage && avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile avatar"
            fill
            sizes="128px"
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <User className="w-16 h-16 text-[#00B14F]" />
        )}
      </div>
    </div>
  )
}
