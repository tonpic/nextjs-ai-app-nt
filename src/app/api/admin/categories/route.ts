import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const categories = await prisma.categories.findMany({
    orderBy: { name: "asc" },
  })

  const data = categories.map((c) => ({
    id: c.id,
    name: c.name ?? "",
  }))

  return NextResponse.json({ success: true, data })
}
