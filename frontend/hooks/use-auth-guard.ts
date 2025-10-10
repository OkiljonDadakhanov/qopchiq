"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore, useHasHydrated } from "@/store/store"

interface UseAuthGuardOptions {
  redirectTo?: string
  requireAuth?: boolean
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { redirectTo = "/signin", requireAuth = true } = options
  const router = useRouter()

  const user = useAppStore((state) => state.user)
  const token = user?.token
  const hasHydrated = useHasHydrated()

  const [isChecking, setIsChecking] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Wait until Zustand store is hydrated
    if (!hasHydrated) return

    const hasAuth = !!(token && user)
    setIsAuthenticated(hasAuth)
    setIsChecking(false)

    if (requireAuth && !hasAuth) {
      router.replace(redirectTo)
    }
  }, [user, token, hasHydrated, router, redirectTo, requireAuth])

  return {
    isAuthenticated,
    isChecking,
    user,
  }
}
