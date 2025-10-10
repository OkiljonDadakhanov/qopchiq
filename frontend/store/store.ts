"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState, User } from "@/types/types"
import type { UserStats } from "@/types/more"

// ===========================
// Types
// ===========================

interface ExtendedAppState extends AppState {
  userStats: UserStats
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void

  setUser: (user: User) => void
  clearUser: () => void
  setUserStats: (stats: UserStats) => void
  clearUserStats: () => void
  clearAll: () => void

  // ✅ Token helpers
  setToken: (token: string) => void
  getToken: () => string | null
  clearToken: () => void
}

// ===========================
// Defaults
// ===========================

const DEFAULT_STATS: UserStats = {
  packagesRescued: 0,
  co2Saved: 0,
  moneySaved: 0,
}

// ===========================
// Zustand Store
// ===========================

export const useAppStore = create<ExtendedAppState>()(
  persist(
    (set, get) => ({
      user: null,
      userStats: DEFAULT_STATS,
      hasHydrated: false,

      setHasHydrated: (value) => set({ hasHydrated: value }),

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      setUserStats: (stats) => set({ userStats: stats }),
      clearUserStats: () => set({ userStats: DEFAULT_STATS }),

      clearAll: () =>
        set({
          user: null,
          userStats: DEFAULT_STATS,
        }),

      // ✅ Token management
      setToken: (token: string) => {
        const currentUser = get().user
        if (currentUser) set({ user: { ...currentUser, token } })
      },

      getToken: () => get().user?.token || null,

      clearToken: () => {
        const currentUser = get().user
        if (currentUser) set({ user: { ...currentUser, token: undefined } })
      },
    }),
    {
      name: "qopchiq-store",
      partialize: (state) => ({
        user: state.user,
        userStats: state.userStats,
      }),
      onRehydrateStorage: () => (state) => {
        // ✅ This runs after Zustand rehydrates localStorage
        state?.setHasHydrated(true)
      },
    }
  )
)

// ===========================
// Selectors
// ===========================

export const useUser = () => useAppStore((s) => s.user)
export const useUserEmail = () => useAppStore((s) => s.user?.email)
export const useUserName = () => useAppStore((s) => s.user?.name)
export const useUserStats = () => useAppStore((s) => s.userStats)
export const useHasHydrated = () => useAppStore((s) => s.hasHydrated)
export const useIsAuthenticated = () =>
  useAppStore((s) => !!s.user && !!s.user?.token)

// ✅ Token helpers
export const useToken = () => useAppStore((s) => s.getToken())
export const useSetToken = () => useAppStore((s) => s.setToken)
export const useClearToken = () => useAppStore((s) => s.clearToken)
