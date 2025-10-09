import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AppState, User } from "@/types/types"

// ===========================
// Store Implementation
// ===========================

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      
      setUser: (user: User) => set({ user }),
      
      clearUser: () => set({ user: null }),
    }),
    {
      name: "qopchiq-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist user data, not tokens (tokens in separate storage)
      partialize: (state) => ({ 
        user: state.user ? {
          name: state.user.name,
          email: state.user.email,
          isVerified: state.user.isVerified,
        } : null 
      }),
    }
  )
)

// ===========================
// Selectors (for optimized re-renders)
// ===========================

export const useUser = () => useAppStore((state) => state.user)
export const useIsAuthenticated = () => useAppStore((state) => !!state.user)
export const useUserEmail = () => useAppStore((state) => state.user?.email)
export const useUserName = () => useAppStore((state) => state.user?.name)