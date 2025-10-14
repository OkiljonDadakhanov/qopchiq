import authClient from "../authClient"
import type { Business } from "@/types/business"

const normalizeBusiness = (business?: any): Business => {
  if (!business) {
    throw new Error("Business payload missing")
  }

  const payload = business.business ?? business

  return {
    id: payload.id ?? payload._id ?? payload.$id,
    name: payload.name ?? "",
    email: payload.email ?? "",
    phoneNumber: payload.phoneNumber ?? payload.phone,
    description: payload.description,
    avatar: payload.avatar ?? null,
    address: payload.address,
    isVerified: payload.isVerified,
    isApproved: payload.isApproved,
    lastLogin: payload.lastLogin,
    createdAt: payload.createdAt,
    updatedAt: payload.updatedAt,
  }
}

const handleBusinessError = (error: any): never => {
  console.error("Business service error:", error)
  throw new Error(error?.response?.data?.message || error.message || "Business operation failed")
}

export const fetchBusinessProfile = async (): Promise<Business> => {
  try {
    const { data } = await authClient.get("/api/business/me")
    return normalizeBusiness(data)
  } catch (error) {
    handleBusinessError(error)
  }
}

export const updateBusinessProfile = async (
  payload: Partial<Business>,
): Promise<Business> => {
  try {
    const { data } = await authClient.patch("/api/business/me", payload)
    return normalizeBusiness(data)
  } catch (error) {
    handleBusinessError(error)
  }
}

