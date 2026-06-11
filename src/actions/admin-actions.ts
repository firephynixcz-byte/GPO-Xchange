'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

export async function approveStaffByManager(staffId: string) {
  const supabase = await createClient();

  // 1. ตรวจสอบสิทธิ์จาก Session ของคนที่กด
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('staff_session');
  
  if (!sessionCookie) {
    return { success: false, error: "กรุณาเข้าสู่ระบบก่อนครับ" };
  }

  const session = JSON.parse(sessionCookie.value);

  // 2. เช็คว่าคนกดเป็น Manager จริงไหม
  if (session.role !== 'manager') {
    return { success: false, error: "คุณไม่มีสิทธิ์อนุมัติพนักงานครับ" };
  }

  // 3. อัปเดตสถานะ
  const { error } = await supabase
    .from('staff_users')
    .update({ 
      is_approved: true,
      updated_at: new Date().toISOString() 
    })
    .eq('id', staffId);

  if (error) {
    return { success: false, error: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล" };
  }

  // 4. สั่ง Refresh
  revalidatePath('/admin/dashboard');
  return { success: true };
}