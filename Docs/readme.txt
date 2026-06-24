MARIADB_USER=app_user -e MARIADB_PASSWORD=Admin_1jj395qu


/Exit #ออกจาก opencode
/models
/variants # เลือก low high
/new #คุยเรื่องใหม่
@Docs/install_mariadb_with_docker.txt ติดตั้ง
@Docs\create_table_ecommerce.sql สร้างจากไฟล์นี้

@prisma ช่วยสร้างตารางเพิ่มเติม better auth เพิ่มเติมด้วยคำสั่ง npx prisma db push
@Docs\insert_data_ecom_example.sql ช่วยเพิ่มข้อมูลและระวังเรื่อง encodeing ให้ใช้ภาษาไทยได้ปกติ

npx prisma generate
npm run dev

บัณฑิต admin@admin.com 12345678

C:\Users\ardui\Desktop\ai\nextjs-ai-app-starter\src\app\(front)\course\page.tsx
ให้แยก logic การ fetch course จากเพจ /course ออกไปเป็น service layer
"
const response = await fetch('https://api.codingthailand.com/api/course');
const courseResponse = await response.json();
"