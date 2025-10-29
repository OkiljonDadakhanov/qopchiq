"use client"

import { useRouter } from "next/navigation"
import { useCustomToast } from "@/components/custom-toast"
import { MORE_TOAST_MESSAGES, MORE_ROUTES } from "@/constants/more"
import { clearStoredAuthState } from "@/api/utils/auth-state"

export function useLogout() {
  const router = useRouter()
  const toast = useCustomToast()

  const logout = () => {
    try {
      clearStoredAuthState()

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
