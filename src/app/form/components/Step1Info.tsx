'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ReturnRepository } from '../../../repositories/ReturnRepository';

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
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('');
  const [otherDetail, setOtherDetail] = useState('');
  const [today, setToday] = useState('');
  const [docNumber, setDocNumber] = useState('Loading...'); 
  const [clientData, setClientData] = useState<any>(null);
  const [customerCode, setCustomerCode] = useState('');

  useEffect(() => {
    const init = async () => {
      const supabase = createClient();
      
      // 1. ดึงข้อมูล User
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth');
        return;
      }

      // 2. ดึงข้อมูลลูกค้าและตรวจสอบสถานะ
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('email', user.email)
        .single();
        
      if (error || !data) {
        alert('ไม่พบข้อมูลบัญชีผู้ใช้งาน หรือบัญชียังไม่ได้รับอนุมัติ กรุณาติดต่อเจ้าหน้าที่ GPO ครับ');
        router.push('/auth');
        return;
      }
      
      setClientData(data);
      // ถ้ามี customer_code ในฐานข้อมูลอยู่แล้ว ให้ดึงมาใส่ใน state
      if (data.b2b_customer_id) {
         // หากมีการเชื่อมต่อตาราง b2b_customers ไว้
      }

      // 3. ดึงเลขที่เอกสาร
      try {
        const nextNumber = await ReturnRepository.getNextDocNumber();
        setDocNumber(nextNumber);
      } catch (error) {
        setDocNumber("S001/2026");
      }
    };
    
    init();

    setToday(new Date().toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
    }));
  }, [router]);

  const handleNext = () => {
    if (!selectedType) return alert('กรุณาเลือกประเภทรายการ');
    if (selectedType === 'อื่นๆ' && !otherDetail.trim()) return alert('กรุณาระบุรายละเอียดอื่นๆ');
    
    updateData((prev: any) => ({
      ...prev,
      reason: selectedType, 
      sender: { 
        ...prev.sender, 
        hospital_name: clientData?.hospital_name || '', 
        province: clientData?.province || '',
        doc_number: docNumber,
        customer_code: customerCode,
        return_type: selectedType,
        other_detail: selectedType === 'อื่นๆ' ? otherDetail : ''
      },
      sigFullname: clientData?.contact_name || '',
      sigPosition: clientData?.position || ''
    }));
    next();
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-10">

        {/* ── Card 1 : ประเภทรายการ ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 w-full">
          <SectionTitle>รายละเอียดรายการ</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {TYPES.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => setSelectedType(t.label)}
                className={[
                  'flex flex-col items-center gap-2 py-5 px-2 rounded-xl border-2 transition-all w-full',
                  selectedType === t.label
                    ? 'border-teal-600 bg-teal-50 shadow-md shadow-teal-100'
                    : 'border-slate-100 bg-slate-50 hover:bg-slate-100',
                ].join(' ')}
              >
                <span className="text-2xl">{t.icon}</span>
                <span className={`text-xs font-bold text-center leading-tight ${selectedType === t.label ? 'text-teal-800' : 'text-slate-500'}`}>
                  {t.label}
                </span>
              </button>
            ))}
          </div>

          {selectedType === 'อื่นๆ' && (
            <div className="flex flex-col gap-1.5 mb-6">
              <FieldLabel>ระบุรายละเอียดอื่นๆ</FieldLabel>
              <input
                onChange={(e) => setOtherDetail(e.target.value)}
                placeholder="ระบุประเภทรายการ..."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>เลขที่เอกสาร (Auto)</FieldLabel>
              <input value={docNumber} readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
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
              <FieldLabel>ชื่อโรงพยาบาล / ร้านยา / คลินิก</FieldLabel>
              <input value={clientData?.hospital_name || 'กำลังโหลด...'} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>จังหวัด</FieldLabel>
              <input value={clientData?.province || 'กำลังโหลด...'} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>รหัสลูกค้า (Customer Code)</FieldLabel>
              <input 
                placeholder="กรอกรหัสหน่วยงาน..."
                value={customerCode}
                onChange={(e) => setCustomerCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-teal-200 outline-none transition" 
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>โทรศัพท์ติดต่อ</FieldLabel>
              <input value={clientData?.phone || 'กำลังโหลด...'} readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 font-mono text-sm border-none outline-none" />
            </div>

            <div className="flex flex-col gap-1.5">
              <FieldLabel>อีเมล</FieldLabel>
              <input value={clientData?.email || 'กำลังโหลด...'} readOnly className="px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none" />
            </div>

            <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <FieldLabel>ชื่อ-นามสกุล ผู้ส่งคืน</FieldLabel>
                <input value={clientData?.contact_name || 'กำลังโหลด...'} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
              </div>
              <div className="flex flex-col gap-1.5">
                <FieldLabel>ตำแหน่ง</FieldLabel>
                <input value={clientData?.position || 'กำลังโหลด...'} readOnly className="w-full px-4 py-3 rounded-xl bg-slate-100 text-slate-500 text-sm border-none outline-none cursor-not-allowed" />
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