import client from "@/api/client"
import type { BusinessAccount } from "@/types/business"

interface UpdateBusinessProfilePayload {
  name?: string
  email?: string
  phoneNumber?: string
  description?: string
  address?: string
}

interface BranchPayload {
  name: string
  address: string
  phoneNumber: string
  location?: { coordinates: [number, number] }
}

export const updateBusinessProfile = async (payload: UpdateBusinessProfilePayload) => {
  const { data } = await client.patch<{ success: boolean; business: BusinessAccount }>("/api/business/me", payload)
  return data.business
}

export const uploadBusinessLogo = async (file: File) => {
  const formData = new FormData()
  formData.append("file", file)
  const { data } = await client.post<{ success: boolean; file: { id: string; url: string } }>(
    "/api/upload?folder=business",
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  )

  const avatar = data.file
  const response = await client.patch<{ success: boolean; business: BusinessAccount }>("/api/business/me/avatar", {
    avatar,
  })
  return response.data.business
}

export const createBranch = async (payload: BranchPayload) => {
  const { data } = await client.post<{ success: boolean; business: BusinessAccount }>("/api/business/me/branches", payload)
  return data.business
}

export const updateBranch = async (branchId: string, payload: Partial<BranchPayload>) => {
  const { data } = await client.patch<{ success: boolean; business: BusinessAccount }>(
    `/api/business/me/branches/${branchId}`,
    payload
  )
  return data.business
}

export const deleteBranch = async (branchId: string) => {
  const { data } = await client.delete<{ success: boolean; business: BusinessAccount }>(
    `/api/business/me/branches/${branchId}`
  )
  return data.business
}
