import { useMutation, useQueryClient } from "@tanstack/react-query"
import {
  registerBusiness,
  loginBusiness,
  logoutBusiness,
  verifyBusinessEmail,
  forgotBusinessPassword,
  resetBusinessPassword,
} from "@/api/services/business-auth"
import type {
  BusinessLoginCredentials,
  BusinessSignupCredentials,
} from "@/types/business"
import { useBusinessStore } from "@/store/business-store"
import { BUSINESS_PROFILE_KEY } from "@/hooks/business"

const useSyncBusiness = () => {
  const { setBusiness } = useBusinessStore()

  return (payload?: {
    accessToken?: string
    business?: {
      id?: string
      name?: string
      email?: string
      phoneNumber?: string
      avatar?: any
      isVerified?: boolean
    }
  }) => {
    if (!payload) return
    setBusiness({
      id: (payload.business as any)?.id ?? (payload.business as any)?._id,
      name: payload.business?.name ?? "",
      email: payload.business?.email ?? "",
      phoneNumber: payload.business?.phoneNumber,
      avatar: payload.business?.avatar ?? null,
      isVerified: payload.business?.isVerified,
      isApproved: (payload.business as any)?.isApproved,
      token: payload.accessToken,
    })
  }
}

export const useBusinessLogin = () => {
  const syncBusiness = useSyncBusiness()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (credentials: BusinessLoginCredentials) =>
      loginBusiness(credentials),
    onSuccess: (data) => {
      syncBusiness(data)
      queryClient.invalidateQueries({ queryKey: BUSINESS_PROFILE_KEY })
    },
  })
}

export const useBusinessRegister = () => {
  const syncBusiness = useSyncBusiness()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: BusinessSignupCredentials) => registerBusiness(payload),
    onSuccess: (data) => {
      syncBusiness(data)
      queryClient.invalidateQueries({ queryKey: BUSINESS_PROFILE_KEY })
    },
  })
}

export const useBusinessVerifyEmail = () => {
  return useMutation({
    mutationFn: verifyBusinessEmail,
  })
}

export const useBusinessForgotPassword = () => {
  return useMutation({
    mutationFn: forgotBusinessPassword,
  })
}

export const useBusinessResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      resetBusinessPassword(token, { password }),
  })
}

export const useBusinessLogout = () => {
  const { clearAll } = useBusinessStore()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logoutBusiness,
    onSettled: () => {
      clearAll()
      queryClient.removeQueries({ queryKey: BUSINESS_PROFILE_KEY })
    },
  })
}

