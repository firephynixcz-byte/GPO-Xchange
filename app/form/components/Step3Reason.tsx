'use client';

import { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StepProps {
  next:       () => void;
  back:       () => void;
  updateData: React.Dispatch<React.SetStateAction<any>>;
  formData:   any;
}

// ── Shared styles (คงเดิม) ──────────────────────────────────────────────────
const textareaCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition resize-none placeholder:text-slate-300';
const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition placeholder:text-slate-300';
const selectCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition appearance-none cursor-pointer bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%230d9488\' stroke-width=\'1.5\' stroke-linecap=\'round\' d=\'M6 8l4 4 4-4\'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_14px_center] bg-[length:18px] pr-10';

// ── Sub-components (คงเดิม) ────────────────────────────────────────────────
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-700 to-teal-500" />
      <span className="text-base font-extrabold text-slate-900">{children}</span>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{children}</label>;
}

function BadgeBtn({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className={['px-5 py-2.5 rounded-full text-sm font-bold border-2 transition-all',
        active ? 'border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-100'
               : 'border-slate-200 bg-white text-slate-500 hover:border-teal-300 hover:text-teal-600'].join(' ')}>
      {label}
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Step3Reason({ next, back, updateData, formData }: StepProps) {
  // เช็คเงื่อนไขจาก Step1: ถ้ามีคำว่า "แลกเปลี่ยน" ให้แสดงส่วนเลือกสินค้า
  const isExchange = formData?.reason?.includes('แลกเปลี่ยน');
  const items = formData?.items || [];

  const [reason, setReason] = useState(formData?.returnReason?.replace('อื่นๆ: ', '') || '');
  const [reasonOther, setReasonOther] = useState(formData?.returnReason?.startsWith('อื่นๆ: ') ? formData.returnReason.replace('อื่นๆ: ', '') : '');
  
  // Logic สำหรับเลือกสินค้าแลกเปลี่ยน
  const [exchangeMode, setExchangeMode] = useState<'รายการเดิม' | 'อื่นๆ' | ''>(formData?.exchangeProductType || '');
  const [checkedItems, setCheckedItems] = useState<string[]>(formData?.exchangeProductList || []);
  const [exchangeOtherText, setExchangeOtherText] = useState(formData?.exchangeProductOther || '');

  const [deliveryType, setDeliveryType] = useState<'ขนส่ง' | 'ผู้แทน' | ''>(formData?.deliveryType || '');
  const [addrStreet, setAddrStreet] = useState(formData?.addrStreet || '');
  const [addrSub, setAddrSub] = useState(formData?.addrSub || '');
  const [addrDistrict, setAddrDistrict] = useState(formData?.addrDistrict || '');
  const [addrProvince, setAddrProvince] = useState(formData?.addrProvince || formData?.sender?.province || '');
  const [agentInfo, setAgentInfo] = useState(formData?.agentInfo || '');

  const toggleItem = (name: string) =>
    setCheckedItems(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  const handleNext = () => {
    if (!reason) return alert('กรุณาระบุเหตุผลการส่งคืนครับ');
    if (reason === 'อื่นๆ' && !reasonOther.trim()) return alert('กรุณาระบุรายละเอียดเหตุผลครับ');
    
    // ตรวจสอบข้อมูลสินค้ากรณีเป็นรายการแลกเปลี่ยน
    if (isExchange) {
        if (!exchangeMode) return alert('กรุณาระบุสินค้าที่ต้องการแลกเปลี่ยนครับ');
        if (exchangeMode === 'รายการเดิม' && checkedItems.length === 0) return alert('กรุณาเลือกรายการสินค้าเดิมอย่างน้อย 1 รายการ');
        if (exchangeMode === 'อื่นๆ' && !exchangeOtherText.trim()) return alert('กรุณาระบุชื่อสินค้าที่ต้องการครับ');
    }

    if (!deliveryType) return alert('กรุณาเลือกวิธีส่งคืนครับ');
    
    updateData((prev: any) => ({
      ...prev,
      returnReason: reason === 'อื่นๆ' ? `อื่นๆ: ${reasonOther}` : reason,
      exchangeProductType: exchangeMode,
      exchangeProductList: checkedItems,
      exchangeProductOther: exchangeOtherText,
      deliveryType, addrStreet, addrSub, addrDistrict, addrProvince, agentInfo
    }));
    next();
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <SectionTitle>Step 3: เหตุผลการส่งคืน</SectionTitle>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <FieldLabel>ระบุเหตุผลการส่งคืน *</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {['สินค้าหมดอายุ', 'อื่นๆ'].map(r => (
                <BadgeBtn key={r} label={r} active={reason === r} onClick={() => setReason(r)} />
              ))}
            </div>
            {reason === 'อื่นๆ' && (
              <textarea rows={2} value={reasonOther} onChange={e => setReasonOther(e.target.value)}
                placeholder="พิมพ์รายละเอียดเหตุผล..." className={textareaCls} />
            )}
          </div>

          {/* ส่วนแสดงเฉพาะกรณี แลกเปลี่ยน */}
          {isExchange && (
            <div className="flex flex-col gap-3 border-t border-slate-100 pt-6">
              <FieldLabel>กรณีแลกเปลี่ยน ระบุสินค้าที่ต้องการ *</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {(['รายการเดิม', 'อื่นๆ'] as const).map(m => (
                  <BadgeBtn key={m} label={m} active={exchangeMode === m}
                    onClick={() => setExchangeMode(m)} />
                ))}
              </div>
              
              {exchangeMode === 'รายการเดิม' && (
                <div className="mt-1 flex flex-col gap-2">
                  {items.map((d: any, i: number) => (
                    <label key={i} className={['flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all',
                      checkedItems.includes(d.drugName) ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:bg-slate-100'].join(' ')}>
                      <input type="checkbox" checked={checkedItems.includes(d.drugName)} onChange={() => toggleItem(d.drugName)} className="w-4 h-4 accent-teal-600" />
                      <span className="text-sm text-slate-700">{d.drugName}</span>
                    </label>
                  ))}
                </div>
              )}
              {exchangeMode === 'อื่นๆ' && (
                <textarea rows={2} value={exchangeOtherText} onChange={e => setExchangeOtherText(e.target.value)}
                  placeholder="ระบุชื่อสินค้าที่ต้องการแลกเปลี่ยน..." className={textareaCls} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <SectionTitle>วิธีการส่งคืนสินค้า</SectionTitle>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <FieldLabel>เลือกวิธีส่งคืน *</FieldLabel>
            <div className="flex flex-wrap gap-2">
              {(['ขนส่ง', 'ผู้แทน'] as const).map(d => (
                <BadgeBtn key={d} label={d === 'ขนส่ง' ? '🚚 โดยบริษัทขนส่ง' : '🤝 จัดส่งผ่านผู้แทน'}
                  active={deliveryType === d} onClick={() => setDeliveryType(d)} />
              ))}
            </div>
          </div>
          {deliveryType === 'ขนส่ง' && (
            <div className="flex flex-col gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500">📍 ที่อยู่สำหรับไปรับสินค้า</p>
              <div className="flex flex-col gap-1.5"><FieldLabel>เลขที่ / ถนน</FieldLabel><input value={addrStreet} onChange={e => setAddrStreet(e.target.value)} className={inputCls} /></div>
              
              {/* แถวแนวยาว: ตำบล อำเภอ จังหวัด */}
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5"><FieldLabel>ตำบล</FieldLabel><input value={addrSub} onChange={e => setAddrSub(e.target.value)} className={inputCls} /></div>
                <div className="flex flex-col gap-1.5"><FieldLabel>อำเภอ</FieldLabel><input value={addrDistrict} onChange={e => setAddrDistrict(e.target.value)} className={inputCls} /></div>
                <div className="flex flex-col gap-1.5">
                  <FieldLabel>จังหวัด</FieldLabel>
                  <select value={addrProvince} onChange={e => setAddrProvince(e.target.value)} className={selectCls}>
                    <option value="">--เลือก จังหวัด--</option>
                    {['สงขลา', 'พัทลุง', 'สตูล', 'ตรัง', 'ปัตตานี', 'ยะลา', 'นราธิวาส'].map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}
          {deliveryType === 'ผู้แทน' && (
            <div className="flex flex-col gap-1.5 p-4 bg-slate-50 rounded-xl border border-slate-100"><FieldLabel>ชื่อผู้แทน / วันนัดหมาย</FieldLabel><input value={agentInfo} onChange={e => setAgentInfo(e.target.value)} className={inputCls} /></div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={back} className="py-4 rounded-xl font-bold text-sm text-slate-500 border-2 border-slate-200 hover:border-teal-400 hover:text-teal-600 transition-all">← ย้อนกลับ</button>
        <button type="button" onClick={handleNext} className="py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 active:scale-[0.99] transition-all shadow-lg shadow-teal-200">ดำเนินการต่อ →</button>
      </div>
    </div>
  );
}