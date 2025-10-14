import type { ApiResponse } from "@/types/types"

export interface BusinessAuthResponse extends ApiResponse {
  accessToken?: string
  business?: Business
}

export interface Business {
  id?: string
  name: string
  email: string
  phoneNumber?: string
  description?: string
  avatar?: {
    id?: string
    url?: string
  } | null
  address?: string
  isVerified?: boolean
  isApproved?: boolean
  lastLogin?: string
  createdAt?: string
  updatedAt?: string
  token?: string
}

export interface BusinessSignupCredentials {
  name: string
  email: string
  password: string
  phoneNumber?: string
}

export interface BusinessLoginCredentials {
  email: string
  password: string
}

