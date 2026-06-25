import { NextResponse } from "next/server"

export async function GET() {
  const mockStats = {
    todaySales: 45250,
    todayOrders: 12,
    pendingOrders: 5,
    totalProducts: 48,
    totalUsers: 156,
  }

  return NextResponse.json(mockStats)
}
