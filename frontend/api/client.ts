"use client"

import axios, { AxiosError } from 'axios'
import { getApiBaseUrl } from '@/lib/config'
import { clearStoredAuthState, getStoredAccessToken } from './utils/auth-state'

export const API_URL = getApiBaseUrl()

const client = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true,
})

client.interceptors.request.use(
  (config) => {
    const token = getStoredAccessToken()
    if (token) {
      config.headers = config.headers ?? {}
      if (!config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearStoredAuthState()
    }
    return Promise.reject(error)
  }
)

export default client
