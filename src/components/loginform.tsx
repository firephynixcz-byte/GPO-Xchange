'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginStaff } from '@/actions/staff-auth';

export default function Loginform() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginStaff(username, password);

      if (result.success) {
        // Login สำเร็จ - Refresh และ Redirect
        router.push('/dashboard');
        router.refresh();
      } else {
        // Login ไม่สำเร็จ - แสดงข้อความจาก Server
        setError(result.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ในขณะนี้');
    } finally {
      // หยุดสถานะ Loading ไม่ว่าจะเกิดอะไรขึ้น
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <form onSubmit={handleLogin} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Username</label>
          <input
            type="text"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1">Password</label>
          <input
            type="password"
            className="w-full p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-600 transition-all"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        {/* Error Message Area */}
        {error && (
          <div className="p-3 bg-red-50 text-red-600 text-[11px] font-bold rounded-lg text-center border border-red-100">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          type="submit"
          className={`w-full p-4 rounded-xl font-black text-white transition-all ${
            loading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-teal-700 hover:bg-teal-800 shadow-lg shadow-teal-900/20'
          }`}
          disabled={loading}
        >
          {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>

      {/* ลิงก์สำหรับลงทะเบียนพนักงานใหม่ */}
      <div className="mt-6 text-center">
        <button 
          onClick={() => router.push('/register')}
          className="text-xs font-bold text-teal-700 hover:underline"
          disabled={loading}
        >
          ลงทะเบียนพนักงานใหม่
        </button>
      </div>
    </div>
  );
}