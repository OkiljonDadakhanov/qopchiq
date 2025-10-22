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
  SIGNUP: "/signup",
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
// Learn/Know More Content
// ===========================

export const KNOW_QOPCHIQ = {
  title: "Get to know Qopchiq better",
  description:
    "Qopchiq — ortiqcha oziq-ovqatni isrof qilmasdan, arzon narxda qutqarish uchun platforma. Siz yaqin atrofdagi restoran va do‘konlardan chegirmali paketlarni topasiz, ular odatda kun oxirida yoki muddatga yaqin qolgan mahsulotlardan tuziladi.",
  bullets: [
    "Restoranlar va do‘konlar ortiqchani yo‘q qilmasdan sotsa — tabiatga foyda",
    "Siz 30-70% gacha tejalgan narxda mazali ovqat olasiz",
    "Har bir qutqarilgan paket CO₂ chiqindilarini kamaytirishga hissa qo‘shadi",
  ],
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