'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // เพิ่ม useRouter มาสำหรับ SPA Navigation
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { RegisterForm } from '@/app/auth/RegisterForm';

// ── Shared styles ──────────────────────────────────────────────────────────
const inputCls =
  'w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition placeholder:text-slate-300';

// ── Shared Components ──────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
      {children}
    </label>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function AuthPage() {
  const router = useRouter(); // เตรียม router ไว้
  const [view,    setView]    = useState<'gateway' | 'register'>('gateway');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // logic คงเดิม 100%
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      // ปรับแก้ Redirect URL ให้สั้นลง แต่ Logic เหมือนเดิม
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm?next=/form` },
    });
    if (error) setMessage(`Error: ${error.message}`);
    else setMessage('ระบบส่งลิงก์ยืนยันตัวตนไปที่อีเมลแล้วครับ');
    setLoading(false);
  };

  // ── Register view ──────────────────────────────────────────────────────
  if (view === 'register') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100
                       flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-100 shadow-xl p-8 md:p-10">
          <RegisterForm />
          <button
            onClick={() => setView('gateway')}
            className="mt-8 flex items-center justify-center w-full gap-2
                       text-[11px] font-bold text-slate-400 hover:text-teal-700
                       uppercase tracking-widest transition-colors"
          >
            ← กลับสู่หน้าก่อนหน้า
          </button>
        </div>
      </main>
    );
  }

  // ── Gateway view ───────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-100
                     flex flex-col items-center justify-center p-6 md:p-10">

      {/* ปุ่มกลับหน้าหลัก */}
      <div className="w-full max-w-5xl mb-6">
        <button
          onClick={() => router.push('/')} // ใช้ router.push สวยกว่า
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/80 backdrop-blur
                     border border-slate-200 text-sm font-bold text-slate-600
                     hover:border-teal-400 hover:text-teal-700 shadow-sm transition-all"
        >
          ← กลับหน้าหลัก
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-12 h-8 rounded-2xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-200">
            <span className="text-white text-xs font-black tracking-tight">GPO</span>
          </div>
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
            Xchange portal
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          ระบบยืนยันตัวตนผู้ใช้งาน
          <span className="text-teal-600"> (Authentication)</span>
        </h1>
        <p className="text-sm text-slate-500">
          กรุณาเลือกดำเนินการตามสถานะการลงทะเบียนของหน่วยงาน
        </p>
      </div>

      {/* Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 gap-y-6">

        {/* ── Card ลงทะเบียน ── */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-lg
                        flex flex-col items-center text-center p-10 gap-6
                        hover:shadow-xl transition-shadow">

          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-teal-50 border-2 border-teal-100
                          flex items-center justify-center text-5xl shadow-inner">
            📝
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-teal-700">ลงทะเบียนลูกค้า "เข้าระบบครั้งแรก"</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              เพื่อเปิดสิทธิ์เข้าใช้งานระบบ Xchange Portal<br /> 
              ลงทะเบียน "ครั้งแรก เพียงครั้งเดียว" เท่านั้น
            </p>
          </div>

          <div className="w-full bg-teal-50 rounded-2xl px-5 py-4 text-xs text-teal-700
                          leading-relaxed border border-teal-100">
            กรอกข้อมูลพื้นฐาน พร้อมลงลายมือชื่อดิจิทัล  ✍️<br />
            เพื่อลงทะเบียน เปิดสิทธิ์ขอเข้าใช้งานระบบ 
          </div>

          <button
            onClick={() => setView('register')}
            className="w-full py-4 rounded-2xl font-bold text-white text-base
                       bg-gradient-to-r from-teal-700 to-teal-500
                       hover:from-teal-800 hover:to-teal-600
                       active:scale-[0.99] transition-all
                       shadow-lg shadow-teal-100"
          >
            เริ่มลงทะเบียน
          </button>
        </div>

        {/* ── Card เข้าสู่ระบบ OTP ── */}
        <div className="bg-white rounded-3xl border-2 border-amber-200 shadow-lg
                        flex flex-col items-center text-center p-10 gap-6
                        hover:shadow-xl transition-shadow">

          {/* Icon */}
          <div className="w-24 h-24 rounded-3xl bg-amber-50 border-2 border-amber-100
                          flex items-center justify-center text-5xl shadow-inner">
            🔑
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-extrabold text-amber-600">เข้าสู่ระบบเพื่อส่งแบบฟอร์ม</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              สำหรับหน่วยงานที่ผ่านการ "ลงทะเบียน" แล้ว 
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            <div className="text-left">
              <FieldLabel>กรุณาระบุ Email ที่ลงทะเบียนไว้กับระบบ *</FieldLabel>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setMessage(''); }}
                placeholder="เช่น pharmacy@hospital.go.th"
                required
                className={inputCls}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-base
                         bg-gradient-to-r from-amber-500 to-amber-400
                         hover:from-amber-600 hover:to-amber-500
                         disabled:opacity-60 active:scale-[0.99]
                         transition-all shadow-lg shadow-amber-100
                         flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  กำลังส่ง...
                </>
              ) : 'ยืนยัน เข้าระบบด้วย email'}
            </button>
          </form>

          {/* message */}
          {message && (
            <div className={[
              'w-full flex items-start gap-2 rounded-2xl px-4 py-3 text-xs font-medium text-left',
              message.startsWith('Error')
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-teal-50 border border-teal-200 text-teal-700',
            ].join(' ')}>
              <span className="shrink-0">{message.startsWith('Error') ? '❌' : '✅'}</span>
              {message}
            </div>
          )}
        </div>

      </div>

      {/* Footer note */}
      <p className="mt-10 text-xs text-slate-400 text-center">
        หากพบปัญหาการใช้งานระบบ ติดต่อ GPO สาขาภาคใต้ โทร. 074-230547
      </p>

    </main>
  );
}