'use server';

import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * สำหรับการกำหนด Runtime ใน Server Actions:
 * เราไม่ใช้ "export const runtime" ในไฟล์ที่ใช้ 'use server'
 * แต่ถ้ากิตต้องการบังคับเป็น Node.js ให้ไปตั้งค่าที่ไฟล์ route.ts 
 * หรือปล่อยให้ Next.js จัดการอัตโนมัติ (ซึ่งมันจะเลือก Node.js ให้เมื่อใช้ bcryptjs ครับ)
 */

export async function loginStaff(username: string, password: string) {
  const supabase = await createClient();

  // 1. ดึงข้อมูล Staff จาก DB (ใช้ Service Role Key ใน Server Action เพื่อ bypass RLS)
  const { data: staff, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !staff) {
    return { success: false, message: 'ไม่พบผู้ใช้งานนี้ครับ' };
  }

  // 2. เปรียบเทียบ Password
  const isMatch = await bcrypt.compare(password, staff.password_hash);
  
  if (!isMatch) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้องครับ' };
  }

  // 3. สร้าง Session ใน Cookie
  const cookieStore = await cookies();
  
  // ตั้งค่า Session
  cookieStore.set('staff_session', JSON.stringify({
    id: staff.id,
    username: staff.username,
    department: staff.department,
    full_name: staff.full_name
  }), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8 // 8 ชั่วโมง
  });

  return { success: true, department: staff.department };
}