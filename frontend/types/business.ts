export interface BusinessAvatar {
  id?: string | null
  url: string
}

export interface BusinessBranch {
  id: string
  name: string
  address: string
  phoneNumber: string
  location?: {
    type?: string
    coordinates?: number[]
  }
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BusinessAccount {
  id?: string
  name: string
  email: string
  phoneNumber?: string
  description?: string
  address?: string
  avatar?: BusinessAvatar | null
  location?: {
    type: string
    coordinates: number[]
  }
  documents?: Array<{ id: string; url: string | null }>
  branches?: BusinessBranch[]
  lastLogin?: string
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
