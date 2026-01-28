// ===========================
// API Response Types
// ===========================

export interface ApiResponse {
  success?: boolean
  message?: string
  error?: string
}

export interface AuthResponse extends ApiResponse {
  accessToken?: string
  user?: {
    id?: string
    name?: string
    email?: string
    isVerified?: boolean
    phone?: string
    avatar?: string
    createdAt?: string
    updatedAt?: string
  }
}

export interface ApiError {
  message: string
  status?: number
  data?: any
}


// ===========================
// User & Auth Types
// ===========================

export interface User {
  id?: string
  name: string
  email: string
  token?: string
  isVerified?: boolean
  phone?: string
  avatar?: {
    id: string
    url: string
  } | null
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpCredentials extends LoginCredentials {
  name: string
}

export interface ForgotPasswordCredentials {
  email: string
}

export interface ResetPasswordCredentials {
  password: string
  confirmPassword?: string
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
  disabled?: boolean
  error?: string
}

// ===========================
// Navigation Types
// ===========================

export interface NavigationItem {
  label: string
  href: string
  icon?: React.ReactNode
  active?: boolean
}

// ===========================
// Common Types
// ===========================

export type LoadingState = 'idle' | 'pending' | 'success' | 'error'

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ===========================
// Listing & Reservation Types
// ===========================

export interface ListingLocation {
  city: string
  country: string
  address?: string
}

export interface ListingPrice {
  amount: number
  currency: string
}

export interface Listing {
  id: string
  title: string
  description: string
  location: ListingLocation
  price: ListingPrice
  images: string[]
  amenities: string[]
  rating?: number | null
  createdAt: string
  updatedAt: string
}

export interface CreateListingPayload {
  title: string
  description?: string
  location?: Partial<ListingLocation>
  price?: Partial<ListingPrice>
  images?: string[]
  amenities?: string[]
  rating?: number | null
}

export interface UpdateListingPayload extends Partial<CreateListingPayload> {}

export type ReservationStatus = "pending" | "confirmed" | "cancelled" | "completed"

export interface Reservation {
  id: string
  listingId: string
  guestName: string
  guestEmail: string
  guests: number
  startDate: string
  endDate: string
  status: ReservationStatus
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CreateReservationPayload {
  listingId: string
  guestName?: string
  guestEmail?: string
  guests?: number
  startDate?: string
  endDate?: string
  status?: ReservationStatus
  notes?: string
}

export interface UpdateReservationPayload extends Partial<CreateReservationPayload> {}

