'use server';

import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';

export async function loginStaff(username: string, password: string) {
  const supabase = await createClient();

  // 1. ใช้ .select('id, username, password_hash, department, full_name, role, is_approved')
  // เพื่อให้มั่นใจว่าดึงทุก field ที่จำเป็นออกมาได้จริงๆ
  const { data: staffList, error } = await supabase
    .from('staff_users')
    .select('id, username, password_hash, department, full_name, role, is_approved')
    .ilike('username', username.trim()); 

  if (error) {
    return { success: false, message: `DB Connection Error: ${error.message}` };
  }

  if (!staffList || staffList.length === 0) {
    return { success: false, message: 'ไม่พบผู้ใช้งานนี้ในระบบ' };
  }

  const selectedStaff = staffList[0];

  // 2. เปรียบเทียบ Password
  const isMatch = await bcrypt.compare(password, selectedStaff.password_hash);
  if (!isMatch) {
    return { success: false, message: 'รหัสผ่านไม่ถูกต้อง' };
  }

  // 3. ตรวจสอบสถานะการอนุมัติ
  if (selectedStaff.is_approved !== true) {
    return { success: false, message: 'บัญชีนี้ยังไม่ได้รับการอนุมัติ กรุณาติดต่อ Manager' };
  }

  // 4. สร้าง Session (แปลง ID เป็น string ชัดเจน)
  const cookieStore = await cookies();
  cookieStore.set('staff_session', JSON.stringify({
    id: String(selectedStaff.id), // บังคับเป็น String เพื่อป้องกันปัญหา UUID
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