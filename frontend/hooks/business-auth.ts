"use client"

import { useMutation } from "@tanstack/react-query"

import {
  loginBusiness,
  signupBusiness,
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

