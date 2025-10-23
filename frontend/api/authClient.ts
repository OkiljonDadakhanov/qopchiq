"use client"

import axios, { AxiosError } from "axios"
import { API_URL } from "./client"
import { clearStoredAuthState, getStoredAccessToken } from "./utils/auth-state"

const authClient = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 10000,
})

authClient.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

authClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearStoredAuthState()
      if (typeof window !== "undefined") {
        window.location.href = "/signin"
      }
    }
    return Promise.reject(error)
  }
)

export default authClient
