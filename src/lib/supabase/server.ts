import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  // กิตใส่ console.log ไว้เพื่อเช็คว่ามันโหลดค่ามาไหม (ดูใน Terminal ตอนรัน dev)
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error("❌ ไม่พบ NEXT_PUBLIC_SUPABASE_URL ใน .env.local!");
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // มั่นใจว่าตรงกับใน .env.local
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}