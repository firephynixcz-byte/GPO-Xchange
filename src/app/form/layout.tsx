import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function FormLayout({ children }: { children: React.ReactNode }) {
  // ต้อง await cookies() ใน Next.js เวอร์ชันใหม่ครับ
  const cookieStore = await cookies() 
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          // ตรงนี้ cookieStore กลายเป็น object ปกติแล้ว
          return cookieStore.getAll()
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth')
  }

  return <>{children}</>
}