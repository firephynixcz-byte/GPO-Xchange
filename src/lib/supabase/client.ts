import { createBrowserClient } from '@supabase/ssr';

// ฟังก์ชันนี้จะสร้าง client ที่ปลอดภัยสำหรับใช้งานฝั่ง Client (หน้าเว็บ)
export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("ลืมใส่ URL หรือ Key ใน Environment Variables ครับ!");
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};