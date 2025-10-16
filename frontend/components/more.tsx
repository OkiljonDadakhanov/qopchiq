"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Settings, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MoreHeader } from "@/components/more/more-header"
import { ImpactSection } from "@/components/more/impact-section"
import { MenuSection } from "@/components/more/menu-section"
import { CO2Modal } from "@/components/more/c02-modal"
import { CTACard } from "@/components/more/cta-card"
import { SocialMedia } from "@/components/more/social-media"
import { TipsSection } from "@/components/more/tips-section"
import BottomNavigation from "@/components/bottom-navigation"
import { useAuthGuard } from "@/hooks/use-auth-guard"
import { useLogout } from "@/hooks/use-logout"
import { useUserName, useUserStats } from "@/store/store"
import { MORE_ROUTES } from "@/constants/more"
import type { MenuItem } from "@/types/more"

export default function MorePage() {
  const router = useRouter()
  const { logout } = useLogout()
  const [showCO2Modal, setShowCO2Modal] = useState(false)

  // Get user data from store
  const userName = useUserName() || "User"
  const userStats = useUserStats()

  // Protect this page
  const { isChecking, isAuthenticated } = useAuthGuard({
    redirectTo: MORE_ROUTES.SIGNIN,
    requireAuth: true,
  })

  // Loading state
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="w-full max-w-md min-h-screen bg-white shadow-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#00B14F] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) return null

  // Menu items configuration
  const userProfileItems: MenuItem[] = [
    {
      label: "Your profile",
      onClick: () => router.push(MORE_ROUTES.PROFILE),
    },
    {
      label: "Saved addresses",
      onClick: () => router.push(MORE_ROUTES.SAVED_ADDRESSES),
    },
  ]

  const settingsItems: MenuItem[] = [
    {
      label: "Notifications",
      onClick: () => router.push(MORE_ROUTES.NOTIFICATIONS),
    },
    {
      label: "Location",
      onClick: () => router.push(MORE_ROUTES.LOCATION),
    },
    {
      label: "Marketing consents",
      onClick: () => router.push(MORE_ROUTES.MARKETING),
    },
  ]

  const aboutItems: MenuItem[] = [
    {
      label: "FAQ",
      onClick: () => router.push(MORE_ROUTES.FAQ),
    },
    {
      label: "Terms and Conditions",
      onClick: () => router.push(MORE_ROUTES.TERMS),
    },
    {
      label: "Privacy policy",
      onClick: () => router.push(MORE_ROUTES.PRIVACY),
    },
    {
      label: "Licenses",
      onClick: () => router.push(MORE_ROUTES.LICENSES),
    },
  ]

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="relative w-full max-w-md min-h-screen flex flex-col bg-white shadow-2xl">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pb-24">
          <div className="px-6 py-6">
            {/* Header */}
            <MoreHeader
              userName={userName}
              onProfileClick={() => router.push(MORE_ROUTES.PROFILE)}
            />

            {/* Impact Section */}
            <ImpactSection
              stats={userStats}
              onInfoClick={() => setShowCO2Modal(true)}
            />

            {/* User Profile Section */}
            <MenuSection title="User profile" items={userProfileItems} />

            {/* Tips Section */}
            <TipsSection />

            {/* Access Settings Section */}
            <MenuSection
              title="Access settings"
              icon={<Settings className="w-5 h-5 text-gray-400" />}
              items={settingsItems}
            />

            {/* Contact CTA */}
            <CTACard
              icon={<Mail className="w-6 h-6 text-gray-600" />}
              title="Something on your mind?"
              actionLabel="Get in touch"
              onAction={() => router.push(MORE_ROUTES.CONTACT)}
            />

            {/* About Section */}
            <MenuSection
              title="About"
              icon={<span className="text-xl">📖</span>}
              items={aboutItems}
            />

            {/* Seller CTA */}
            <CTACard
              icon={<span className="text-2xl">⭐</span>}
              title="Want to start selling surplus on Qopchiq?"
              actionLabel="Join Qopchiq"
              onAction={() => router.push(MORE_ROUTES.JOIN_SELLER)}
            />

            {/* Social Media */}
            <SocialMedia />

            {/* Logout Button */}
            <Button
              onClick={logout}
              variant="outline"
              className="w-full py-6 rounded-full text-base font-semibold border-2 hover:bg-gray-50"
            >
              Logout
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />

        {/* CO2 Modal */}
        <CO2Modal isOpen={showCO2Modal} onClose={() => setShowCO2Modal(false)} />
      </div>
    </div>
  )
}