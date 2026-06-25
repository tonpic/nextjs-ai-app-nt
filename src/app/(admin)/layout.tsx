import type { ReactNode } from "react"
import "../globals.css"
import { AdminShell } from "./admin-shell"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th">
      <body>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  )
}
