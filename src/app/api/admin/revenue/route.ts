import { NextResponse } from "next/server"
import type { RevenuePoint, Period } from "@/types/admin"

const periods: Period[] = ["7d", "30d", "90d"]

function generateMockRevenue(period: Period): RevenuePoint[] {
  const count = period === "7d" ? 7 : period === "30d" ? 30 : 90
  const points: RevenuePoint[] = []

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    points.push({
      date: date.toLocaleDateString("th-TH", { day: "2-digit", month: "2-digit" }),
      revenue: Math.floor(Math.random() * 20000) + 5000,
      orders: Math.floor(Math.random() * 15) + 1,
    })
  }

  return points
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const periodParam = searchParams.get("period") ?? "30d"
  const period: Period = periods.includes(periodParam as Period)
    ? (periodParam as Period)
    : "30d"

  const revenue = generateMockRevenue(period)

  return NextResponse.json(revenue)
}
