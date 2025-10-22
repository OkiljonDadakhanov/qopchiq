// ===============================
// User & Profile Models
// ===============================
import type { User } from './types'


export interface UserProfile extends User {
  phone?: string
  phoneNumber?: string // API field name
  createdAt: string
  updatedAt: string
  lastLogin?: string
}

// ===============================
// Avatar Types
// ===============================
export interface AvatarData {
  id: string
  url: string
}

// ===============================
// API Payloads
// ===============================
export interface UpdateProfileData {
  name?: string
  email?: string
  phone?: string
}

export interface CreatedAt {
  createdAt?: Date
}

export interface UpdateAvatar {
  avatar: AvatarData
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface AvatarUpdateResponse {
  message: string
  user: UserProfile
}

// ===============================
// API Response
// ===============================
export interface ProfileResponse {
  user: UserProfile
}
