import client from "@/api/client"
import type { Product } from "@/types/product"

export const fetchFavorites = async () => {
  const { data } = await client.get<{ success: boolean; favorites: Product[] }>("/api/favorites")
  return data.favorites
}

export const toggleFavorite = async (productId: string) => {
  const { data } = await client.post<{ success: boolean; isFavorite: boolean }>("/api/favorites/toggle", { productId })
  return data
}

export const addToFavorites = async (productId: string) => {
  const { data } = await client.post("/api/favorites", { productId })
  return data
}

export const removeFromFavorites = async (productId: string) => {
  await client.delete(`/api/favorites/${productId}`)
}

export const checkFavorite = async (productId: string) => {
  const { data } = await client.get<{ success: boolean; isFavorite: boolean }>(`/api/favorites/check/${productId}`)
  return data.isFavorite
}



