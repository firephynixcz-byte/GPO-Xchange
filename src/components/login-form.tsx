'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
// เรียกใช้ createClient จากตำแหน่งที่เราเพิ่งแก้ไว้ (ให้ตรงกับ path จริงของกิตนะครับ)
import { createClient } from '@/lib/supabase/client'; 
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // ใช้ client ที่สร้างจากฟังก์ชันของเรา
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      router.push('/dashboard'); // หรือหน้าตามที่กิตกำหนดไว้
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
      <input 
        type="email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        placeholder="อีเมล" 
        required 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder="รหัสผ่าน" 
        required 
      />
      <Button type="submit" disabled={loading}>
        {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
      </Button>
    </form>
  );
}