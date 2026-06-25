import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { productSchema } from "@/lib/validations/product"

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const productId = Number(id)

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" },
        { status: 404 }
      )
    }

    const body = await request.json()
    const result = productSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.errors[0].message },
        { status: 400 }
      )
    }

    const { name, description, price, categoryId } = result.data

    const product = await prisma.products.update({
      where: { id: productId },
      data: {
        name,
        description: description || null,
        price,
        category_id: Number(categoryId),
      },
      include: { categories: true },
    })

    return NextResponse.json({
      success: true,
      data: {
        id: product.id,
        name: product.name ?? "",
        description: product.description,
        price: Number(product.price),
        categoryId: product.category_id,
        categoryName: product.categories?.name ?? "",
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการอัปเดตสินค้า" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session || session.user.role !== "admin") {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const productId = Number(id)

    const existing = await prisma.products.findUnique({ where: { id: productId } })
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "ไม่พบสินค้า" },
        { status: 404 }
      )
    }

    const count = await prisma.order_items.count({
      where: { product_id: productId },
    })

    if (count > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `ไม่สามารถลบสินค้านี้ได้ เนื่องจากมีคำสั่งซื้อที่เกี่ยวข้อง ${count} รายการ`,
        },
        { status: 409 }
      )
    }

    await prisma.products.delete({ where: { id: productId } })

    return NextResponse.json({ success: true, data: null })
  } catch {
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการลบสินค้า" },
      { status: 500 }
    )
  }
}
