'use client';

import { useRef, useEffect, useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
interface StepProps {
  next:        () => void;
  back:        () => void;
  updateData:  React.Dispatch<React.SetStateAction<any>>;
  formData:    any; // รับ formData เข้ามาเพื่อดึงค่า Auto-fill
}

// ── Shared styles (คงเดิม) ──────────────────────────────────────────────────
const inputCls =
  'w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 ' +
  'focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition placeholder:text-slate-300';

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
  return (
    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
      {children}
    </label>
  );
}

// ── SignaturePad (โค้ดเดิมกิต 100%) ──────────────────────────────────────────
function SignaturePad({
  canvasRef,
  isEmpty,
  setIsEmpty,
}: {
  canvasRef:  React.RefObject<HTMLCanvasElement>;
  isEmpty:    boolean;
  setIsEmpty: (v: boolean) => void;
}) {
  const drawing  = useRef(false);
  const lastPos  = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width  = rect.width  * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      ctx.strokeStyle = '#0f766e';
      ctx.lineWidth   = 2.5;
      ctx.lineCap     = 'round';
      ctx.lineJoin    = 'round';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef]);

  const getPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  };

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    drawing.current = true;
    lastPos.current = getPos(e);
    setIsEmpty(false);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current || !lastPos.current) return;
    const ctx  = canvasRef.current!.getContext('2d')!;
    const pos  = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    lastPos.current = pos;
  };

  const stopDraw = () => { drawing.current = false; lastPos.current = null; };

  return (
    <div className="relative w-full h-48 rounded-2xl border-2 border-dashed border-slate-200
                    bg-slate-50 overflow-hidden hover:border-teal-400 transition-colors group">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
        onMouseDown={startDraw}
        onMouseMove={draw}
        onMouseUp={stopDraw}
        onMouseLeave={stopDraw}
        onTouchStart={startDraw}
        onTouchMove={draw}
        onTouchEnd={stopDraw}
      />
      {isEmpty && (
        <div className="absolute inset-0 flex flex-col items-center justify-center
                        pointer-events-none text-slate-300 gap-2">
          <span className="text-4xl">✍️</span>
          <span className="text-sm font-medium">ลงลายเซ็นที่นี่</span>
        </div>
      )}
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function Step4Signature({ next, back, updateData, formData }: StepProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const [isEmpty,  setIsEmpty]  = useState(true);

  // ── Auto-fill ข้อมูลจาก formData ที่ส่งต่อมาจาก Step 1 ──
  const [fullname, setFullname] = useState(formData?.sigFullname || 'ธนกฤต โรจน์กิจจานุรักษ์');
  const [position, setPosition] = useState(formData?.sigPosition || 'เภสัชกร 7');
  const [pdpa,     setPdpa]     = useState(formData?.pdpaConsent || false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr  = window.devicePixelRatio || 1;
    const ctx  = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    setIsEmpty(true);
  };

  const handleNext = () => {
    if (isEmpty)        return alert('กรุณาลงลายเซ็นก่อนครับ');
    if (!fullname.trim()) return alert('กรุณาระบุชื่อ-นามสกุลผู้ลงนามครับ');
    if (!pdpa)          return alert('กรุณายินยอม PDPA ก่อนดำเนินการต่อครับ');

    const sigDataUrl = canvasRef.current!.toDataURL('image/png');

    updateData((prev: any) => ({
      ...prev,
      sigImage:    sigDataUrl,
      sigFullname: fullname,
      sigPosition: position,
      pdpaConsent: true,
    }));
    next();
  };

  return (
    <div className="w-full flex flex-col gap-5">
      {/* ── Card: ลายเซ็น (คงเดิม) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <SectionTitle>Step 4: ยืนยันข้อมูลและลงนาม</SectionTitle>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel>ลายมือชื่อผู้ส่งคืน *</FieldLabel>
              {!isEmpty && (
                <button type="button" onClick={clearSig}
                  className="text-xs font-bold text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                  ล้างลายเซ็น
                </button>
              )}
            </div>
            <SignaturePad canvasRef={canvasRef} isEmpty={isEmpty} setIsEmpty={setIsEmpty} />
            <p className="text-[11px] text-slate-300 text-center">
              วาดลายเซ็นด้วยนิ้วหรือเมาส์ · รองรับ Retina Display
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <FieldLabel>ชื่อ-นามสกุล ผู้ส่งคืน *</FieldLabel>
              <input value={fullname} onChange={e => setFullname(e.target.value)} placeholder="ชื่อ-นามสกุล" className={inputCls} />
            </div>
            <div className="flex flex-col gap-1.5">
              <FieldLabel>ตำแหน่ง</FieldLabel>
              <input value={position} onChange={e => setPosition(e.target.value)} placeholder="เช่น เภสัชกร / หัวหน้าคลังยา" className={inputCls} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Card: PDPA (คงเดิม) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-7">
        <SectionTitle>ความยินยอม PDPA</SectionTitle>
        <label className={['flex items-start gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all', pdpa ? 'border-teal-400 bg-teal-50' : 'border-slate-200 bg-slate-50 hover:border-teal-200'].join(' ')}>
          <input type="checkbox" checked={pdpa} onChange={e => setPdpa(e.target.checked)} className="w-5 h-5 mt-0.5 accent-teal-600 cursor-pointer shrink-0" />
          <div className="text-sm text-slate-600 leading-relaxed">
            <span className="font-bold text-slate-800">คำยินยอม PDPA: </span>
            ข้าพเจ้ายินยอมให้ <span className="font-bold text-teal-700">องค์การเภสัชกรรม (GPO)</span> เก็บรวบรวม ใช้ และเปิดเผยข้อมูลส่วนบุคคล ได้แก่ ชื่อ-นามสกุล, หน่วยงาน, เบอร์โทรศัพท์, อีเมล และลายมือชื่อดิจิทัล เพื่อวัตถุประสงค์ในการดำเนินงานรับคืนและแลกเปลี่ยนสินค้า ตามนโยบายคุ้มครองข้อมูลส่วนบุคคล
          </div>
        </label>
        {pdpa && <p className="mt-3 text-xs text-teal-600 font-medium text-center">✅ ยืนยันการยินยอมเรียบร้อยแล้ว</p>}
      </div>

      {/* ── Navigation (คงเดิม) ── */}
      <div className="grid grid-cols-2 gap-4">
        <button type="button" onClick={back} className="py-4 rounded-xl font-bold text-sm text-slate-500 border-2 border-slate-200 hover:border-teal-400 hover:text-teal-600 transition-all">← ย้อนกลับ</button>
        <button type="button" onClick={handleNext} className="py-4 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-800 hover:to-teal-700 transition-all">ตรวจสอบและยืนยัน →</button>
      </div>
    </div>
  );
}