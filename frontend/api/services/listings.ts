import { api, apiUtils, API_ENDPOINTS } from "../api"
import type {
  ApiResponse,
  Listing,
  CreateListingPayload,
  UpdateListingPayload,
} from "@/types/types"

interface ListingsResponse extends ApiResponse {
  data: Listing[]
}

interface ListingResponse extends ApiResponse {
  data: Listing
}

export const listingsApi = {
  getAll: () =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.get<ListingsResponse>(API_ENDPOINTS.LISTINGS)
      return data
    }),

  getById: (id: string) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.get<ListingResponse>(`${API_ENDPOINTS.LISTINGS}/${id}`)
      return data
    }),

  create: (payload: CreateListingPayload) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.post<ListingResponse>(API_ENDPOINTS.LISTINGS, payload)
      return data
    }),

  update: (id: string, payload: UpdateListingPayload) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.put<ListingResponse>(`${API_ENDPOINTS.LISTINGS}/${id}`, payload)
      return data
    }),

  remove: (id: string) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.delete<ApiResponse>(`${API_ENDPOINTS.LISTINGS}/${id}`)
      return data
    }),
}
