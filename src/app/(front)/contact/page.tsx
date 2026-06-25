import React from 'react'
import { Mail, Phone, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import ContactForm from './contact-form'

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 md:py-20 font-sans">
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 font-heading text-foreground">ติดต่อเจ้าหน้าที่</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          หากคุณมีคำถามหรือต้องการข้อมูลเพิ่มเติม สามารถส่งข้อความหาเราได้ผ่านแบบฟอร์มด้านล่างนี้
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-8 md:gap-12">
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 bg-secondary rounded-full border border-border">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">support@example.com</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 bg-secondary rounded-full border border-border">
                <Phone className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">02-xxx-xxxx</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="p-2 bg-secondary rounded-full border border-border">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">จันทร์ - ศุกร์: 09:00 - 18:00 น.</span>
            </div>
          </div>
          
          <Separator className="bg-border" />
          
          <p className="text-muted-foreground leading-relaxed">
            เรายินดีให้บริการและตอบทุกข้อสงสัยของคุณ 
            ทีมงานของเราจะพยายามตอบกลับภายใน 5 ชั่วโมงในวันทำการ
          </p>
        </div>

        <div className="bg-card p-6 md:p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

