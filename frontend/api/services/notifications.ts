import client from "@/api/client"

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data: any;
  createdAt: string;
  order?: {
    _id: string;
    qrToken: string;
    status: string;
    totalPrice: number;
  };
  business?: {
    name: string;
    avatar?: string;
  };
}

export const fetchNotifications = async (params?: Record<string, string | number>) => {
  const { data } = await client.get<{ success: boolean; notifications: Notification[] }>("/api/notifications", { params })
  return data.notifications
}

export const getUnreadCount = async () => {
  const { data } = await client.get<{ success: boolean; count: number }>("/api/notifications/unread-count")
  return data.count
}

export const markAsRead = async (notificationId: string) => {
  const { data } = await client.patch(`/api/notifications/${notificationId}/read`)
  return data
}

export const markAllAsRead = async () => {
  const { data } = await client.patch("/api/notifications/mark-all-read")
  return data
}

export const deleteNotification = async (notificationId: string) => {
  await client.delete(`/api/notifications/${notificationId}`)
}

