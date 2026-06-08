'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RegisterForm } from '@/app/auth/RegisterForm';

const inputCls =
  'w-full px-5 py-4 rounded-xl border border-slate-300 bg-white text-sm text-slate-900 ' +
  'focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 ' +
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
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm?next=/form`,
      },
    });

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage('ระบบส่งลิงก์ยืนยันตัวตนไปที่อีเมลแล้วครับ');
    }

    setLoading(false);
  };

  // ------------------------------------------------------------------
  // Register View
  // ------------------------------------------------------------------
  if (view === 'register') {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-6">

          <button
            onClick={() => setView('gateway')}
            className="
              flex items-center gap-2
              px-6 py-3
              rounded-full
              border-2 border-teal-600
              text-teal-700
              text-xs font-bold uppercase tracking-widest
              hover:bg-teal-600 hover:text-white
              transition-all
            "
          >
            ← ย้อนกลับ
          </button>

          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 px-10 py-12 shadow-2xl">

            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '32px 32px',
              }}
            />

            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />

            <div className="relative">
              <p className="text-teal-300 text-xs font-bold uppercase tracking-[0.25em] mb-3">
                ลงทะเบียนครั้งแรก
              </p>

              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                ข้อมูลหน่วยงาน
              </h2>

              <p className="text-white/70 mt-3 text-sm md:text-base">
                กรุณากรอกข้อมูลให้ครบถ้วนเพื่อส่งคำขอลงทะเบียนใช้งานระบบ
              </p>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-10">
            <RegisterForm setView={setView} />
          </div>
        </div>
      </main>
    );
  }

  // ------------------------------------------------------------------
  // Gateway View
  // ------------------------------------------------------------------
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 px-10 py-12 shadow-2xl">

          <div
            className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />

          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold backdrop-blur">
            ส่วนของลูกค้า
          </div>

          <div className="relative flex flex-col md:flex-row md:items-center gap-8">

            <div className="flex items-center gap-4 shrink-0">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                <span className="text-white text-lg font-black">GPO</span>
              </div>

              <div>
                <p className="text-white/60 text-[11px] font-bold uppercase tracking-widest mb-1">
                  องค์การเภสัชกรรม สาขาภาคใต้
                </p>

                <p className="text-white text-2xl font-black tracking-tight">
                  Xchange Portal
                </p>
              </div>
            </div>

            <div className="hidden md:block w-px h-14 bg-white/20" />

            <div className="flex-1">
              <h1 className="text-white text-2xl md:text-3xl font-black tracking-tight">
                ระบบยืนยันตัวตนผู้ใช้งาน
              </h1>

              <p className="text-white/70 text-sm md:text-base mt-2">
                เลือกดำเนินการตามสถานะการลงทะเบียนของหน่วยงาน
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Registration Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 flex flex-col">

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl">
                📝
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  ลงทะเบียนครั้งแรก
                </h2>

                <p className="text-sm text-slate-500">
                  สำหรับหน่วยงานที่ยังไม่มีบัญชี
                </p>
              </div>
            </div>

            <div className="space-y-4 flex-1">
              {[
                'กรอกข้อมูลหน่วยงานและผู้ประสานงาน',
                'ลงลายมือชื่อดิจิทัลและยินยอม PDPA',
                'รอเจ้าหน้าที่อนุมัติ 1–2 วันทำการ',
              ].map((s, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 shrink-0 rounded-full bg-teal-100 text-teal-700 font-bold text-sm flex items-center justify-center">
                    {i + 1}
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed">
                    {s}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setView('register')}
              className="
                mt-6
                w-full
                py-4
                rounded-xl
                text-sm
                font-bold
                text-white
                bg-gradient-to-r
                from-teal-600
                to-emerald-600
                hover:from-teal-700
                hover:to-emerald-700
                shadow-lg
                shadow-teal-500/20
                transition-all
              "
            >
              เริ่มลงทะเบียน →
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8 flex flex-col">

            <div className="flex items-center gap-4 mb-6">

              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
                🔑
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  เข้าสู่ระบบ
                </h2>

                <p className="text-sm text-slate-500">
                  สำหรับหน่วยงานที่ได้รับอนุมัติแล้ว
                </p>
              </div>

            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[11px] text-slate-500">Access</p>
                <p className="font-bold text-slate-800">Secure</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[11px] text-slate-500">Method</p>
                <p className="font-bold text-slate-800">Magic Link</p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[11px] text-slate-500">Status</p>
                <p className="font-bold text-green-600">Online</p>
              </div>

            </div>

            <form
              onSubmit={handleLogin}
              className="flex flex-col gap-5 flex-1"
            >

              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                  Email หน่วยงาน *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setMessage('');
                  }}
                  placeholder="pharmacy@hospital.go.th"
                  required
                  className={inputCls}
                />
              </div>

              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4">
                <p className="text-xs text-amber-800 leading-relaxed">
                  ระบบจะส่ง Magic Link ไปยังอีเมลของหน่วยงาน
                  สามารถคลิกลิงก์เพื่อเข้าสู่ระบบได้ทันที
                  โดยไม่ต้องใช้รหัสผ่าน
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  py-4
                  rounded-xl
                  text-sm
                  font-bold
                  text-white
                  bg-gradient-to-r
                  from-amber-500
                  to-orange-500
                  hover:from-amber-600
                  hover:to-orange-600
                  shadow-lg
                  shadow-amber-500/20
                  transition-all
                "
              >
                {loading
                  ? 'กำลังส่ง...'
                  : 'ยืนยัน และขอรับ Link ทาง Email →'}
              </button>

            </form>

            {message && (
              <div
                className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                  message.startsWith('Error')
                    ? 'bg-red-50 text-red-700 border border-red-100'
                    : 'bg-teal-50 text-teal-700 border border-teal-100'
                }`}
              >
                {message}
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
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