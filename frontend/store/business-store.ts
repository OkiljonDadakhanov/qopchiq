"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { BusinessAccount } from "@/types/business"

type BusinessState = {
  business: BusinessAccount | null
  token: string | null
  setBusiness: (payload: { business?: BusinessAccount | null; token?: string | null }) => void
  clear: () => void
}

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set) => ({
      business: null,
      token: null,
      setBusiness: ({ business, token }) =>
        set((state) => ({
          business: business ?? state.business,
          token: token ?? state.token,
        })),
      clear: () => set({ business: null, token: null }),
    }),
    {
      name: "qopchiq-business-store",
      partialize: (state) => ({ business: state.business, token: state.token }),
    }
  )
)

export const useBusinessToken = () => useBusinessStore((state) => state.token)
export const useBusinessAccount = () => useBusinessStore((state) => state.business)

