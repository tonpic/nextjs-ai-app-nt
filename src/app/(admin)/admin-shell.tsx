"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  RiDashboardLine,
  RiProductHuntLine,
  RiShoppingBag3Line,
  RiMenuLine,
} from "@remixicon/react"

const navItems = [
  { href: "/dashboard", label: "แดชบอร์ด", icon: RiDashboardLine },
  { href: "/dashboard/products", label: "สินค้า", icon: RiProductHuntLine },
  { href: "/dashboard/orders", label: "คำสั่งซื้อ", icon: RiShoppingBag3Line },
]

function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()

  return (
    <nav className="flex flex-col gap-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-3xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Mobile header */}
      <header className="flex items-center gap-2 border-b bg-background px-4 py-3 md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <RiMenuLine className="size-5" />
              <span className="sr-only">เปิดเมนู</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="mb-6 px-3 text-sm font-bold text-foreground/60 uppercase tracking-wider">
              เมนู
            </div>
            <Sidebar />
          </SheetContent>
        </Sheet>
        <span className="text-sm font-medium">Admin Panel</span>
      </header>

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="hidden w-64 shrink-0 border-r bg-background p-4 md:block">
          <div className="mb-6 px-3 text-sm font-bold text-foreground/60 uppercase tracking-wider">
            Admin Panel
          </div>
          <Sidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<div className="p-4 text-muted-foreground">กำลังโหลด...</div>}>
            {children}
          </Suspense>
        </main>
      </div>
    </>
  )
}
