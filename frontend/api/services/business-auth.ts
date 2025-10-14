import client from "../client"
import authClient from "../authClient"
import type {
  BusinessAuthResponse,
  BusinessLoginCredentials,
  BusinessSignupCredentials,
} from "@/types/business"

const handleBusinessAuthError = (error: any): never => {
  console.error("Business auth error:", error)
  throw new Error(
    error?.response?.data?.message || error.message || "Business authentication failed",
  )
}

export const registerBusiness = async (
  payload: BusinessSignupCredentials,
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post("/api/business/auth/signup", payload)
    return data as BusinessAuthResponse
  } catch (error) {
    handleBusinessAuthError(error)
  }
}

export const loginBusiness = async (
  payload: BusinessLoginCredentials,
): Promise<BusinessAuthResponse> => {
  try {
    const { data } = await client.post("/api/business/auth/login", payload)
    return data as BusinessAuthResponse
  } catch (error) {
    handleBusinessAuthError(error)
  }
}

export const verifyBusinessEmail = async (payload: { code: string }): Promise<void> => {
  try {
    await client.post("/api/business/auth/verify-email", payload)
  } catch (error) {
    handleBusinessAuthError(error)
  }
}

export const logoutBusiness = async (): Promise<void> => {
  try {
    await authClient.post("/api/business/auth/logout")
  } catch (error) {
    console.warn("Business logout failed:", error)
  }
}

export const forgotBusinessPassword = async (payload: { email: string }): Promise<void> => {
  try {
    await client.post("/api/business/auth/forgot-password", payload)
  } catch (error) {
    handleBusinessAuthError(error)
  }
}

export const resetBusinessPassword = async (
  token: string,
  payload: { password: string },
): Promise<void> => {
  try {
    await client.post(`/api/business/auth/reset-password/${token}`, payload)
  } catch (error) {
    handleBusinessAuthError(error)
  }
}

