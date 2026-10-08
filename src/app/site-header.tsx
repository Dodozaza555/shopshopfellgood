import Link from "next/link";

import { auth } from "@/auth";
import { AuthButtons } from "@/app/auth-buttons";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="site-header">
      <Link className="site-brand" href="/" aria-label="ของใช้ทำงาน - หน้าร้าน">
        <span className="brand-mark" aria-hidden="true">✳</span>
        <span>ของใช้ทำงาน</span>
      </Link>
      <nav className="site-nav" aria-label="เมนูหลัก">
        <Link href="/">หน้าร้าน</Link>
        <Link href="/explorer">สำรวจสินค้า</Link>
      </nav>
      <AuthButtons
        isLoggedIn={Boolean(session?.user)}
        userName={session?.user?.name}
      />
    </header>
  );
}
