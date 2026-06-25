import dynamic from "next/dynamic"
import type { RevenuePoint } from "@/types/admin"
import { Spinner } from "@/components/ui/spinner"

const RevenueChartInner = dynamic(
  () => import("./revenue-chart-inner").then((m) => m.RevenueChartInner),
  { ssr: false, loading: () => <div className="flex h-72 items-center justify-center"><Spinner className="size-6 text-muted-foreground" /></div> }
)

interface RevenueChartProps {
  data: RevenuePoint[]
  loading: boolean
  error: string | null
  onRetry: () => void
}

function RevenueChart(props: RevenueChartProps) {
  return <RevenueChartInner {...props} />
}

export { RevenueChart }
