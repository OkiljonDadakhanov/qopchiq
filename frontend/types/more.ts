// ===========================
// User Stats Types
// ===========================

export interface UserStats {
  packagesRescued: number
  co2Saved: number
  moneySaved: number
}

// ===========================
// Component Props
// ===========================

export interface MoreHeaderProps {
  userName: string
  onProfileClick: () => void
}

export interface ImpactSectionProps {
  stats: UserStats
  onInfoClick: () => void
}

export interface StatsCardsProps {
  packagesRescued: number
  moneySaved: number
}

export interface MenuSectionProps {
  title: string
  icon?: React.ReactNode
  items: MenuItem[]
}

export interface MenuItem {
  label: string
  onClick: () => void
}

export interface CO2ModalProps {
  isOpen: boolean
  onClose: () => void
}

export interface CTACardProps {
  icon: React.ReactNode
  title: string
  actionLabel: string
  onAction: () => void
}