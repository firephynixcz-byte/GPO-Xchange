'use client';

import { useState, useRef } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StepProps {
  next:       () => void;
  back:       () => void;
  updateData: React.Dispatch<React.SetStateAction<any>>;
  formData:   any;
}

const UNITS = ['แผง', 'กล่อง', 'ขวด', 'amp', 'ลัง'] as const;
const MAX   = 5;

// ── Validation Logic ───────────────────────────────────────────────────────
const validateItem = (item: any) => {
  if (!item.exp) return { valid: false, msg: `รายการ ${item.drugName} ยังไม่ได้ระบุวันหมดอายุครับ` };
  
  const today = new Date();
  const expDate = new Date(item.exp);
  
  const diffInMonths = (expDate.getFullYear() - today.getFullYear()) * 12 + (expDate.getMonth() - today.getMonth());

  if (item.productType === 'GPO') {
    if (expDate < today) {
      const monthsExpired = Math.abs(diffInMonths);
      if (monthsExpired > 6) return { valid: false, msg: `${item.drugName} (GPO) หมดอายุเกิน 6 เดือน ไม่สามารถทำรายการได้ครับ` };
    }
  }

  if (item.productType === 'OTHER') {
    if (diffInMonths < 7) return { valid: false, msg: `${item.drugName} (อื่นๆ) ต้องมีอายุเหลือมากกว่า 7 เดือนครับ` };
  }

  return { valid: true };
};

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

// ── FieldLabel ─────────────────────────────────────────────────────────────
function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{children}</label>;
}

// ── DrugCard ───────────────────────────────────────────────────────────────
function DrugCard({ item, index, onRemove }: { item: any; index: number; onRemove: () => void }) {
  return (
    <div className="relative flex bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="w-1.5 shrink-0 bg-teal-400" />
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-teal-50 text-teal-700 text-[11px] font-bold flex items-center justify-center shrink-0">
              {index + 1}
            </span>
            <span className="font-bold text-slate-900 text-sm leading-snug break-words">{item.drugName}</span>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100">
              ✓ ผ่านเกณฑ์
            </span>
          </div>
          <button type="button" onClick={onRemove} className="w-7 h-7 rounded-full bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center text-xs transition shrink-0">✕</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-xs text-slate-500">
          <div><span className="font-semibold text-slate-700">จำนวน: </span>{item.qty} {item.unit}</div>
          <div><span className="font-semibold text-slate-700">Lot: </span>{item.lot || '-'}</div>
          <div><span className="font-semibold text-slate-700">Exp: </span>{item.exp || '-'}</div>
          <div><span className="font-semibold text-teal-600">
            {parseFloat(item.val || '0').toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
          </span></div>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Step2Items({ next, back, updateData, formData }: StepProps) {
  const [items, setItems] = useState<any[]>([]);
  const [temp,  setTemp]  = useState({
    drugName: '', productType: '', qty: '', unit: '', lot: '', exp: '', val: '', inv: '',
  });
  
  const drugNameInputRef = useRef<HTMLInputElement>(null);

  const set = (field: string, value: string) => setTemp(prev => ({ ...prev, [field]: value }));

  const addItemToList = () => {
    if (items.length >= MAX) return alert(`จำกัดรายการสูงสุด ${MAX} รายการครับ`);
    
    // บังคับกรอกเฉพาะที่สำคัญ
    if (!temp.drugName || !temp.qty || !temp.lot || !temp.exp) {
      return alert('กรุณากรอกชื่อยา, จำนวน, Lot, และ Exp. Date ให้ครบถ้วนครับ');
    }
    
    // ตรวจสอบเงื่อนไข Pre-validation (อายุยา)
    const validation = validateItem(temp);
    if (!validation.valid) return alert(validation.msg);
    
    // ถ้าไม่กรอกมูลค่า ให้ใส่เป็น '0'
    const updated = [...items, { ...temp, val: temp.val || '0', id: Date.now() }];
    setItems(updated);
    setTemp({ drugName: '', productType: '', qty: '', unit: '', lot: '', exp: '', val: '', inv: '' });
    
    drugNameInputRef.current?.focus();
  };

  const removeItem = (id: number) => setItems(items.filter(i => i.id !== id));

  const totalValue = items.reduce((s, i) => s + parseFloat(i.val || '0'), 0);

  const handleNext = () => {
    if (items.length === 0) return alert('กรุณาเพิ่มรายการยาอย่างน้อย 1 รายการครับ');
    updateData((prev: any) => ({ ...prev, items, totalValue }));
    next();
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-5 rounded-full bg-gradient-to-b from-teal-700 to-teal-500" />
          <span className="text-base font-extrabold text-slate-900">Step 2: รายการยาและเวชภัณฑ์</span>
          <span className="ml-auto text-xs font-bold text-slate-400">{items.length} / {MAX} รายการ</span>
        </div>

        <div className="bg-teal-50/60 border border-teal-100 rounded-2xl p-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <FieldLabel>ชื่อยาและขนาด *</FieldLabel>
            <input ref={drugNameInputRef} value={temp.drugName} onChange={e => set('drugName', e.target.value)}
              placeholder="ระบุชื่อยา..." className={inputCls} />
          </div>
          
          {formData?.reason?.includes('แลกเปลี่ยน') && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-300">
              <FieldLabel>ประเภทผลิตภัณฑ์</FieldLabel>
              <select value={temp.productType} onChange={e => set('productType', e.target.value)}
                className={selectCls}>
                <option value="">-- กรุณาเลือก --</option>
                <option value="GPO">ยา GPO ผลิตเอง</option>
                <option value="OTHER">ยาสมุนไพร / ยาผู้ผลิตอื่น</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>จำนวน *</FieldLabel>
              <input type="number" value={temp.qty} onChange={e => set('qty', e.target.value)}
                placeholder="0" className={inputCls} min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>หน่วย</FieldLabel>
              <select value={temp.unit} onChange={e => set('unit', e.target.value)}
                className={selectCls}>
                <option value="">-- เลือกหน่วย --</option>
                {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Lot No. *</FieldLabel>
              <input value={temp.lot} onChange={e => set('lot', e.target.value)}
                placeholder="Lot..." className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Exp. Date *</FieldLabel>
              <input type="date" value={temp.exp} onChange={e => set('exp', e.target.value)}
                className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>มูลค่า (฿)</FieldLabel>
              <input type="number" value={temp.val} onChange={e => set('val', e.target.value)}
                placeholder="0.00" className={inputCls} min="0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>เลขใบส่งของ</FieldLabel>
              <input value={temp.inv} onChange={e => set('inv', e.target.value)}
                placeholder="เลขที่ใบส่งของ..." className={inputCls} />
            </div>
          </div>
          <button type="button" onClick={addItemToList}
            className="w-full py-3.5 mt-1 rounded-xl font-bold text-white text-sm bg-emerald-500 hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center justify-center gap-2">
            <span className="text-lg leading-none">＋</span> เพิ่มรายการลงตาราง
          </button>
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <DrugCard key={item.id} item={item} index={i} onRemove={() => removeItem(item.id)} />
          ))}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-2xl px-6 py-4 shadow-sm">
            <span className="text-sm font-bold text-slate-500">💰 รวมมูลค่าทั้งสิ้น</span>
            <span className="text-xl font-extrabold text-teal-600">
              {totalValue.toLocaleString('th-TH', { minimumFractionDigits: 2 })} ฿
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={back} className="py-4 rounded-xl font-bold text-sm text-slate-500 border-2 border-slate-200 hover:border-teal-400 hover:text-teal-600 transition-all">← ย้อนกลับ</button>
        <button type="button" onClick={handleNext} className="py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 active:scale-[0.99] transition-all shadow-lg shadow-teal-200">ดำเนินการต่อ →</button>
      </div>
    </div>
  );
}