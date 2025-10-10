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
  setUser: (user: User) => void
  clearUser: () => void
  setUserStats: (stats: UserStats) => void
  clearUserStats: () => void
  clearAll: () => void
  // ✅ Token management methods
  setToken: (token: string) => void
  getToken: () => string | null
  clearToken: () => void
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
    (set, get) => ({
      user: null,
      userStats: DEFAULT_STATS,

      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),

      setUserStats: (stats) => set({ userStats: stats }),
      clearUserStats: () => set({ userStats: DEFAULT_STATS }),

      clearAll: () => set({ user: null, userStats: DEFAULT_STATS }),

      // ✅ Token management - only store in Zustand, not localStorage
      setToken: (token: string) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, token } })
        }
      },
      
      getToken: () => {
        const currentUser = get().user
        return currentUser?.token || null
      },
      
      clearToken: () => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, token: undefined } })
        }
      },
    }),
    {
      name: 'qopchiq-store',
      partialize: (state) => ({ user: state.user }),
    }
  )
)

// ===========================
// Selectors (for convenience)
// ===========================

export const useUser = () => useAppStore((s) => s.user)
export const useUserEmail = () => useAppStore((s) => s.user?.email)
export const useUserName = () => useAppStore((s) => s.user?.name)
export const useUserStats = () => useAppStore((s) => s.userStats)
export const useIsAuthenticated = () => useAppStore((s) => !!s.user)
// ✅ Token selectors
export const useToken = () => useAppStore((s) => s.getToken())
export const useSetToken = () => useAppStore((s) => s.setToken)
export const useClearToken = () => useAppStore((s) => s.clearToken)
