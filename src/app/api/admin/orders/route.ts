import { NextResponse } from "next/server"
import type { AdminOrderItem } from "@/types/admin"

const mockOrders: AdminOrderItem[] = [
  { id: 1, customer: "สมชาย ใจดี", status: "delivered", total: 3500, date: "25/06/2026" },
  { id: 2, customer: "สมหญิง รักดี", status: "processing", total: 12000, date: "25/06/2026" },
  { id: 3, customer: "มานะ ขยัน", status: "received", total: 2500, date: "24/06/2026" },
  { id: 4, customer: "วิไล สวยงาม", status: "processing", total: 8750, date: "24/06/2026" },
  { id: 5, customer: "ประเสริฐ เก่งกาจ", status: "delivered", total: 15000, date: "23/06/2026" },
  { id: 6, customer: "นภา ฟ้าสวย", status: "delivered", total: 4200, date: "23/06/2026" },
  { id: 7, customer: "วิทยา แข็งแรง", status: "processing", total: 6300, date: "22/06/2026" },
]

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const limit = Number.parseInt(searchParams.get("limit") ?? "5", 10)

  const orders = mockOrders.slice(0, limit)

  return NextResponse.json({ orders, total: mockOrders.length })
}
