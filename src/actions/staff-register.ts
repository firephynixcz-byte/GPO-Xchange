'use server';

import { createClient } from '@/lib/supabase/server';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function registerStaff(formData: FormData) {
  const supabase = await createClient();
  
  // ดึงข้อมูลจากฟอร์ม
  const full_name = formData.get('full_name') as string;
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const department = formData.get('department') as string;

  // 1. ตรวจสอบเบื้องต้น (เช่น ห้ามค่าว่าง)
  if (!username || !password || !department) {
    return { success: false, error: { message: 'กรุณากรอกข้อมูลให้ครบถ้วนครับ' } };
  }

  try {
    // 2. Hash รหัสผ่าน
    const password_hash = await bcrypt.hash(password, 10);

    // 3. Insert ข้อมูลลงตาราง staff_users
    // is_approved จะเป็น false โดย default ตาม schema ของกิต
    const { error } = await supabase.from('staff_users').insert({
      full_name,
      username,
      password_hash,
      department,
      role: 'staff' // กำหนด role เริ่มต้นเป็น staff
    });

    if (error) {
      if (error.code === '23505') { // รหัส Error กรณี username ซ้ำ
        return { success: false, error: { message: 'Username นี้มีผู้ใช้งานแล้วครับ' } };
      }
      throw error;
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: { message: err.message || 'เกิดข้อผิดพลาดในการลงทะเบียน' } };
  }
}

// เพิ่มเติม: ฟังก์ชันสำหรับการอนุมัติที่กิตถามถึงก่อนหน้านี้
export async function approveStaff(staffId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('staff_users')
    .update({ is_approved: true })
    .eq('id', staffId);

  if (error) {
    throw new Error('ไม่สามารถอนุมัติสิทธิ์ได้: ' + error.message);
  }

  revalidatePath('/admin/dashboard');
  return { success: true };
}