"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/store"

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = "/signin", requireAuth = true } = options
  const router = useRouter()

  // ✅ Get user & token directly from Zustand store
  const user = useAppStore((state) => state.user)
  const token = user?.token

  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const hasAuth = !!(token && user)

      setIsAuthenticated(hasAuth)
      setIsChecking(false)

      // Redirect if required but not authenticated
      if (requireAuth && !hasAuth) {
        router.replace(redirectTo)
      }
    }

    checkAuth()
  }, [user, token, router, redirectTo, requireAuth])

  return {
    isAuthenticated,
    isChecking,
    user,
  }
}
