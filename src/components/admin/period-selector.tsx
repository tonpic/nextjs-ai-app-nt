import type { Period } from "@/types/admin"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const options: { label: string; value: Period }[] = [
  { label: "7 วัน", value: "7d" },
  { label: "30 วัน", value: "30d" },
  { label: "90 วัน", value: "90d" },
]

interface PeriodSelectorProps {
  value: Period
  onChange: (period: Period) => void
}

function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex gap-1 rounded-3xl bg-muted p-1">
      {options.map((opt) => (
        <Button
          key={opt.value}
          variant="ghost"
          size="sm"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-2xl",
            value === opt.value && "bg-background text-foreground shadow-xs"
          )}
        >
          {opt.label}
        </Button>
      ))}
    </div>
  )
}

export { PeriodSelector }
