import axios, { AxiosError } from "axios"
import { API_URL } from "./client"

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

// ✅ Request interceptor - Attach token from Zustand store
authClient.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined' && config.headers) {
        // ✅ Get token from Zustand stores instead of localStorage
        const { useAppStore } = require('@/store/store')
        let token = useAppStore.getState().getToken()

        if (!token) {
          try {
            const { useBusinessStore } = require('@/store/business-store')
            token = useBusinessStore.getState().getToken()
          } catch (error) {
            console.warn('Business store unavailable:', error)
          }
        }

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (e) {
      console.warn('Token retrieval failed:', e)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor - Handle errors globally
authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // ✅ Token expired or invalid - clear from Zustand store
      if (typeof window !== 'undefined') {
        const { useAppStore } = require('@/store/store')
        useAppStore.getState().clearAll()

        try {
          const { useBusinessStore } = require('@/store/business-store')
          useBusinessStore.getState().clearAll()
        } catch (error) {
          console.warn('Business store cleanup failed:', error)
        }

        const redirectTo = window.location.pathname.startsWith('/business')
          ? '/business/signin'
          : '/signin'
        window.location.href = redirectTo
      }
    }
    
    // Transform error for consistent handling
   
    
    return Promise.reject(error)
  }
)

export default authClient
