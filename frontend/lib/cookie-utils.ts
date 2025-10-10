// ✅ Professional cookie management utilities

// ✅ Set cookie with proper options
export function setCookie(
  name: string,
  value: string,
  options: {
    expires?: Date
    maxAge?: number
    path?: string
    domain?: string
    secure?: boolean
    httpOnly?: boolean
    sameSite?: 'strict' | 'lax' | 'none'
  } = {}
) {
  if (typeof document === 'undefined') return

  const {
    expires,
    maxAge,
    path = '/',
    domain,
    secure = process.env.NODE_ENV === 'production',
    httpOnly = false,
    sameSite = 'lax'
  } = options

  let cookieString = `${name}=${encodeURIComponent(value)}`

  if (expires) {
    cookieString += `; expires=${expires.toUTCString()}`
  }

  if (maxAge) {
    cookieString += `; max-age=${maxAge}`
  }

  cookieString += `; path=${path}`

  if (domain) {
    cookieString += `; domain=${domain}`
  }

  if (secure) {
    cookieString += '; secure'
  }

  if (httpOnly) {
    cookieString += '; httpOnly'
  }

  cookieString += `; sameSite=${sameSite}`

  document.cookie = cookieString
}

// ✅ Get cookie value
export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  
  return null
}

// ✅ Remove cookie
export function removeCookie(name: string, path: string = '/') {
  if (typeof document === 'undefined') return

  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};`
}

// ✅ Check if cookies are enabled
export function areCookiesEnabled(): boolean {
  if (typeof document === 'undefined') return false

  try {
    const testCookie = 'test-cookie'
    setCookie(testCookie, 'test')
    const enabled = getCookie(testCookie) === 'test'
    removeCookie(testCookie)
    return enabled
  } catch {
    return false
  }
}

// ✅ Token cookie management
export const tokenCookie = {
  name: 'qopchiq_token',
  
  set: (token: string, options?: Parameters<typeof setCookie>[2]) => {
    setCookie(tokenCookie.name, token, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      ...options
    })
  },
  
  get: (): string | null => {
    return getCookie(tokenCookie.name)
  },
  
  remove: () => {
    removeCookie(tokenCookie.name)
  }
}
