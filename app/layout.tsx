import './globals.css';
import type { Metadata } from 'next';
import { Sarabun } from 'next/font/google'; // 1. import ฟอนต์

// 2. ตั้งค่าตัวแปรฟอนต์
const sarabun = Sarabun({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '700', '800'],
  variable: '--font-sarabun',
});

export const metadata: Metadata = {
  title: 'GPO Xchange Portal',
  description: 'ระบบรับคืนและแลกเปลี่ยนสินค้าองค์การเภสัชกรรม',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // 3. ใส่ sarabun.variable และคลาส font-sans
    <html lang="th" className={sarabun.variable}>
      <body className="font-sans bg-gray-50 text-gray-900">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}