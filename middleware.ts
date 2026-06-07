import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 1. เปลี่ยนมาใช้ getSession() เพื่ออ่านจาก Cookie (เร็วกว่า getUser มากๆ)
  const { data: { session } } = await supabase.auth.getSession()

  // 2. ถ้าไม่มี session และพยายามเข้าหน้า /form ให้เด้งไปหน้า /auth
  if (!session && request.nextUrl.pathname.startsWith('/form')) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // 3. ถ้ามี session แล้วแต่ยังอยู่ในหน้า /auth ให้เด้งไป /form
  if (session && request.nextUrl.pathname.startsWith('/auth')) {
    const url = request.nextUrl.clone()
    url.pathname = '/form'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    '/form/:path*', 
    '/auth',
  ],
}