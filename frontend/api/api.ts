"use client"

import axios, { AxiosError } from "axios"
import { useAppStore } from "@/store/store"
import type {
  AuthResponse,
  LoginCredentials,
  SignUpCredentials,
  ApiResponse,
} from "@/types/types"

import { tokenService } from "./tokenService"
import { getApiBaseUrl } from "@/lib/config"

export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh",
  LISTINGS: "/api/listings",
  RESERVATIONS: "/api/reservations",
} as const

const API_BASE_URL = getApiBaseUrl()

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
})

// ===========================
// Interceptors
// ===========================

api.interceptors.request.use(
  (config) => {
    const token = tokenService.get()
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenService.remove()
      useAppStore.getState().clearAll()
      if (typeof window !== "undefined") window.location.href = "/signin"
    }
    return Promise.reject(error)
  },
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

const persistAuthState = (data: AuthResponse) => {
  if (data.accessToken) tokenService.set(data.accessToken)

  const { setUser } = useAppStore.getState()
  setUser({
    name: data.user?.name ?? "User",
    email: data.user?.email ?? "",
    isVerified: data.user?.isVerified ?? false,
  })
}

const withErrorHandling = async <T>(callback: () => Promise<T>): Promise<T> => {
  try {
    return await callback()
  } catch (error) {
    return handleError(error)
  }
}

// ===========================
// Auth API
// ===========================

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> =>
    withErrorHandling(async () => {
      const { data } = await api.post<AuthResponse>(API_ENDPOINTS.LOGIN, credentials)
      persistAuthState(data)
      return data
    }),

  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> =>
    withErrorHandling(async () => {
      const { data } = await api.post<AuthResponse>(API_ENDPOINTS.SIGNUP, credentials)
      persistAuthState(data)
      return data
    }),

  logout: async (): Promise<ApiResponse> =>
    withErrorHandling(async () => {
      await api.post<ApiResponse>(API_ENDPOINTS.LOGOUT)
      tokenService.remove()
      useAppStore.getState().clearAll()
      return { success: true, message: "Logged out" }
    }),
}

export const apiUtils = {
  handleError,
  withErrorHandling,
}
