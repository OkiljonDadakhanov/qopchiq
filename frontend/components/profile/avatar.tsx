import Image from "next/image"
import { User } from "lucide-react"

export default function ProfileAvatar({
  avatarUrl,
}: {
  avatarUrl?: string | null
}) {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative w-32 h-32 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt="Profile Avatar"
            fill
            priority
            sizes="(max-width: 768px) 128px, (max-width: 1200px) 128px, 128px"
            className="object-cover"
          />
        ) : (
          <User className="w-16 h-16 text-[#00B14F]" />
        )}
      </div>
    </div>
  )
}
