// ===============================
// User & Profile Models
// ===============================
import type { User } from './types'

export interface UserProfile extends User {
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

// ===============================
// API Payloads
// ===============================
export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
  avatar?: string
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

// ===============================
// API Response
// ===============================
export interface ProfileResponse {
  user: UserProfile
}
