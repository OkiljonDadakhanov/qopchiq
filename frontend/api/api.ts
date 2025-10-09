"use client"

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import type { AuthResponse, LoginCredentials, SignUpCredentials } from "@/types/types"

// ===========================
// Constants
// ===========================

const TOKEN_KEY = "qopchiq_token" as const
const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  SIGNUP: "/api/auth/signup",
} as const

// ===========================
// Axios Instance
// ===========================

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
})

// ===========================
// Token Management
// ===========================

export const tokenService = {
  get: (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem(TOKEN_KEY)
  },
  set: (token: string): void => {
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, token)
    }
  },
  remove: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY)
    }
  },
}

// ===========================
// Interceptors
// ===========================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenService.get()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      tokenService.remove()
      // Optionally redirect to login
      if (typeof window !== "undefined") {
        window.location.href = "/signin"
      }
    }
    return Promise.reject(error)
  }
)

// ===========================
// Error Handling
// ===========================

interface ApiError {
  message: string
  statusCode?: number
}

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    // Extract error message from response
    const errorMessage = 
      error.response?.data?.message || 
      error.response?.data?.error ||
      error.message || 
      "An unexpected error occurred"
    
    const apiError: ApiError = {
      message: errorMessage,
      statusCode: error.response?.status,
    }
    
    // Create error with proper message
    const err = new Error(apiError.message)
    throw err
  }
  
  if (error instanceof Error) {
    throw error
  }
  
  throw new Error("An unknown error occurred")
}

// ===========================
// API Methods
// ===========================

export const authApi = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(
        API_ENDPOINTS.LOGIN,
        credentials
      )
      
      // Automatically store token if present
      if (data.accessToken) {
        tokenService.set(data.accessToken)
      }
      
      return data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * Register new user
   */
  signUp: async (credentials: SignUpCredentials): Promise<AuthResponse> => {
    try {
      const { data } = await api.post<AuthResponse>(
        API_ENDPOINTS.SIGNUP,
        credentials
      )
      
      // Automatically store token if present
      if (data.accessToken) {
        tokenService.set(data.accessToken)
      }
      
      return data
    } catch (error) {
      return handleError(error)
    }
  },

  /**
   * Logout user (client-side only)
   */
  logout: (): void => {
    tokenService.remove()
  },
}

// Legacy exports for backward compatibility
export const loginUser = authApi.login
export const signUpUser = authApi.signUp