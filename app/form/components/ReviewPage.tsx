'use client';

import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StepProps {
  back:     () => void;
  formData: any; 
  onSubmit: () => Promise<any>;
}

// ── Sub-components ─────────────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-700 to-teal-500" />
      <span className="text-base font-extrabold text-slate-900">{children}</span>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-slate-400 uppercase tracking-wide w-36 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm text-slate-800 font-medium flex-1">{value}</span>
    </div>
  );
}

function ReviewCard({ title, color = '#0d9488', children }: { title: string; color?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-3 font-bold text-sm text-white" style={{ background: color }}>{title}</div>
      <div className="px-6 py-3">{children}</div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function ReviewPage({ back, formData, onSubmit }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [status,  setStatus]  = useState<'idle' | 'success' | 'error'>('idle');
  const [refId,   setRefId]   = useState('');

  const { sender, items, totalValue, returnReason, exchangeProduct, deliveryType, addrStreet, addrSub, addrDistrict, addrProvince, agentInfo, sigImage, sigFullname, sigPosition } = formData;

  const deliveryDetail = deliveryType === 'ขนส่ง' 
    ? `${addrStreet} ต.${addrSub} อ.${addrDistrict} จ.${addrProvince}` 
    : agentInfo || '-';

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await onSubmit();
      setRefId(result?.refId || 'GPO-' + Date.now().toString().slice(-6)); 
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ──
  if (status === 'success') {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-6 py-16 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center text-4xl">✅</div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-1">ส่งแบบฟอร์มสำเร็จ!</h2>
          <p className="text-sm text-slate-500">ระบบได้รับข้อมูลเรียบร้อยแล้ว</p>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-2xl px-8 py-5">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">รหัสอ้างอิง</p>
          <p className="text-2xl font-black text-teal-700 font-mono">{refId}</p>
        </div>
      </div>
    );
  }

  // ── Error screen ──
  if (status === 'error') {
    return (
      <div className="w-full flex flex-col items-center gap-4 py-16 text-center bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="text-5xl">❌</div>
        <h2 className="text-lg font-bold text-slate-800">เกิดข้อผิดพลาด</h2>
        <button onClick={() => setStatus('idle')} className="px-6 py-3 rounded-xl bg-teal-600 text-white font-bold text-sm">ลองอีกครั้ง</button>
      </div>
    );
  }

  // ── Review screen ──
  return (
    <div className="w-full flex flex-col gap-5">
      <ReviewCard title="📋 ข้อมูลหน่วยงาน" color="#0f766e">
        <ReviewRow label="ประเภทรายการ" value={sender?.return_type} />
        <ReviewRow label="หน่วยงาน" value={sender?.hospital_name} />
        <ReviewRow label="จังหวัด" value={sender?.province} />
        <ReviewRow label="ผู้ส่งคืน" value={sender?.sender_name} />
      </ReviewCard>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-3 font-bold text-sm text-white bg-rose-600">💊 รายการยาและเวชภัณฑ์</div>
        <div className="px-6 py-4 flex flex-col gap-3">
          {items?.map((d: any, i: number) => (
            <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 text-[11px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
              <div className="flex-1">
                <p className="font-bold text-sm text-slate-900">{d.drugName}</p>
                <p className="text-xs text-slate-500">จำนวน: {d.qty} {d.unit} | Lot: {d.lot} | Exp: {d.exp}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-sm font-bold text-slate-500">รวมมูลค่า</span>
            <span className="text-lg font-extrabold text-teal-600">{totalValue?.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿</span>
          </div>
        </div>
      </div>

      <ReviewCard title="📦 เหตุผลและวิธีส่งคืน" color="#7c3aed">
        <ReviewRow label="เหตุผล" value={returnReason} />
        <ReviewRow label="สินค้าแลกเปลี่ยน" value={exchangeProduct} />
        <ReviewRow label="วิธีส่งคืน" value={deliveryType} />
        <ReviewRow label="รายละเอียด" value={deliveryDetail} />
      </ReviewCard>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-3 font-bold text-sm text-white bg-amber-700">✍️ ลายมือชื่อผู้ส่งคืน</div>
        <div className="px-6 py-5 flex items-center gap-6">
          {sigImage && (
            <div className="flex flex-col items-center">
              <img src={sigImage} alt="ลายเซ็น" className="max-h-20" />
              <p className="text-sm font-bold">{sigFullname}</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={back} className="py-4 rounded-xl font-bold text-sm text-slate-500 border-2 border-slate-200">← ย้อนกลับ</button>
        <button type="button" onClick={handleSubmit} className="py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-teal-700 to-teal-600">✅ ยืนยันและส่งแบบฟอร์ม</button>
      </div>
    </div>
  );
}