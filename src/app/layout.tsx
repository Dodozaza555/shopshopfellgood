import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ของใช้ทำงาน | Shop Shop Feel Good",
  description: "เลือกชิ้นที่ใช่ ให้ทุกวันทำงาน",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
