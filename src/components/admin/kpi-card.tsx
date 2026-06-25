import type { ReactNode } from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface KpiCardProps {
  title: string
  value: string
  icon: ReactNode
  className?: string
}

function KpiCard({ title, value, icon, className }: KpiCardProps) {
  return (
    <Card size="sm" className={cn("", className)}>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{title}</p>
          <p className="truncate text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function KpiCardSkeleton() {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <div className="size-10 shrink-0 animate-pulse rounded-3xl bg-muted" />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="h-3 w-16 animate-pulse rounded bg-muted" />
          <div className="h-5 w-24 animate-pulse rounded bg-muted" />
        </div>
      </CardContent>
    </Card>
  )
}

export { KpiCard, KpiCardSkeleton }
