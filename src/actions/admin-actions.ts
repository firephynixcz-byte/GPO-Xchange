'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function approveStaffByManager(staffId: string) {
  const supabase = await createClient();

  // 1. ตรวจสอบ Session และ Role ก่อนเสมอ
  // (สมมติว่ากิตมีระบบ checkSession ที่เช็ค role ใน cookie แล้ว)
  
  // 2. อัปเดตสถานะในตาราง
  const { error } = await supabase
    .from('staff_users')
    .update({ 
      is_approved: true,
      updated_at: new Date().toISOString() 
    })
    .eq('id', staffId);

  if (error) {
    console.error("Error approving staff:", error);
    return { success: false, error: "ไม่สามารถอนุมัติสิทธิ์ได้" };
  }

  // 3. สั่ง Refresh ข้อมูลในหน้า Dashboard
  revalidatePath('/admin/dashboard');
  return { success: true };
}