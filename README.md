# Shop Shop Feel Good

ร้านสินค้าและหน้า Product Explorer สร้างจากตัวอย่าง 67-Shop และใบงาน
Google OAuth (Next.js 16, Auth.js, Server Actions)

## ติดตั้งและตั้งค่า

ต้องใช้ Node.js และ npm จากโฟลเดอร์นี้ รัน:

```powershell
npm install
Copy-Item .env.example .env.local
```

แก้ `.env.local` ด้วยค่า OAuth ของ Google จริง และสร้าง `AUTH_SECRET` ที่สุ่ม
และคาดเดายาก ตัวอย่างสร้าง secret:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

ใน Google Cloud Console ให้สร้าง OAuth Client แบบ Web application และเพิ่ม
Authorized redirect URI นี้ให้ตรงทุกตัวอักษร:

```text
http://localhost:3000/api/auth/callback/google
```

จากนั้นเริ่มแอป:

```powershell
npm run dev
```

เปิด `http://localhost:3000` เพื่อดูหน้าร้าน และ `/explorer` เพื่อค้นหา
แคตตาล็อกสินค้า

## การยืนยันตัวตน

- `src/auth.ts` ตั้งค่า Auth.js และ Google provider
- `src/app/api/auth/[...nextauth]/route.ts` ให้บริการ OAuth callback และ session
- `src/proxy.ts` ปกป้องหน้าแก้ไขและยืนยันลบสินค้า
- หน้าแรกแสดงลิงก์จัดการเมื่อมี session เท่านั้น
- Server Actions ตรวจ session ซ้ำก่อนแก้ไขหรือลบข้อมูล

รายการหน้าร้านเป็นข้อมูล in-memory สำหรับสาธิต การเปลี่ยนแปลงจะหายเมื่อ
restart server และไม่เหมาะกับ production หลาย instance

## ตรวจสอบ

```powershell
npm run lint
npm run build
```
