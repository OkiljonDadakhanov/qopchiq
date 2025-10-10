"use client"

import axios, { AxiosError } from "axios"
import { useAppStore } from "@/store/store"
import type { AuthResponse, LoginCredentials, SignUpCredentials } from "@/types/types"

import { tokenService } from './tokenService'

// ===========================
// API Setup
// ===========================

const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
} as const

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
})

// ✅ Attach token before each request
api.interceptors.request.use(
  (config) => {
    const token = tokenService.get()
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenService.remove()
      useAppStore.getState().clearAll()
      if (typeof window !== "undefined") window.location.href = "/signin"
    }
    return Promise.reject(error)
  }
)

// ===========================
// Error Handling
// ===========================

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "An unexpected error occurred"
    throw new Error(message)
  }

  if (error instanceof Error) throw error
  throw new Error("An unknown error occurred")
}

// ===========================
// Auth API
// ===========================

export const authApi = {
  /**
   * 🔐 Login
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials)

      if (data.accessToken) tokenService.set(data.accessToken)

      const { setUser } = useAppStore.getState()
      setUser({
        name: data.user?.name ?? "User",
        email: data.user?.email ?? "",
        isVerified: data.user?.isVerified ?? false,
      })

      return data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * 🆕 Register
   */
  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(API_ENDPOINTS.SIGNUP, credentials)

      if (data.accessToken) tokenService.set(data.accessToken)

      const { setUser } = useAppStore.getState()
      setUser({
        name: data.user?.name ?? "User",
        email: data.user?.email ?? "",
        isVerified: data.user?.isVerified ?? false,
      })

      return data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * 🚪 Logout
   */
  logout: (): void => {
    tokenService.remove()
    useAppStore.getState().clearAll()
  },
}
