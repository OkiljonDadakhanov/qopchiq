import client from "@/api/client"
import type {
  Product,
  ProductPayload,
  ProductsResponse,
  CreateProductResponse,
  ProductStatus,
} from "@/types/product"

const buildFormData = (payload: ProductPayload & { existingImages?: string[]; replaceImages?: boolean }) => {
  const formData = new FormData()
  formData.append("title", payload.title)
  formData.append("description", payload.description)
  formData.append("originalPrice", String(payload.originalPrice))
  formData.append("discountPrice", String(payload.discountPrice))
  formData.append("stock", String(payload.stock))
  formData.append("quantity", JSON.stringify(payload.quantity))
  if (payload.category) formData.append("category", payload.category)
  if (payload.dietaryPreferences !== undefined) {
    formData.append("dietaryPreferences", JSON.stringify(payload.dietaryPreferences))
  }
  if (payload.foodType !== undefined) {
    formData.append("foodType", payload.foodType === null ? "null" : payload.foodType)
  }
  if (payload.expiresAt) formData.append("expiresAt", payload.expiresAt)
  if (payload.pickupStartTime) formData.append("pickupStartTime", payload.pickupStartTime)
  if (payload.pickupEndTime) formData.append("pickupEndTime", payload.pickupEndTime)
  if (payload.status) formData.append("status", payload.status)
  if (payload.replaceImages) formData.append("replaceImages", String(payload.replaceImages))
  if (payload.existingImages?.length) {
    formData.append("existingImages", JSON.stringify(payload.existingImages))
  }

  payload.images?.forEach((image) => {
    if (image instanceof File) {
      formData.append("images", image)
    }
  })

  return formData
}

export interface ProductQuery {
  status?: string
  includeInactive?: boolean
  foodType?: string | string[]
  dietary?: string | string[]
  dietaryPreferences?: string | string[]
  diet?: string | string[]
  [key: string]: unknown
}

export const fetchProducts = async (params?: ProductQuery) => {
  const { data } = await client.get<ProductsResponse>("/api/products", { params })
  return data
}

export const fetchProduct = async (id: string) => {
  const { data } = await client.get<CreateProductResponse>(`/api/products/${id}`)
  return data.product
}

export const fetchMyProducts = async () => {
  const { data } = await client.get<ProductsResponse>("/api/products/business/me")
  return data.products
}

export const fetchBusinessProducts = async (businessId: string) => {
  const { data } = await client.get<ProductsResponse>(`/api/products/business/${businessId}`)
  return data.products
}

export const createProduct = async (payload: ProductPayload & { images?: File[] }) => {
  const formData = buildFormData(payload)
  const { data } = await client.post<CreateProductResponse>("/api/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.product
}

export const updateProduct = async (
  id: string,
  payload: ProductPayload & { images?: (File | string)[]; existingImages?: string[]; replaceImages?: boolean }
) => {
  const files: File[] = []
  const retained: string[] = []

  payload.images?.forEach((item) => {
    if (item instanceof File) {
      files.push(item)
    } else if (typeof item === "string") {
      retained.push(item)
    }
  })

  const formData = buildFormData({
    ...payload,
    images: files,
    existingImages: payload.existingImages ?? retained,
  })

  const { data } = await client.put<CreateProductResponse>(`/api/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return data.product
}

export const updateProductStatus = async (id: string, status: ProductStatus) => {
  const { data } = await client.patch<CreateProductResponse>(`/api/products/${id}/status`, { status })
  return data.product
}

export const deleteProduct = async (id: string) => {
  await client.delete(`/api/products/${id}`)
}
