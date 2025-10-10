import { cookies } from 'next/headers'

// ✅ Server-side cookie utilities for SSR

// ✅ Get token from server-side cookies
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('qopchiq_token')
    return token?.value || null
  } catch (error) {
    console.warn('Failed to get server token:', error)
    return null
  }
}

// ✅ Check if user is authenticated on server
export async function isServerAuthenticated(): Promise<boolean> {
  const token = await getServerToken()
  return !!token
}

// ✅ Get user data from server (if needed for SSR)
export async function getServerUser() {
  const token = await getServerToken()
  
  if (!token) {
    return null
  }

  try {
    // ✅ Make authenticated request to get user data
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.user || data
  } catch (error) {
    console.warn('Failed to fetch server user:', error)
    return null
  }
}
