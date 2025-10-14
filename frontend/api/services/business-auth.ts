import axios from "axios"

import client from "@/api/client"
import { useBusinessStore } from "@/store/business-store"
import type {
  BusinessAuthResponse,
  BusinessLoginPayload,
  BusinessSignupPayload,
} from "@/types/business"

const BUSINESS_ENDPOINTS = {
  signup: "/api/auth/business/signup",
  login: "/api/auth/business/login",
}

const persistBusinessSession = (data: BusinessAuthResponse) => {
  const { setBusiness } = useBusinessStore.getState()
  setBusiness({
    business: data.business ?? null,
    token: data.accessToken ?? null,
  })
}

const handleBusinessError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      (error.response?.data as { message?: string; error?: string })?.message ||
      (error.response?.data as { message?: string; error?: string })?.error ||
      error.message ||
      "Business authentication failed"
    throw new Error(message)
  }

  if (error instanceof Error) {
    throw error
  }

  throw new Error("An unexpected error occurred")
}

export const signupBusiness = async (
  payload: BusinessSignupPayload
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post<BusinessAuthResponse>(BUSINESS_ENDPOINTS.signup, payload)
    persistBusinessSession(data)
    return data
  } catch (error) {
    return handleBusinessError(error)
  }
}

export const loginBusiness = async (
  payload: BusinessLoginPayload
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post<BusinessAuthResponse>(BUSINESS_ENDPOINTS.login, payload)
    persistBusinessSession(data)
    return data
  } catch (error) {
    return handleBusinessError(error)
  }
}

export const logoutBusiness = () => {
  const { clear } = useBusinessStore.getState()
  clear()
}

