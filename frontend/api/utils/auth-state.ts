"use client"

import type { AuthResponse } from "@/types/types"

const isBrowser = () => typeof window !== "undefined"

const logWarning = (message: string, error: unknown) => {
  if (process.env.NODE_ENV !== "production") {
    console.warn(message, error)
  }
}

const getBusinessToken = (): string | null => {
  if (!isBrowser()) return null
  try {
    const { useBusinessStore }: typeof import("@/store/business-store") = require("@/store/business-store")
    const token = useBusinessStore.getState().token
    return token ?? null
  } catch (error) {
    logWarning("Failed to access business store token", error)
    return null
  }
}

const getUserToken = (): string | null => {
  if (!isBrowser()) return null
  try {
    const { useAppStore }: typeof import("@/store/store") = require("@/store/store")
    const state = useAppStore.getState()
    if (typeof state.getToken === "function") {
      return state.getToken() ?? null
    }
    return state.user?.token ?? null
  } catch (error) {
    logWarning("Failed to access user store token", error)
    return null
  }
}

export const getStoredAccessToken = (): string | null => {
  const businessToken = getBusinessToken()
  if (businessToken) return businessToken
  return getUserToken()
}

export const clearStoredAuthState = () => {
  if (!isBrowser()) return
  try {
    const { useBusinessStore }: typeof import("@/store/business-store") = require("@/store/business-store")
    const clear = useBusinessStore.getState().clear
    if (typeof clear === "function") {
      clear()
    }
  } catch (error) {
    logWarning("Failed to clear business auth state", error)
  }

  try {
    const { useAppStore }: typeof import("@/store/store") = require("@/store/store")
    const clearAll = useAppStore.getState().clearAll
    if (typeof clearAll === "function") {
      clearAll()
    }
  } catch (error) {
    logWarning("Failed to clear user auth state", error)
  }
}

export const syncUserAuthState = (data: AuthResponse | null | undefined) => {
  if (!data || !isBrowser()) return
  try {
    const { useAppStore }: typeof import("@/store/store") = require("@/store/store")
    const { setUser } = useAppStore.getState()
    if (typeof setUser === "function") {
      setUser({
        name: data.user?.name ?? "User",
        email: data.user?.email ?? "",
        token: data.accessToken ?? data.user?.token ?? null,
        isVerified: data.user?.isVerified ?? false,
      })
    }
  } catch (error) {
    logWarning("Failed to synchronise user auth state", error)
  }
}
