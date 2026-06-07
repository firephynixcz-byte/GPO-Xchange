import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/form'

  if (token_hash && type) {
    const cookieStore = {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet: any[]) => {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        )
      },
    }

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: cookieStore,
      }
    )

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    if (!error) {
      // ยืนยันสำเร็จ เด้งไปหน้าแบบฟอร์ม
      return NextResponse.redirect(new URL(next, request.url))
    }
  }

  // ถ้า Error ให้กลับไปหน้า Login หรือหน้า Error ของกิต
  return NextResponse.redirect(new URL('/auth/login', request.url))
}