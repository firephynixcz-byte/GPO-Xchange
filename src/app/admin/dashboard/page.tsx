import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from './DashboardClient'; // ต้องมั่นใจว่าไฟล์นี้อยู่โฟลเดอร์เดียวกัน

export default async function StaffDashboardPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('staff_session');

  if (!session) redirect('/admin');

  const user = JSON.parse(session.value);
  const supabase = await createClient();

  const [requestsRes, staffRes] = await Promise.all([
    supabase
      .from('requests')
      .select('*, drug_items(id, drug_name, exp_status, qty)')
      .eq('department', user.department)
      .order('created_at', { ascending: false }),
    
    supabase
      .from('staff_users')
      .select('*')
      .eq('is_approved', false)
      .order('created_at', { ascending: true })
  ]);

  if (requestsRes.error) {
    return <div className="p-10 text-red-600">โหลดข้อมูลใบงานผิดพลาด</div>;
  }

  // นี่คือจุดสำคัญ: เราส่ง Data เข้าไปให้ DashboardClient แบบนี้
  return (
    <DashboardClient 
      user={user} 
      initialRequests={requestsRes.data || []} 
      pendingStaff={staffRes.data || []} 
    />
  );
}