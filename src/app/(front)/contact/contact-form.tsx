'use client'

import React, { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { contactSchema, ContactFormValues } from '@/lib/validations/contact'

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isPending, isPendingTransition] = useTransition()

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  })

  async function onSubmit(values: ContactFormValues) {
    isPendingTransition(async () => {
      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        const result = await response.json()

        if (!result.success) {
          throw new Error(result.error)
        }

        toast.success('ส่งข้อความสำเร็จ!')
        form.reset()
        setIsSubmitted(true)
      } catch (error) {
        toast.error((error as Error).message || 'เกิดข้อผิดพลาดในการส่งข้อความ')
      }
    })
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center text-center gap-4 py-8">
        <CheckCircle className="w-12 h-12 text-green-500" />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">ส่งข้อความเรียบร้อยแล้ว</h3>
          <p className="text-muted-foreground">เราจะติดต่อกลับหาคุณโดยเร็วที่สุด</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsSubmitted(false)}
          className="mt-4"
        >
          ส่งข้อความอีกครั้ง
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <FieldGroup>
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-name">ชื่อ</FieldLabel>
              <Input 
                {...field} 
                id="contact-name"
                placeholder="กรอกชื่อของคุณ" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-email">Email</FieldLabel>
              <Input 
                {...field} 
                id="contact-email"
                type="email" 
                placeholder="example@email.com" 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
        <Controller
          name="message"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="contact-message">ข้อความ</FieldLabel>
              <Textarea 
                {...field} 
                id="contact-message"
                rows={5} 
                placeholder="พิมพ์ข้อความที่ต้องการ..." 
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && (
                <FieldError errors={[fieldState.error]} />
              )}
            </Field>
          )}
        />
      </FieldGroup>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'กำลังส่ง...' : 'ส่งข้อความ'}
      </Button>
    </form>
  )
}
