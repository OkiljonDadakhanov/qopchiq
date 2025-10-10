import type { ApiError } from '@/types/types'

// ✅ Professional API error handling utilities
export class ApiError extends Error {
  public status?: number
  public data?: any

  constructor(message: string, status?: number, data?: any) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// ✅ Transform axios errors to consistent format
export function transformApiError(error: any): ApiError {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response
    const message = data?.message || data?.error || `HTTP ${status} Error`
    return new ApiError(message, status, data)
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError('Network error - please check your connection', 0)
  } else {
    // Something else happened
    return new ApiError(error.message || 'An unexpected error occurred')
  }
}

// ✅ Check if error is a network error
export function isNetworkError(error: any): boolean {
  return !error.response && error.request
}

// ✅ Check if error is a server error (5xx)
export function isServerError(error: any): boolean {
  return error.response?.status >= 500
}

// ✅ Check if error is a client error (4xx)
export function isClientError(error: any): boolean {
  return error.response?.status >= 400 && error.response?.status < 500
}

// ✅ Get user-friendly error message
export function getUserFriendlyMessage(error: any): string {
  if (isNetworkError(error)) {
    return 'Please check your internet connection and try again.'
  }
  
  if (isServerError(error)) {
    return 'Server is temporarily unavailable. Please try again later.'
  }
  
  if (isClientError(error)) {
    const status = error.response?.status
    
    switch (status) {
      case 401:
        return 'Please sign in to continue.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 422:
        return error.response?.data?.message || 'Please check your input and try again.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      default:
        return error.response?.data?.message || 'Something went wrong. Please try again.'
    }
  }
  
  return error.message || 'An unexpected error occurred.'
}

// ✅ Retry configuration for different error types
export function shouldRetry(error: any, attempt: number): boolean {
  // Don't retry client errors (4xx)
  if (isClientError(error)) {
    return false
  }
  
  // Retry network errors and server errors up to 3 times
  if (isNetworkError(error) || isServerError(error)) {
    return attempt < 3
  }
  
  return false
}

// ✅ Delay function for retries
export function getRetryDelay(attempt: number): number {
  // Exponential backoff with jitter
  const baseDelay = Math.min(1000 * Math.pow(2, attempt), 30000)
  const jitter = Math.random() * 1000
  return baseDelay + jitter
}
