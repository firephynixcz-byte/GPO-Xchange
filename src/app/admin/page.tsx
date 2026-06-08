'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/actions/staff-auth';
import Link from 'next/link';

export default function AdminHubPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await loginStaff(username, password);
    if (result.success) {
      router.push('/admin/dashboard');
    } else {
      alert(result.message);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-teal-50/50 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl flex flex-col gap-8">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-teal-800 px-10 py-12 shadow-lg shadow-teal-900/10">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="relative flex flex-col md:flex-row md:items-center gap-8">
            <div className="flex items-center gap-4 shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-lg font-black">GPO</span>
              </div>
              <div>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">องค์การเภสัชกรรม สาขาภาคใต้</p>
                <p className="text-white text-xl font-extrabold">Xchange Portal</p>
              </div>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="flex-1">
              <h1 className="text-white text-lg font-extrabold">ระบบจัดการภายใน (Staff Management)</h1>
              <p className="text-white/60 text-sm mt-1">เข้าสู่ระบบเพื่อปฏิบัติงานตามแผนกที่รับผิดชอบ</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Login Form (รวมช่องกรอกไว้ในนี้) */}
          <form onSubmit={handleLogin} className="bg-gradient-to-br from-teal-600 to-teal-800 rounded-3xl shadow-xl shadow-teal-200/50 p-8 flex flex-col gap-5 text-white">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">🔐</div>
              <div>
                <h2 className="text-base font-extrabold">GPO Staff Login</h2>
                <p className="text-xs text-white/60">สำหรับเจ้าหน้าที่ CSR, Log และ WH</p>
              </div>
            </div>
            
            <input 
              required
              placeholder="Username"
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 focus:bg-white/20 outline-none transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input 
              required
              type="password"
              placeholder="Password"
              className="w-full px-5 py-4 rounded-xl bg-white/10 border border-white/20 placeholder:text-white/50 focus:bg-white/20 outline-none transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl text-sm font-bold text-teal-900 bg-white hover:bg-teal-50 transition-all active:scale-[0.98]"
            >
              {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ →'}
            </button>
          </form>

          {/* Card 2: Dashboard Management */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-xl shadow-orange-200/50 p-8 flex flex-col gap-6 text-white">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">📊</div>
              <div>
                <h2 className="text-base font-extrabold">Dashboard Management</h2>
                <p className="text-xs text-white/60">วิเคราะห์ภาพรวมงานสำหรับผู้บริหาร</p>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <p className="text-sm text-white/90 font-medium flex-1">ส่วนการแสดงผลภาพรวมสถานะงาน (Visual Board) เพื่อติดตามประสิทธิภาพการดำเนินงานแบบ Real-time</p>
            <button 
              disabled 
              className="w-full py-4 rounded-xl text-sm font-bold text-orange-900/60 bg-orange-100 cursor-not-allowed"
            >
              อยู่ระหว่างการพัฒนา
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-6 border-t border-slate-200">
          <button 
            onClick={() => router.push('/')} 
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-teal-600 
                       text-teal-700 text-xs font-bold uppercase tracking-widest
                       hover:bg-teal-600 hover:text-white transition-all active:scale-[0.98]"
          >
            <span>←</span> กลับหน้าหลัก
          </button>
          <p className="text-[11px] text-slate-400 font-medium">พบปัญหาการใช้งานระบบ ติดต่อ GPO สาขาภาคใต้ โทร. 074-230547</p>
        </div>

      </div>
    </main>
  );
}