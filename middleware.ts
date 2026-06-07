import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // DEBUG: ดูว่า Middleware กำลังทำงานที่ไหน
  console.log("Middleware Running on:", request.nextUrl.pathname);

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

  // 1. ตรวจสอบ Session ของผู้ใช้งาน
  const { data: { user } } = await supabase.auth.getUser()

  // DEBUG: ดูว่าตรวจพบ User หรือไม่
  if (user) {
    console.log("Middleware Found User:", user.id);
  } else {
    console.log("Middleware No User Session Detected");
  }

  // 2. ถ้ายังไม่มี user และพยายามเข้าหน้าแบบฟอร์ม ให้เด้งไปหน้า /auth
  if (!user && request.nextUrl.pathname.startsWith('/form')) {
    console.log("Redirecting to /auth (No Session)");
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // 3. ป้องกันกรณี Login แล้ว แต่เผลอกดกลับไปหน้า Auth ให้ดีดมาหน้า /form
  if (user && request.nextUrl.pathname.startsWith('/auth')) {
    console.log("Redirecting to /form (Already Logged In)");
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