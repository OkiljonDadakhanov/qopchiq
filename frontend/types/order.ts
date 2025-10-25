export type OrderStatus = "pending" | "confirmed" | "ready" | "completed" | "cancelled";

export interface Order {
  _id: string;
  productId: string;
  businessId: string;
  userId: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  qrToken: string;
  createdAt: string;
  updatedAt: string;
  product?: {
    _id: string;
    title: string;
    images: string[];
    business?: {
      name: string;
      address?: string;
    };
  };
}

export interface CreateOrderPayload {
  productId: string;
  businessId: string;
  quantity: number;
  totalPrice: number;
}

export interface CreateOrderResponse {
  success: boolean;
  order: Order;
}

export interface OrdersResponse {
  success: boolean;
  orders: Order[];
}



