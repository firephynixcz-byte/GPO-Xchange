import { createBrowserClient } from '@supabase/ssr';

// สร้างตัวแปรไว้เก็บ instance เดียว (Singleton)
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  // ถ้ายังไม่มี client ถึงจะสร้างใหม่
  if (!browserClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("ลืมใส่ URL หรือ Key ใน Environment Variables ครับ!");
    }

    browserClient = createBrowserClient(supabaseUrl, supabaseKey);
  }

  // ส่งคืนตัวเดิมที่สร้างไว้แล้วเสมอ
  return browserClient;
};