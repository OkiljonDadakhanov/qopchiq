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
        // ✅ Get token from Zustand store instead of localStorage
        const { useAppStore } = require('@/store/store')
        const token = useAppStore.getState().getToken()
        
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
        window.location.href = '/signin'
      }
    }
    
    // Transform error for consistent handling
    const transformedError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      status: error.response?.status,
      data: error.response?.data,
    }
    
    return Promise.reject(transformedError)
  }
)

export default authClient
