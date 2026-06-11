'use server';

import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginStaff(username: string, password: string) {
  const supabase = await createClient();

  // ดึงข้อมูลเป็น Array (ป้องกันปัญหา .single() ที่ทำให้พัง)
  const { data: staffList, error } = await supabase
    .from('staff_users')
    .select('*')
    .eq('username', username.trim());

  // เช็ค Error หรือไม่มีข้อมูล
  if (error || !staffList || staffList.length === 0) {
    return { success: false, message: 'ไม่พบผู้ใช้งานนี้ในระบบ' };
  }

  // ใช้ selectedStaff ตัวเดียวตลอดทั้งไฟล์
  const selectedStaff = staffList[0];

  const isMatch = await bcrypt.compare(password, selectedStaff.password_hash);
  if (!isMatch) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  }

  if (selectedStaff.is_approved !== true) {
    return { success: false, message: 'บัญชีนี้ยังไม่ได้รับการอนุมัติ กรุณาติดต่อ Manager' };
  }

  const cookieStore = await cookies();
  cookieStore.set('staff_session', JSON.stringify({
    id: selectedStaff.id,
    username: selectedStaff.username,
    department: selectedStaff.department,
    full_name: selectedStaff.full_name,
    role: selectedStaff.role
  }), { 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8
  });

  return { success: true, department: selectedStaff.department };
}

export async function logoutStaff() {
  const cookieStore = await cookies();
  cookieStore.delete('staff_session');
  return { success: true };
}