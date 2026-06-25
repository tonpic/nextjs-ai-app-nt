import type { AdminOrderItem } from "@/types/admin"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

const statusLabel: Record<AdminOrderItem["status"], string> = {
  delivered: "สำเร็จ",
  received: "รับแล้ว",
  processing: "กำลังดำเนินการ",
}

const statusVariant: Record<AdminOrderItem["status"], "default" | "secondary" | "outline"> = {
  delivered: "default",
  received: "secondary",
  processing: "outline",
}

interface RecentOrdersTableProps {
  orders: AdminOrderItem[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function RecentOrdersTable({ orders, loading, error, onRetry }: RecentOrdersTableProps) {
  if (error) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={onRetry}>
          ลองใหม่
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        ไม่มีคำสั่งซื้อล่าสุด
      </p>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>ลูกค้า</TableHead>
          <TableHead>สถานะ</TableHead>
          <TableHead>ยอดรวม</TableHead>
          <TableHead>วันที่</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id}</TableCell>
            <TableCell>{order.customer}</TableCell>
            <TableCell>
              <Badge variant={statusVariant[order.status]}>
                {statusLabel[order.status]}
              </Badge>
            </TableCell>
            <TableCell>
              {Intl.NumberFormat("th-TH", {
                style: "currency",
                currency: "THB",
              }).format(order.total)}
            </TableCell>
            <TableCell className="text-muted-foreground">{order.date}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export { RecentOrdersTable }
