// ===========================
// Offer Types
// ===========================

export interface Offer {
  id: number
  name: string
  description: string
  image: string
  originalPrice: number
  discountPrice: number
  rating: number
  distance: string
  time: string
  packagesLeft: string
  logo: string
}

export interface Location {
  city: string
  radius: string
  coordinates?: {
    lat: number
    lng: number
  }
}

// ===========================
// API Response Types
// ===========================

export interface OffersResponse {
  offers: Offer[]
  total: number
  hasMore: boolean
}

export interface OfferFilters {
  maxDistance?: number
  minRating?: number
  maxPrice?: number
  categories?: string[]
  sortBy?: "distance" | "price" | "rating"
}

// ===========================
// Component Props
// ===========================

export interface OfferCardProps {
  offer: Offer
  onClick: () => void
  onFavorite?: (offerId: number) => void
  isFavorite?: boolean
}