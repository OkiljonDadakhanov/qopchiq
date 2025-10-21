"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import type { BusinessAccount } from "@/types/business"

type BusinessState = {
  business: BusinessAccount | null
  token: string | null
  isHydrated: boolean
  setBusiness: (payload: { business?: BusinessAccount | null; token?: string | null }) => void
  clear: () => void
  setHydrated: () => void
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business: null,
      token: null,
      isHydrated: false,
      setBusiness: ({ business, token }) =>
        set((state) => ({
          business: business ?? state.business,
          token: token ?? state.token,
        })),
      clear: () => set({ business: null, token: null }),
      setHydrated: () => set({ isHydrated: true }),
    }),
    {
      name: "qopchiq-business-store",
      storage: createJSONStorage(() => {
        // Check if we're in browser environment
        if (typeof window !== "undefined") {
          return localStorage
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      }),
      partialize: (state) => ({ 
        business: state.business, 
        token: state.token 
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated()
      },
    }
  )
)

export const useBusinessToken = () => useBusinessStore((state) => state.token)
export const useBusinessAccount = () => useBusinessStore((state) => state.business)
export const useBusinessIsHydrated = () => useBusinessStore((state) => state.isHydrated)