'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RegisterForm } from '@/app/auth/RegisterForm';

const inputCls =
  'w-full px-5 py-4 rounded-xl border border-slate-200 bg-slate-50/50 text-sm text-slate-900 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-100 focus:border-teal-500 ' +
  'transition-all duration-200 placeholder:text-slate-400';

export default function AuthPage() {
  const router = useRouter();
  const [view, setView] = useState<'gateway' | 'register'>('gateway');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/form` },
    });
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage('ระบบส่งลิงก์ยืนยันตัวตนไปที่อีเมลแล้วครับ');
    setLoading(false);
  };

// ── Register view ──────────────────────────────────────────────────────
  if (view === 'register') {
    return (
      <main className="min-h-screen bg-teal-50/50 flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          
          {/* ปุ่มย้อนกลับ (Interactive) */}
          <button 
            onClick={() => setView('gateway')}
            className="self-start flex items-center gap-2 px-6 py-3 rounded-full border-2 border-teal-600 
                       text-teal-700 text-xs font-black uppercase tracking-widest
                       hover:bg-teal-600 hover:text-white transition-all active:scale-[0.98]"
          >
            <span>←</span> ย้อนกลับ
          </button>

          {/* Banner ส่วนบนของหน้า Register */}
          <div className="bg-teal-800 rounded-3xl p-10 shadow-xl shadow-teal-900/10">
            <p className="text-[12px] font-extrabold text-teal-300 uppercase tracking-widest mb-2">ลงทะเบียนครั้งแรก</p>
            <h2 className="text-3xl font-black text-white">ข้อมูลหน่วยงาน</h2>
            <p className="text-teal-100/70 text-sm mt-2">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อส่งคำขอลงทะเบียน</p>
          </div>

          {/* ส่วนฟอร์ม */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-10">
            <RegisterForm setView={setView} />
          </div>
        </div>
      </main>
    );
  }

  // ── Gateway view ───────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-teal-50/50 flex flex-col items-center justify-center px-6 py-20">
      <div className="w-full max-w-5xl flex flex-col gap-8">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-teal-800 px-10 py-12 shadow-lg shadow-teal-900/10">
          <div 
            className="absolute inset-0 opacity-[0.05]" 
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
          />
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
              <h1 className="text-white text-lg font-extrabold">ระบบยืนยันตัวตนผู้ใช้งาน</h1>
              <p className="text-white/60 text-sm mt-1">เลือกดำเนินการตามสถานะการลงทะเบียนของหน่วยงาน</p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Registration Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 flex flex-col gap-6 hover:shadow-lg transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center text-2xl">📝</div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">ลงทะเบียนครั้งแรก</h2>
                <p className="text-xs text-slate-400 mt-1">สำหรับหน่วยงานที่ยังไม่มีบัญชี</p>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="flex flex-col gap-4 flex-1">
              {['กรอกข้อมูลหน่วยงานและผู้ประสานงาน เพื่อเปิดสิทธิ์การใช้งานระบบ', 'ลงลายมือชื่อดิจิทัลและให้ความยินยอม PDPA', 'รอเจ้าหน้าที่อนุมัติใน 1–2 วันทำการ'].map((s, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-teal-50 text-teal-600 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                  {s}
                </div>
              ))}
            </div>
            <button 
              onClick={() => setView('register')} 
              className="w-full py-4 rounded-xl text-sm font-bold text-white bg-teal-700 hover:bg-teal-800 transition-all active:scale-[0.98]"
            >
              เริ่มลงทะเบียน →
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-amber-100 shadow-sm p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl">🔑</div>
              <div>
                <h2 className="text-base font-extrabold text-slate-900">เข้าสู่ระบบ</h2>
                <p className="text-xs text-slate-400 mt-1">สำหรับหน่วยงานที่ได้รับอนุมัติแล้ว</p>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <form onSubmit={handleLogin} className="flex flex-col gap-5 flex-1">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Email หน่วยงาน *</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => { setEmail(e.target.value); setMessage(''); }} 
                  placeholder="pharmacy@hospital.go.th" 
                  required 
                  className={inputCls} 
                />
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">ระบบจะส่ง Magic Link ไปยังอีเมลของท่าน สามารถกดเข้าระบบได้ทันทีผ่าน Link นั้น</p>
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full py-4 rounded-xl font-bold text-white text-sm bg-amber-500 hover:bg-amber-600 transition-all active:scale-[0.98]"
              >
                {loading ? 'กำลังส่ง...' : 'ยืนยัน และขอรับ Link ทาง Email →'}
              </button>
            </form>
            {message && (
              <div className={`p-4 rounded-xl text-xs font-medium ${message.startsWith('Error') ? 'bg-red-50 text-red-600' : 'bg-teal-50 text-teal-700'}`}>
                {message}
              </div>
            )}
          </div>
        </div>

{/* Footer - ปรับใหม่ให้ปุ่มกลับหน้าหลักเป็น Outline Button ที่ชัดเจน */}
<div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
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