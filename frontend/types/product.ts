export type ProductStatus = "available" | "sold" | "expired" | "inactive";

export interface ProductQuantity {
  amount: number;
  unit: "kg" | "g" | "l" | "ml" | "pcs";
}

export interface ProductBusinessSummary {
  id?: string;
  name: string;
  avatar?: string | null;
  address?: string;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category?: {
    _id: string;
    name: string;
  } | null;
  originalPrice: number;
  discountPrice: number;
  quantity: ProductQuantity;
  dietaryPreferences?: string[] | null;
  foodType?: "meals" | "bakery" | "groceries" | "plants" | "cosmetics" | "other" | null;
  stock: number;
  status: ProductStatus;
  expiresAt?: string | null;
  pickupStartTime?: string | null;
  pickupEndTime?: string | null;
  business?: ProductBusinessSummary | null;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  title: string;
  description: string;
  category?: string;
  originalPrice: number;
  discountPrice: number;
  quantity: ProductQuantity;
  dietaryPreferences?: string[];
  foodType?: Product["foodType"];
  stock: number;
  expiresAt?: string | null;
  pickupStartTime?: string | null;
  pickupEndTime?: string | null;
  status?: ProductStatus;
  images?: (File | string)[];
}

export interface CreateProductResponse {
  success: boolean;
  product: Product;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
}
