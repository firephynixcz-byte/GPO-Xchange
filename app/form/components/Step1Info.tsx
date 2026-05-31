'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// ── Types ──────────────────────────────────────────────────────────────────
interface Step1Props {
  next: () => void;
  updateData: React.Dispatch<React.SetStateAction<any>>;
}

const TYPES = [
  { label: 'รับคืนลดหนี้',     icon: '💰' },
  { label: 'รับคืน Recall',    icon: '⚠️' },
  { label: 'รับคืนแลกเปลี่ยน', icon: '🔄' },
  { label: 'อื่นๆ',            icon: '⋯'  },
] as const;

const PROVINCES = ['สงขลา', 'ตรัง', 'พัทลุง', 'ปัตตานี', 'ยะลา', 'นราธิวาส', 'สตูล'];

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-700 to-teal-500" />
      <span className="text-base font-extrabold text-slate-900">{children}</span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
      {children}
    </label>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Step1Info({ next, updateData }: Step1Props) {
  const [selectedType, setSelectedType] = useState('');
  const [today, setToday]               = useState('');

  useEffect(() => {
    setToday(new Date().toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
    }));
  }, []);

  const set = (field: string, value: string) =>
    updateData((prev: any) => ({
      ...prev,
      sender: { ...prev.sender, [field]: value },
    }));

  const handleNext = () => {
    if (!selectedType) return alert('กรุณาเลือกประเภทรายการ');
    next();
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-5">

        {/* ── ปุ่มกลับสู่หน้าหลัก ── */}
        <div className="flex justify-start">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-teal-700 font-bold text-sm hover:text-teal-900 transition-all px-4 py-2 rounded-lg hover:bg-teal-100/50"
          >
          </Link>
        </div>

        {/* ── Card 1 : ประเภทรายการ ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full">
          <SectionTitle>รายละเอียดรายการ</SectionTitle>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => { setSelectedType(t.label); set('return_type', t.label); }}
                className={[
                  'flex flex-col items-center gap-2 py-5 px-2 rounded-xl border-2 transition-all w-full',
                  selectedType === t.label
                    ? 'border-teal-600 bg-teal-50 shadow-md shadow-teal-100'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100',
                ].join(' ')}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className={`text-xs font-bold text-center leading-tight ${
                  selectedType === t.label ? 'text-teal-800' : 'text-slate-500'
                }`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          {selectedType === 'อื่นๆ' && (
            <div className="flex flex-col gap-1.5 mb-6">
              <FieldLabel>ระบุรายละเอียดอื่นๆ</FieldLabel>
              <input
                onChange={(e) => set('other_detail', e.target.value)}
                placeholder="ระบุประเภทรายการ..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>เลขที่เอกสาร (Auto)</FieldLabel>
              <input value="S058/2026" readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>วันที่ทำรายการ</FieldLabel>
              <input value={today} readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
            </div>
          </div>
        </div>

        {/* ── Card 2 : ข้อมูลหน่วยงาน ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7 w-full">
          <SectionTitle>ข้อมูลหน่วยงาน</SectionTitle>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <FieldLabel>ชื่อโรงพยาบาล / ร้านยา / คลินิก *</FieldLabel>
              <input
                onChange={(e) => set('hospital_name', e.target.value)}
                placeholder="ระบุชื่อหน่วยงาน"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>จังหวัด *</FieldLabel>
              <select
                onChange={(e) => set('province', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition appearance-none cursor-pointer"
              >
                <option value="">-- เลือกจังหวัด --</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>รหัสลูกค้า</FieldLabel>
              <input value="CUST-12345" readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>โทรศัพท์ติดต่อ</FieldLabel>
              <input value="074-XXX-XXX" readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>อีเมลสำหรับรับรหัสอ้างอิง</FieldLabel>
              <input value="user@email.com" readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none" />
            </div>

            {/* ── แยกฟิลด์ผู้ส่งคืนและตำแหน่ง ── */}
            <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>ชื่อ-นามสกุล ผู้ส่งคืน *</FieldLabel>
                <input value="ธนกฤต โรจน์กิจจานุรักษ์" readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>ตำแหน่ง *</FieldLabel>
                <input value="เภสัชกร 7" readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="w-full py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 active:scale-[0.99] transition-all shadow-lg shadow-teal-200"
        >
          ดำเนินการต่อ →
        </button>

      </div>
    </div>
  );
}