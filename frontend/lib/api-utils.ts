import type { ApiErrorData, ApiErrorInstance, ApiResponseError } from '@/types/errors'
import { isApiResponseError, isApiRequestError } from '@/types/errors'

// ✅ Professional API error handling utilities
export class ApiError extends Error {
  public status?: number
  public data?: ApiErrorData

  constructor(message: string, status?: number, data?: ApiErrorData) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

// ✅ Transform axios errors to consistent format
export function transformApiError(error: unknown): ApiError {
  if (isApiResponseError(error)) {
    // Server responded with error status
    const { status, data } = error.response
    const message = data?.message || data?.error || `HTTP ${status} Error`
    return new ApiError(message, status, data)
  } else if (isApiRequestError(error)) {
    // Request was made but no response received
    return new ApiError('Network error - please check your connection', 0)
  } else if (error instanceof Error) {
    // Something else happened with a proper Error object
    return new ApiError(error.message)
  } else {
    // Fallback for unknown error types
    return new ApiError('An unexpected error occurred')
  }
}

// ✅ Check if error is a network error
export function isNetworkError(error: unknown): boolean {
  return isApiRequestError(error)
}

// ✅ Check if error is a server error (5xx)
export function isServerError(error: unknown): boolean {
  return isApiResponseError(error) && error.response.status >= 500
}

// ✅ Check if error is a client error (4xx)
export function isClientError(error: unknown): boolean {
  return isApiResponseError(error) && 
    error.response.status >= 400 && 
    error.response.status < 500
}

// ✅ Get user-friendly error message
export function getUserFriendlyMessage(error: unknown): string {
  if (isNetworkError(error)) {
    return 'Please check your internet connection and try again.'
  }
  
  if (isServerError(error)) {
    return 'Server is temporarily unavailable. Please try again later.'
  }
  
  if (isClientError(error)) {
    const { status, data } = (error as ApiResponseError).response
    
    switch (status) {
      case 401:
        return 'Please sign in to continue.'
      case 403:
        return 'You do not have permission to perform this action.'
      case 404:
        return 'The requested resource was not found.'
      case 422:
        return data?.message || 'Please check your input and try again.'
      case 429:
        return 'Too many requests. Please wait a moment and try again.'
      default:
        return data?.message || 'Something went wrong. Please try again.'
    }
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred.'
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
