import { useMemo } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchBusinessProfile, updateBusinessProfile } from "@/api/services/business"
import type { Business } from "@/types/business"
import { useBusinessStore } from "@/store/business-store"

export const BUSINESS_PROFILE_KEY = ["business-profile"] as const

export const useFetchBusinessProfile = () => {
  const { business } = useBusinessStore()
  const hasHydrated = useBusinessStore((state) => state.hasHydrated)

  const placeholder = useMemo(() => {
    if (!business) return undefined
    return {
      ...business,
    } as Business
  }, [business])

  const { setBusiness } = useBusinessStore()

  return useQuery<Business, Error>({
    queryKey: BUSINESS_PROFILE_KEY,
    queryFn: async () => {
      const profile = await fetchBusinessProfile()
      return profile
    },
    enabled: hasHydrated && !!business?.token,
    placeholderData: placeholder ? () => placeholder : undefined,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 15,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    onSuccess: (data) => {
      if (data) {
        setBusiness({ ...data, token: business?.token })
      }
    },
  })
}

export const useUpdateBusinessProfile = () => {
  const queryClient = useQueryClient()
  const { setBusiness, business } = useBusinessStore()

  return useMutation<Business, Error, Partial<Business>>({
    mutationFn: updateBusinessProfile,
    onSuccess: (updated) => {
      setBusiness({ ...updated, token: business?.token })
      queryClient.setQueryData(BUSINESS_PROFILE_KEY, updated)
    },
  })
}

