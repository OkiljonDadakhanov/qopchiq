"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState, User } from "@/types/types"
import type { UserStats } from "@/types/more"

// ===========================
// Types
// ===========================

interface ExtendedAppState extends AppState {
  // ✅ Stats
  userStats: UserStats
  setUserStats: (stats: UserStats) => void
  clearUserStats: () => void

  // ✅ Hydration
  hasHydrated: boolean
  setHasHydrated: (value: boolean) => void

  // ✅ User management
  setUser: (user: Partial<User>) => void
  clearUser: () => void
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
  packagesRescued: 3,
  co2Saved: 1,
  moneySaved: 75000,
}

// ===========================
// Zustand Store
// ===========================

export const useAppStore = create<ExtendedAppState>()(
  persist(
    (set, get) => ({
      // ===================
      // State
      // ===================
      user: null,
      userStats: DEFAULT_STATS,
      hasHydrated: false,

      // ===================
      // Hydration
      // ===================
      setHasHydrated: (value) => set({ hasHydrated: value }),

      // ===================
      // User management
      // ===================
      setUser: (user) =>
        set((state) => ({
          // ✅ merge updates to preserve token or other fields
          user: state.user ? { ...state.user, ...user } : user as User,
        })),

      clearUser: () => set({ user: null }),

      clearAll: () =>
        set({
          user: null,
          userStats: DEFAULT_STATS,
        }),

      // ===================
      // Stats
      // ===================
      setUserStats: (stats) => set({ userStats: stats }),
      clearUserStats: () => set({ userStats: DEFAULT_STATS }),

      // ===================
      // Token helpers
      // ===================
      setToken: (token) => {
        const currentUser = get().user
        if (currentUser) {
          set({ user: { ...currentUser, token } })
        } else {
          // ✅ create new user with token only (e.g., after login)
          set({ user: { token } as User })
        }
      },

      getToken: () => get().user?.token || null,

      clearToken: () => {
        const currentUser = get().user
        if (currentUser) {
          const { token, ...rest } = currentUser
          set({ user: { ...rest, token: undefined } })
        }
      },
    }),
    {
      name: "qopchiq-store", // key in localStorage
      partialize: (state) => ({
        // ✅ persist only minimal data
        user: state.user,
        userStats: state.userStats,
      }),
      onRehydrateStorage: () => (state) => {
        // ✅ runs after Zustand rehydrates from localStorage
        state?.setHasHydrated(true)
      },
    }
  )
)

// ===========================
// Selectors (optional helpers)
// ===========================

export const useUser = () => useAppStore((s) => s.user)
export const useUserEmail = () => useAppStore((s) => s.user?.email)
export const useUserName = () => useAppStore((s) => s.user?.name)
export const useUserStats = () => useAppStore((s) => s.userStats)
export const useHasHydrated = () => useAppStore((s) => s.hasHydrated)
export const useIsAuthenticated = () =>
  useAppStore((s) => !!s.user && !!s.user?.token)

export const useToken = () => useAppStore((s) => s.getToken())
export const useSetToken = () => useAppStore((s) => s.setToken)
export const useClearToken = () => useAppStore((s) => s.clearToken)
