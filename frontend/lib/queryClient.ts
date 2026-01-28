"use client"

import { QueryClient } from '@tanstack/react-query'
import { isClientError, isServerError } from '@/lib/api-utils'

// ✅ Retry configuration
function shouldRetry(error: unknown, failureCount: number): boolean {
  // Don't retry on 4xx errors
  if (isClientError(error)) {
    return false
  }
  
  // Retry server errors up to 3 times
  if (isServerError(error)) {
    return failureCount < 3
  }
  
  // For other errors, retry twice
  return failureCount < 2
}

// ✅ Professional QueryClient configuration
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => shouldRetry(error, failureCount),
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      },
      mutations: {
        retry: (failureCount, error) => shouldRetry(error, failureCount),
      },
    },
  })
}
