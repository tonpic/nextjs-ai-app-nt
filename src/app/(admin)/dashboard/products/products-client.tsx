"use client"

/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState, useCallback } from "react"
import { toast } from "sonner"
import {
  RiAddLine,
  RiPencilLine,
  RiDeleteBinLine,
  RiSearchLine,
  RiArrowLeftSLine,
  RiArrowRightSLine,
} from "@remixicon/react"
import type { AdminProduct, CategoryOption } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import ProductFormModal from "./product-form-modal"
import DeleteConfirmDialog from "./delete-confirm-dialog"

export default function ProductsClient() {
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [inputVal, setInputVal] = useState("")
  const [search, setSearch] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<AdminProduct | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null)

  const pageSize = 10

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set("search", search)
      params.set("page", String(page))
      const res = await fetch(`/api/admin/products?${params}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.error)
      setProducts(json.data)
      setTotal(json.total)
    } catch {
      toast.error("ไม่สามารถโหลดข้อมูลสินค้าได้")
    } finally {
      setLoading(false)
    }
  }, [search, page])

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/categories")
      const json = await res.json()
      if (json.success) setCategories(json.data)
    } catch {
      // silent — categories will be empty
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(inputVal)
      setPage(1)
    }, 300)
    return () => clearTimeout(t)
  }, [inputVal])

  const totalPages = Math.ceil(total / pageSize)

  const handleCreate = () => {
    setEditProduct(null)
    setFormOpen(true)
  }

  const handleEdit = (product: AdminProduct) => {
    setEditProduct(product)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    setFormOpen(false)
    setEditProduct(null)
    fetchProducts()
  }

  const handleDeleteSuccess = () => {
    setDeleteTarget(null)
    fetchProducts()
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">จัดการสินค้า</h1>
          <p className="text-sm text-muted-foreground">เพิ่ม แก้ไข หรือลบสินค้า</p>
        </div>
        <Button onClick={handleCreate}>
          <RiAddLine className="mr-1 size-4" />
          เพิ่มสินค้า
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>สินค้าทั้งหมด ({total})</CardTitle>
            <div className="relative w-64">
              <RiSearchLine className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="ค้นหาสินค้า..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner className="size-6" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              ไม่พบสินค้า
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อสินค้า</TableHead>
                  <TableHead>หมวดหมู่</TableHead>
                  <TableHead className="text-right">ราคา</TableHead>
                  <TableHead className="w-24 text-right">จัดการ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.categoryName}</TableCell>
                    <TableCell className="text-right">
                      {Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                      }).format(product.price)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => handleEdit(product)}
                        >
                          <RiPencilLine className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => setDeleteTarget(product)}
                        >
                          <RiDeleteBinLine className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <RiArrowLeftSLine className="size-4" />
            ก่อนหน้า
          </Button>
          <span className="text-sm text-muted-foreground">
            หน้า {page} จาก {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            ถัดไป
            <RiArrowRightSLine className="size-4" />
          </Button>
        </div>
      )}

      <ProductFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editProduct}
        categories={categories}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        product={deleteTarget}
        onOpenChange={() => setDeleteTarget(null)}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
