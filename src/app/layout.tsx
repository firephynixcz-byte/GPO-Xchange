import './globals.css';
import type { Metadata } from 'next';
import { Sarabun } from 'next/font/google';

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
    <html lang="th" className={sarabun.variable}>
      {/* ลบ bg-teal-50/40 ออกจาก body เพื่อให้เราคุม background ที่หน้า page แทน 
          และมั่นใจว่าไม่มี overflow-hidden ครับ */}
      <body className="font-sans text-gray-900">
        
        {/* ── Sticky Glass Header ── */}
        <header className="fixed top-0 left-0 w-full bg-white/85 backdrop-blur-lg border-b border-teal-100 z-50">
          <div className="max-w-[1200px] mx-auto h-[48px] px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-gradient-to-br from-teal-800 to-teal-600 text-white font-black text-[12px] px-[10px] py-[4px] rounded-full shadow-[0_2px_8px_rgba(13,148,136,0.3)] tracking-wide">
                GPO
              </span>
              <span className="text-teal-950 font-black text-sm tracking-wide hidden sm:block">
                องค์การเภสัชกรรม สาขาภาคใต้
              </span>
            </div>
          </div>
        </header>

        {/* ── เปลี่ยนเป็นไม่มี min-h-screen ที่ main เพื่อให้พื้นที่ยืดตามเนื้อหาหน้าลูก ── */}
        <main className="pt-[48px]">
          {children}
        </main>
        
      </body>
    </html>
  );
}