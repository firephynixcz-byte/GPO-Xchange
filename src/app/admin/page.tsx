'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/actions/staff-auth';

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
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-800 px-10 py-12 shadow-2xl">

          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-0 w-72 h-72 bg-emerald-300/10 rounded-full blur-3xl" />

          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold backdrop-blur">
            Xchange Portal v2.0
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
                ระบบจัดการภายใน
              </h1>

              <p className="text-white/70 text-sm md:text-base mt-2">
                Staff Management Portal สำหรับเจ้าหน้าที่ CSR, LOG และ Warehouse
              </p>
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Login */}
          <form
            onSubmit={handleLogin}
            className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center text-2xl">
                🔐
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-slate-800">
                  GPO Staff Login
                </h2>

                <p className="text-sm text-slate-500">
                  สำหรับเจ้าหน้าที่ CSR, LOG และ WH
                </p>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-3 mb-6">

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500">ฝ่ายงาน</p>
                <p className="font-bold text-slate-800">3 แผนก</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500">Workflow</p>
                <p className="font-bold text-slate-800">CSR → LOG → WH</p>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
                <p className="text-[11px] text-slate-500">Status</p>
                <p className="font-bold text-green-600">Online</p>
              </div>

            </div>

            <div className="space-y-4">

              <input
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  w-full
                  px-5
                  py-3.5
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  text-slate-800
                  placeholder:text-slate-400
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-100
                  outline-none
                  transition-all
                "
              />

              <input
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full
                  px-5
                  py-3.5
                  rounded-xl
                  border
                  border-slate-300
                  bg-white
                  text-slate-800
                  placeholder:text-slate-400
                  focus:border-teal-500
                  focus:ring-4
                  focus:ring-teal-100
                  outline-none
                  transition-all
                "
              />

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
                  from-teal-600
                  to-emerald-600
                  hover:from-teal-700
                  hover:to-emerald-700
                  shadow-lg
                  shadow-teal-500/20
                  transition-all
                  active:scale-[0.98]
                "
              >
                {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ →'}
              </button>

            </div>
          </form>

          {/* Dashboard */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl shadow-xl p-8 text-white flex flex-col">

            <div className="flex items-center justify-between mb-6">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-2xl">
                  📊
                </div>

                <div>
                  <h2 className="text-lg font-extrabold">
                    Dashboard Management
                  </h2>

                  <p className="text-sm text-white/70">
                    วิเคราะห์ภาพรวมงานสำหรับผู้บริหาร
                  </p>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold">
                Coming Soon
              </span>

            </div>

            <div className="h-px bg-white/15 mb-6" />

            <p className="text-white/90 leading-relaxed flex-1">
              ส่วนการแสดงผลภาพรวมสถานะงาน (Visual Board)
              เพื่อติดตามประสิทธิภาพการดำเนินงานแบบ Real-time
              และสนับสนุนการตัดสินใจของผู้บริหาร
            </p>

            <button
              disabled
              className="
                mt-6
                w-full
                py-4
                rounded-xl
                bg-white/20
                border
                border-white/20
                text-white
                font-bold
                cursor-not-allowed
                backdrop-blur
              "
            >
              อยู่ระหว่างการพัฒนา
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-6 border-t border-slate-200">

          <button
            onClick={() => router.push('/')}
            className="
              flex
              items-center
              gap-2
              px-6
              py-3
              rounded-full
              border-2
              border-teal-600
              text-teal-700
              text-xs
              font-bold
              uppercase
              tracking-widest
              hover:bg-teal-600
              hover:text-white
              transition-all
              w-fit
            "
          >
            ← กลับหน้าหลัก
          </button>

          <p className="text-xs text-slate-500 font-medium">
            พบปัญหาการใช้งานระบบ ติดต่อ GPO สาขาภาคใต้ โทร. 074-230547
          </p>

        </div>
      </div>
    </main>
  );
}