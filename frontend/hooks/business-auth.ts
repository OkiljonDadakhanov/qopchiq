"use client"

import { useMutation, useQuery } from "@tanstack/react-query"

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
  return useQuery({
    queryKey: ["business-profile"],
    queryFn: getBusinessProfile,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

