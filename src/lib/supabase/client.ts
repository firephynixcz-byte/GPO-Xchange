// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// กิตต้องมั่นใจว่าในไฟล์ .env.local ของกิตมี 2 ตัวนี้อยู่นะครับ:
// NEXT_PUBLIC_SUPABASE_URL=...
// NEXT_PUBLIC_SUPABASE_ANON_KEY=...

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("ลืมใส่ URL หรือ Key ในไฟล์ .env.local หรือเปล่าครับกิต?");
}

// นี่คือการสร้าง "กล่องเครื่องมือ" เพื่อเชื่อมต่อ Supabase ครับ
export const supabase = createClient(supabaseUrl, supabaseKey);