const isBrowser = typeof window !== "undefined"

const normalizeUrl = (url: string | undefined | null) => {
  if (!url) return undefined
  try {
    const parsed = new URL(url)
    return parsed.origin
  } catch (error) {
    console.warn("Invalid NEXT_PUBLIC_API_URL provided:", url, error)
    return undefined
  }
}

const cachedBaseUrl = normalizeUrl(process.env.NEXT_PUBLIC_API_URL)
const devFallback = process.env.NODE_ENV !== "production" ? "http://localhost:3001" : undefined

export const getApiBaseUrl = () => {
  if (cachedBaseUrl) return cachedBaseUrl
  if (!isBrowser && devFallback) {
    return devFallback
  }
  if (isBrowser) {
    return window.location.origin
  }
  throw new Error("NEXT_PUBLIC_API_URL is not defined")
}

