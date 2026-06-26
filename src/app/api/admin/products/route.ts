import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get("search") ?? ""
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const limit = 10
  const skip = (page - 1) * limit

  const where = search
    ? { name: { contains: search } }
    : {}

  const [products, total] = await Promise.all([
    prisma.products.findMany({
      where,
      skip,
      take: limit,
      include: { categories: true },
      orderBy: { id: "desc" },
    }),
    prisma.products.count({ where }),
  ])

  const data = products.map((p) => ({
    id: p.id,
    name: p.name ?? "",
    description: p.description,
    price: Number(p.price),
    categoryId: p.category_id,
    categoryName: p.categories?.name ?? "",
  }))

  return NextResponse.json({
    success: true,
    data,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await request.json()
    const result = productSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, description, price, categoryId } = result.data

    const product = await prisma.products.create({
      data: {
        name,
        description: description || null,
        price,
        category_id: Number(categoryId),
      },
      include: { categories: true },
    })

    return NextResponse.json(
      {
        success: true,
        data: {
          id: product.id,
          name: product.name ?? "",
          description: product.description,
          price: Number(product.price),
          categoryId: product.category_id,
          categoryName: product.categories?.name ?? "",
        },
      },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการสร้างสินค้า" },
      { status: 500 }
    )
  }
}
