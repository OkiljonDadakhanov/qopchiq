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
// Component Props
// ===========================

export interface HeaderProps {
  onFilterClick: () => void
  location: Location
}

export interface OfferCardProps {
  offer: Offer
  onClick: () => void
  onFavorite?: (offerId: number) => void
  isFavorite?: boolean
}

export interface FloatingMapButtonProps {
  onClick: () => void
}

export interface OfferListProps {
  offers: Offer[]
  onOfferClick: (offerId: number) => void
}