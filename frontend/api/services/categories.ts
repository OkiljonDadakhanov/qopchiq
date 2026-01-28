import client from "@/api/client"
import type { Category, CategoriesResponse, CreateCategoryResponse } from "@/types/category"

export const fetchCategories = async (params?: Record<string, string | number>) => {
  try {
    const { data } = await client.get<CategoriesResponse>("/api/categories", { params })
    return data
  } catch (error: any) {
    console.error("Failed to fetch categories:", error)
    throw new Error(error?.response?.data?.message || "Failed to fetch categories")
  }
}

export const fetchCategory = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Category ID is required")
    }
    const { data } = await client.get<CreateCategoryResponse>(`/api/categories/${id}`)
    return data.category
  } catch (error: any) {
    console.error("Failed to fetch category:", error)
    throw new Error(error?.response?.data?.message || "Failed to fetch category")
  }
}

export const createCategory = async (payload: { name: string }) => {
  try {
    if (!payload.name || payload.name.trim().length === 0) {
      throw new Error("Category name is required")
    }
    const { data } = await client.post<CreateCategoryResponse>("/api/categories", {
      name: payload.name.trim()
    })
    return data.category
  } catch (error: any) {
    console.error("Failed to create category:", error)
    throw new Error(error?.response?.data?.message || "Failed to create category")
  }
}

export const updateCategory = async (id: string, payload: { name: string }) => {
  try {
    if (!id) {
      throw new Error("Category ID is required")
    }
    if (!payload.name || payload.name.trim().length === 0) {
      throw new Error("Category name is required")
    }
    const { data } = await client.put<CreateCategoryResponse>(`/api/categories/${id}`, {
      name: payload.name.trim()
    })
    return data.category
  } catch (error: any) {
    console.error("Failed to update category:", error)
    throw new Error(error?.response?.data?.message || "Failed to update category")
  }
}

export const deleteCategory = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Category ID is required")
    }
    await client.delete(`/api/categories/${id}`)
  } catch (error: any) {
    console.error("Failed to delete category:", error)
    throw new Error(error?.response?.data?.message || "Failed to delete category")
  }
}

