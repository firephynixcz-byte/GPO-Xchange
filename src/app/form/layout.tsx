// src/app/form/layout.tsx
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = cookies()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // ด่านตรวจ: ถ้าไม่มี session ให้เด้งไปหน้า Login ทันที
  if (!session) {
    redirect('/auth')
  }

  // ถ้าผ่านด่านนี้ ก็ปล่อยให้หน้าเว็บในโฟลเดอร์นี้ทำงานต่อได้เลย
  return <>{children}</>
}