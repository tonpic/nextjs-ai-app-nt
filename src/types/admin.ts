export interface AdminStats {
  todaySales: number
  todayOrders: number
  pendingOrders: number
  totalProducts: number
  totalUsers: number
}

export interface RevenuePoint {
  date: string
  revenue: number
  orders: number
}

export interface AdminOrderItem {
  id: number
  customer: string
  status: "delivered" | "received" | "processing"
  total: number
  date: string
}

export type Period = "7d" | "30d" | "90d"

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string }

export interface AdminProduct {
  id: number
  name: string
  description: string | null
  price: number
  categoryId: number
  categoryName: string
}

export interface CategoryOption {
  id: number
  name: string
}
