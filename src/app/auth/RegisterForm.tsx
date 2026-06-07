'use client';

import { useState, useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

// ── Shared styles ──────────────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition placeholder:text-slate-300';

const selectCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition ' +
  'appearance-none cursor-pointer ' +
  'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%230d9488\' stroke-width=\'1.5\' stroke-linecap=\'round\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] ' +
  'bg-no-repeat bg-[right_14px_center] bg-[length:18px] pr-10';

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
      {children}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
}

const PROVINCES = [
  'สงขลา','ตรัง','พัทลุง','ปัตตานี','ยะลา','นราธิวาส','สตูล',
];

// ── Component ──────────────────────────────────────────────────────────────
export function RegisterForm() {
  const sigCanvas = useRef<any>(null);
  const [sigEmpty,  setSigEmpty]  = useState(true);
  const [pdpa,      setPdpa]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [done,      setDone]      = useState(false);

  const [formData, setFormData] = useState({
    hospitalName: '',
    contactName:  '',
    position:     '',
    province:     '',
    phone:        '',
    email:        '',
  });

  const set = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const clearSig = () => { sigCanvas.current?.clear(); setSigEmpty(true); };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pdpa)                        return alert('กิตครับ รบกวนกดรับรอง PDPA ก่อนนะ');
    if (sigCanvas.current?.isEmpty()) return alert('กิตครับ อย่าลืมลงลายมือชื่อนะ');

    setLoading(true);
    const signatureBase64 = sigCanvas.current.toDataURL();
    const supabase = createClient();

    // ── INSERT → public.clients ───────────────────────────────────────────
    const { error } = await supabase.from('clients').insert([{
      hospital_name:     formData.hospitalName,
      contact_name:      formData.contactName,
      position:          formData.position,
      province:          formData.province,
      phone:             formData.phone,
      email:             formData.email,
      signature:         signatureBase64,
      status:            'pending',
    }]);

    if (error) {
      if (error.code === '23505') {
        alert('อีเมลนี้ถูกลงทะเบียนแล้วครับ');
      } else {
        alert(`โอ๊ะ! มีปัญหาตอนบันทึกครับ: ${error.message}`);
      }
      setLoading(false);
      return;
    }

    // ── ยิง API ส่งอีเมลต้อนรับ ──────────────────────────────────────────
    try {
      await fetch('/api/send-welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          hospitalName: formData.hospitalName 
        }),
      });
    } catch (err) {
      console.error("ส่งอีเมลไม่สำเร็จ แต่ข้อมูลถูกบันทึกแล้ว:", err);
    }

    setDone(true);
    setLoading(false);
  };

  // ── Success state ──────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-10 text-center">
        <div className="w-14 h-14 rounded-full bg-teal-50 flex items-center justify-center text-3xl">
          ✅
        </div>
        <div>
          <p className="font-extrabold text-slate-900 text-base">ส่งคำขอลงทะเบียนสำเร็จ!</p>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-xs">
            กิตเดี๋ยวค่อยมาตรวจอนุมัติใน Admin Panel นะครับ
          </p>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleRegister} className="flex flex-col gap-5">

      {/* ชื่อหน่วยงาน — full width */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>ชื่อโรงพยาบาล / ร้านยา / คลินิก / หน่วยงาน</FieldLabel>
        <input
          value={formData.hospitalName}
          onChange={e => set('hospitalName', e.target.value)}
          placeholder="ระบุชื่อหน่วยงานเต็ม เช่น โรงพยาบาลสงขลา"
          className={inputCls}
          required
        />
      </div>

      {/* ชื่อผู้ประสานงาน — full width */}
      <div className="flex flex-col gap-1.5">
        <FieldLabel required>ชื่อ-นามสกุล ผู้ขอใช้งานระบบ</FieldLabel>
        <input
          value={formData.contactName}
          onChange={e => set('contactName', e.target.value)}
          placeholder="ระบุชื่อ-นามสกุลจริง"
          className={inputCls}
          required
        />
      </div>

      {/* ตำแหน่ง + จังหวัด */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>ตำแหน่ง</FieldLabel>
          <input
            value={formData.position}
            onChange={e => set('position', e.target.value)}
            placeholder="เช่น เภสัชกร หรือเจ้าหน้าที่หน่วยงาน"
            className={inputCls}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>จังหวัด</FieldLabel>
          <select
            value={formData.province}
            onChange={e => set('province', e.target.value)}
            className={selectCls}
            required
          >
            <option value="">-- เลือกจังหวัด --</option>
            {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* โทร + อีเมล */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>เบอร์โทรศัพท์ติดต่อ</FieldLabel>
          <input
            type="tel"
            value={formData.phone}
            onChange={e => set('phone', e.target.value)}
            placeholder="0XX-XXX-XXXX"
            className={inputCls}
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <FieldLabel required>อีเมลล์ (Email)</FieldLabel>
          <input
            type="email"
            value={formData.email}
            onChange={e => set('email', e.target.value)}
            placeholder="example@hospital.go.th"
            className={inputCls}
            required
          />
        </div>
      </div>

      {/* ลายเซ็นดิจิทัล */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <FieldLabel required>ลงลายมือชื่อดิจิทัล (ผู้ขอใช้งานระบบ)</FieldLabel>
          {!sigEmpty && (
            <button
              type="button"
              onClick={clearSig}
              className="text-xs font-bold text-red-400 hover:text-red-600
                         bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition"
            >
              ล้างลายเซ็น
            </button>
          )}
        </div>

        <div className="relative w-full rounded-2xl border-2 border-dashed border-teal-200
                        bg-white overflow-hidden hover:border-teal-400 transition-colors">
          <SignatureCanvas
            ref={sigCanvas}
            onBegin={() => setSigEmpty(false)}
            canvasProps={{
              className: 'w-full',
              style: { width: '100%', height: 150, display: 'block' },
            }}
            backgroundColor="transparent"
            penColor="#0f766e"
          />
          {/* hint */}
          {sigEmpty && (
            <div className="absolute inset-0 flex flex-col items-center justify-center
                            pointer-events-none text-slate-300 gap-1">
              <span className="text-3xl">✍️</span>
              <span className="text-xs font-medium">ลงลายเซ็นที่นี่</span>
            </div>
          )}
        </div>

        <p className="text-[11px] text-slate-300 text-center">
          วาดลายเซ็นด้วยนิ้วหรือเมาส์ · ใช้เป็นทะเบียนตัวอย่างผู้ประสานงาน
        </p>
      </div>

      {/* PDPA */}
      <label className={[
        'flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all',
        pdpa
          ? 'border-teal-400 bg-teal-50'
          : 'border-slate-200 bg-slate-50 hover:border-teal-200',
      ].join(' ')}>
        <input
          type="checkbox"
          checked={pdpa}
          onChange={e => setPdpa(e.target.checked)}
          className="w-5 h-5 mt-0.5 accent-teal-600 cursor-pointer shrink-0"
          required
        />
        <span className="text-xs text-slate-600 leading-relaxed">
          <b className="text-slate-800">คำยินยอม PDPA: </b>
          ข้าพเจ้ายินยอมให้ระบบ Xchange Portal ของ{' '}
          <span className="font-bold text-teal-700">องค์การเภสัชกรรม (GPO)</span>{' '}
          จัดเก็บ ประมวลผล และใช้ข้อมูลส่วนบุคคลข้างต้น
          (ชื่อ-นามสกุล, เบอร์โทรศัพท์, อีเมล และลายมือชื่ออิเล็กทรอนิกส์)
          เพื่อวัตถุประสงค์ในการยืนยันตัวตนและการติดต่อประสานงาน
          ตามนโยบายคุ้มครองข้อมูลส่วนบุคคล
        </span>
      </label>

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full py-6 rounded-xl font-bold text-sm
                   bg-gradient-to-r from-teal-700 to-teal-600
                   hover:from-teal-800 hover:to-teal-700
                   disabled:opacity-60 transition-all
                   shadow-lg shadow-teal-100"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            กำลังบันทึก...
          </span>
        ) : 'ส่งข้อมูลลงทะเบียน'}
      </Button>

    </form>
  );
}