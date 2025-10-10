"use client"

/**
 * tokenService — lightweight wrapper around localStorage
 * for safely storing and retrieving access tokens.
 */

const TOKEN_KEY = "qopchiq_token"

export const tokenService = {
  /**
   * 🧠 Get the token
   */
  get(): string | null {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(TOKEN_KEY)
    } catch {
      return null
    }
  },

  /**
   * 💾 Save the token
   */
  set(token: string): void {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(TOKEN_KEY, token)
    } catch {
      console.error("Failed to save token to localStorage")
    }
  },

  /**
   * ❌ Remove the token
   */
  remove(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(TOKEN_KEY)
    } catch {
      console.error("Failed to remove token from localStorage")
    }
  },

  /**
   * 🧹 Clear everything (optional)
   */
  clearAll(): void {
    if (typeof window === "undefined") return
    try {
      localStorage.clear()
    } catch {
      console.error("Failed to clear localStorage")
    }
  },
}
