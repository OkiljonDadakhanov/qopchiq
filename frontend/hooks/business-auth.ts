"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { useEffect, useState } from "react"

import {
  loginBusiness,
  signupBusiness,
  getBusinessProfile,
} from "@/api/services/business-auth"
import type {
  BusinessAuthResponse,
  BusinessLoginPayload,
  BusinessSignupPayload,
} from "@/types/business"
import { useBusinessToken } from "@/store/business-store"

export const useBusinessSignup = () => {
  return useMutation<BusinessAuthResponse, Error, BusinessSignupPayload>({
    mutationFn: signupBusiness,
  })
}

export const useBusinessLogin = () => {
  return useMutation<BusinessAuthResponse, Error, BusinessLoginPayload>({
    mutationFn: loginBusiness,
  })
}

export const useBusinessProfile = () => {
  const token = useBusinessToken()
  const [isMounted, setIsMounted] = useState(false)

  // Handle SSR hydration
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return useQuery({
    queryKey: ["business-profile", token],
    queryFn: async () => {
      if (!token) {
        throw new Error("No authentication token found")
      }
      return getBusinessProfile()
    },
    enabled: isMounted && !!token, // Only run after mount and if token exists
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Only retry once on failure
    refetchOnWindowFocus: false, // Don't refetch on window focus
  })
}