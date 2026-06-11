'use server';

import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

/**
 * ฟังก์ชันสำหรับ Login พนักงาน
 */
export async function loginStaff(username: string, password: string) {
  const supabase = await createClient();

  const { data: staff, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !staff) {
    return { success: false, message: 'ไม่พบผู้ใช้งานนี้ในระบบ' };
  }

  const isMatch = await bcrypt.compare(password, staff.password_hash);
  if (!isMatch) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  }

  // ตรวจสอบสถานะการอนุมัติ
  if (staff.is_approved !== true) {
    return { success: false, message: 'บัญชีนี้ยังไม่ได้รับการอนุมัติ กรุณาติดต่อ Manager' };
  }

  // สร้าง Session Cookie
  const cookieStore = await cookies();
  cookieStore.set('staff_session', JSON.stringify({
    id: staff.id,
    username: staff.username,
    department: staff.department,
    full_name: staff.full_name,
    role: staff.role
  }), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8 // 8 ชั่วโมง
  });

  return { success: true, department: staff.department };
}

/**
 * ฟังก์ชันสำหรับ Logout พนักงาน
 */
export async function logoutStaff() {
  const cookieStore = await cookies();
  
  // ลบ Cookie ของ Session ออก
  cookieStore.delete('staff_session');
  
  return { success: true };
}