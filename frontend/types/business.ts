export interface BusinessAccount {
  id?: string
  name: string
  email: string
  phoneNumber?: string
  description?: string
  address?: string
  avatar?: string | { id: string; url: string }
  isVerified?: boolean
  isApproved?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BusinessAuthResponse {
  success?: boolean
  message?: string
  accessToken?: string
  business?: BusinessAccount
}

export interface BusinessSignupPayload {
  name: string
  email: string
  password: string
  phoneNumber: string
  description?: string
  address?: string
  businessType?: string
}

export interface BusinessLoginPayload {
  email: string
  password: string
}

