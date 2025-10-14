"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Business } from "@/types/business"

interface BusinessState {
  business: Business | null
  hasHydrated: boolean
  setBusiness: (business: Partial<Business>) => void
  clearBusiness: () => void
  clearAll: () => void
  setHasHydrated: (hydrated: boolean) => void
  setToken: (token: string) => void
  getToken: () => string | null
  clearToken: () => void
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      business: null,
      hasHydrated: false,
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      setBusiness: (business) =>
        set((state) => ({
          business: state.business
            ? { ...state.business, ...business }
            : (business as Business),
        })),
      clearBusiness: () => set({ business: null }),
      clearAll: () => set({ business: null }),
      setToken: (token) => {
        const currentBusiness = get().business
        if (currentBusiness) {
          set({ business: { ...currentBusiness, token } })
        } else {
          set({ business: { token } as Business })
        }
      },
      getToken: () => get().business?.token ?? null,
      clearToken: () => {
        const currentBusiness = get().business
        if (!currentBusiness) return
        const { token, ...rest } = currentBusiness
        set({ business: { ...rest } })
      },
    }),
    {
      name: "qopchiq-business-store",
      partialize: (state) => ({ business: state.business }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)

export const useBusiness = () => useBusinessStore((state) => state.business)
export const useBusinessToken = () => useBusinessStore((state) => state.getToken())
