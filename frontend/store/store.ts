"use client"

import { useEffect, useState } from "react"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AppState, User } from "@/types/types"
import type { UserStats } from "@/types/more"

// ===========================
// Extended Store with Stats
// ===========================

interface ExtendedAppState extends AppState {
  userStats: UserStats
  setUserStats: (stats: UserStats) => void
  clearUserStats: () => void
  clearAll: () => void // ✅ NEW helper to fully clear persisted data
}

// ===========================
// Default Values
// ===========================

const DEFAULT_STATS: UserStats = {
  packagesRescued: 0,
  co2Saved: 0,
  moneySaved: 0,
}

// ===========================
// Store Implementation
// ===========================

export const useAppStore = create<ExtendedAppState>()(
  persist(
    (set) => ({
      user: null,
      userStats: DEFAULT_STATS,

      setUser: (user: User) => set({ user }),

      clearUser: () => set({ user: null, userStats: DEFAULT_STATS }),

      setUserStats: (stats: UserStats) => set({ userStats: stats }),

      clearUserStats: () => set({ userStats: DEFAULT_STATS }),

      // ✅ Full reset: clears store + removes localStorage key
      clearAll: () => {
        set({ user: null, userStats: DEFAULT_STATS })
        localStorage.removeItem("qopchiq-storage")
      },
    }),
    {
      name: "qopchiq-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user
          ? {
            
              token: state.user.token,
        
            }
          : null,
        userStats: state.userStats,
      }),
    }
  )
)

// ===========================
// Hydration Helper
// ===========================

export const useHasHydrated = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const unsub = useAppStore.persist.onFinishHydration(() => setHydrated(true))
    setHydrated(useAppStore.persist.hasHydrated())
    return () => unsub()
  }, [])

  return hydrated
}

// ===========================
// Selectors
// ===========================

export const useUser = () => useAppStore((state) => state.user)
export const useIsAuthenticated = () => useAppStore((state) => !!state.user)
export const useUserEmail = () => useAppStore((state) => state.user?.email)
export const useUserName = () => useAppStore((state) => state.user?.name)
export const useUserStats = () => useAppStore((state) => state.userStats)
