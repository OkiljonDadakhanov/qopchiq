"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { LogOut, UserCircle2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logoutBusiness } from "@/api/services/business-auth"
import { useBusinessAccount, useBusinessIsHydrated } from "@/store/business-store"

const FALLBACK_NAME = "Business"

export default function BusinessProfileMenu() {
  const router = useRouter()
  const business = useBusinessAccount()
  const isHydrated = useBusinessIsHydrated()

  const handleProfile = useCallback(() => {
    router.push("/business/profile")
  }, [router])

  const handleLogout = useCallback(async () => {
    await logoutBusiness()
    router.push("/business/signin")
  }, [router])

  if (!isHydrated) {
    return null
  }

  const displayName = business?.name?.trim() || FALLBACK_NAME
  const email = business?.email || ""

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 px-2 sm:px-3" aria-label="Open business profile menu">
          <UserCircle2 className="h-6 w-6" />
          <span className="hidden sm:flex flex-col text-left leading-tight">
            <span className="text-sm font-medium text-gray-900">{displayName}</span>
            {email ? <span className="text-xs text-gray-500">{email}</span> : null}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">{displayName}</span>
            {email ? <span className="text-xs text-gray-500">{email}</span> : null}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            handleProfile()
          }}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault()
            void handleLogout()
          }}
          className="flex items-center gap-2 text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
