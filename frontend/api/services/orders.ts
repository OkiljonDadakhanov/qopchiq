import client from "@/api/client"
import type { Order, CreateOrderPayload, CreateOrderResponse, OrdersResponse } from "@/types/order"

export const fetchOrders = async () => {
  const { data } = await client.get<OrdersResponse>("/api/orders")
  return data.orders
}

export const createOrder = async (payload: CreateOrderPayload) => {
  const { data } = await client.post<CreateOrderResponse>("/api/orders", payload)
  return data.order
}

export const updateOrderStatus = async (orderId: string, status: string) => {
  const { data } = await client.patch(`/api/orders/${orderId}/status`, { status })
  return data.order
}

export const cancelOrder = async (orderId: string) => {
  const { data } = await client.delete(`/api/orders/${orderId}`)
  return data
}




