'use client';
import { useState } from 'react';
import { approveStaffByManager } from '@/actions/admin-actions';
import { useRouter } from 'next/navigation';

export function ApproveButton({ staffId }: { staffId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (!confirm('อนุมัติพนักงานท่านนี้เข้าสู่ระบบใช่หรือไม่?')) return;
    setLoading(true);
    await approveStaffByManager(staffId);
    setLoading(false);
    router.refresh(); // ให้หน้ารีเฟรชเพื่ออัปเดตสถานะ
  };

  return (
    <button 
      onClick={handleApprove}
      disabled={loading}
      className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-xl transition"
    >
      {loading ? 'กำลังอนุมัติ...' : 'อนุมัติสิทธิ์'}
    </button>
  );
}