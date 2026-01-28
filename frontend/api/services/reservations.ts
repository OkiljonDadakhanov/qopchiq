import { api, apiUtils, API_ENDPOINTS } from "../api"
import type {
  ApiResponse,
  Reservation,
  CreateReservationPayload,
  UpdateReservationPayload,
} from "@/types/types"

interface ReservationsResponse extends ApiResponse {
  data: Reservation[]
}

interface ReservationResponse extends ApiResponse {
  data: Reservation
}

export const reservationsApi = {
  getAll: () =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.get<ReservationsResponse>(API_ENDPOINTS.RESERVATIONS)
      return data
    }),

  getById: (id: string) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.get<ReservationResponse>(`${API_ENDPOINTS.RESERVATIONS}/${id}`)
      return data
    }),

  create: (payload: CreateReservationPayload) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.post<ReservationResponse>(API_ENDPOINTS.RESERVATIONS, payload)
      return data
    }),

  update: (id: string, payload: UpdateReservationPayload) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.put<ReservationResponse>(`${API_ENDPOINTS.RESERVATIONS}/${id}`, payload)
      return data
    }),

  remove: (id: string) =>
    apiUtils.withErrorHandling(async () => {
      const { data } = await api.delete<ApiResponse>(`${API_ENDPOINTS.RESERVATIONS}/${id}`)
      return data
    }),
}
