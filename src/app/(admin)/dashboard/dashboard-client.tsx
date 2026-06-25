"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from "react"
import type { AdminStats, RevenuePoint, AdminOrderItem, Period } from "@/types/admin"
import { KpiCard, KpiCardSkeleton } from "@/components/admin/kpi-card"
import { RevenueChart } from "@/components/admin/revenue-chart"
import { RecentOrdersTable } from "@/components/admin/recent-orders-table"
import { PeriodSelector } from "@/components/admin/period-selector"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  RiMoneyDollarCircleLine,
  RiShoppingCartLine,
  RiTimeLine,
  RiBox3Line,
  RiUserLine,
} from "@remixicon/react"

export default function DashboardClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState<string | null>(null)

  const [revenue, setRevenue] = useState<RevenuePoint[]>([])
  const [revenueLoading, setRevenueLoading] = useState(true)
  const [revenueError, setRevenueError] = useState<string | null>(null)

  const [period, setPeriod] = useState<Period>("30d")

  const [orders, setOrders] = useState<AdminOrderItem[]>([])
  const [ordersLoading, setOrdersLoading] = useState(true)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    setStatsLoading(true)
    setStatsError(null)
    try {
      const res = await fetch("/api/admin/stats")
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลสถิติได้")
      const data: AdminStats = await res.json()
      setStats(data)
    } catch {
      setStatsError("เกิดข้อผิดพลาดในการโหลดสถิติ")
    } finally {
      setStatsLoading(false)
    }
  }, [])

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    setOrdersError(null)
    try {
      const res = await fetch("/api/admin/orders?limit=5")
      if (!res.ok) throw new Error("ไม่สามารถโหลดคำสั่งซื้อล่าสุดได้")
      const data = await res.json()
      setOrders(data.orders)
    } catch {
      setOrdersError("เกิดข้อผิดพลาดในการโหลดคำสั่งซื้อ")
    } finally {
      setOrdersLoading(false)
    }
  }, [])

  const fetchRevenue = useCallback(async (p: Period) => {
    setRevenueLoading(true)
    setRevenueError(null)
    try {
      const res = await fetch(`/api/admin/revenue?period=${p}`)
      if (!res.ok) throw new Error("ไม่สามารถโหลดข้อมูลรายได้ได้")
      const data: RevenuePoint[] = await res.json()
      setRevenue(data)
    } catch {
      setRevenueError("เกิดข้อผิดพลาดในการโหลดข้อมูลรายได้")
    } finally {
      setRevenueLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    fetchStats()
    fetchOrders()
  }, [fetchStats, fetchOrders])

  useEffect(() => {
    fetchRevenue(period)
  }, [fetchRevenue, period])

  // Auto-refresh every 30s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStats()
      fetchOrders()
    }, 30_000)

    return () => clearInterval(interval)
  }, [fetchStats, fetchOrders])

  // Re-fetch revenue when period changes
  const handlePeriodChange = useCallback(
    (p: Period) => {
      setPeriod(p)
      fetchRevenue(p)
    },
    [fetchRevenue]
  )

  const formatCurrency = (value: number) =>
    Intl.NumberFormat("th-TH", { style: "currency", currency: "THB" }).format(value)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">แดชบอร์ด</h1>
        <p className="text-sm text-muted-foreground">ภาพรวมร้านค้าของคุณ</p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {statsLoading ? (
          <>
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
            <KpiCardSkeleton />
          </>
        ) : statsError ? (
          <div className="col-span-full flex flex-col items-center gap-2 py-8 text-center">
            <p className="text-sm text-destructive">{statsError}</p>
          </div>
        ) : stats ? (
          <>
            <KpiCard
              title="ยอดขายวันนี้"
              value={formatCurrency(stats.todaySales)}
              icon={<RiMoneyDollarCircleLine className="size-5" />}
            />
            <KpiCard
              title="คำสั่งซื้อวันนี้"
              value={stats.todayOrders.toString()}
              icon={<RiShoppingCartLine className="size-5" />}
            />
            <KpiCard
              title="รอดำเนินการ"
              value={stats.pendingOrders.toString()}
              icon={<RiTimeLine className="size-5" />}
            />
            <KpiCard
              title="สินค้าทั้งหมด"
              value={stats.totalProducts.toString()}
              icon={<RiBox3Line className="size-5" />}
            />
            <KpiCard
              title="ผู้ใช้ทั้งหมด"
              value={stats.totalUsers.toString()}
              icon={<RiUserLine className="size-5" />}
            />
          </>
        ) : null}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>รายได้</CardTitle>
            <PeriodSelector value={period} onChange={handlePeriodChange} />
          </div>
        </CardHeader>
        <CardContent>
          <RevenueChart
            data={revenue}
            loading={revenueLoading}
            error={revenueError}
            onRetry={() => fetchRevenue(period)}
          />
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <RecentOrdersTable
            orders={orders}
            loading={ordersLoading}
            error={ordersError}
            onRetry={fetchOrders}
          />
        </CardContent>
      </Card>
    </div>
  )
}
