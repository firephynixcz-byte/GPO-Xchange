'use client';
import { useState } from 'react';
import { registerStaff } from '@/actions/staff-register';
import { useRouter } from 'next/navigation';

// ── Shared Styles ──
const inputCls =
  'w-full px-5 py-4 rounded-xl border border-teal-100 bg-teal-50/50 text-sm font-medium text-slate-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition placeholder:text-slate-400';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-teal-100 bg-teal-50/50 text-sm font-medium text-slate-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition ' +
  'appearance-none cursor-pointer ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%230d9488\' stroke-width=\'1.5\' stroke-linecap=\'round\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] ' +
  'bg-no-repeat bg-[right_14px_center] bg-[length:18px] pr-10';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
      {children}{required && <span className="text-teal-600 ml-1">*</span>}
    </label>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await registerStaff(formData);

    if (result.success) {
      alert("ลงทะเบียนเรียบร้อย รอ Admin อนุมัติสิทธิ์นะครับ");
      router.push('/admin');
    } else {
      alert("เกิดข้อผิดพลาด: " + (result.error?.message || "ไม่ทราบสาเหตุ"));
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg">
        
        {/* Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-emerald-700 p-8 rounded-t-3xl shadow-lg text-white">
          <h1 className="text-2xl font-black">ลงทะเบียนพนักงาน GPO</h1>
          <p className="text-teal-100 text-sm mt-1">กรอกข้อมูลเพื่อขอเข้าใช้งาน Xchange Portal</p>
        </div>

        {/* ฟอร์ม */}
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-b-3xl shadow-xl border border-teal-100 space-y-6">
          
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>ชื่อ-นามสกุล</FieldLabel>
            <input name="full_name" className={inputCls} placeholder="ระบุชื่อ-นามสกุลจริง" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>Username</FieldLabel>
            <input name="username" className={inputCls} placeholder="ระบุ Username ที่ต้องการ" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <FieldLabel required>รหัสผ่าน</FieldLabel>
            <input name="password" type="password" className={inputCls} placeholder="ระบุรหัสผ่าน" required />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <FieldLabel required>ฝ่ายงาน</FieldLabel>
            <select name="department" className={selectCls} required>
              <option value="csr">CSR - Customer Service</option>
              <option value="log">LOG - Logistics</option>
              <option value="wh">WH - Warehouse</option>
              <option value="manager">Manager - Management</option>
            </select>
          </div>

          <button 
            disabled={loading} 
            className="w-full py-5 mt-2 bg-gradient-to-r from-teal-700 to-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 active:scale-[0.98] transition-all"
          >
            {loading ? 'กำลังบันทึกข้อมูล...' : 'ส่งคำขอลงทะเบียน'}
          </button>
        </form>
      </div>

      {/* ปุ่มย้อนกลับ */}
      <button
        onClick={() => router.push('/admin')}
        className="fixed bottom-10 left-10 flex items-center gap-2 px-6 py-3 rounded-full border-2 border-teal-600 text-teal-700 text-xs font-bold uppercase tracking-widest hover:bg-teal-600 hover:text-white transition-all"
      >
        ← ย้อนกลับ
      </button>
    </main>
  );
}