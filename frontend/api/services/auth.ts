import client from "../client"
import authClient from "../authClient"
import type { SignUpCredentials, AuthResponse } from "../../types/types"

// ✅ Centralized error handler
const handleAuthError = (error: any): never => {
  console.error("Auth service error:", error)
  throw new Error(error?.response?.data?.message || error.message || "Authentication failed")
}

// ===============================
// AUTH SERVICES
// ===============================

export const registerUser = async (
  payload: SignUpCredentials
): Promise<AuthResponse | undefined> => {
  try {
    const { data } = await client.post("/api/auth/signup", payload)
    return data as AuthResponse
  } catch (error) {
    handleAuthError(error)
  }
}

export const loginUser = async (
  payload: { email: string; password: string }
): Promise<AuthResponse | undefined> => {
  try {
    const { data } = await client.post("/api/auth/login", payload)
    return data as AuthResponse
  } catch (error) {
    handleAuthError(error)
  }
}

export const verifyEmail = async (payload: { code: string }): Promise<void> => {
  try {
    await client.post("api/auth/verify-email", payload)
  } catch (error) {
    handleAuthError(error)
  }
}

export const logoutUser = async (): Promise<void> => {
  try {
    await authClient.post("/api/auth/logout")
  } catch (error) {
    console.warn("Logout request failed:", error)
  }
}

export const forgotPassword = async (payload: { email: string }): Promise<void> => {
  try {
    await client.post("/api/auth/forgot-password", payload)
  } catch (error) {
    handleAuthError(error)
  }
}

export const resetPassword = async (
  token: string,
  payload: { password: string }
): Promise<void> => {
  try {
    await client.post(`/api/auth/reset-password/${token}`, payload)
  } catch (error) {
    handleAuthError(error)
  }
}

export const resendVerification = async (payload: { email: string }): Promise<void> => {
  try {
    await client.post("/api/auth/resend-verification", payload)
  } catch (error) {
    handleAuthError(error)
  }
}

export default {
  registerUser,
  loginUser,
  verifyEmail,
  logoutUser,
  forgotPassword,
  resetPassword,
  resendVerification,
}
