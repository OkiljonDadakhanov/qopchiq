"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/store"
import { tokenService } from "@/api/tokenService"
import { useCustomToast } from "@/components/custom-toast"
import { MORE_TOAST_MESSAGES, MORE_ROUTES } from "@/constants/more"

export function useLogout() {
  const router = useRouter()
  const toast = useCustomToast()
 const clearAll = useAppStore((state) => state.clearAll)


 const logout = () => {
  try {
    // ✅ Clear both token and persisted store
    tokenService.remove()
    clearAll()

    toast.success(
      MORE_TOAST_MESSAGES.LOGOUT_SUCCESS.title,
      MORE_TOAST_MESSAGES.LOGOUT_SUCCESS.description
    )

    router.push(MORE_ROUTES.SIGNIN)
  } catch (error) {
    console.error("Logout error:", error)
    toast.error(
      MORE_TOAST_MESSAGES.LOGOUT_ERROR.title,
      MORE_TOAST_MESSAGES.LOGOUT_ERROR.description
    )
  }
}

  return { logout }
}