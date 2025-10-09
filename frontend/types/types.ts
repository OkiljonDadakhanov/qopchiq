// ===========================
// API Response Types
// ===========================

export interface ApiResponse {
  success?: boolean
  message?: string
}

export interface AuthResponse extends ApiResponse {
  accessToken?: string
  user?: {
    name?: string
    email?: string
    isVerified?: boolean
  }
}


// ===========================
// User & Auth Types
// ===========================

export interface User {
  name: string
  email: string
  token?: string
  isVerified?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  name: string
}

// ===========================
// Store Types
// ===========================

export interface AppState {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

// ===========================
// Component Props
// ===========================

export interface FormFieldProps {
  id: string
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  icon?: React.ReactNode
}

