"use client"

import { useTransition } from "react"
import { toast } from "sonner"

import type { AdminProduct } from "@/types/admin"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

interface Props {
  product: AdminProduct | null
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export default function DeleteConfirmDialog({
  product,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    if (!product) return

    startTransition(async () => {
      try {
        const res = await fetch(`/api/admin/products/${product.id}`, {
          method: "DELETE",
        })

        const json = await res.json()

        if (!json.success) {
          throw new Error(json.error)
        }

        toast.success("ลบสินค้าสำเร็จ")
        onSuccess()
      } catch (error) {
        toast.error((error as Error).message || "เกิดข้อผิดพลาดในการลบสินค้า")
      }
    })
  }

  return (
    <AlertDialog
      open={!!product}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการลบสินค้า</AlertDialogTitle>
          <AlertDialogDescription>
            คุณแน่ใจหรือไม่ที่จะลบ <strong>{product?.name}</strong>?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isPending}>
              ยกเลิก
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              disabled={isPending}
              onClick={handleDelete}
            >
              {isPending && <Spinner className="mr-1 size-4" />}
              ลบ
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
