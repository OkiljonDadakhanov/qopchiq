// ===========================
// Routes
// ===========================

export const MORE_ROUTES = {
  PROFILE: "/profile",
  SAVED_ADDRESSES: "/saved-addresses",
  NOTIFICATIONS: "/settings/notifications",
  LOCATION: "/settings/location",
  MARKETING: "/settings/marketing",
  FAQ: "/faq",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  LICENSES: "/licenses",
  CONTACT: "/contact",
  JOIN_SELLER: "/join-seller",
  SIGNIN: "/signin",
} as const

// ===========================
// Social Media Links
// ===========================

export const SOCIAL_LINKS = {
  FACEBOOK: "https://facebook.com/qopchiq",
  INSTAGRAM: "https://instagram.com/qopchiq",
  TIKTOK: "https://tiktok.com/@qopchiq",
} as const

// ===========================
// CO2 Info
// ===========================

export const CO2_INFO = {
  title: "How do we count the CO₂ saved?",
  description:
    "We rely on data from the FAO report and estimate CO₂ savings based on typical product sets usually found in our packages — so you can see how every rescue really helps the planet 🌍💚",
} as const

// ===========================
// Toast Messages
// ===========================

export const MORE_TOAST_MESSAGES = {
  LOGOUT_SUCCESS: {
    title: "Logged out",
    description: "You have successfully signed out.",
  },
  LOGOUT_ERROR: {
    title: "Logout Failed",
    description: "Something went wrong while logging out.",
  },
} as const